// DOM Elements
const searchInput = document.querySelector('.search-wrapper input');
const messageFilter = document.getElementById('messageFilter');
const messagesList = document.querySelector('.messages-list');
const messageDetail = document.querySelector('.message-detail');
const replyBox = document.querySelector('.reply-box textarea');
const sendButton = document.querySelector('.btn-send');

// Sample Messages Data (In real app, this would come from an API)
let messages = [
    {
        id: 1,
        patientId: 'P-0123',
        patientName: 'John Smith',
        patientImage: '../img/patient1.jpg',
        status: 'urgent',
        isUnread: true,
        timestamp: 'Today, 10:30 AM',
        preview: 'Need urgent appointment with cardiologist...',
        thread: [
            {
                sender: 'patient',
                message: 'Need urgent appointment with cardiologist. Having chest pain since morning.',
                time: '10:30 AM'
            },
            {
                sender: 'admin',
                message: 'I understand your concern. Let me check the availability of our cardiologists right away.',
                time: '10:32 AM'
            }
        ]
    },
    {
        id: 2,
        patientId: 'P-0124',
        patientName: 'Sarah Johnson',
        patientImage: '../img/patient2.jpg',
        status: 'resolved',
        isUnread: false,
        timestamp: 'Yesterday, 3:45 PM',
        preview: 'Thank you for the quick response regarding...',
        thread: [
            {
                sender: 'patient',
                message: 'Thank you for the quick response regarding my prescription refill request.',
                time: '3:45 PM'
            },
            {
                sender: 'admin',
                message: 'You're welcome! The prescription has been sent to your preferred pharmacy.',
                time: '4:00 PM'
            }
        ]
    }
];

// Search and Filter Functionality
function filterMessages() {
    const searchTerm = searchInput.value.toLowerCase();
    const filterValue = messageFilter.value;

    const filteredMessages = messages.filter(message => {
        const matchesSearch = message.patientName.toLowerCase().includes(searchTerm) ||
                            message.preview.toLowerCase().includes(searchTerm);
        const matchesFilter = filterValue === 'all' ||
                            (filterValue === 'unread' && message.isUnread) ||
                            (filterValue === 'urgent' && message.status === 'urgent') ||
                            (filterValue === 'resolved' && message.status === 'resolved');

        return matchesSearch && matchesFilter;
    });

    renderMessagesList(filteredMessages);
}

// Render Messages List
function renderMessagesList(messagesToRender) {
    messagesList.innerHTML = messagesToRender.map(message => `
        <div class="message-item ${message.isUnread ? 'unread' : ''}" data-id="${message.id}">
            <div class="message-header">
                <img src="${message.patientImage}" alt="${message.patientName}">
                <div class="message-info">
                    <h3>${message.patientName}</h3>
                    <span class="timestamp">${message.timestamp}</span>
                </div>
                <div class="message-status ${message.status}">${message.status}</div>
            </div>
            <div class="message-preview">
                ${message.preview}
            </div>
        </div>
    `).join('');

    // Add click handlers to message items
    const messageItems = messagesList.querySelectorAll('.message-item');
    messageItems.forEach(item => {
        item.addEventListener('click', () => {
            const messageId = parseInt(item.dataset.id);
            viewMessage(messageId);
            item.classList.remove('unread');
            messages = messages.map(m => 
                m.id === messageId ? {...m, isUnread: false} : m
            );
        });
    });
}

// View Message Thread
function viewMessage(messageId) {
    const message = messages.find(m => m.id === messageId);
    if (!message) return;

    messageDetail.innerHTML = `
        <div class="detail-header">
            <div class="patient-info">
                <img src="${message.patientImage}" alt="${message.patientName}">
                <div>
                    <h2>${message.patientName}</h2>
                    <p>Patient ID: ${message.patientId}</p>
                </div>
            </div>
            <div class="detail-actions">
                <button class="btn-forward" onclick="forwardToDoctor(${messageId})" title="Forward to Doctor">
                    <span class="las la-share"></span> Forward
                </button>
                <button class="btn-resolve" onclick="resolveMessage(${messageId})" title="Mark as Resolved">
                    <span class="las la-check"></span> Resolve
                </button>
            </div>
        </div>

        <div class="message-thread">
            ${message.thread.map(msg => `
                <div class="message-bubble ${msg.sender}">
                    <p>${msg.message}</p>
                    <span class="time">${msg.time}</span>
                </div>
            `).join('')}
        </div>

        <div class="reply-box">
            <textarea placeholder="Type your reply..."></textarea>
            <button class="btn-send" onclick="sendReply(${messageId})">
                <span class="las la-paper-plane"></span>
            </button>
        </div>
    `;

    // Update reply box and send button references
    replyBox = messageDetail.querySelector('.reply-box textarea');
    sendButton = messageDetail.querySelector('.btn-send');
}

// Send Reply
function sendReply(messageId) {
    const replyText = replyBox.value.trim();
    if (!replyText) return;

    const message = messages.find(m => m.id === messageId);
    if (!message) return;

    // Add reply to thread
    const now = new Date();
    const time = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    
    message.thread.push({
        sender: 'admin',
        message: replyText,
        time: time
    });

    // Update preview
    message.preview = replyText;
    message.timestamp = 'Just now';

    // Clear reply box
    replyBox.value = '';

    // Refresh views
    renderMessagesList(messages);
    viewMessage(messageId);
    showNotification('Reply sent successfully!');
}

// Forward to Doctor
function forwardToDoctor(messageId) {
    const message = messages.find(m => m.id === messageId);
    if (!message) return;

    // Create and show forward modal
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2><span class="las la-share"></span> Forward Message</h2>
                <button class="close-modal"><span class="las la-times"></span></button>
            </div>
            <form id="forwardForm" class="modal-form">
                <div class="form-group">
                    <label for="doctorSelect">Select Doctor</label>
                    <select id="doctorSelect" required>
                        <option value="">Choose a doctor...</option>
                        <option value="1">Dr. Hassan Yassin - General Medicine</option>
                        <option value="2">Dr. Sarah Johnson - Pediatrics</option>
                        <option value="3">Dr. Michael Chen - Cardiology</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="forwardNote">Add Note (Optional)</label>
                    <textarea id="forwardNote" rows="3" placeholder="Add a note for the doctor..."></textarea>
                </div>
                <div class="form-actions">
                    <button type="button" class="btn-secondary close-modal">Cancel</button>
                    <button type="submit" class="btn-primary">Forward</button>
                </div>
            </form>
        </div>
    `;

    document.body.appendChild(modal);
    modal.style.display = 'flex';

    // Handle form submission
    const form = modal.querySelector('#forwardForm');
    form.onsubmit = (e) => {
        e.preventDefault();
        modal.remove();
        showNotification('Message forwarded to doctor successfully!');
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

// Resolve Message
function resolveMessage(messageId) {
    messages = messages.map(m => 
        m.id === messageId ? {...m, status: 'resolved'} : m
    );
    renderMessagesList(messages);
    viewMessage(messageId);
    showNotification('Message marked as resolved!');
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
searchInput.addEventListener('input', filterMessages);
messageFilter.addEventListener('change', filterMessages);

// Initial render
renderMessagesList(messages); 