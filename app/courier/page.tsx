import type { Metadata } from 'next';
import CourierClientPage from './ClientPage';

export const metadata: Metadata = {
    title: 'Courier Dashboard',
    description: 'Delivery management and route tracking.',
};

export default function CourierDashboardPage() {
    return <CourierClientPage />;
}
