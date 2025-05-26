document.addEventListener('DOMContentLoaded', function() {
    // Modal handling
    const addDoctorBtn = document.getElementById('addDoctorBtn');
    const addDoctorModal = document.getElementById('addDoctorModal');
    const closeButtons = document.getElementsByClassName('close-modal');
    
    if (addDoctorBtn && addDoctorModal) {
        // Open modal
        addDoctorBtn.addEventListener('click', function() {
            addDoctorModal.style.display = 'flex'; // Changed to flex for better centering
            document.body.style.overflow = 'hidden'; // Prevent background scrolling
        });
        
        // Close modal
        Array.from(closeButtons).forEach(button => {
            button.addEventListener('click', function() {
                addDoctorModal.style.display = 'none';
                document.body.style.overflow = 'auto';
                resetForm('addDoctorForm');
            });
        });
        
        // Close modal when clicking outside
        window.addEventListener('click', function(event) {
            if (event.target === addDoctorModal) {
                addDoctorModal.style.display = 'none';
                document.body.style.overflow = 'auto';
                resetForm('addDoctorForm');
            }
        });

        // Preview image before upload
        const doctorImage = document.getElementById('doctorImage');
        if (doctorImage) {
            doctorImage.addEventListener('change', function(e) {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        const preview = document.getElementById('imagePreview');
                        if (preview) {
                            preview.src = e.target.result;
                            preview.style.display = 'block';
                        }
                    }
                    reader.readAsDataURL(file);
                }
            });
        }
        
        // Handle form submission
        const addDoctorForm = document.getElementById('addDoctorForm');
        if (addDoctorForm) {
            addDoctorForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                if (validateForm(this)) {
                    // Get form data
                    const formData = new FormData(addDoctorForm);
                    const doctorData = Object.fromEntries(formData.entries());
                    
                    // Add doctor to table/grid
                    if (document.querySelector('.doctors-grid')) {
                        addDoctorToGrid(doctorData);
                    } else if (document.querySelector('.appointments-table')) {
                        addDoctorToTable(doctorData);
                    }
                    
                    // Show success message
                    showNotification('Doctor added successfully!', 'success');
                    
                    // Close modal and reset form
                    addDoctorModal.style.display = 'none';
                    document.body.style.overflow = 'auto';
                    resetForm('addDoctorForm');
                }
            });
        }
    }
    
    // Action buttons functionality
    document.addEventListener('click', function(e) {
        if (e.target.closest('.view-btn')) {
            const row = e.target.closest('tr');
            const doctorName = row.querySelector('h4').textContent;
            console.log('Viewing details for:', doctorName);
            // Implement view functionality
        }
        
        if (e.target.closest('.edit-btn')) {
            const row = e.target.closest('tr');
            const doctorName = row.querySelector('h4').textContent;
            console.log('Editing:', doctorName);
            // Implement edit functionality
        }
        
        if (e.target.closest('.delete-btn')) {
            const row = e.target.closest('tr');
            const doctorName = row.querySelector('h4').textContent;
            if (confirm(`Are you sure you want to remove ${doctorName}?`)) {
                console.log('Removing:', doctorName);
                row.remove();
                // Implement delete functionality with backend
            }
        }
    });
});

// Form validation
function validateForm(form) {
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            isValid = false;
            showFieldError(field, 'This field is required');
        } else {
            clearFieldError(field);
            
            // Additional validation based on field type
            if (field.type === 'email' && !validateEmail(field.value)) {
                isValid = false;
                showFieldError(field, 'Please enter a valid email address');
            }
            if (field.type === 'tel' && !validatePhone(field.value)) {
                isValid = false;
                showFieldError(field, 'Please enter a valid phone number');
            }
        }
    });
    
    return isValid;
}

// Validation helpers
function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validatePhone(phone) {
    return /^\+?[\d\s-]{10,}$/.test(phone);
}

function showFieldError(field, message) {
    const errorDiv = field.nextElementSibling?.classList.contains('error-message') 
        ? field.nextElementSibling 
        : document.createElement('div');
    
    if (!field.nextElementSibling?.classList.contains('error-message')) {
        errorDiv.className = 'error-message';
        field.parentNode.insertBefore(errorDiv, field.nextSibling);
    }
    
    errorDiv.textContent = message;
    field.classList.add('error');
}

function clearFieldError(field) {
    const errorDiv = field.nextElementSibling;
    if (errorDiv?.classList.contains('error-message')) {
        errorDiv.remove();
    }
    field.classList.remove('error');
}

// Reset form
function resetForm(formId) {
    const form = document.getElementById(formId);
    if (form) {
        form.reset();
        const errorMessages = form.querySelectorAll('.error-message');
        errorMessages.forEach(error => error.remove());
        const errorFields = form.querySelectorAll('.error');
        errorFields.forEach(field => field.classList.remove('error'));
        
        // Reset image preview
        const imagePreview = document.getElementById('imagePreview');
        if (imagePreview) {
            imagePreview.src = '';
            imagePreview.style.display = 'none';
        }
    }
}

// Show notification
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
    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.remove();
    });
}

// Add doctor to grid view
function addDoctorToGrid(doctorData) {
    const doctorsGrid = document.querySelector('.doctors-grid');
    const doctorCard = document.createElement('div');
    doctorCard.className = 'doctor-card';
    
    doctorCard.innerHTML = `
        <div class="doctor-header">
            <img src="${doctorData.image ? URL.createObjectURL(doctorData.image) : '../img/default-doctor.jpg'}" alt="doctor">
            <div class="status-badge active">Active</div>
        </div>
        <div class="doctor-info">
            <h3>Dr. ${doctorData.name}</h3>
            <p class="specialty">${doctorData.specialty}</p>
            <p class="stats">
                <span><i class="las la-user-friends"></i> 0 Patients</span>
                <span><i class="las la-calendar-check"></i> 0 Appointments</span>
            </p>
            <div class="contact-info">
                <p><i class="las la-envelope"></i> ${doctorData.email}</p>
                <p><i class="las la-phone"></i> ${doctorData.phone}</p>
            </div>
        </div>
        <div class="doctor-actions">
            <button class="btn-view" title="View Details">
                <span class="las la-eye"></span>
            </button>
            <button class="btn-edit" title="Edit">
                <span class="las la-edit"></span>
            </button>
            <button class="btn-delete" title="Remove">
                <span class="las la-trash"></span>
            </button>
        </div>
    `;
    
    doctorsGrid.insertBefore(doctorCard, doctorsGrid.firstChild);
}

// Add doctor to table view
function addDoctorToTable(doctorData) {
    const tbody = document.querySelector('.appointments-table tbody');
    const tr = document.createElement('tr');
    
    tr.innerHTML = `
        <td class="patient-info">
            <img src="${doctorData.image ? URL.createObjectURL(doctorData.image) : '../img/default-doctor.jpg'}" alt="doctor">
            <div>
                <h4>Dr. ${doctorData.name}</h4>
                <small>ID: D-${String(Date.now()).slice(-4)}</small>
            </div>
        </td>
        <td>${doctorData.specialty}</td>
        <td>0 patients</td>
        <td><span class="status confirmed">Active</span></td>
        <td>
            <div class="action-buttons">
                <button class="action-btn view-btn" title="View Details">
                    <span class="las la-eye"></span>
                </button>
                <button class="action-btn edit-btn" title="Edit">
                    <span class="las la-edit"></span>
                </button>
                <button class="action-btn delete-btn" title="Remove">
                    <span class="las la-trash"></span>
                </button>
            </div>
        </td>
    `;
    
    tbody.insertBefore(tr, tbody.firstChild);
} 