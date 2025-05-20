// DOM Elements
const searchInput = document.querySelector('.search-wrapper input');
const activityTypeFilter = document.getElementById('activityType');
const dateFilter = document.getElementById('dateFilter');
const exportButton = document.querySelector('.btn-export');
const activityTimeline = document.querySelector('.activity-timeline');

// Sample Activity Data (In real app, this would come from an API)
let activities = [
    {
        id: 1,
        type: 'doctor',
        title: 'Doctor Profile Updated',
        description: 'Dr. Hassan Yassin updated their contact information and availability schedule',
        user: 'Dr. Hassan Yassin',
        category: 'Profile Update',
        timestamp: '2024-03-20T10:45:00',
        time: '10:45 AM'
    },
    {
        id: 2,
        type: 'patient',
        title: 'New Appointment Scheduled',
        description: 'Patient John Smith scheduled an urgent appointment with Dr. Sarah Johnson for cardiology consultation',
        user: 'John Smith',
        category: 'Appointment',
        timestamp: '2024-03-20T10:30:00',
        time: '10:30 AM'
    },
    {
        id: 3,
        type: 'system',
        title: 'System Backup Completed',
        description: 'Daily automated system backup completed successfully. All patient records and system configurations secured',
        user: 'System',
        category: 'Maintenance',
        timestamp: '2024-03-20T10:15:00',
        time: '10:15 AM'
    },
    {
        id: 4,
        type: 'admin',
        title: 'New Doctor Added',
        description: 'Admin added new doctor: Dr. Michael Chen (Cardiology). License and credentials verified',
        user: 'Admin',
        category: 'Doctor Management',
        timestamp: '2024-03-20T10:00:00',
        time: '10:00 AM'
    },
    {
        id: 5,
        type: 'patient',
        title: 'Patient Message Received',
        description: 'Urgent message received from patient Sarah Johnson regarding prescription refill request',
        user: 'Sarah Johnson',
        category: 'Communication',
        timestamp: '2024-03-20T09:45:00',
        time: '9:45 AM'
    },
    {
        id: 6,
        type: 'doctor',
        title: 'Prescription Issued',
        description: 'Dr. Sarah Johnson issued a prescription for Patient Mark Wilson - Medication: Amoxicillin 500mg',
        user: 'Dr. Sarah Johnson',
        category: 'Prescription',
        timestamp: '2024-03-20T09:30:00',
        time: '9:30 AM'
    },
    {
        id: 7,
        type: 'system',
        title: 'Security Alert',
        description: 'Multiple failed login attempts detected from unknown IP address. Security protocols activated',
        user: 'System',
        category: 'Security',
        timestamp: '2024-03-20T09:15:00',
        time: '9:15 AM'
    },
    {
        id: 8,
        type: 'admin',
        title: 'System Settings Updated',
        description: 'Updated appointment scheduling rules and notification preferences for emergency consultations',
        user: 'Admin',
        category: 'System Configuration',
        timestamp: '2024-03-20T09:00:00',
        time: '9:00 AM'
    },
    {
        id: 9,
        type: 'doctor',
        title: 'Medical Record Updated',
        description: 'Dr. Michael Chen updated patient treatment plan and added new test results for Patient Emily Brown',
        user: 'Dr. Michael Chen',
        category: 'Patient Care',
        timestamp: '2024-03-20T08:45:00',
        time: '8:45 AM'
    },
    {
        id: 10,
        type: 'patient',
        title: 'Appointment Rescheduled',
        description: 'Patient Robert Davis rescheduled their follow-up appointment with Dr. Hassan Yassin to next week',
        user: 'Robert Davis',
        category: 'Appointment',
        timestamp: '2024-03-20T08:30:00',
        time: '8:30 AM'
    },
    {
        id: 11,
        type: 'system',
        title: 'Database Optimization',
        description: 'Automated database optimization completed. System performance improved by 15%',
        user: 'System',
        category: 'Maintenance',
        timestamp: '2024-03-20T08:15:00',
        time: '8:15 AM'
    },
    {
        id: 12,
        type: 'admin',
        title: 'Department Schedule Updated',
        description: 'Updated operating hours for Cardiology department during upcoming holiday season',
        user: 'Admin',
        category: 'Department Management',
        timestamp: '2024-03-20T08:00:00',
        time: '8:00 AM'
    },
    {
        id: 13,
        type: 'doctor',
        title: 'Emergency Consultation',
        description: 'Dr. Sarah Johnson provided emergency teleconsultation for Patient James Wilson',
        user: 'Dr. Sarah Johnson',
        category: 'Emergency Care',
        timestamp: '2024-03-20T07:45:00',
        time: '7:45 AM'
    },
    {
        id: 14,
        type: 'system',
        title: 'System Update Installed',
        description: 'Critical security patches and system updates installed successfully',
        user: 'System',
        category: 'System Update',
        timestamp: '2024-03-20T07:30:00',
        time: '7:30 AM'
    },
    {
        id: 15,
        type: 'patient',
        title: 'New Patient Registration',
        description: 'New patient Lisa Anderson completed registration and submitted medical history',
        user: 'Lisa Anderson',
        category: 'Registration',
        timestamp: '2024-03-20T07:15:00',
        time: '7:15 AM'
    }
];

