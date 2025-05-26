// Doctor data structure
const doctors = [
    {
        id: 1,
        name: "Dr. John Smith",
        specialty: "cardiology",
        rating: 4.5,
        image: "../Doctor and Admin/img/doctor.jpg",
        weeklyAvailability: {
            Monday: ["09:00", "10:00", "11:00", "14:00", "15:00"],
            Tuesday: ["09:00", "11:00", "14:00", "16:00"],
            Wednesday: ["10:00", "11:00", "14:00", "15:00"],
            Thursday: ["09:00", "10:00", "14:00", "15:00"],
            Friday: ["09:00", "10:00", "11:00", "14:00"],
            Saturday: [],
            Sunday: []
        }
    },
    {
        id: 2,
        name: "Dr. Sarah Johnson",
        specialty: "dermatology",
        rating: 5.0,
        image: "../Doctor and Admin/img/doctor2.jpg",
        weeklyAvailability: {
            Monday: ["09:00", "10:00", "14:00", "15:00", "16:00"],
            Tuesday: ["09:00", "10:00", "11:00", "14:00"],
            Wednesday: ["09:00", "10:00", "14:00", "15:00"],
            Thursday: ["10:00", "11:00", "14:00", "15:00"],
            Friday: ["09:00", "10:00", "11:00", "15:00"],
            Saturday: ["10:00", "11:00"],
            Sunday: []
        }
    },
    {
        id: 3,
        name: "Dr. Michael Chen",
        specialty: "neurology",
        rating: 4.0,
        image: "../Doctor and Admin/img/doctor3.jpg",
        weeklyAvailability: {
            Monday: ["10:00", "11:00", "14:00", "15:00"],
            Tuesday: ["09:00", "10:00", "14:00", "15:00"],
            Wednesday: ["09:00", "10:00", "11:00", "14:00"],
            Thursday: ["09:00", "10:00", "14:00", "15:00"],
            Friday: ["10:00", "11:00", "14:00", "15:00"],
            Saturday: [],
            Sunday: []
        }
    }
];

// State management
let state = {
    selectedDoctor: null,
    selectedSlot: null,
    currentWeekStart: null,
    appointments: []
};

// Initialize the application
function init() {
    console.log("Initializing application...");
    
    try {
        // Load appointments from localStorage
        try {
            state.appointments = JSON.parse(localStorage.getItem('appointments')) || [];
        } catch (error) {
            console.error("Error loading appointments:", error);
            state.appointments = [];
        }
        
        // Set current week start
        state.currentWeekStart = getWeekStart(new Date());
        
        // Setup doctor cards
        setupDoctorCards();
        
        // Setup event listeners
        setupEventListeners();
        
        console.log("Initialization successful");
    } catch (error) {
        console.error("Initialization failed:", error);
        alert("There was an error initializing the application. See console for details.");
    }
}

// Setup doctor cards with click handlers
function setupDoctorCards() {
    const doctorCards = document.querySelectorAll('.doctor-card');
    
    console.log("Found doctor cards:", doctorCards.length);
    
    if (doctorCards.length === 0) {
        // If no doctor cards exist, create them
        const doctorsList = document.querySelector('.doctors-list');
        if (!doctorsList) {
            throw new Error("Doctors list element not found");
        }
        
        doctorsList.innerHTML = doctors.map((doctor, index) => `
            <div class="doctor-card ${index === 0 ? 'selected' : ''}" data-doctor-id="${doctor.id}">
                <img src="${doctor.image}" alt="${doctor.name}" onerror="this.src='https://via.placeholder.com/60?text=Doctor'">
                <div class="doctor-info">
                    <h3>${doctor.name}</h3>
                    <p class="specialty">${doctor.specialty.charAt(0).toUpperCase() + doctor.specialty.slice(1)}</p>
                    <div class="rating">
                        ${generateRatingStars(doctor.rating)}
                        <span>(${doctor.rating})</span>
                    </div>
                </div>
            </div>
        `).join('');
        
        // Select the first doctor by default
        if (doctors.length > 0) {
            state.selectedDoctor = doctors[0];
            updateCalendar();
            updateBookingDetails();
        }
    } else {
        // If cards already exist, add data attributes and event handlers
        doctorCards.forEach((card, index) => {
            // Try to get doctor name from the card
            const doctorName = card.querySelector('h3')?.textContent;
            const doctor = doctors.find(d => d.name === doctorName) || doctors[index];
            
            if (doctor) {
                card.setAttribute('data-doctor-id', doctor.id);
                
                // Set the first doctor as selected by default
                if (index === 0 || card.classList.contains('selected')) {
                    state.selectedDoctor = doctor;
                    card.classList.add('selected');
                }
            }
        });
        
        if (state.selectedDoctor) {
            updateCalendar();
            updateBookingDetails();
        }
    }
}

