// Add working hours configuration at the top
const doctorSchedule = {
    workingDays: [1, 2, 3, 4, 5], // Monday to Friday
    workingHours: {
        start: '09:00',
        end: '17:00',
        slotDuration: 30 // in minutes
    }
};

// Initial data
const initialPatients = {
    'P-0123': {
        id: 'P-0123',
        firstName: 'John',
        lastName: 'Smith',
        dateOfBirth: '1980-05-15',
        age: 43,
        gender: 'male',
        phone: '123-456-7890',
        email: 'john@example.com',
        address: '123 Main St, City, Country',
        bloodGroup: 'A+',
        allergies: 'Penicillin',
        medicalHistory: 'Hypertension, Diabetes',
        status: 'active',
        lastVisit: '2024-03-15',
        image: 'img/patient1.jpg'
    },
    'P-0124': {
        id: 'P-0124',
        firstName: 'Sarah',
        lastName: 'Johnson',
        dateOfBirth: '1992-08-21',
        age: 31,
        gender: 'female',
        phone: '234-567-8901',
        email: 'sarah.j@example.com',
        address: '456 Oak Ave, City, Country',
        bloodGroup: 'B-',
        allergies: 'None',
        medicalHistory: 'Asthma',
        status: 'active',
        lastVisit: '2024-03-15',
        image: 'img/patient2.jpg'
    }
};

const initialAppointments = {
    'APT-001': {
        id: 'APT-001',
        patientId: 'P-0123',
        date: '2024-03-15',
        time: '10:00 AM',
        type: 'Check-up',
        status: 'confirmed',
        notes: 'Regular check-up appointment. Patient has history of hypertension.',
        patient: initialPatients['P-0123']
    },
    'APT-002': {
        id: 'APT-002',
        patientId: 'P-0124',
        date: '2024-03-15',
        time: '11:30 AM',
        type: 'Consultation',
        status: 'pending',
        notes: 'New patient consultation for recurring headaches.',
        patient: initialPatients['P-0124']
    }
};

