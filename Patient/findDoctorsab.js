// Global State
let state = {
    selectedDoctor: null,
    selectedSlot: null,
    currentWeekStart: getWeekStart(new Date())
};

// Init
document.addEventListener('DOMContentLoaded', () => {
    setupDoctorCards();
    setupEventListeners();
});

// Setup doctor cards
function setupDoctorCards() {
    const doctorCards = document.querySelectorAll('.doctor-card');
    doctorCards.forEach(card => {
        card.addEventListener('click', () => handleDoctorSelection(card));
    });
}

// Doctor selection
function handleDoctorSelection(card) {
    document.querySelectorAll('.doctor-card').forEach(c => c.classList.remove('selected'));
    card.classList.add('selected');

    const doctorId = parseInt(card.dataset.doctorId);
    state.selectedDoctor = doctors.find(d => d.doctor_id == doctorId);
    state.selectedSlot = null;

    updateCalendar();
    updateBookingDetails();
}

// Calendar navigation
document.querySelector('.prev-week').addEventListener('click', () => {
    state.currentWeekStart.setDate(state.currentWeekStart.getDate() - 7);
    updateCalendar();
});
document.querySelector('.next-week').addEventListener('click', () => {
    state.currentWeekStart.setDate(state.currentWeekStart.getDate() + 7);
    updateCalendar();
});

// Update calendar
function updateCalendar() {
    const header = document.querySelector('.calendar-header h2');
    const weekDates = getWeekDates(state.currentWeekStart);
    header.textContent = `${formatDate(weekDates[0])} - ${formatDate(weekDates[6])}`;

    const daysGrid = document.querySelector('.days-grid');
    daysGrid.innerHTML = '';

    const times = ['09:00','10:00','11:00','12:00','14:00','15:00','16:00','17:00'];

    weekDates.forEach(date => {
        const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
        const dayColumn = document.createElement('div');
        dayColumn.className = 'day-column';
        dayColumn.innerHTML = `
            <div class="day-header">
                ${date.toLocaleDateString('en-US', { weekday: 'short' })}<br>
                ${date.getDate()}
            </div>
        `;

        times.forEach(time => {
            const slot = document.createElement('div');
            slot.className = 'slot';
            slot.dataset.date = date.toISOString().split('T')[0];
            slot.dataset.time = time;

            if (!state.selectedDoctor || !schedule[state.selectedDoctor.doctor_id] || !schedule[state.selectedDoctor.doctor_id][dayName]) {
                slot.classList.add('disabled');
                slot.textContent = formatTime(time);
            } else {
                const availableSlots = schedule[state.selectedDoctor.doctor_id][dayName];
                if (availableSlots.includes(time)) {
                    if (isSlotBooked(state.selectedDoctor.doctor_id, slot.dataset.date, time)) {
                        slot.classList.add('booked');
                        slot.textContent = formatTime(time);
                    } else {
                        slot.classList.add('available');
                        slot.textContent = formatTime(time);
                        slot.addEventListener('click', () => selectSlot(date, time, slot));
                    }
                } else {
                    slot.classList.add('disabled');
                    slot.textContent = formatTime(time);
                }
            }

            dayColumn.appendChild(slot);
        });

        daysGrid.appendChild(dayColumn);
    });
}

// Select slot
function selectSlot(date, time, slotElement) {
    document.querySelectorAll('.slot.selected').forEach(s => s.classList.remove('selected'));
    slotElement.classList.add('selected');
    state.selectedSlot = { date, time };

    // Update hidden fields for form
    document.getElementById('hiddenDoctorId').value = state.selectedDoctor.doctor_id;
    document.getElementById('hiddenDate').value = date.toISOString().split('T')[0];
    document.getElementById('hiddenTime').value = time;

    updateBookingDetails();
}

// Update booking details panel
function updateBookingDetails() {
    const selectedDateElement = document.getElementById('selectedDate');
    const selectedTimeElement = document.getElementById('selectedTime');
    const selectedDoctorElement = document.getElementById('selectedDoctor');

    selectedDoctorElement.textContent = state.selectedDoctor ? state.selectedDoctor.doctor_name : 'Select a doctor';
    if (state.selectedSlot) {
        selectedDateElement.textContent = state.selectedSlot.date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        selectedTimeElement.textContent = formatTime(state.selectedSlot.time);
    } else {
        selectedDateElement.textContent = 'Select a time slot';
        selectedTimeElement.textContent = 'Select a time slot';
    }
}

// Helpers
function getWeekStart(date) {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Monday as first day
    d.setDate(diff);
    d.setHours(0, 0, 0, 0);
    return d;
}

function getWeekDates(startDate) {
    return Array.from({ length: 7 }, (_, i) => {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + i);
        return date;
    });
}

function formatDate(date) {
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

function formatTime(time) {
    const [hour, minute] = time.split(':');
    const h = parseInt(hour);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const displayHour = h % 12 || 12;
    return `${displayHour}:${minute} ${ampm}`;
}

function isSlotBooked(doctorId, date, time) {
    return appointments.some(apt =>
        apt.doctor_id == doctorId &&
        apt.date === date &&
        apt.time === time
    );
}

// Setup event listeners (Search + Filter)
function setupEventListeners() {
    document.querySelector('.search-btn').addEventListener('click', handleSearch);
    document.getElementById('searchInput').addEventListener('input', debounce(handleSearch, 300));
    document.getElementById('specialtyFilter').addEventListener('change', handleSearch);
}

function handleSearch() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const specialty = document.getElementById('specialtyFilter').value.toLowerCase();

    document.querySelectorAll('.doctor-card').forEach(card => {
        const doctorId = parseInt(card.dataset.doctorId);
        const doctor = doctors.find(d => d.doctor_id == doctorId);
        const nameMatch = doctor.doctor_name.toLowerCase().includes(searchTerm);
        const specialtyName = doctor.specialty_name.toLowerCase();
        const specialtyMatch = !specialty || specialtyName === specialty;

        card.style.display = nameMatch && specialtyMatch ? 'flex' : 'none';
    });
}

function debounce(func, wait) {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
}
