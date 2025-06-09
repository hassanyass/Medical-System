// Doctor data for reference (same as in findDoctors.js)
const doctors = [
    {
        id: 1,
        name: "Dr. John Smith",
        specialty: "cardiology",
        image: "../Doctor and Admin/img/doctor.jpg"
    },
    {
        id: 2,
        name: "Dr. Sarah Johnson",
        specialty: "dermatology",
        image: "../Doctor and Admin/img/doctor2.jpg"
    },
    {
        id: 3,
        name: "Dr. Michael Chen",
        specialty: "neurology",
        image: "../Doctor and Admin/img/doctor3.jpg"
    }
];

// State
let state = {
    appointments: [],
    filters: {
        status: '',
        date: ''
    },
    selectedAppointment: null
};

// DOM Elements
const elements = {
    appointmentsList: document.querySelector('.appointments-list'),
    noAppointments: document.querySelector('.no-appointments'),
    statusFilter: document.getElementById('statusFilter'),
    dateFilter: document.getElementById('dateFilter'),
    filterBtn: document.querySelector('.filter-btn'),
    modal: document.getElementById('appointmentModal'),
    closeModal: document.querySelector('.close-modal'),
    appointmentDetails: document.querySelector('.appointment-details'),
    btnReschedule: document.getElementById('btnReschedule'),
    btnCancel: document.getElementById('btnCancel')
};

// Initialize the page
function init() {
    console.log('Initializing appointments page...');
    
    // Load appointments from localStorage
    loadAppointments();
    
    // Setup event listeners
    setupEventListeners();
    
    // Initial render
    renderAppointments();
    
    console.log('Appointments page initialized.');
}

// Load appointments from localStorage
function loadAppointments() {
    try {
        const stored = localStorage.getItem('appointments');
        if (stored) {
            state.appointments = JSON.parse(stored).map(apt => ({
                ...apt,
                date: new Date(apt.date)
            }));
            console.log(`Loaded ${state.appointments.length} appointments from localStorage.`);
        }
    } catch (error) {
        console.error('Error loading appointments:', error);
        state.appointments = [];
    }
}

// Setup event listeners
function setupEventListeners() {
    // Filter button
    if (elements.filterBtn) {
        elements.filterBtn.addEventListener('click', handleFilterChange);
    }
    
    // Status filter
    if (elements.statusFilter) {
        elements.statusFilter.addEventListener('change', handleFilterChange);
    }
    
    // Date filter
    if (elements.dateFilter) {
        elements.dateFilter.addEventListener('change', handleFilterChange);
    }
    
    // Modal close button
    if (elements.closeModal) {
        elements.closeModal.addEventListener('click', closeModal);
    }
    
    // Click outside modal to close
    window.addEventListener('click', (e) => {
        if (e.target === elements.modal) {
            closeModal();
        }
    });
    
    // Reschedule button
    if (elements.btnReschedule) {
        elements.btnReschedule.addEventListener('click', handleReschedule);
    }
    
    // Cancel button
    if (elements.btnCancel) {
        elements.btnCancel.addEventListener('click', handleCancelAppointment);
    }
}

// Handle filter change
function handleFilterChange() {
    state.filters.status = elements.statusFilter ? elements.statusFilter.value : '';
    state.filters.date = elements.dateFilter ? elements.dateFilter.value : '';
    
    console.log('Filters updated:', state.filters);
    renderAppointments();
}

// Render appointments
function renderAppointments() {
    if (!elements.appointmentsList) return;
    
    const filteredAppointments = filterAppointments();
    
    if (filteredAppointments.length === 0) {
        elements.appointmentsList.innerHTML = '';
        if (elements.noAppointments) {
            elements.noAppointments.style.display = 'block';
        }
        return;
    }
    
    if (elements.noAppointments) {
        elements.noAppointments.style.display = 'none';
    }
    
    elements.appointmentsList.innerHTML = filteredAppointments
        .map(appointment => createAppointmentCard(appointment))
        .join('');
    
    // Add event listeners to view buttons
    document.querySelectorAll('.btn-view').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const appointmentId = parseInt(e.target.dataset.id);
            openAppointmentDetails(appointmentId);
        });
    });
}

// Filter appointments based on state.filters
function filterAppointments() {
    return state.appointments.filter(appointment => {
        // Status filter
        if (state.filters.status && appointment.status !== state.filters.status) {
            return false;
        }
        
        // Date filter
        if (state.filters.date) {
            const filterDate = new Date(state.filters.date);
            const appointmentDate = new Date(appointment.date);
            
            if (
                appointmentDate.getFullYear() !== filterDate.getFullYear() ||
                appointmentDate.getMonth() !== filterDate.getMonth() ||
                appointmentDate.getDate() !== filterDate.getDate()
            ) {
                return false;
            }
        }
        
        return true;
    }).sort((a, b) => new Date(a.date) - new Date(b.date));
}

