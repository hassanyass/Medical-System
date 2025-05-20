/**
 * StorageManager class for handling all localStorage operations
 * Implements data versioning and type safety
 */
class StorageManager {
    constructor() {
        this.VERSION = '2.1';
        this.init();
    }

    init() {
        // Initialize storage with default data if empty
        if (!localStorage.getItem('storageVersion') || 
            localStorage.getItem('storageVersion') !== this.VERSION) {
            this.resetToDefaults();
        }
    }

    resetToDefaults() {
        const defaultData = {
            patients: {
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
            },
            appointments: {
                '2024-03-15': [
                    {
                        id: 'APT-001',
                        patientId: 'P-0123',
                        date: '2024-03-15',
                        time: '10:00',
                        type: 'Check-up',
                        status: 'confirmed',
                        notes: 'Regular check-up appointment'
                    },
                    {
                        id: 'APT-002',
                        patientId: 'P-0124',
                        date: '2024-03-15',
                        time: '11:30',
                        type: 'Consultation',
                        status: 'pending',
                        notes: 'New patient consultation'
                    }
                ]
            },
            chats: {
                'P-0123': {
                    messages: [
                        {
                            id: 1,
                            sender: 'patient',
                            content: 'Hello Dr. Yassin, I have a question about my medication.',
                            time: '2024-03-15T09:30:00',
                            read: true
                        },
                        {
                            id: 2,
                            sender: 'doctor',
                            content: 'Hello John, of course. What would you like to know?',
                            time: '2024-03-15T09:32:00',
                            read: true
                        }
                    ],
                    unread: 0,
                    lastMessage: '2024-03-15T09:32:00'
                },
                'P-0124': {
                    messages: [
                        {
                            id: 1,
                            sender: 'patient',
                            content: 'Hi Doctor, this is my first consultation.',
                            time: '2024-03-15T10:15:00',
                            read: false
                        }
                    ],
                    unread: 1,
                    lastMessage: '2024-03-15T10:15:00'
                }
            },
            settings: {
                theme: 'light',
                notifications: true,
                language: 'en'
            }
        };

        // Store default data
        Object.entries(defaultData).forEach(([key, value]) => {
            localStorage.setItem(key, JSON.stringify(value));
        });
        localStorage.setItem('storageVersion', this.VERSION);
    }

    // Generic CRUD operations
    get(key) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error(`Error getting ${key} from storage:`, error);
            return null;
        }
    }

    set(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error(`Error setting ${key} in storage:`, error);
            return false;
        }
    }

    remove(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.error(`Error removing ${key} from storage:`, error);
            return false;
        }
    }

    // Patient-specific operations
    getPatients() {
        return this.get('patients') || {};
    }

    getPatient(patientId) {
        const patients = this.getPatients();
        return patients[patientId];
    }

    setPatient(patientId, patientData) {
        const patients = this.getPatients();
        patients[patientId] = patientData;
        return this.set('patients', patients);
    }

    removePatient(patientId) {
        const patients = this.getPatients();
        delete patients[patientId];
        return this.set('patients', patients);
    }

    // Appointment-specific operations
    getAppointments() {
        return this.get('appointments') || {};
    }

    getAppointmentsForDate(date) {
        const appointments = this.getAppointments();
        return appointments[date] || [];
    }

    setAppointment(date, appointmentData) {
        const appointments = this.getAppointments();
        if (!appointments[date]) {
            appointments[date] = [];
        }
        appointments[date].push(appointmentData);
        return this.set('appointments', appointments);
    }

    removeAppointment(date, appointmentId) {
        const appointments = this.getAppointments();
        if (appointments[date]) {
            appointments[date] = appointments[date].filter(apt => apt.id !== appointmentId);
            return this.set('appointments', appointments);
        }
        return false;
    }

    // Chat-specific operations
    getChats() {
        return this.get('chats') || {};
    }

    getChatHistory(patientId) {
        const chats = this.getChats();
        return chats[patientId] || { messages: [], unread: 0, lastMessage: null };
    }

    addMessage(patientId, messageData) {
        const chats = this.getChats();
        if (!chats[patientId]) {
            chats[patientId] = { messages: [], unread: 0, lastMessage: null };
        }
        chats[patientId].messages.push(messageData);
        chats[patientId].lastMessage = messageData.time;
        if (messageData.sender === 'patient') {
            chats[patientId].unread++;
        }
        return this.set('chats', chats);
    }

    markChatAsRead(patientId) {
        const chats = this.getChats();
        if (chats[patientId]) {
            chats[patientId].unread = 0;
            chats[patientId].messages.forEach(msg => msg.read = true);
            return this.set('chats', chats);
        }
        return false;
    }

    // Settings operations
    getSettings() {
        return this.get('settings') || {
            theme: 'light',
            notifications: true,
            language: 'en'
        };
    }

    updateSettings(newSettings) {
        const currentSettings = this.getSettings();
        return this.set('settings', { ...currentSettings, ...newSettings });
    }

    // Storage management
    clear() {
        localStorage.clear();
        this.init();
    }

    getSize() {
        let size = 0;
        for (let key in localStorage) {
            if (localStorage.hasOwnProperty(key)) {
                size += localStorage[key].length * 2; // UTF-16 uses 2 bytes per character
            }
        }
        return size; // Size in bytes
    }
} 