// Generate rating stars HTML
function generateRatingStars(rating) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
        if (i <= rating) {
            stars += '<i class="fas fa-star"></i>';
        } else if (i - 0.5 <= rating) {
            stars += '<i class="fas fa-star-half-alt"></i>';
        } else {
            stars += '<i class="far fa-star"></i>';
        }
    }
    return stars;
}

// Setup event listeners
function setupEventListeners() {
    console.log("Setting up event listeners");
    
    // Doctor selection
    document.querySelectorAll('.doctor-card').forEach(card => {
        card.addEventListener('click', handleDoctorSelection);
    });
    
    // Search and filter
    const searchInput = document.querySelector('input[placeholder="Search doctors by name"]');
    const specialtyFilter = document.getElementById('specialtyFilter');
    const searchBtn = document.querySelector('.search-btn');
    
    if (searchBtn) searchBtn.addEventListener('click', handleSearch);
    if (searchInput) searchInput.addEventListener('input', debounce(handleSearch, 300));
    if (specialtyFilter) specialtyFilter.addEventListener('change', handleSearch);
    
    // Calendar navigation
    const prevWeekBtn = document.querySelector('.prev-week');
    const nextWeekBtn = document.querySelector('.next-week');
    
    if (prevWeekBtn) prevWeekBtn.addEventListener('click', () => navigateWeek(-1));
    if (nextWeekBtn) nextWeekBtn.addEventListener('click', () => navigateWeek(1));
    
    // Time slot selection
    const daysGrid = document.querySelector('.days-grid');
    if (daysGrid) daysGrid.addEventListener('click', handleSlotSelection);
    
    // Form submission
    const bookingForm = document.querySelector('.booking-form');
    if (bookingForm) bookingForm.addEventListener('submit', handleBookingSubmission);
}

// Handle doctor selection
function handleDoctorSelection(e) {
    const doctorCard = e.currentTarget;
    if (!doctorCard || !doctorCard.classList.contains('doctor-card')) return;
    
    console.log("Doctor card clicked:", doctorCard);
    
    // Get doctor ID
    const doctorId = parseInt(doctorCard.dataset.doctorId);
    if (!doctorId) {
        console.error("Doctor ID not found");
        return;
    }
    
    // Find the doctor
    const doctor = doctors.find(d => d.id === doctorId);
    if (!doctor) {
        console.error("Doctor not found with ID:", doctorId);
        return;
    }
    
    // Update state
    state.selectedDoctor = doctor;
    
    // Update UI
    document.querySelectorAll('.doctor-card').forEach(card => {
        card.classList.remove('selected');
    });
    doctorCard.classList.add('selected');
    
    // Reset selected slot
    state.selectedSlot = null;
    
    // Update UI
    updateCalendar();
    updateBookingDetails();
}