// Create appointment card HTML
function createAppointmentCard(appointment) {
    const doctor = doctors.find(d => d.id === appointment.doctorId) || {
        name: appointment.doctorName || 'Unknown Doctor',
        specialty: 'Specialty not available',
        image: 'https://via.placeholder.com/50?text=Dr'
    };
    
    const appointmentDate = new Date(appointment.date);
    const formattedDate = appointmentDate.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    // Default to confirmed if no status is set
    const status = appointment.status || 'confirmed';
    
    return `
        <div class="appointment-card">
            <div class="appointment-info">
                <div class="appointment-doctor">
                    <img src="${doctor.image}" alt="${doctor.name}" onerror="this.src='https://via.placeholder.com/50?text=Dr'">
                    <div>
                        <div class="doctor-name">${doctor.name}</div>
                        <div class="doctor-specialty">${doctor.specialty}</div>
                    </div>
                </div>
                <div class="appointment-details">
                    <p><i class="fas fa-calendar-alt"></i> ${formattedDate}</p>
                    <p><i class="fas fa-clock"></i> ${formatTime(appointment.time)}</p>
                    <p><i class="fas fa-comment-medical"></i> ${appointment.reason}</p>
                </div>
            </div>
            <div class="appointment-status status-${status}">
                ${capitalizeFirstLetter(status)}
            </div>
            <div class="appointment-actions">
                <button class="btn-view" data-id="${appointment.id}">View Details</button>
            </div>
        </div>
    `;
}

// Open appointment details modal
function openAppointmentDetails(appointmentId) {
    const appointment = state.appointments.find(apt => apt.id === appointmentId);
    if (!appointment) return;
    
    state.selectedAppointment = appointment;
    
    const doctor = doctors.find(d => d.id === appointment.doctorId) || {
        name: appointment.doctorName || 'Unknown Doctor',
        specialty: 'Specialty not available'
    };
    
    const appointmentDate = new Date(appointment.date);
    const formattedDate = appointmentDate.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    elements.appointmentDetails.innerHTML = `
        <p><i class="fas fa-user-md"></i> <strong>Doctor:</strong> ${doctor.name}</p>
        <p><i class="fas fa-stethoscope"></i> <strong>Specialty:</strong> ${doctor.specialty}</p>
        <p><i class="fas fa-calendar-alt"></i> <strong>Date:</strong> ${formattedDate}</p>
        <p><i class="fas fa-clock"></i> <strong>Time:</strong> ${formatTime(appointment.time)}</p>
        <p><i class="fas fa-comment-medical"></i> <strong>Reason:</strong> ${appointment.reason}</p>
        <p><i class="fas fa-phone-alt"></i> <strong>Contact Method:</strong> ${capitalizeFirstLetter(appointment.contactMethod)}</p>
        <p><i class="fas fa-info-circle"></i> <strong>Status:</strong> <span class="status-${appointment.status || 'confirmed'}">${capitalizeFirstLetter(appointment.status || 'confirmed')}</span></p>
    `;
    
    elements.modal.style.display = 'flex';
}

// Close modal
function closeModal() {
    elements.modal.style.display = 'none';
    state.selectedAppointment = null;
}

// Handle reschedule button click
function handleReschedule() {
    if (!state.selectedAppointment) return;
    
    // Redirect to the findDoctors page
    window.location.href = 'finddoctors.php';
}

// Handle cancel appointment
function handleCancelAppointment() {
    if (!state.selectedAppointment) return;
    
    // Update appointment status
    const appointmentId = state.selectedAppointment.id;
    const appointmentIndex = state.appointments.findIndex(apt => apt.id === appointmentId);
    
    if (appointmentIndex !== -1) {
        state.appointments[appointmentIndex].status = 'canceled';
        
        // Save to localStorage
        localStorage.setItem('appointments', JSON.stringify(state.appointments));
        
        // Close modal and refresh list
        closeModal();
        renderAppointments();
        
        // Show notification
        showNotification('Appointment canceled successfully', 'success');
    }
}

// Show notification
function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('fade-out');
        setTimeout(() => notification.remove(), 500);
    }, 3000);
}

// Format time (12-hour format)
function formatTime(time) {
    if (!time) return '';
    
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${period}`;
}

// Capitalize first letter
function capitalizeFirstLetter(string) {
    if (!string) return '';
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// Initialize when DOM content is loaded
document.addEventListener('DOMContentLoaded', init); 