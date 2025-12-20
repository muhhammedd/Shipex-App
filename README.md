# Shipex - Shipping Management System Frontend

This repository contains the frontend application for the Shipex Shipping Management System, built using React, TypeScript, and Vite. The application implements a robust Role-Based Access Control (RBAC) system with mock data to simulate a full-featured logistics platform for Merchants, Couriers, and Administrators.

## 🚀 Project Overview

The primary goal of this project phase was to establish a clean, professional, and scalable frontend structure based on the provided user flow specification. The application is designed to be fully functional with local mock data, making it ready for future integration with a real backend API.

### Key Features Implemented

| Feature | Description |
| :--- | :--- |
| **Technology Stack** | React, TypeScript, Vite, Tailwind CSS (v4), \`react-router-dom\`. |
| **State Management** | Custom React Context (\`AuthContext\` and \`DataContext\`) for managing user authentication, roles, and all application data (Users, Orders). |
| **Authentication (Mock)** | Role-based login with persistence via \`localStorage\`. Supports \`merchant\`, \`courier\`, and \`admin\` roles. |
| **Role-Based Access Control (RBAC)** | Implemented via a \`ProtectedRoute\` component, ensuring users can only access routes permitted by their assigned role. |
| **Merchant Flow** | Dashboard, Orders List (with filtering), Create Order form, and Order Details with a mock cancellation feature. |
| **Courier Flow** | Dashboard, Tasks List (assigned orders), and Task Details with sequential status updates (Pending → Picked → Delivered). |
| **Admin Flow** | Dashboard (with key metrics), Users Management, and Orders Management with a mock courier assignment feature. |

## 🛠️ Local Development Setup

Follow these steps to set up the project locally.

### Prerequisites

*   Node.js (v18+)
*   pnpm (recommended package manager)

### Installation

1.  **Clone the repository:**
    \`\`\`bash
    git clone muhhammedd/Shipex-App
    cd Shipex-App
    \`\`\`

2.  **Install dependencies:**
    \`\`\`bash
    pnpm install
    \`\`\`

3.  **Run the development server:**
    \`\`\`bash
    pnpm dev
    \`\`\`
    The application will be available at \`http://localhost:3000\`.

## 🔑 Demo Credentials

The application uses mock authentication. Use the following credentials to test the different user roles:

| Role | Email | Password | Redirects to |
| :--- | :--- | :--- | :--- |
| **Merchant** | \`alice@shipex.com\` | \`password\` | \`/merchant/dashboard\` |
| **Courier** | \`bob@shipex.com\` | \`password\` | \`/courier/dashboard\` |
| **Admin** | \`charlie@shipex.com\` | \`password\` | \`/admin/dashboard\` |

## 📂 Project Structure

The project follows a standard React/Vite structure:

\`\`\`
src/
├── components/           # Reusable UI components (e.g., buttons, forms, sidebar parts)
│   ├── admin/
│   ├── courier/
│   └── merchant/
├── contexts/             # React Context for global state management (Auth, Data)
│   ├── AuthContext.tsx
│   └── DataContext.tsx
├── lib/                  # Utility files (types, mock data, utility functions)
│   ├── types.ts
│   └── mockData.ts
├── layouts/              # Layout components (e.g., BaseLayout)
├── pages/                # Main application pages, grouped by role
│   ├── admin/
│   ├── courier/
│   └── merchant/
├── App.tsx               # Main router configuration
└── main.tsx              # Entry point
\`\`\`

## ✅ Completion Status

This phase successfully implemented all frontend user flows and RBAC as specified. The application is now ready for the next phase: **Backend Integration**.
