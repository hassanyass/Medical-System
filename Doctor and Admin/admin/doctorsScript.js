// DOM Elements
const searchInput = document.querySelector('.search-wrapper input');
const specialtyFilter = document.getElementById('specialtyFilter');
const statusFilter = document.getElementById('statusFilter');
const doctorsGrid = document.querySelector('.doctors-grid');
const addDoctorBtn = document.getElementById('addDoctorBtn');

// Doctor Data (This would typically come from a backend API)
let doctors = [
    {
        id: 1,
        name: 'Dr. Hassan Yassin',
        specialty: 'General Medicine',
        status: 'active',
        patients: 45,
        appointments: 12,
        email: 'dr.hassan@medicalsystem.com',
        phone: '+1 234 567 8900',
        image: '../img/doctor.jpg'
    },
    {
        id: 2,
        name: 'Dr. Sarah Johnson',
        specialty: 'Pediatrics',
        status: 'active',
        patients: 38,
        appointments: 8,
        email: 'dr.sarah@medicalsystem.com',
        phone: '+1 234 567 8901',
        image: '../img/doctor2.jpg'
    },
    // Add more doctors here
];

// Search and Filter Functionality
function filterDoctors() {
    const searchTerm = searchInput.value.toLowerCase();
    const selectedSpecialty = specialtyFilter.value;
    const selectedStatus = statusFilter.value;

    const filteredDoctors = doctors.filter(doctor => {
        const matchesSearch = doctor.name.toLowerCase().includes(searchTerm) ||
                            doctor.specialty.toLowerCase().includes(searchTerm) ||
                            doctor.email.toLowerCase().includes(searchTerm);
        const matchesSpecialty = !selectedSpecialty || doctor.specialty === selectedSpecialty;
        const matchesStatus = !selectedStatus || doctor.status === selectedStatus;

        return matchesSearch && matchesSpecialty && matchesStatus;
    });

    renderDoctors(filteredDoctors);
}

// Render Doctors Grid
function renderDoctors(doctorsToRender) {
    doctorsGrid.innerHTML = doctorsToRender.map(doctor => `
        <div class="doctor-card" data-id="${doctor.id}">
            <div class="doctor-header">
                <img src="${doctor.image}" alt="${doctor.name}">
                <div class="status-badge ${doctor.status}">${doctor.status}</div>
            </div>
            <div class="doctor-info">
                <h3>${doctor.name}</h3>
                <p class="specialty">${doctor.specialty}</p>
                <p class="stats">
                    <span><i class="las la-user-friends"></i> ${doctor.patients} Patients</span>
                    <span><i class="las la-calendar-check"></i> ${doctor.appointments} Today</span>
                </p>
                <div class="contact-info">
                    <p><i class="las la-envelope"></i> ${doctor.email}</p>
                    <p><i class="las la-phone"></i> ${doctor.phone}</p>
                </div>
            </div>
            <div class="doctor-actions">
                <button class="btn-view" title="View Details" onclick="viewDoctor(${doctor.id})">
                    <span class="las la-eye"></span>
                </button>
                <button class="btn-edit" title="Edit" onclick="editDoctor(${doctor.id})">
                    <span class="las la-edit"></span>
                </button>
                <button class="btn-delete" title="Remove" onclick="deleteDoctor(${doctor.id})">
                    <span class="las la-trash"></span>
                </button>
            </div>
        </div>
    `).join('');
}

// Button Actions
function viewDoctor(id) {
    const doctor = doctors.find(d => d.id === id);
    if (!doctor) return;

    // Create and show modal with doctor details
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

    // Close modal functionality
    const closeBtn = modal.querySelector('.close-modal');
    closeBtn.onclick = () => {
        modal.remove();
    };

    // Close on outside click
    modal.onclick = (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    };
}

