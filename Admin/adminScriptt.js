document.addEventListener('DOMContentLoaded', function() {
    const addDoctorBtn = document.getElementById('addDoctorBtn');
    const addDoctorModal = document.getElementById('addDoctorModal');
    const closeButtons = document.getElementsByClassName('close-modal');
    
    if (addDoctorBtn && addDoctorModal) {
        addDoctorBtn.addEventListener('click', function() {
            addDoctorModal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        });

        Array.from(closeButtons).forEach(button => {
            button.addEventListener('click', function() {
                addDoctorModal.style.display = 'none';
                document.body.style.overflow = 'auto';
                resetForm('addDoctorForm');
            });
        });

        window.addEventListener('click', function(event) {
            if (event.target === addDoctorModal) {
                addDoctorModal.style.display = 'none';
                document.body.style.overflow = 'auto';
                resetForm('addDoctorForm');
            }
        });

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
    }

    document.addEventListener('click', function(e) {
        if (e.target.closest('.view-btn')) {
            const row = e.target.closest('tr');
            const doctorName = row.querySelector('h4').textContent;
            console.log('Viewing details for:', doctorName);
        }

        if (e.target.closest('.edit-btn')) {
            const row = e.target.closest('tr');
            const doctorName = row.querySelector('h4').textContent;
            console.log('Editing:', doctorName);
        }

        if (e.target.closest('.delete-btn')) {
            const row = e.target.closest('tr');
            const doctorName = row.querySelector('h4').textContent;
            if (confirm(`Are you sure you want to remove ${doctorName}?`)) {
                console.log('Removing:', doctorName);
                row.remove();
            }
        }
    });
});

function validateForm(form) {
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;

    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            isValid = false;
            showFieldError(field, 'This field is required');
        } else {
            clearFieldError(field);

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

function resetForm(formId) {
    const form = document.getElementById(formId);
    if (form) {
        form.reset();
        const errorMessages = form.querySelectorAll('.error-message');
        errorMessages.forEach(error => error.remove());
        const errorFields = form.querySelectorAll('.error');
        errorFields.forEach(field => field.classList.remove('error'));

        const imagePreview = document.getElementById('imagePreview');
        if (imagePreview) {
            imagePreview.src = '';
            imagePreview.style.display = 'none';
        }
    }
}

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

    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.remove();
    });
}
