# BioVault Data Portal

A secure, role-based biomedical data platform built with React, Firebase, and Vite. BioVault enables researchers, reviewers, and admins to manage sensitive datasets with real-time access control, audit logging, and ethical transparency. Designed for scalable, modular deployment.

## 🚀 Live Demo

[Live Site](https://biovault-e4f8e.firebaseapp.com/)

## Features

- Role-based authentication (Admin, Researcher, Reviewer)
- Real-time dataset management (Firestore)
- Secure file uploads (Firebase Storage integration ready)
- Audit logging for all user actions
- Responsive UI with Tailwind CSS and glassmorphism design
- Modular React components and Zustand state management

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm

### Installation

```sh
git clone https://github.com/yourusername/biovault.git
cd biovault
npm install
```

### Development

```sh
npm run dev
```

### Build

```sh
npm run build
```

### Preview

```sh
npm run preview
```

## Firebase Setup

1. Create a Firebase project.
2. Update `src/firebase.js` with your Firebase config.
3. Enable Firestore, Authentication, and Storage as needed.

## Folder Structure

```
biovault/
  ├── src/
  │   ├── components/
  │   ├── pages/
  │   ├── services/
  │   ├── state/
  │   ├── styles/
  │   └── utils/
  ├── public/
  ├── package.json
  ├── tailwind.config.js
  ├── vite.config.js
  └── ...
```

## License

MIT © Vanshika

---

**Live Link:** [https://biovault-e4f8e.firebaseapp.com/]