// Activity Summary Data
const activitySummary = {
    doctor: 45,
    patient: 128,
    system: 12,
    admin: 23
};

// Search and Filter Functionality
function filterActivities() {
    const searchTerm = searchInput.value.toLowerCase();
    const activityType = activityTypeFilter.value;
    const selectedDate = dateFilter.value;

    const filteredActivities = activities.filter(activity => {
        const matchesSearch = activity.title.toLowerCase().includes(searchTerm) ||
                            activity.description.toLowerCase().includes(searchTerm) ||
                            activity.user.toLowerCase().includes(searchTerm);
        
        const matchesType = activityType === 'all' || activity.type === activityType;
        
        const matchesDate = !selectedDate || 
                          new Date(activity.timestamp).toLocaleDateString() === 
                          new Date(selectedDate).toLocaleDateString();

        return matchesSearch && matchesType && matchesDate;
    });

    renderActivityTimeline(filteredActivities);
    updateSummaryCards(filteredActivities);
}

// Render Activity Timeline
function renderActivityTimeline(activitiesToRender) {
    activityTimeline.innerHTML = activitiesToRender.map(activity => `
        <div class="timeline-item">
            <div class="time">${activity.time}</div>
            <div class="indicator ${activity.type}"></div>
            <div class="content">
                <h4>${activity.title}</h4>
                <p>${activity.description}</p>
                <div class="meta">
                    <span class="user">By: ${activity.user}</span>
                    <span class="category">Category: ${activity.category}</span>
                </div>
            </div>
        </div>
    `).join('');
}

// Update Summary Cards
function updateSummaryCards(filteredActivities) {
    const today = new Date().toLocaleDateString();
    
    const counts = {
        doctor: 0,
        patient: 0,
        system: 0
    };

    filteredActivities.forEach(activity => {
        if (new Date(activity.timestamp).toLocaleDateString() === today) {
            counts[activity.type] = (counts[activity.type] || 0) + 1;
        }
    });

    // Update summary card numbers
    Object.keys(counts).forEach(type => {
        const summaryCard = document.querySelector(`.summary-card .summary-icon.${type}`);
        if (summaryCard) {
            const countElement = summaryCard.closest('.summary-card').querySelector('p');
            countElement.textContent = `${counts[type]} activities today`;
        }
    });
}

// Export Logs Functionality
function exportLogs() {
    const filteredActivities = activities.filter(activity => {
        const activityType = activityTypeFilter.value;
        const selectedDate = dateFilter.value;
        
        const matchesType = activityType === 'all' || activity.type === activityType;
        const matchesDate = !selectedDate || 
                          new Date(activity.timestamp).toLocaleDateString() === 
                          new Date(selectedDate).toLocaleDateString();

        return matchesType && matchesDate;
    });

    // Create CSV content
    const csvContent = [
        ['Timestamp', 'Type', 'Title', 'Description', 'User', 'Category'],
        ...filteredActivities.map(activity => [
            activity.timestamp,
            activity.type,
            activity.title,
            activity.description,
            activity.user,
            activity.category
        ])
    ].map(row => row.join(',')).join('\n');

    // Create and trigger download
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `activity_logs_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    showNotification('Activity logs exported successfully!');
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
searchInput.addEventListener('input', filterActivities);
activityTypeFilter.addEventListener('change', filterActivities);
dateFilter.addEventListener('change', filterActivities);
exportButton.addEventListener('click', exportLogs);

// Set default date filter to today
dateFilter.valueAsDate = new Date();

// Initial render
filterActivities(); 