// DOM Elements
const searchInput = document.querySelector('.search-wrapper input');
const specialtyFilter = document.getElementById('specialtyFilter');
const statusFilter = document.getElementById('statusFilter');
const doctorsGrid = document.querySelector('.doctors-grid');
const addDoctorBtn = document.getElementById('addDoctorBtn');
const addDoctorModal = document.getElementById('addDoctorModal');
const closeButtons = document.querySelectorAll('.close-modal');
const imageInput = document.getElementById('doctorImage');
const imagePreview = document.getElementById('imagePreview');



// Search and Filter Functionality
function filterDoctors() {
    const searchTerm = searchInput.value.toLowerCase();
    const selectedSpecialty = specialtyFilter.value;
    const selectedStatus = statusFilter.value;

    document.querySelectorAll('.doctor-card').forEach(card => {
        const name = card.querySelector('h3').textContent.toLowerCase();
        const specialty = card.getAttribute('data-specialty').toLowerCase();
        const status = card.getAttribute('data-status').toLowerCase();
        const email = card.querySelector('.contact-info p:first-child').textContent.toLowerCase();

        const matchesSearch = name.includes(searchTerm) || specialty.includes(searchTerm) || email.includes(searchTerm);
        const matchesSpecialty = !selectedSpecialty || specialty === selectedSpecialty.toLowerCase();
        const matchesStatus = !selectedStatus || status === selectedStatus.toLowerCase();

        if (matchesSearch && matchesSpecialty && matchesStatus) {
            card.style.display = '';
        } else {
            card.style.display = 'none';
        }
    });
}


// View Doctor (modal)
function viewDoctor(id) {
    const doctor = doctors.find(d => d.id === id);
    if (!doctor) return;

    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2><span class="las la-user-md"></span> Doctor Details</h2>
                <button class="close-modal"><span class="las la-times"></span></button>
            </div>
            <div class="modal-body">
                <div class="doctor-profile">
                    <img src="${doctor.image}" alt="${doctor.name}">
                    <div class="profile-info">
                        <h3>${doctor.name}</h3>
                        <p class="specialty">${doctor.specialty}</p>
                        <div class="status ${doctor.status}">${doctor.status}</div>
                    </div>
                </div>
                <div class="stats-grid">
                    <div class="stat-card">
                        <span class="las la-user-friends"></span>
                        <h4>${doctor.patients}</h4>
                        <p>Total Patients</p>
                    </div>
                    <div class="stat-card">
                        <span class="las la-calendar-check"></span>
                        <h4>${doctor.appointments}</h4>
                        <p>Today's Appointments</p>
                    </div>
                </div>
                <div class="contact-details">
                    <h4>Contact Information</h4>
                    <p><span class="las la-envelope"></span> ${doctor.email}</p>
                    <p><span class="las la-phone"></span> ${doctor.phone}</p>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
    modal.style.display = 'flex';

    const closeBtn = modal.querySelector('.close-modal');
    closeBtn.onclick = () => modal.remove();

    modal.onclick = (e) => {
        if (e.target === modal) modal.remove();
    };
}

// Edit Doctor — Disabled for now (PHP will handle it later)
function editDoctor(id) {
    showNotification('Edit doctor - This action will be handled in PHP backend.', 'info');
}

// Delete Doctor — Disabled for now (PHP will handle it later)
function deleteDoctor(id) {
    showNotification('Delete doctor - This action will be handled in PHP backend.', 'info');
}

// Show Add Doctor Modal
addDoctorBtn.addEventListener('click', () => {
    addDoctorModal.style.display = 'flex';
});

// Close modal buttons
closeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        addDoctorModal.style.display = 'none';
        resetAddDoctorForm();
    });
});

// Close modal on outside click
addDoctorModal.addEventListener('click', (e) => {
    if (e.target === addDoctorModal) {
        addDoctorModal.style.display = 'none';
        resetAddDoctorForm();
    }
});

// Image preview
if (imageInput) {
    imageInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                imagePreview.src = e.target.result;
                imagePreview.style.display = 'block';
            };
            reader.readAsDataURL(file);
        }
    });
}

// Reset Add Doctor Form (good UX)
function resetAddDoctorForm() {
    const form = document.getElementById('addDoctorForm');
    if (form) {
        form.reset();
    }
    imagePreview.src = '';
    imagePreview.style.display = 'none';
}

// Notification System
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <span class="notification-message">${message}</span>
        <span class="notification-close">&times;</span>
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 3000);

    notification.querySelector('.notification-close').onclick = () => {
        notification.remove();
    };
}

// Event Listeners
searchInput.addEventListener('input', filterDoctors);
specialtyFilter.addEventListener('change', filterDoctors);
statusFilter.addEventListener('change', filterDoctors);

// Initial render
