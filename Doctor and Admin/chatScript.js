// Import patient data from the system
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

// Chat data structure
let chats = {
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
            },
            {
                id: 3,
                sender: 'patient',
                content: 'Should I take it before or after meals?',
                time: '2024-03-15T09:33:00',
                read: true
            }
        ],
        unread: 0,
        lastMessage: '2024-03-15T09:33:00'
    },
    'P-0124': {
        messages: [
            {
                id: 1,
                sender: 'patient',
                content: 'Hi Doctor, my headache is getting worse.',
                time: '2024-03-15T10:15:00',
                read: false
            }
        ],
        unread: 1,
        lastMessage: '2024-03-15T10:15:00'
    }
};

class ChatManager {
    constructor() {
        this.initializeData();
        this.initializeEventListeners();
        this.loadChats();
        this.activeChat = null;
    }

    initializeData() {
        // Initialize localStorage with sample data if it doesn't exist
        if (!localStorage.getItem('chats')) {
            const initialChats = {
                'P-0123': {
                    userId: 'P-0123',
                    name: 'John Smith',
                    image: 'img/patient1.jpg',
                    status: 'online',
                    lastMessage: 'Thank you doctor, I will follow your advice.',
                    lastMessageTime: '10:30 AM',
                    unread: 0,
                    messages: [
                        {
                            id: 1,
                            type: 'received',
                            content: 'Hello doctor, I have been experiencing headaches lately.',
                            time: '10:00 AM'
                        },
                        {
                            id: 2,
                            type: 'sent',
                            content: 'Hello John, how long have you been having these headaches?',
                            time: '10:15 AM'
                        },
                        {
                            id: 3,
                            type: 'received',
                            content: 'For about a week now, especially in the morning.',
                            time: '10:20 AM'
                        },
                        {
                            id: 4,
                            type: 'sent',
                            content: 'I see. Make sure to get enough sleep and stay hydrated. If it persists, we should schedule an appointment.',
                            time: '10:25 AM'
                        },
                        {
                            id: 5,
                            type: 'received',
                            content: 'Thank you doctor, I will follow your advice.',
                            time: '10:30 AM'
                        }
                    ],
                    files: [
                        {
                            name: 'Medical Report.pdf',
                            size: '2.4 MB',
                            icon: 'la-file-pdf'
                        },
                        {
                            name: 'Blood Test.pdf',
                            size: '1.8 MB',
                            icon: 'la-file-medical'
                        }
                    ]
                },
                'P-0124': {
                    userId: 'P-0124',
                    name: 'Sarah Johnson',
                    image: 'img/patient2.jpg',
                    status: 'offline',
                    lastMessage: 'I will send you my latest test results.',
                    lastMessageTime: '9:45 AM',
                    unread: 2,
                    messages: [
                        {
                            id: 1,
                            type: 'received',
                            content: 'Good morning doctor, I wanted to discuss my test results.',
                            time: '9:30 AM'
                        },
                        {
                            id: 2,
                            type: 'sent',
                            content: 'Good morning Sarah, yes please share them with me.',
                            time: '9:35 AM'
                        },
                        {
                            id: 3,
                            type: 'received',
                            content: 'I will send you my latest test results.',
                            time: '9:45 AM'
                        }
                    ],
                    files: [
                        {
                            name: 'Test Results.pdf',
                            size: '3.2 MB',
                            icon: 'la-file-medical'
                        }
                    ]
                }
            };
            localStorage.setItem('chats', JSON.stringify(initialChats));
        }
    }

