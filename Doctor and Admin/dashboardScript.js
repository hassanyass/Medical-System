// Import patient and appointment data
let patients = {
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

let appointments = {
    'APT001': {
        id: 'APT001',
        patientId: 'P-0123',
        date: '2024-03-15',
        time: '10:00',
        type: 'Check-up',
        status: 'confirmed',
        notes: 'Regular check-up appointment. Patient has history of hypertension.',
        patient: patients['P-0123']
    },
    'APT002': {
        id: 'APT002',
        patientId: 'P-0124',
        date: '2024-03-15',
        time: '11:30',
        type: 'Consultation',
        status: 'pending',
        notes: 'New patient consultation for recurring headaches.',
        patient: patients['P-0124']
    }
};

// Dashboard functionality
class DashboardManager {
    constructor() {
        this.initializeEventListeners();
        this.updateDashboardStats();
    }

    initializeEventListeners() {
        // Navigation toggle
        const navToggle = document.getElementById('nav-toggle');
        if (navToggle) {
            navToggle.addEventListener('change', () => {
                document.querySelector('.sidebar').classList.toggle('collapsed');
            });
        }

        // Search functionality
        const searchInput = document.querySelector('.search-wrapper input');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => this.handleSearch(e.target.value));
        }

        // Header icons
        const bookmarkIcon = document.querySelector('.header-icons .la-bookmark');
        if (bookmarkIcon) {
            bookmarkIcon.addEventListener('click', () => this.handleBookmark());
        }

        const messageIcon = document.querySelector('.header-icons .la-sms');
        if (messageIcon) {
            messageIcon.addEventListener('click', () => {
                window.location.href = 'doctorChat.html';
            });
        }

        // Settings button
        const settingsBtn = document.querySelector('.button-group button');
        if (settingsBtn) {
            settingsBtn.addEventListener('click', () => this.openSettingsModal());
        }

        // Action buttons in the appointments table
        const actionButtons = document.querySelectorAll('.action-btn');
        actionButtons.forEach(button => {
            button.addEventListener('click', (e) => this.handleAppointmentAction(e));
        });

        // View All link
        const viewAllLink = document.querySelector('.view-all');
        if (viewAllLink) {
            viewAllLink.addEventListener('click', (e) => {
                e.preventDefault();
                window.location.href = 'doctorAppointment.html';
            });
        }

        // New Appointment Modal
        const modal = document.getElementById('newAppointmentModal');
        const closeBtn = modal.querySelector('.close-modal');
        const cancelBtn = modal.querySelector('.cancel-btn');
        const form = document.getElementById('newAppointmentForm');

        closeBtn.addEventListener('click', () => this.closeModal(modal));
        cancelBtn.addEventListener('click', () => this.closeModal(modal));
        form.addEventListener('submit', (e) => this.handleNewAppointment(e));

        // Close modal when clicking outside
        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeModal(modal);
            }
        });
    }

    updateDashboardStats() {
        // Get stats from localStorage or API
        const stats = this.getDashboardStats();
        
        // Update total patients
        document.querySelector('.card:nth-child(1) h3').textContent = stats.totalPatients;
        
        // Update appointments today
        document.querySelector('.card:nth-child(2) h3').textContent = stats.appointmentsToday;
        document.querySelector('.card:nth-child(2) small').textContent = 
            `${stats.pendingAppointments} pending confirmation${stats.pendingAppointments !== 1 ? 's' : ''}`;
        
        // Update upcoming appointments
        document.querySelector('.card:nth-child(3) h3').textContent = stats.upcomingAppointments;
        
        // Update consultations
        document.querySelector('.card:nth-child(4) h3').textContent = stats.consultationsToday;
    }

    getDashboardStats() {
        // This would typically come from an API or localStorage
        return {
            totalPatients: 2,
            appointmentsToday: 2,
            pendingAppointments: 1,
            upcomingAppointments: 2,
            consultationsToday: 1
        };
    }

    handleSearch(searchTerm) {
        searchTerm = searchTerm.toLowerCase();
        const rows = document.querySelectorAll('.appointments-list tbody tr');

        rows.forEach(row => {
            const patientName = row.querySelector('h4').textContent.toLowerCase();
            const patientId = row.querySelector('small').textContent.toLowerCase();
            
            if (patientName.includes(searchTerm) || patientId.includes(searchTerm)) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    }

    handleBookmark() {
        alert('Bookmarks feature coming soon!');
    }

    openSettingsModal() {
        alert('Settings panel coming soon!');
    }

    handleAppointmentAction(e) {
        const row = e.target.closest('tr');
        const patientName = row.querySelector('h4').textContent;
        const patientId = row.querySelector('small').textContent.split(': ')[1];
        const appointmentDate = row.querySelector('td:nth-child(2)').textContent;
        const appointmentTime = row.querySelector('td:nth-child(3)').textContent;
        const status = row.querySelector('.status').textContent;

        // Store the selected appointment details in localStorage
        localStorage.setItem('selectedAppointment', JSON.stringify({
            patientName,
            patientId,
            date: appointmentDate,
            time: appointmentTime,
            status
        }));

        // Redirect to appointment details page
        window.location.href = 'doctorAppointment.html';
    }

    closeModal(modal) {
        modal.style.display = 'none';
        const form = modal.querySelector('form');
        if (form) form.reset();
    }

    handleNewAppointment(e) {
        e.preventDefault();
        const form = e.target;
        const formData = new FormData(form);

        // Validate date and time
        const date = new Date(formData.get('date'));
        const time = formData.get('time');
        const now = new Date();

        if (date < now.setHours(0,0,0,0)) {
            alert('Please select a future date');
            return;
        }

        // Validate working hours (9 AM to 5 PM)
        const [hours, minutes] = time.split(':');
        if (hours < 9 || hours >= 17) {
            alert('Please select a time between 9 AM and 5 PM');
            return;
        }

        // Store appointment data
        const appointmentData = {
            patientName: formData.get('patientName'),
            date: formData.get('date'),
            time: formData.get('time'),
            type: formData.get('type'),
            notes: formData.get('notes'),
            status: 'pending'
        };

        // Store in localStorage (in a real app, this would go to a backend)
        let appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
        appointments.push(appointmentData);
        localStorage.setItem('appointments', JSON.stringify(appointments));

        // Close modal and show success message
        this.closeModal(document.getElementById('newAppointmentModal'));
        alert('Appointment scheduled successfully!');

        // Refresh dashboard stats
        this.updateDashboardStats();
    }
}

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new DashboardManager();
}); 