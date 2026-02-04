import type { Metadata } from 'next';
import AdminClientPage from './ClientPage';

export const metadata: Metadata = {
    title: 'Admin Dashboard',
    description: 'System-wide monitoring and merchant management.',
};

export default function AdminDashboardPage() {
    return <AdminClientPage />;
}