    initializeEventListeners() {
        // Message input
        const messageInput = document.getElementById('messageInput');
        const sendButton = document.getElementById('sendMessage');

        messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });

        sendButton.addEventListener('click', () => this.sendMessage());

        // Chat filters
        document.querySelectorAll('.chat-filters button').forEach(button => {
            button.addEventListener('click', () => {
                document.querySelector('.chat-filters button.active').classList.remove('active');
                button.classList.add('active');
                this.filterChats(button.textContent.toLowerCase());
            });
        });

        // Search functionality
        document.querySelector('.search-wrapper input').addEventListener('input', (e) => {
            this.searchChats(e.target.value);
        });
    }

    loadChats() {
        const chats = JSON.parse(localStorage.getItem('chats'));
        const chatListContent = document.querySelector('.chat-list-content');
        chatListContent.innerHTML = '';

        Object.values(chats).forEach(chat => {
            const chatElement = document.createElement('div');
            chatElement.className = 'chat-item';
            chatElement.dataset.userId = chat.userId;
            chatElement.innerHTML = `
                <img src="${chat.image}" alt="${chat.name}">
                <div class="chat-item-info">
                    <div class="chat-item-header">
                        <span class="chat-item-name">${chat.name}</span>
                        <span class="chat-item-time">${chat.lastMessageTime}</span>
                    </div>
                    <div class="chat-item-last-message">${chat.lastMessage}</div>
                </div>
                ${chat.unread ? `<span class="unread-count">${chat.unread}</span>` : ''}
            `;

            chatElement.addEventListener('click', () => this.openChat(chat.userId));
            chatListContent.appendChild(chatElement);
        });

        // Open first chat by default if none is active
        if (!this.activeChat && Object.keys(chats).length > 0) {
            this.openChat(Object.keys(chats)[0]);
        }
    }

    openChat(userId) {
        const chats = JSON.parse(localStorage.getItem('chats'));
        const chat = chats[userId];
        if (!chat) return;

        // Update active chat
        this.activeChat = userId;
        document.querySelectorAll('.chat-item').forEach(item => {
            item.classList.toggle('active', item.dataset.userId === userId);
        });

        // Update chat header
        document.getElementById('activeChatUserImg').src = chat.image;
        document.getElementById('activeChatUserName').textContent = chat.name;
        document.getElementById('activeChatUserStatus').textContent = chat.status;

        // Update patient profile
        document.getElementById('patientProfileImg').src = chat.image;
        document.getElementById('patientProfileName').textContent = chat.name;
        document.getElementById('patientProfileId').textContent = `ID: ${userId}`;

        // Load messages
        this.loadMessages(chat.messages);

        // Load shared files
        this.loadSharedFiles(chat.files);

        // Mark messages as read
        if (chat.unread > 0) {
            chat.unread = 0;
            chats[userId] = chat;
            localStorage.setItem('chats', JSON.stringify(chats));
            this.loadChats();
        }
    }

    loadMessages(messages) {
        const chatMessages = document.getElementById('chatMessages');
        chatMessages.innerHTML = '';

        messages.forEach(message => {
            const messageElement = document.createElement('div');
            messageElement.className = `message ${message.type}`;
            messageElement.innerHTML = `
                <div class="message-content">
                    ${message.content}
                    <div class="message-time">${message.time}</div>
                </div>
            `;
            chatMessages.appendChild(messageElement);
        });

        // Scroll to bottom
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    loadSharedFiles(files) {
        const filesList = document.querySelector('.files-list');
        filesList.innerHTML = '';

        files.forEach(file => {
            const fileElement = document.createElement('div');
            fileElement.className = 'file-item';
            fileElement.innerHTML = `
                <div class="file-icon">
                    <span class="las ${file.icon}"></span>
                </div>
                <div class="file-info">
                    <p class="file-name">${file.name}</p>
                    <p class="file-size">${file.size}</p>
                </div>
            `;
            filesList.appendChild(fileElement);
        });
    }

    sendMessage() {
        if (!this.activeChat) return;

        const messageInput = document.getElementById('messageInput');
        const content = messageInput.value.trim();
        if (!content) return;

        const chats = JSON.parse(localStorage.getItem('chats'));
        const chat = chats[this.activeChat];

        // Add new message
        const newMessage = {
            id: chat.messages.length + 1,
            type: 'sent',
            content: content,
            time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })
        };

        chat.messages.push(newMessage);
        chat.lastMessage = content;
        chat.lastMessageTime = newMessage.time;

        // Update localStorage
        chats[this.activeChat] = chat;
        localStorage.setItem('chats', JSON.stringify(chats));

        // Clear input
        messageInput.value = '';

        // Reload chat
        this.loadMessages(chat.messages);
        this.loadChats();
    }

    filterChats(filter) {
        const chats = JSON.parse(localStorage.getItem('chats'));
        const chatListContent = document.querySelector('.chat-list-content');
        chatListContent.innerHTML = '';

        Object.values(chats).forEach(chat => {
            let show = true;
            if (filter === 'unread' && chat.unread === 0) show = false;
            if (filter === 'important' && !chat.important) show = false;

            if (show) {
                const chatElement = document.createElement('div');
                chatElement.className = 'chat-item';
                chatElement.dataset.userId = chat.userId;
                chatElement.innerHTML = `
                    <img src="${chat.image}" alt="${chat.name}">
                    <div class="chat-item-info">
                        <div class="chat-item-header">
                            <span class="chat-item-name">${chat.name}</span>
                            <span class="chat-item-time">${chat.lastMessageTime}</span>
                        </div>
                        <div class="chat-item-last-message">${chat.lastMessage}</div>
                    </div>
                    ${chat.unread ? `<span class="unread-count">${chat.unread}</span>` : ''}
                `;

                chatElement.addEventListener('click', () => this.openChat(chat.userId));
                chatListContent.appendChild(chatElement);
            }
        });
    }

    searchChats(searchTerm) {
        const chats = JSON.parse(localStorage.getItem('chats'));
        const chatListContent = document.querySelector('.chat-list-content');
        chatListContent.innerHTML = '';

        Object.values(chats).forEach(chat => {
            if (chat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                chat.lastMessage.toLowerCase().includes(searchTerm.toLowerCase())) {
                const chatElement = document.createElement('div');
                chatElement.className = 'chat-item';
                chatElement.dataset.userId = chat.userId;
                chatElement.innerHTML = `
                    <img src="${chat.image}" alt="${chat.name}">
                    <div class="chat-item-info">
                        <div class="chat-item-header">
                            <span class="chat-item-name">${chat.name}</span>
                            <span class="chat-item-time">${chat.lastMessageTime}</span>
                        </div>
                        <div class="chat-item-last-message">${chat.lastMessage}</div>
                    </div>
                    ${chat.unread ? `<span class="unread-count">${chat.unread}</span>` : ''}
                `;

                chatElement.addEventListener('click', () => this.openChat(chat.userId));
                chatListContent.appendChild(chatElement);
            }
        });
    }
}

// Initialize chat manager
const chatManager = new ChatManager(); 