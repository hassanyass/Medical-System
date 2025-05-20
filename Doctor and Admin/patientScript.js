class PatientManager {
    constructor() {
        this.initializeData();
        this.initializeEventListeners();
        this.loadPatients();
    }

    initializeData() {
        // Initialize localStorage with initial data if it doesn't exist
        if (!localStorage.getItem('patients')) {
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
            localStorage.setItem('patients', JSON.stringify(initialPatients));
        }
    }

    initializeEventListeners() {
        // Add new patient button
        document.querySelector('.add-patient-btn').addEventListener('click', () => {
            this.showNewPatientModal();
        });

        // Filter button
        document.querySelector('.filter-btn').addEventListener('click', () => {
            document.getElementById('filterModal').style.display = 'block';
        });

        // Export button
        document.querySelector('.export-btn').addEventListener('click', () => {
            this.exportPatients();
        });

        // Close modal buttons
        document.querySelectorAll('.close-modal, .cancel-btn').forEach(button => {
            button.addEventListener('click', () => {
                this.closeModals();
            });
        });

        // Click outside modal to close
        window.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.closeModals();
            }
        });

        // Search functionality
        document.querySelector('.search-wrapper input').addEventListener('input', (e) => {
            this.handleSearch(e.target.value);
        });

        // Patient form submission
        document.getElementById('patientForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handlePatientFormSubmit(e.target);
        });

        // Filter form submission
        document.getElementById('filterForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleFilterFormSubmit(e.target);
        });

        // Filter reset button
        document.querySelector('.reset-btn').addEventListener('click', () => {
            document.getElementById('filterForm').reset();
            this.loadPatients();
            this.closeModals();
        });
    }

    loadPatients() {
        const patients = JSON.parse(localStorage.getItem('patients') || '{}');
        const tableBody = document.getElementById('patientTableBody');
        if (!tableBody) return;

        tableBody.innerHTML = '';

        Object.values(patients).forEach(patient => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td class="patient-info">
                    <img src="${patient.image}" alt="${patient.firstName} ${patient.lastName}">
                    <div>
                        <h4>${patient.firstName} ${patient.lastName}</h4>
                        <small>ID: ${patient.id}</small>
                    </div>
                </td>
                <td>${patient.age}</td>
                <td>${patient.gender}</td>
                <td>${patient.bloodGroup}</td>
                <td>${patient.medicalHistory}</td>
                <td>${this.formatDate(patient.lastVisit)}</td>
                <td><span class="status ${patient.status}">${patient.status}</span></td>
                <td class="actions">
                    <button class="action-btn view-btn" data-patient-id="${patient.id}">
                        <span class="las la-eye"></span>
                    </button>
                    <button class="action-btn edit-btn" data-patient-id="${patient.id}">
                        <span class="las la-edit"></span>
                    </button>
                    <button class="action-btn delete-btn" data-patient-id="${patient.id}">
                        <span class="las la-trash"></span>
                    </button>
                </td>
            `;

            // Add event listeners for action buttons
            row.querySelector('.view-btn').addEventListener('click', () => this.viewPatient(patient.id));
            row.querySelector('.edit-btn').addEventListener('click', () => this.editPatient(patient.id));
            row.querySelector('.delete-btn').addEventListener('click', () => this.deletePatient(patient.id));

            tableBody.appendChild(row);
        });
    }

    showNewPatientModal() {
        const modal = document.getElementById('newPatientModal');
        const form = document.getElementById('patientForm');
        form.reset();
        form.removeAttribute('data-patient-id');
        modal.querySelector('h2').textContent = 'Add New Patient';
        modal.style.display = 'block';
    }

    viewPatient(patientId) {
        const patients = JSON.parse(localStorage.getItem('patients') || '{}');
        const patient = patients[patientId];
        if (!patient) return;

        const modal = document.getElementById('patientModal');
        
        // Update modal content
        document.getElementById('modalPatientImage').src = patient.image;
        document.getElementById('modalPatientName').textContent = `${patient.firstName} ${patient.lastName}`;
        document.getElementById('modalPatientId').textContent = patient.id;
        document.getElementById('modalDateOfBirth').textContent = this.formatDate(patient.dateOfBirth);
        document.getElementById('modalAge').textContent = patient.age;
        document.getElementById('modalGender').textContent = patient.gender;
        document.getElementById('modalBloodGroup').textContent = patient.bloodGroup;
        document.getElementById('modalPhone').textContent = patient.phone;
        document.getElementById('modalEmail').textContent = patient.email;
        document.getElementById('modalAddress').textContent = patient.address;
        document.getElementById('modalMedicalHistory').textContent = patient.medicalHistory;
        document.getElementById('modalAllergies').textContent = patient.allergies;

        modal.style.display = 'block';
    }

    editPatient(patientId) {
        const patients = JSON.parse(localStorage.getItem('patients') || '{}');
        const patient = patients[patientId];
        if (!patient) return;

        const modal = document.getElementById('newPatientModal');
        const form = document.getElementById('patientForm');

        // Update modal title
        modal.querySelector('h2').textContent = 'Edit Patient';

        // Populate form
        form.elements.firstName.value = patient.firstName;
        form.elements.lastName.value = patient.lastName;
        form.elements.dateOfBirth.value = patient.dateOfBirth;
        form.elements.gender.value = patient.gender;
        form.elements.bloodGroup.value = patient.bloodGroup;
        form.elements.phone.value = patient.phone;
        form.elements.email.value = patient.email;
        form.elements.address.value = patient.address;
        form.elements.medicalHistory.value = patient.medicalHistory;
        form.elements.allergies.value = patient.allergies;
        form.elements.status.value = patient.status;

        // Store patient ID for update
        form.dataset.patientId = patientId;

        modal.style.display = 'block';
    }

    deletePatient(patientId) {
        if (confirm('Are you sure you want to delete this patient?')) {
            const patients = JSON.parse(localStorage.getItem('patients') || '{}');
            delete patients[patientId];
            localStorage.setItem('patients', JSON.stringify(patients));
            this.loadPatients();
        }
    }

    handlePatientFormSubmit(form) {
        const formData = new FormData(form);
        const patientId = form.dataset.patientId || `P-${Math.random().toString(36).substr(2, 4)}`;
        
        const patientData = {
            id: patientId,
            firstName: formData.get('firstName'),
            lastName: formData.get('lastName'),
            dateOfBirth: formData.get('dateOfBirth'),
            age: this.calculateAge(formData.get('dateOfBirth')),
            gender: formData.get('gender'),
            phone: formData.get('phone'),
            email: formData.get('email'),
            address: formData.get('address'),
            bloodGroup: formData.get('bloodGroup'),
            allergies: formData.get('allergies'),
            medicalHistory: formData.get('medicalHistory'),
            status: formData.get('status'),
            lastVisit: new Date().toISOString().split('T')[0],
            image: 'img/default-patient.jpg'
        };

        // Save patient
        const patients = JSON.parse(localStorage.getItem('patients') || '{}');
        patients[patientId] = patientData;
        localStorage.setItem('patients', JSON.stringify(patients));

        // Close modal and refresh list
        this.closeModals();
        this.loadPatients();

        // Show success message
        alert(form.dataset.patientId ? 'Patient updated successfully!' : 'Patient added successfully!');
    }

    handleFilterFormSubmit(form) {
        const formData = new FormData(form);
        const filters = {
            gender: formData.get('gender'),
            bloodGroup: formData.get('bloodGroup'),
            status: formData.get('status'),
            ageMin: formData.get('ageMin'),
            ageMax: formData.get('ageMax')
        };

        const patients = JSON.parse(localStorage.getItem('patients') || '{}');
        const filteredPatients = {};

        Object.entries(patients).forEach(([id, patient]) => {
            let matches = true;

            if (filters.gender && patient.gender !== filters.gender) matches = false;
            if (filters.bloodGroup && patient.bloodGroup !== filters.bloodGroup) matches = false;
            if (filters.status && patient.status !== filters.status) matches = false;
            if (filters.ageMin && patient.age < parseInt(filters.ageMin)) matches = false;
            if (filters.ageMax && patient.age > parseInt(filters.ageMax)) matches = false;

            if (matches) {
                filteredPatients[id] = patient;
            }
        });

        this.updatePatientsTable(filteredPatients);
        this.closeModals();
    }

    handleSearch(searchTerm) {
        searchTerm = searchTerm.toLowerCase();
        const patients = JSON.parse(localStorage.getItem('patients') || '{}');
        const filteredPatients = {};

        Object.entries(patients).forEach(([id, patient]) => {
            const searchString = `
                ${patient.firstName} ${patient.lastName}
                ${patient.id}
                ${patient.email}
                ${patient.phone}
                ${patient.medicalHistory}
            `.toLowerCase();

            if (searchString.includes(searchTerm)) {
                filteredPatients[id] = patient;
            }
        });

        this.updatePatientsTable(filteredPatients);
    }

    exportPatients() {
        const patients = JSON.parse(localStorage.getItem('patients') || '{}');
        
        // Create CSV content
        const csvContent = [
            // Headers
            ['Patient ID', 'Name', 'Age', 'Gender', 'Blood Group', 'Phone', 'Email', 'Address', 'Medical History', 'Allergies', 'Status', 'Last Visit'].join(','),
            // Data rows
            ...Object.values(patients).map(patient => [
                patient.id,
                `${patient.firstName} ${patient.lastName}`,
                patient.age,
                patient.gender,
                patient.bloodGroup,
                patient.phone,
                patient.email,
                patient.address,
                patient.medicalHistory,
                patient.allergies,
                patient.status,
                this.formatDate(patient.lastVisit)
            ].map(field => `"${field}"`).join(','))
        ].join('\n');

        // Create and trigger download
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        
        link.setAttribute('href', url);
        link.setAttribute('download', `patients_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.display = 'none';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    updatePatientsTable(patients) {
        const tableBody = document.getElementById('patientTableBody');
        if (!tableBody) return;

        tableBody.innerHTML = '';

        Object.values(patients).forEach(patient => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td class="patient-info">
                    <img src="${patient.image}" alt="${patient.firstName} ${patient.lastName}">
                    <div>
                        <h4>${patient.firstName} ${patient.lastName}</h4>
                        <small>ID: ${patient.id}</small>
                    </div>
                </td>
                <td>${patient.age}</td>
                <td>${patient.gender}</td>
                <td>${patient.bloodGroup}</td>
                <td>${patient.medicalHistory}</td>
                <td>${this.formatDate(patient.lastVisit)}</td>
                <td><span class="status ${patient.status}">${patient.status}</span></td>
                <td class="actions">
                    <button class="action-btn view-btn" data-patient-id="${patient.id}">
                        <span class="las la-eye"></span>
                    </button>
                    <button class="action-btn edit-btn" data-patient-id="${patient.id}">
                        <span class="las la-edit"></span>
                    </button>
                    <button class="action-btn delete-btn" data-patient-id="${patient.id}">
                        <span class="las la-trash"></span>
                    </button>
                </td>
            `;

            // Add event listeners for action buttons
            row.querySelector('.view-btn').addEventListener('click', () => this.viewPatient(patient.id));
            row.querySelector('.edit-btn').addEventListener('click', () => this.editPatient(patient.id));
            row.querySelector('.delete-btn').addEventListener('click', () => this.deletePatient(patient.id));

            tableBody.appendChild(row);
        });
    }

    closeModals() {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.style.display = 'none';
        });
    }

    calculateAge(dateOfBirth) {
        const today = new Date();
        const birthDate = new Date(dateOfBirth);
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        
        return age;
    }

    formatDate(dateString) {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }
}

// Initialize the patient manager
var patientManager = new PatientManager(); 