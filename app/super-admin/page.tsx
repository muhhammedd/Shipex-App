import type { Metadata } from 'next';
import SuperAdminClientPage from './ClientPage';

export const metadata: Metadata = {
    title: 'Super Admin',
    description: 'Global infrastructure and multi-tenant management.',
};

export default function SuperAdminDashboardPage() {
    return <SuperAdminClientPage />;
}