// Calendar functionality
class Calendar {
    constructor() {
        this.date = new Date();
        this.currentMonth = this.date.getMonth();
        this.currentYear = this.date.getFullYear();
        this.selectedDate = null;
        this.months = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];
        this.initCalendar();
        this.bindEvents();
        this.renderDailySchedule();
    }

    initCalendar() {
        const calendarView = document.querySelector('.calendar-view');
        if (!calendarView) return;

        // Update month and year in header
        document.querySelector('.calendar-header h3').textContent = 
            `${this.months[this.currentMonth]} ${this.currentYear}`;

        // Create calendar grid
        const firstDay = new Date(this.currentYear, this.currentMonth, 1);
        const lastDay = new Date(this.currentYear, this.currentMonth + 1, 0);
        const startingDay = firstDay.getDay();
        const totalDays = lastDay.getDate();

        let calendarHTML = `
            <div class="calendar-grid">
                <div class="calendar-weekdays">
                    <div>Sun</div>
                    <div>Mon</div>
                    <div>Tue</div>
                    <div>Wed</div>
                    <div>Thu</div>
                    <div>Fri</div>
                    <div>Sat</div>
                </div>
                <div class="calendar-days">
        `;

        // Add empty cells for days before the first day of the month
        for (let i = 0; i < startingDay; i++) {
            calendarHTML += '<div class="calendar-day empty"></div>';
        }

        // Add days of the month
        for (let day = 1; day <= totalDays; day++) {
            const date = `${this.currentYear}-${String(this.currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const hasAppointments = this.getAppointmentsForDate(date);
            const isToday = this.isToday(day);
            
            calendarHTML += `
                <div class="calendar-day ${hasAppointments ? 'has-appointments' : ''} ${isToday ? 'today' : ''}" 
                     data-date="${date}">
                    <span class="day-number">${day}</span>
                    ${hasAppointments ? `<span class="appointment-count">${hasAppointments}</span>` : ''}
                </div>
            `;
        }

        calendarHTML += `
                </div>
            </div>
        `;

        calendarView.innerHTML = calendarHTML;
    }

    getAppointmentsForDate(date) {
        let count = 0;
        Object.values(appointments).forEach(apt => {
            if (apt.date === date) count++;
        });
        return count;
    }

    isToday(day) {
        const today = new Date();
        return day === today.getDate() && 
               this.currentMonth === today.getMonth() && 
               this.currentYear === today.getFullYear();
    }

    bindEvents() {
        // Previous month
        document.querySelector('.date-nav.prev').addEventListener('click', () => {
            this.currentMonth--;
            if (this.currentMonth < 0) {
                this.currentMonth = 11;
                this.currentYear--;
            }
            this.initCalendar();
        });

        // Next month
        document.querySelector('.date-nav.next').addEventListener('click', () => {
            this.currentMonth++;
            if (this.currentMonth > 11) {
                this.currentMonth = 0;
                this.currentYear++;
            }
            this.initCalendar();
        });

        // Day click handler
        document.addEventListener('click', (e) => {
            const dayCell = e.target.closest('.calendar-day');
            if (dayCell && !dayCell.classList.contains('empty')) {
                const date = dayCell.dataset.date;
                this.showAppointmentsForDate(date);
            }
        });

        // New Appointment button handler
        document.querySelector('.new-appointment-btn')?.addEventListener('click', () => {
            const modal = document.getElementById('newAppointmentModal');
            modal.style.display = 'flex';
        });

        // New Appointment form handler
        document.getElementById('newAppointmentForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleNewAppointment(e.target);
        });

        // Time slot click handler
        document.addEventListener('click', (e) => {
            const timeSlot = e.target.closest('.time-slot');
            if (timeSlot && timeSlot.classList.contains('available')) {
                const time = timeSlot.dataset.time;
                this.openNewAppointmentModal(time);
            }
        });
    }

    showAppointmentsForDate(date) {
        this.selectedDate = date;
        const appointmentsForDate = Object.entries(appointments)
            .filter(([_, apt]) => apt.date === date);

        // Update the appointments table
        updateAppointmentsTable(appointmentsForDate);
        
        // Show daily schedule
        this.renderDailySchedule();
    }

    renderDailySchedule() {
        if (!this.selectedDate) return;

        const scheduleContainer = document.querySelector('.daily-schedule') || this.createScheduleContainer();
        const date = new Date(this.selectedDate);
        const dayOfWeek = date.getDay();

        // Check if it's a working day
        const isWorkingDay = doctorSchedule.workingDays.includes(dayOfWeek);
        if (!isWorkingDay) {
            scheduleContainer.innerHTML = '<p class="non-working-day">Not a working day</p>';
            return;
        }

        // Generate time slots
        const slots = this.generateTimeSlots();
        const appointmentsForDay = Object.values(appointments)
            .filter(apt => apt.date === this.selectedDate);

        let scheduleHTML = `
            <h3>Schedule for ${formatDate(this.selectedDate)}</h3>
            <div class="time-slots">
        `;

        slots.forEach(slot => {
            const appointment = appointmentsForDay.find(apt => apt.time === slot);
            const slotClass = appointment ? 'occupied' : 'available';
            
            scheduleHTML += `
                <div class="time-slot ${slotClass}" data-time="${slot}">
                    <span class="time">${formatTime(slot)}</span>
                    ${appointment ? `
                        <div class="appointment-info">
                            <span class="patient-name">${appointment.name}</span>
                            <span class="appointment-type">${appointment.type}</span>
                        </div>
                    ` : '<span class="available-text">Available</span>'}
                </div>
            `;
        });

        scheduleHTML += '</div>';
        scheduleContainer.innerHTML = scheduleHTML;
    }

    createScheduleContainer() {
        const container = document.createElement('div');
        container.className = 'daily-schedule';
        document.querySelector('.calendar-view').after(container);
        return container;
    }

    generateTimeSlots() {
        const slots = [];
        const [startHour, startMinute] = doctorSchedule.workingHours.start.split(':').map(Number);
        const [endHour, endMinute] = doctorSchedule.workingHours.end.split(':').map(Number);
        
        let currentTime = new Date();
        currentTime.setHours(startHour, startMinute, 0);
        
        const endTime = new Date();
        endTime.setHours(endHour, endMinute, 0);

        while (currentTime < endTime) {
            slots.push(
                `${String(currentTime.getHours()).padStart(2, '0')}:${String(currentTime.getMinutes()).padStart(2, '0')}`
            );
            currentTime.setMinutes(currentTime.getMinutes() + doctorSchedule.workingHours.slotDuration);
        }

        return slots;
    }

    openNewAppointmentModal(time = '') {
        const modal = document.getElementById('newAppointmentModal');
        const dateInput = document.getElementById('newDate');
        const timeInput = document.getElementById('newTime');

        if (this.selectedDate) {
            dateInput.value = this.selectedDate;
        }
        if (time) {
            timeInput.value = time;
        }

        modal.style.display = 'flex';
    }

    handleNewAppointment(form) {
        const formData = new FormData(form);
        const newAppointment = {
            name: formData.get('patientName'),
            date: formData.get('date'),
            time: formData.get('time'),
            type: formData.get('type'),
            status: 'confirmed',
            notes: formData.get('notes'),
            image: 'img/default-patient.jpg' // Default image
        };

        // Generate a new unique ID
        const newId = `P-${Math.random().toString(36).substr(2, 4)}`;
        appointments[newId] = newAppointment;

        // Update the calendar and schedule
        this.showAppointmentsForDate(newAppointment.date);
        
        // Close the modal and reset form
        const modal = document.getElementById('newAppointmentModal');
        modal.style.display = 'none';
        form.reset();

        // Show success message
        alert('Appointment scheduled successfully!');
    }
}

// Modal handling
class ModalHandler {
    constructor() {
        this.modals = document.querySelectorAll('.modal');
        this.bindEvents();
    }

    bindEvents() {
        // Close buttons
        document.querySelectorAll('.close-modal, .cancel-btn').forEach(button => {
            button.addEventListener('click', () => {
                const modal = button.closest('.modal');
                this.closeModal(modal);
            });
        });

        // Click outside to close
        window.addEventListener('click', (e) => {
            this.modals.forEach(modal => {
                if (e.target === modal) {
                    this.closeModal(modal);
                }
            });
        });

        // View appointment buttons
        document.querySelectorAll('.view-btn').forEach(button => {
            button.addEventListener('click', () => this.handleViewAppointment(button));
        });

        // Edit appointment buttons
        document.querySelectorAll('.edit-btn').forEach(button => {
            button.addEventListener('click', () => this.handleEditAppointment(button));
        });

        // Delete appointment buttons
        document.querySelectorAll('.delete-btn').forEach(button => {
            button.addEventListener('click', () => this.handleDeleteAppointment(button));
        });

        // Form submissions
        document.getElementById('editAppointmentForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleFormSubmit(e.target);
        });
    }

    closeModal(modal) {
        modal.style.display = 'none';
    }

    openModal(modalId) {
        document.getElementById(modalId).style.display = 'flex';
    }

    handleViewAppointment(button) {
        const appointmentData = this.getAppointmentData(button);
        this.populateViewModal(appointmentData);
        this.openModal('viewModal');
    }

    handleEditAppointment(button) {
        const appointmentData = this.getAppointmentData(button);
        this.populateEditModal(appointmentData);
        this.openModal('editModal');
    }

    handleDeleteAppointment(button) {
        const appointmentData = this.getAppointmentData(button);
        this.populateDeleteModal(appointmentData);
        this.openModal('deleteModal');
    }

    getAppointmentData(button) {
        const row = button.closest('tr');
        const patientId = row.querySelector('small').textContent.split(': ')[1];
        return { id: patientId, ...appointments[patientId] };
    }

    populateViewModal(appointment) {
        document.getElementById('modalPatientImg').src = appointment.image;
        document.getElementById('modalPatientName').textContent = appointment.name;
        document.getElementById('modalPatientId').textContent = appointment.id;
        document.getElementById('modalDate').textContent = formatDate(appointment.date);
        document.getElementById('modalTime').textContent = formatTime(appointment.time);
        document.getElementById('modalType').textContent = appointment.type;
        document.getElementById('modalStatus').textContent = appointment.status;
        document.getElementById('modalNotes').textContent = appointment.notes;
    }

    populateEditModal(appointment) {
        document.getElementById('editPatientName').value = appointment.name;
        document.getElementById('editDate').value = appointment.date;
        document.getElementById('editTime').value = appointment.time;
        document.getElementById('editType').value = appointment.type;
        document.getElementById('editStatus').value = appointment.status;
        document.getElementById('editNotes').value = appointment.notes;
    }

    populateDeleteModal(appointment) {
        document.getElementById('deletePatientName').textContent = appointment.name;
        document.getElementById('deleteDateTime').textContent = 
            `${formatDate(appointment.date)} at ${formatTime(appointment.time)}`;
    }

    handleFormSubmit(form) {
        // Here you would typically send the data to your backend
        const formData = new FormData(form);
        console.log('Saving appointment data:', Object.fromEntries(formData));
        
        // Show success message
        alert('Appointment updated successfully!');
        this.closeModal(form.closest('.modal'));
    }
}

// Utility functions
function formatDate(dateStr) {
    return new Date(dateStr).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function formatTime(timeStr) {
    return new Date(`2000-01-01T${timeStr}`).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });
}

function updateAppointmentsTable(appointmentsList) {
    const tbody = document.querySelector('.appointments-table tbody');
    tbody.innerHTML = appointmentsList.map(([id, apt]) => `
        <tr>
            <td class="patient-info">
                <img src="${apt.image}" alt="patient">
                <div>
                    <h4>${apt.name}</h4>
                    <small>ID: ${id}</small>
                </div>
            </td>
            <td>${formatDate(apt.date)}</td>
            <td>${formatTime(apt.time)}</td>
            <td>${apt.type}</td>
            <td><span class="status ${apt.status}">${apt.status}</span></td>
            <td class="actions">
                <button class="view-btn"><span class="las la-eye"></span></button>
                <button class="edit-btn"><span class="las la-edit"></span></button>
                <button class="delete-btn"><span class="las la-trash"></span></button>
            </td>
        </tr>
    `).join('');

    // Rebind event handlers for new buttons
    new ModalHandler();
}

// Main AppointmentManager class
class AppointmentManager {
    static instance = null;

    constructor() {
        if (AppointmentManager.instance) {
            return AppointmentManager.instance;
        }
        AppointmentManager.instance = this;
        this.appointments = {};
        this.filteredAppointments = {};
        this.currentFilters = {
            date: '',
            type: '',
            status: ''
        };
        this.initializeData();
        this.initializeEventListeners();
        this.initializeActionButtons();
    }

    initializeData() {
        // Initialize localStorage with initial data if it doesn't exist
        if (!localStorage.getItem('appointments')) {
            localStorage.setItem('appointments', JSON.stringify(initialAppointments));
        }
        if (!localStorage.getItem('patients')) {
            localStorage.setItem('patients', JSON.stringify(initialPatients));
        }
    }

    initializeEventListeners() {
        // Filter buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', () => this.handleFilter());
        });

        // Export buttons
        document.querySelectorAll('.export-btn').forEach(btn => {
            btn.addEventListener('click', () => this.handleExport());
        });

        // Close modal buttons
        document.querySelectorAll('.close-modal, .cancel-btn').forEach(button => {
            button.addEventListener('click', () => this.closeModals());
        });

        // Click outside modal to close
        window.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.closeModals();
            }
        });

        // Form submission
        const appointmentForm = document.getElementById('appointmentForm');
        if (appointmentForm) {
            appointmentForm.addEventListener('submit', (e) => this.handleAppointmentFormSubmit(e));
        }

        // Initialize action buttons for existing appointments
        this.initializeActionButtons();

        // Filter button handlers
        const filterButtons = document.querySelectorAll('.filter-btn');
        filterButtons.forEach(button => {
            button.addEventListener('click', () => this.openFilterModal());
        });

        // Export button handlers
        const exportButtons = document.querySelectorAll('.export-btn');
        exportButtons.forEach(button => {
            button.addEventListener('click', () => this.exportAppointments());
        });
    }

    initializeActionButtons() {
        // View appointment buttons
        document.querySelectorAll('.view-btn').forEach(button => {
            button.addEventListener('click', () => {
                const appointmentId = button.dataset.appointmentId;
                this.viewAppointment(appointmentId);
            });
        });

        // Edit appointment buttons
        document.querySelectorAll('.edit-btn').forEach(button => {
            button.addEventListener('click', () => {
                const appointmentId = button.dataset.appointmentId;
                this.editAppointment(appointmentId);
            });
        });

        // Delete appointment buttons
        document.querySelectorAll('.delete-btn').forEach(button => {
            button.addEventListener('click', () => {
                const appointmentId = button.dataset.appointmentId;
                this.deleteAppointment(appointmentId);
            });
        });
    }

    handleAppointmentFormSubmit(e) {
        e.preventDefault();
        const form = e.target;
        const formData = new FormData(form);
        const appointmentId = form.dataset.appointmentId;

        // Validate date and time
        const date = new Date(formData.get('date'));
        const time = formData.get('time');
        const now = new Date();

        if (date < now.setHours(0,0,0,0)) {
            alert('Please select a future date');
            return;
        }

        // Validate working hours (9 AM to 5 PM)
        const [hours] = time.split(':');
        if (hours < 9 || hours >= 17) {
            alert('Please select a time between 9 AM and 5 PM');
            return;
        }

        // Create appointment object
        const appointmentData = {
            id: appointmentId || 'APT-' + Math.random().toString(36).substr(2, 6),
            patientId: formData.get('patientId'),
            date: formData.get('date'),
            time: formData.get('time'),
            type: formData.get('type'),
            status: formData.get('status'),
            notes: formData.get('notes')
        };

        // Save appointment
        this.saveAppointment(appointmentData, appointmentId);

        // Close modal and refresh table
        this.closeModals();
        this.loadAppointments();
    }

    saveAppointment(appointmentData, existingId = null) {
        // Get existing appointments from localStorage
        let appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
        
        if (existingId) {
            // Update existing appointment
            appointments = appointments.map(apt => 
                apt.id === existingId ? appointmentData : apt
            );
        } else {
            // Add new appointment
            appointments.push(appointmentData);
        }
        
        // Save back to localStorage
        localStorage.setItem('appointments', JSON.stringify(appointments));
        
        // Show success message
        alert(existingId ? 'Appointment updated successfully!' : 'Appointment scheduled successfully!');
    }

    loadAppointments() {
        const appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
        const patients = JSON.parse(localStorage.getItem('patients') || '{}');
        const tableBody = document.getElementById('appointmentTableBody');
        if (!tableBody) return;

        tableBody.innerHTML = '';

        appointments.forEach(appointment => {
            const patient = patients[appointment.patientId];
            if (!patient) return;

            const row = document.createElement('tr');
            row.innerHTML = `
                <td class="patient-info">
                    <img src="${patient.image}" alt="${patient.name}">
                    <div>
                        <h4>${patient.name}</h4>
                        <small>ID: ${patient.id}</small>
                    </div>
                </td>
                <td>${this.formatDate(appointment.date)}</td>
                <td>${this.formatTime(appointment.time)}</td>
                <td>${appointment.type}</td>
                <td><span class="status ${appointment.status.toLowerCase()}">${appointment.status}</span></td>
                <td class="actions">
                    <button class="action-btn view-btn" data-id="${appointment.id}">
                        <span class="las la-eye"></span>
                    </button>
                    <button class="action-btn edit-btn" data-id="${appointment.id}">
                        <span class="las la-edit"></span>
                    </button>
                    <button class="action-btn delete-btn" data-id="${appointment.id}">
                        <span class="las la-trash"></span>
                    </button>
                </td>
            </tr>
        `;

        // Add event listeners for action buttons
        const viewBtn = row.querySelector('.view-btn');
        const editBtn = row.querySelector('.edit-btn');
        const deleteBtn = row.querySelector('.delete-btn');

        viewBtn.addEventListener('click', () => this.viewAppointment(appointment.id));
        editBtn.addEventListener('click', () => this.editAppointment(appointment.id));
        deleteBtn.addEventListener('click', () => this.deleteAppointment(appointment.id));

        tableBody.appendChild(row);
    });

    viewAppointment = (appointmentId) => {
        const appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
        const patients = JSON.parse(localStorage.getItem('patients') || '{}');
        const appointment = appointments.find(a => a.id === appointmentId);
        if (!appointment) return;

        const patient = patients[appointment.patientId];
        if (!patient) return;

        const modal = document.getElementById('appointmentModal');
        
        // Update modal content
        document.getElementById('modalPatientName').textContent = patient.name;
        document.getElementById('modalPatientId').textContent = patient.id;
        document.getElementById('modalDate').textContent = this.formatDate(appointment.date);
        document.getElementById('modalTime').textContent = this.formatTime(appointment.time);
        document.getElementById('modalType').textContent = appointment.type;
        document.getElementById('modalStatus').textContent = appointment.status;
        document.getElementById('modalNotes').textContent = appointment.notes || 'No notes';

        modal.style.display = 'block';
    };

    editAppointment = (appointmentId) => {
        const appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
        const appointment = appointments.find(a => a.id === appointmentId);
        if (!appointment) return;

        const modal = document.getElementById('newAppointmentModal');
        const form = document.getElementById('appointmentForm');

        // Populate form with appointment data
        form.elements.patientId.value = appointment.patientId;
        form.elements.date.value = appointment.date;
        form.elements.time.value = appointment.time;
        form.elements.type.value = appointment.type;
        form.elements.status.value = appointment.status;
        form.elements.notes.value = appointment.notes || '';

        // Store appointment ID for update
        form.dataset.appointmentId = appointmentId;

        modal.style.display = 'block';
    };

    deleteAppointment = (appointmentId) => {
        if (confirm('Are you sure you want to delete this appointment?')) {
            let appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
            appointments = appointments.filter(a => a.id !== appointmentId);
            localStorage.setItem('appointments', JSON.stringify(appointments));
            this.loadAppointments();
        }
    };

    handleFilter = () => {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2>Filter Appointments</h2>
                    <span class="close-modal">&times;</span>
                </div>
                <div class="modal-body">
                    <form id="filterForm">
                        <div class="form-group">
                            <label for="filterDate">Date</label>
                            <input type="date" id="filterDate" name="date">
                        </div>
                        <div class="form-group">
                            <label for="filterStatus">Status</label>
                            <select id="filterStatus" name="status">
                                <option value="">All</option>
                                <option value="confirmed">Confirmed</option>
                                <option value="pending">Pending</option>
                                <option value="cancelled">Cancelled</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="filterType">Type</label>
                            <select id="filterType" name="type">
                                <option value="">All</option>
                                <option value="Check-up">Check-up</option>
                                <option value="Consultation">Consultation</option>
                                <option value="Follow-up">Follow-up</option>
                                <option value="Emergency">Emergency</option>
                            </select>
                        </div>
                        <div class="form-actions">
                            <button type="button" class="cancel-btn">Reset</button>
                            <button type="submit" class="save-btn">Apply Filter</button>
                        </div>
                    </form>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        modal.style.display = 'block';

        // Close button handler
        const closeBtn = modal.querySelector('.close-modal');
        closeBtn.onclick = () => {
            modal.remove();
        };

        // Click outside to close
        modal.onclick = (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        };

        // Reset button handler
        const resetBtn = modal.querySelector('.cancel-btn');
        resetBtn.onclick = () => {
            document.getElementById('filterForm').reset();
            this.loadAppointments(); // Reset to show all appointments
        };

        // Form submit handler
        const filterForm = modal.querySelector('#filterForm');
        filterForm.onsubmit = (e) => {
            e.preventDefault();
            const formData = new FormData(filterForm);
            
            // Get all appointments
            let appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
            
            // Apply filters
            appointments = appointments.filter(apt => {
                let matches = true;
                
                // Date filter
                if (formData.get('date')) {
                    matches = matches && apt.date === formData.get('date');
                }
                
                // Status filter
                if (formData.get('status')) {
                    matches = matches && apt.status === formData.get('status');
                }
                
                // Type filter
                if (formData.get('type')) {
                    matches = matches && apt.type === formData.get('type');
                }
                
                return matches;
            });
            
            // Update table with filtered results
            this.updateAppointmentsTable(appointments);
            
            // Close modal
            modal.remove();
        };
    };

    handleExport = () => {
        const appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
        const patients = JSON.parse(localStorage.getItem('patients') || '{}');

        // Create CSV content with more detailed information
        const csvContent = [
            // Headers
            ['Appointment ID', 'Patient ID', 'Patient Name', 'Date', 'Time', 'Type', 'Status', 'Notes'].join(','),
            // Data rows
            ...appointments.map(apt => {
                const patient = patients[apt.patientId];
                return [
                    apt.id,
                    apt.patientId,
                    patient ? patient.name : 'Unknown',
                    this.formatDate(apt.date),
                    this.formatTime(apt.time),
                    apt.type,
                    apt.status,
                    apt.notes || ''
                ].map(field => `"${field}"`).join(',');
            })
        ].join('\n');

        // Create and trigger download
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        
        link.setAttribute('href', url);
        link.setAttribute('download', `appointments_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.display = 'none';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    updateAppointmentsTable = (appointments) => {
        const patients = JSON.parse(localStorage.getItem('patients') || '{}');
        const tableBody = document.getElementById('appointmentTableBody');
        if (!tableBody) return;

        tableBody.innerHTML = '';

        appointments.forEach(appointment => {
            const patient = patients[appointment.patientId];
            if (!patient) return;

            const row = document.createElement('tr');
            row.innerHTML = `
                <td class="patient-info">
                    <img src="${patient.image}" alt="${patient.name}">
                    <div>
                        <h4>${patient.name}</h4>
                        <small>ID: ${patient.id}</small>
                    </div>
                </td>
                <td>${this.formatDate(appointment.date)}</td>
                <td>${this.formatTime(appointment.time)}</td>
                <td>${appointment.type}</td>
                <td><span class="status ${appointment.status.toLowerCase()}">${appointment.status}</span></td>
                <td class="actions">
                    <button class="action-btn view-btn" title="View Details" data-id="${appointment.id}">
                        <span class="las la-eye"></span>
                    </button>
                    <button class="action-btn edit-btn" title="Edit Appointment" data-id="${appointment.id}">
                        <span class="las la-edit"></span>
                    </button>
                    <button class="action-btn delete-btn" title="Delete Appointment" data-id="${appointment.id}">
                        <span class="las la-trash"></span>
                    </button>
                </td>
            `;

            // Add event listeners for action buttons
            const viewBtn = row.querySelector('.view-btn');
            const editBtn = row.querySelector('.edit-btn');
            const deleteBtn = row.querySelector('.delete-btn');

            viewBtn.addEventListener('click', () => this.viewAppointment(appointment.id));
            editBtn.addEventListener('click', () => this.editAppointment(appointment.id));
            deleteBtn.addEventListener('click', () => this.deleteAppointment(appointment.id));

            tableBody.appendChild(row);
        });
    };

    closeModals = () => {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.style.display = 'none';
        });
    };

    formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    formatTime = (timeString) => {
        return new Date(`2000/01/01 ${timeString}`).toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: 'numeric',
            hour12: true
        });
    };

    openFilterModal = () => {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2>Filter Appointments</h2>
                    <span class="close-modal">&times;</span>
                </div>
                <form id="filterForm">
                    <div class="form-group">
                        <label for="filterDate">Date</label>
                        <input type="date" id="filterDate" name="date">
                    </div>
                    <div class="form-group">
                        <label for="filterType">Appointment Type</label>
                        <select id="filterType" name="type">
                            <option value="">All Types</option>
                            <option value="Check-up">Check-up</option>
                            <option value="Consultation">Consultation</option>
                            <option value="Follow-up">Follow-up</option>
                            <option value="Emergency">Emergency</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="filterStatus">Status</label>
                        <select id="filterStatus" name="status">
                            <option value="">All Status</option>
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                    </div>
                    <div class="form-actions">
                        <button type="button" class="reset-btn">Reset</button>
                        <button type="submit" class="apply-btn">Apply Filter</button>
                    </div>
                </form>
            </div>
        `;

        document.body.appendChild(modal);
        modal.style.display = 'flex';

        // Close modal when clicking the close button or outside the modal
        modal.querySelector('.close-modal').addEventListener('click', () => {
            modal.remove();
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });

        // Handle filter form submission
        const filterForm = modal.querySelector('#filterForm');
        filterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(filterForm);
            this.currentFilters = {
                date: formData.get('date'),
                type: formData.get('type'),
                status: formData.get('status')
            };
            this.applyFilters();
            modal.remove();
        });

        // Handle reset button
        filterForm.querySelector('.reset-btn').addEventListener('click', () => {
            this.currentFilters = {
                date: '',
                type: '',
                status: ''
            };
            this.applyFilters();
            modal.remove();
        });
    };

    applyFilters = () => {
        this.filteredAppointments = Object.entries(this.appointments).filter(([_, appointment]) => {
            let matches = true;
            if (this.currentFilters.date && appointment.date !== this.currentFilters.date) {
                matches = false;
            }
            if (this.currentFilters.type && appointment.type !== this.currentFilters.type) {
                matches = false;
            }
            if (this.currentFilters.status && appointment.status !== this.currentFilters.status) {
                matches = false;
            }
            return matches;
        });

        this.updateAppointmentsTable(this.filteredAppointments);
    };

    exportAppointments = () => {
        const appointmentsToExport = this.filteredAppointments.length > 0 ? 
            this.filteredAppointments : Object.entries(this.appointments);

        const csvContent = this.convertToCSV(appointmentsToExport);
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        
        link.setAttribute('href', url);
        link.setAttribute('download', `appointments_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    convertToCSV = (appointments) => {
        const headers = ['ID', 'Patient Name', 'Date', 'Time', 'Type', 'Status', 'Notes'];
        const rows = appointments.map(([id, apt]) => [
            id,
            `${apt.patient.firstName} ${apt.patient.lastName}`,
            apt.date,
            apt.time,
            apt.type,
            apt.status,
            apt.notes
        ]);

        return [
            headers.join(','),
            ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
        ].join('\n');
    };
}

// Initialize the appointment manager
var appointmentManager = new AppointmentManager(); 