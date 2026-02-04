import type { Metadata } from 'next';
import MerchantClientPage from './ClientPage';

export const metadata: Metadata = {
    title: 'Merchant Dashboard',
    description: 'Overview of your shipping operations and orders.',
};

export default function MerchantDashboardPage() {
    return <MerchantClientPage />;
}