function editDoctor(id) {
    const doctor = doctors.find(d => d.id === id);
    if (!doctor) return;

    // Create and show edit modal
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2><span class="las la-edit"></span> Edit Doctor</h2>
                <button class="close-modal"><span class="las la-times"></span></button>
            </div>
            <form id="editDoctorForm" class="modal-form">
                <div class="form-grid">
                    <div class="form-group">
                        <label for="doctorName">Full Name</label>
                        <input type="text" id="doctorName" name="name" value="${doctor.name}" required>
                    </div>
                    <div class="form-group">
                        <label for="doctorSpecialty">Specialty</label>
                        <select id="doctorSpecialty" name="specialty" required>
                            <option value="General Medicine" ${doctor.specialty === 'General Medicine' ? 'selected' : ''}>General Medicine</option>
                            <option value="Pediatrics" ${doctor.specialty === 'Pediatrics' ? 'selected' : ''}>Pediatrics</option>
                            <option value="Cardiology" ${doctor.specialty === 'Cardiology' ? 'selected' : ''}>Cardiology</option>
                            <option value="Dermatology" ${doctor.specialty === 'Dermatology' ? 'selected' : ''}>Dermatology</option>
                            <option value="Orthopedics" ${doctor.specialty === 'Orthopedics' ? 'selected' : ''}>Orthopedics</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="doctorEmail">Email</label>
                        <input type="email" id="doctorEmail" name="email" value="${doctor.email}" required>
                    </div>
                    <div class="form-group">
                        <label for="doctorPhone">Phone</label>
                        <input type="tel" id="doctorPhone" name="phone" value="${doctor.phone}" required>
                    </div>
                    <div class="form-group">
                        <label for="doctorStatus">Status</label>
                        <select id="doctorStatus" name="status" required>
                            <option value="active" ${doctor.status === 'active' ? 'selected' : ''}>Active</option>
                            <option value="inactive" ${doctor.status === 'inactive' ? 'selected' : ''}>Inactive</option>
                            <option value="pending" ${doctor.status === 'pending' ? 'selected' : ''}>Pending</option>
                        </select>
                    </div>
                </div>
                <div class="form-actions">
                    <button type="button" class="btn-secondary close-modal">Cancel</button>
                    <button type="submit" class="btn-primary">Save Changes</button>
                </div>
            </form>
        </div>
    `;

    document.body.appendChild(modal);
    modal.style.display = 'flex';

    // Handle form submission
    const form = modal.querySelector('#editDoctorForm');
    form.onsubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        const updatedDoctor = Object.fromEntries(formData.entries());
        
        // Update doctor data (In real app, this would be an API call)
        doctors = doctors.map(d => d.id === id ? {...d, ...updatedDoctor} : d);
        
        // Update UI
        renderDoctors(doctors);
        modal.remove();
        showNotification('Doctor information updated successfully!');
    };

    // Close modal functionality
    const closeButtons = modal.querySelectorAll('.close-modal');
    closeButtons.forEach(btn => {
        btn.onclick = () => modal.remove();
    });

    // Close on outside click
    modal.onclick = (e) => {
        if (e.target === modal) modal.remove();
    };
}

function deleteDoctor(id) {
    if (confirm('Are you sure you want to remove this doctor?')) {
        // Remove doctor (In real app, this would be an API call)
        doctors = doctors.filter(d => d.id !== id);
        renderDoctors(doctors);
        showNotification('Doctor removed successfully!');
    }
}

// Add New Doctor
addDoctorBtn.addEventListener('click', () => {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2><span class="las la-user-plus"></span> Add New Doctor</h2>
                <button class="close-modal"><span class="las la-times"></span></button>
            </div>
            <form id="addDoctorForm" class="modal-form">
                <div class="form-grid">
                    <div class="form-group">
                        <label for="doctorName">Full Name</label>
                        <input type="text" id="doctorName" name="name" required placeholder="Enter doctor's full name">
                    </div>
                    <div class="form-group">
                        <label for="doctorSpecialty">Specialty</label>
                        <select id="doctorSpecialty" name="specialty" required>
                            <option value="">Select specialty</option>
                            <option value="General Medicine">General Medicine</option>
                            <option value="Pediatrics">Pediatrics</option>
                            <option value="Cardiology">Cardiology</option>
                            <option value="Dermatology">Dermatology</option>
                            <option value="Orthopedics">Orthopedics</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="doctorEmail">Email</label>
                        <input type="email" id="doctorEmail" name="email" required placeholder="doctor@example.com">
                    </div>
                    <div class="form-group">
                        <label for="doctorPhone">Phone</label>
                        <input type="tel" id="doctorPhone" name="phone" required placeholder="+1 (234) 567-8900">
                    </div>
                </div>
                <div class="form-group">
                    <div class="image-upload">
                        <input type="file" id="doctorImage" name="image" accept="image/*">
                        <label for="doctorImage" class="upload-label">
                            <span class="icon las la-cloud-upload-alt"></span>
                            <span class="text">Click to upload profile image</span>
                        </label>
                        <img id="imagePreview" src="#" alt="Preview">
                    </div>
                </div>
                <div class="form-actions">
                    <button type="button" class="btn-secondary close-modal">Cancel</button>
                    <button type="submit" class="btn-primary">Add Doctor</button>
                </div>
            </form>
        </div>
    `;

    document.body.appendChild(modal);
    modal.style.display = 'flex';

    // Image preview functionality
    const imageInput = modal.querySelector('#doctorImage');
    const imagePreview = modal.querySelector('#imagePreview');
    imageInput.onchange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                imagePreview.src = e.target.result;
                imagePreview.style.display = 'block';
            };
            reader.readAsDataURL(file);
        }
    };

    // Handle form submission
    const form = modal.querySelector('#addDoctorForm');
    form.onsubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        const newDoctor = {
            id: doctors.length + 1,
            ...Object.fromEntries(formData.entries()),
            status: 'active',
            patients: 0,
            appointments: 0,
            image: imagePreview.src || '../img/default-doctor.jpg'
        };
        
        // Add new doctor (In real app, this would be an API call)
        doctors.unshift(newDoctor);
        renderDoctors(doctors);
        modal.remove();
        showNotification('New doctor added successfully!');
    };

    // Close modal functionality
    const closeButtons = modal.querySelectorAll('.close-modal');
    closeButtons.forEach(btn => {
        btn.onclick = () => modal.remove();
    });

    // Close on outside click
    modal.onclick = (e) => {
        if (e.target === modal) modal.remove();
    };
});

// Notification System
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <span class="notification-message">${message}</span>
        <span class="notification-close">&times;</span>
    `;
    
    document.body.appendChild(notification);
    
    // Auto-remove after 3 seconds
    setTimeout(() => {
        notification.remove();
    }, 3000);
    
    // Click to remove
    notification.querySelector('.notification-close').onclick = () => {
        notification.remove();
    };
}

// Event Listeners
searchInput.addEventListener('input', filterDoctors);
specialtyFilter.addEventListener('change', filterDoctors);
statusFilter.addEventListener('change', filterDoctors);

// Initial render
renderDoctors(doctors); 