// Handle search and filter
function handleSearch() {
    const searchInput = document.querySelector('input[placeholder="Search doctors by name"]');
    const specialtyFilter = document.getElementById('specialtyFilter');
    
    const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
    const specialty = specialtyFilter ? specialtyFilter.value.toLowerCase() : '';
    
    console.log("Searching for:", searchTerm, "Specialty:", specialty);
    
    document.querySelectorAll('.doctor-card').forEach(card => {
        const doctorId = parseInt(card.dataset.doctorId);
        const doctor = doctors.find(d => d.id === doctorId);
        
        if (!doctor) return;
        
        const nameMatch = doctor.name.toLowerCase().includes(searchTerm);
        const specialtyMatch = !specialty || doctor.specialty === specialty;
        const isVisible = nameMatch && specialtyMatch;
        
        card.style.display = isVisible ? 'flex' : 'none';
    });
}

// Handle slot selection
function handleSlotSelection(e) {
    const slot = e.target.closest('.slot');
    if (!slot) return;
    
    console.log("Slot clicked:", slot);
    
    // Check if slot is available
    if (!slot.classList.contains('available')) {
        if (slot.classList.contains('booked')) {
            showNotification('This slot is already booked', 'error');
        } else if (slot.classList.contains('past')) {
            showNotification('Cannot book past time slots', 'error');
        }
        return;
    }
    
    // Check if doctor is selected
    if (!state.selectedDoctor) {
        showNotification('Please select a doctor first', 'error');
        return;
    }
    
    // Remove previous selection
    document.querySelectorAll('.slot.selected').forEach(s => s.classList.remove('selected'));
    
    // Add new selection
    slot.classList.add('selected');
    
    // Update state
    const date = slot.dataset.date ? new Date(slot.dataset.date) : null;
    const time = slot.dataset.time;
    
    if (!date || !time) {
        console.error("Date or time missing from slot data");
        return;
    }
    
    state.selectedSlot = { date, time };
    
    // Update booking panel
    updateBookingDetails();
}

// Handle booking submission
function handleBookingSubmission(e) {
    e.preventDefault();
    
    console.log("Form submitted");
    console.log("Current state:", state);
    
    if (!state.selectedDoctor) {
        showNotification('Please select a doctor first', 'error');
        return;
    }
    
    if (!state.selectedSlot) {
        showNotification('Please select a time slot first', 'error');
        return;
    }
    
    const form = e.target;
    const reasonInput = form.querySelector('textarea[name="reason"]') || form.querySelector('textarea');
    const contactMethodInput = form.querySelector('select[name="contactMethod"]') || form.querySelector('select');
    
    if (!reasonInput || !contactMethodInput) {
        showNotification('Form fields not found', 'error');
        return;
    }
    
    const reason = reasonInput.value;
    const contactMethod = contactMethodInput.value;
    
    if (!reason?.trim()) {
        showNotification('Please provide a reason for the visit', 'error');
        return;
    }
    
    // Create appointment
    const appointment = {
        id: Date.now(),
        doctorId: state.selectedDoctor.id,
        doctorName: state.selectedDoctor.name,
        date: state.selectedSlot.date,
        time: state.selectedSlot.time,
        reason,
        contactMethod
    };
    
    // Add button loading state
    const button = form.querySelector('button[type="submit"]');
    if (button) {
        button.disabled = true;
        button.classList.add('loading');
    }
    
    try {
        // Save appointment
        state.appointments.push(appointment);
        localStorage.setItem('appointments', JSON.stringify(state.appointments));
        
        console.log("Appointment created:", appointment);
        
        // Update UI
        showNotification('Appointment booked successfully!', 'success');
        form.reset();
        state.selectedSlot = null;
        updateCalendar();
        updateBookingDetails();
    } catch (error) {
        console.error("Error saving appointment:", error);
        showNotification('Error saving appointment', 'error');
    } finally {
        // Remove button loading state
        if (button) {
            button.disabled = false;
            button.classList.remove('loading');
        }
    }
}

