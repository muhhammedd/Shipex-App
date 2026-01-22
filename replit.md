# Shipex Admin Dashboard

## Overview

Shipex is a logistics and delivery management platform built with Next.js 14. The application provides an admin dashboard for managing orders, merchants, drivers, and delivery operations. It features a multi-tenant architecture designed to support different user roles (Admin, Merchant, Courier) with RTL (right-to-left) language support for Arabic.

The current implementation is in Phase 0, focusing on layout, mock data, and core dashboard functionality. The system is designed to be API-ready, with mock data structured to mirror future backend responses.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Framework
- **Next.js 14** with App Router for server and client components
- **TypeScript** for type safety across the codebase
- **Tailwind CSS** for styling with a custom color palette (primary: #111111, secondary: #2F2F2F, background: #F6F6F6, accent: #FFCB74)

### Component Architecture
- **UI Components** (`components/ui/`): Reusable, generic components like Badge, Card, StatCard
- **Domain Components** (`components/domain/`): Business-specific components organized by feature (e.g., order components)
- **Dashboard Components** (`components/dashboard/`): Dashboard-specific widgets like IntelligenceCard

### Data Layer
- **Mock Data** (`lib/mock/`): Centralized mock data modules that mirror expected API responses
- **Types** (`types/`): TypeScript interfaces defining data structures (Order, OrderStatus, OrderHistory)
- Data is designed for easy replacement with real API calls

### Routing Structure
- Admin routes under `/admin/` with nested pages for different features
- Dynamic routes for detail pages (e.g., `/admin/orders/[id]`)
- Shared layout with sidebar navigation and topbar

### Design Patterns
- Component composition for complex UI elements
- Separation of concerns between UI and data
- RTL-first design with Arabic language support
- Role-based component variations (admin, merchant, courier props)

## External Dependencies

### Core Framework
- **Next.js 14.2.0**: React framework with App Router
- **React 18**: UI library
- **TypeScript 5**: Type system

### UI Libraries
- **Tailwind CSS 3.4.1**: Utility-first CSS framework
- **Lucide React 0.562.0**: Icon library
- **Recharts 3.6.0**: Charting library for analytics visualizations

### Development Tools
- **ESLint**: Code linting with Next.js config
- **PostCSS**: CSS processing for Tailwind

### Future Integrations (Planned)
- Backend API for order management
- Database integration (structure ready for Drizzle ORM)
- Authentication system for multi-role access