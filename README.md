# Shipex - Modern Logistics & Supply Chain Platform

Shipex is a next-generation logistics platform connecting merchants, couriers, and administrators through a seamless, high-performance web application. Built with **Next.js 16**, **Tailwind CSS**, and **TypeScript**, it features a robust role-based architecture and a premium design system.

![Design System](docs/design-system-preview.png)

## 🚀 Key Features

### 👑 Role-Based Dashboards
- **Merchants**: Order management, address book, analytics, and bulk imports.
- **Couriers**: Delivery manifest, route optimization, and earnings tracking.
- **Admins**: System oversight, user management, and financial reporting.
- **Super Admins**: Tenant management and global configurations.

### 🌟 Core Capabilities
- **Real-time Notifications**: Instant updates via WebSockets for order status changes.
- **Live Tracking**: Public public tracking page with real-time status updates.
- **Delivery Proof**: GPS-tagged photo and signature capture for deliveries.
- **Smart Analytics**: Interactive charts and data visualization for all roles.
- **Accessibility**: First-class support for screen readers and keyboard navigation (Axe-core tested).

## 🛠 Tech Stack

- **Framework**: [Next.js 16 via App Router](https://nextjs.org/)
- **Language**: TypeScript
- **Styling**: Tailwind CSS, CSS Variables, Glassmorphism
- **State Management**: Zustand
- **Forms**: React Hook Form + Zod
- **Testing**: Playwright + Axe-core
- **Icons**: Lucide React
- **Charts**: Recharts

## 🏁 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/your-org/shipex-app.git
    cd shipex-app
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Environment Setup**:
    Copy `.env.local.example` to `.env.local`:
    ```bash
    cp .env.local.example .env.local
    ```
    *Note: Ask the team lead for the required API keys.*

4.  **Run Development Server**:
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000) (or 3001 if configured).

## 🧪 Testing

We use **Playwright** for End-to-End (E2E) and Accessibility testing.

```bash
# Run all tests (headless)
npx playwright test

# Run UI mode (interactive)
npx playwright test --ui

# Run specific suite
npx playwright test e2e/auth.spec.ts
```

## 📚 Documentation

Detailed documentation available in the `docs/` directory:

- [🎨 Design System](docs/design-system.md): Colors, Typography, and Components.
- [🚀 Deployment Guide](docs/deployment.md): Build instructions and Vercel configuration.

## 🤝 Contributing

1.  Create a feature branch (`git checkout -b feature/amazing-feature`).
2.  Commit your changes (`git commit -m 'Add amazing feature'`).
3.  Push to the branch (`git push origin feature/amazing-feature`).
4.  Open a Pull Request.

---

© 2026 Shipex Logistics. All rights reserved.
