# Medical System Dashboard

A comprehensive medical system dashboard for managing patients, appointments, and doctor-patient communication.

## Features

- Patient Management System
- Appointment Scheduling (9 AM - 5 PM)
- Real-time Chat Functionality
- Responsive Dashboard
- Doctor Profile Management
- Admin Panel

## Technical Requirements

- Modern browser support
- Maximum page weight: 500KB
- Lighthouse score target: 90+
- Client-side only (no backend required)

## Project Structure

```
medical-system/
├── assets/
│   ├── css/
│   ├── js/
│   └── img/
├── components/
│   ├── chat/
│   ├── appointments/
│   ├── patients/
│   └── dashboard/
├── admin/
└── doctor/
```

## Setup Instructions

1. Clone the repository
2. Open `index.html` in a modern web browser
3. Login using the following credentials:
   - Doctor: doctor@example.com / password
   - Admin: admin@example.com / password

## Development

### CSS Variables

The project uses CSS variables for consistent theming:

```css
:root {
  --primary-color: #2196f3;
  --secondary-color: #1976d2;
  --text-color: #333;
  --background-color: #f5f5f5;
  /* ... other variables ... */
}
```

### Storage

Data is persisted using the StorageManager class which handles localStorage operations.

### Performance Optimization

- Lazy loading of images
- Minified CSS/JS
- Optimized asset delivery
- Efficient DOM operations

## Accessibility

The system implements ARIA roles and semantic HTML for better accessibility:

- Proper heading hierarchy
- ARIA labels
- Keyboard navigation
- Focus management
- Screen reader support

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Version

Current Version: 2.1 