// Update calendar
function updateCalendar() {
    if (!state.selectedDoctor) {
        console.log("No doctor selected, not updating calendar");
        return;
    }
    
    console.log("Updating calendar for:", state.selectedDoctor.name);
    
    const weekDates = getWeekDates(state.currentWeekStart);
    updateCalendarHeader(weekDates);
    renderCalendarGrid(weekDates);
}

// Get week dates
function getWeekDates(startDate) {
    return Array.from({ length: 7 }, (_, i) => {
        const date = new Date(startDate);
        date.setDate(date.getDate() + i);
        return date;
    });
}

// Update calendar header
function updateCalendarHeader(weekDates) {
    const headerElement = document.querySelector('.calendar-header h2');
    if (!headerElement) return;
    
    const firstDate = weekDates[0].toLocaleDateString('en-US', { 
        month: 'long', 
        day: 'numeric' 
    });
    const lastDate = weekDates[6].toLocaleDateString('en-US', { 
        month: 'long', 
        day: 'numeric', 
        year: 'numeric' 
    });
    
    headerElement.textContent = `${firstDate} - ${lastDate}`;
}

// Render calendar grid
function renderCalendarGrid(weekDates) {
    const daysGrid = document.querySelector('.days-grid');
    if (!daysGrid) return;
    
    daysGrid.innerHTML = weekDates.map(date => {
        const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
        const availableSlots = state.selectedDoctor.weeklyAvailability[dayName] || [];
        
        return `
            <div class="day-column">
                <div class="day-header">
                    ${date.toLocaleDateString('en-US', { weekday: 'short' })}<br>
                    ${date.getDate()}
                </div>
                ${generateTimeSlots(date, availableSlots)}
            </div>
        `;
    }).join('');
    
    console.log("Calendar grid updated with", weekDates.length, "days");
}

// Generate time slots
function generateTimeSlots(date, availableSlots) {
    return availableSlots.map(time => {
        const isBooked = isSlotBooked(date, time);
        const isPast = new Date(`${date.toDateString()} ${time}`) < new Date();
        const status = isPast ? 'past' : isBooked ? 'booked' : 'available';
        
        return `
            <div class="slot ${status}" 
                 data-date="${date.toISOString()}" 
                 data-time="${time}">
                ${formatTime(time)}
            </div>
        `;
    }).join('');
}

// Update booking panel
function updateBookingDetails() {
    const selectedDateElement = document.querySelector('.selected-slot p:nth-child(1) span');
    const selectedTimeElement = document.querySelector('.selected-slot p:nth-child(2) span');
    const selectedDoctorElement = document.querySelector('.selected-slot p:nth-child(3) span');
    
    if (!selectedDateElement || !selectedTimeElement || !selectedDoctorElement) {
        console.error("Booking details elements not found");
        return;
    }
    
    selectedDoctorElement.textContent = state.selectedDoctor ? 
        state.selectedDoctor.name : 'Select a doctor';
    
    if (state.selectedSlot) {
        selectedDateElement.textContent = state.selectedSlot.date
            .toLocaleDateString('en-US', { 
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
    
    console.log("Booking details updated");
}

// Utility functions
function getWeekStart(date) {
    const newDate = new Date(date);
    const day = newDate.getDay();
    const diff = newDate.getDate() - day + (day === 0 ? -6 : 1);
    newDate.setDate(diff);
    return newDate;
}

function navigateWeek(direction) {
    state.currentWeekStart.setDate(state.currentWeekStart.getDate() + (direction * 7));
    updateCalendar();
}

function formatTime(time) {
    if (!time) return '';
    
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${period}`;
}

function isSlotBooked(date, time) {
    return state.appointments.some(apt => 
        apt.doctorId === state.selectedDoctor.id &&
        new Date(apt.date).toDateString() === date.toDateString() &&
        apt.time === time
    );
}

function showNotification(message, type) {
    console.log(`Notification (${type}):`, message);
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('fade-out');
        setTimeout(() => notification.remove(), 500);
    }, 3000);
}

function debounce(func, wait) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', init); 