'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    MapPin,
    Plus,
    Edit,
    Trash2,
    Star,
    Phone,
    Mail,
    Search
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Loading } from '@/components/ui/Loading';
import { AddressFormModal } from '@/components/merchant/AddressFormModal';
import { addressBookService } from '@/lib/services/addressBookService';
import { Address, CreateAddressDto } from '@/types/address';
import { toast } from 'react-hot-toast';

export default function AddressBookPage() {
    const router = useRouter();
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingAddress, setEditingAddress] = useState<Address | undefined>();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        loadAddresses();
    }, []);

    const loadAddresses = async () => {
        try {
            setIsLoading(true);
            const response = await addressBookService.getAddresses();
            setAddresses(response.data || []);
        } catch (error) {
            console.error('Error loading addresses:', error);
            toast.error('Failed to load addresses');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreate = () => {
        setEditingAddress(undefined);
        setIsModalOpen(true);
    };

    const handleEdit = (address: Address) => {
        setEditingAddress(address);
        setIsModalOpen(true);
    };

    const handleSubmit = async (data: CreateAddressDto) => {
        try {
            setIsSubmitting(true);
            if (editingAddress) {
                await addressBookService.updateAddress(editingAddress.id, data);
                toast.success('Address updated successfully');
            } else {
                await addressBookService.createAddress(data);
                toast.success('Address created successfully');
            }
            await loadAddresses();
            setIsModalOpen(false);
        } catch (error) {
            console.error('Error saving address:', error);
            toast.error('Failed to save address');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this address?')) return;

        try {
            await addressBookService.deleteAddress(id);
            toast.success('Address deleted successfully');
            await loadAddresses();
        } catch (error) {
            console.error('Error deleting address:', error);
            toast.error('Failed to delete address');
        }
    };

    const handleSetDefault = async (id: string) => {
        try {
            await addressBookService.setDefaultAddress(id);
            toast.success('Default address updated');
            await loadAddresses();
        } catch (error) {
            console.error('Error setting default address:', error);
            toast.error('Failed to set default address');
        }
    };

    const filteredAddresses = addresses.filter(address =>
        address.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        address.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        address.phone.includes(searchQuery)
    );

    if (isLoading) {
        return <Loading text="Loading addresses..." />;
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-bold text-text-main dark:text-text-main-dark font-gilroy">
                        Address Book
                    </h1>
                    <p className="text-text-dim dark:text-text-dim-dark mt-2">
                        Manage your saved delivery addresses
                    </p>
                </div>
                <Button
                    variant="primary"
                    leftIcon={<Plus className="w-5 h-5" />}
                    onClick={handleCreate}
                >
                    Add New Address
                </Button>
            </div>

            {/* Search */}
            {addresses.length > 0 && (
                <Card variant="default" className="p-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-text-dim dark:text-text-dim-dark" />
                        <Input
                            placeholder="Search by name, city, or phone..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                </Card>
            )}

            {/* Address Grid */}
            {filteredAddresses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredAddresses.map((address) => (
                        <Card
                            key={address.id}
                            variant="hover"
                            className="p-6 relative"
                        >
                            {/* Default Badge */}
                            {address.isDefault && (
                                <div className="absolute top-4 right-4">
                                    <Badge variant="success" size="sm">
                                        <Star className="w-3 h-3 mr-1 fill-current" />
                                        Default
                                    </Badge>
                                </div>
                            )}

                            {/* Address Info */}
                            <div className="space-y-4 mb-6">
                                <div>
                                    <h3 className="text-lg font-bold text-text-main dark:text-text-main-dark mb-1">
                                        {address.name}
                                    </h3>
                                    <div className="flex items-center gap-2 text-sm text-text-dim dark:text-text-dim-dark">
                                        <Phone className="w-4 h-4" />
                                        {address.phone}
                                    </div>
                                    {address.email && (
                                        <div className="flex items-center gap-2 text-sm text-text-dim dark:text-text-dim-dark mt-1">
                                            <Mail className="w-4 h-4" />
                                            {address.email}
                                        </div>
                                    )}
                                </div>

                                <div className="flex items-start gap-2 text-sm text-text-main dark:text-text-main-dark">
                                    <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-primary" />
                                    <div>
                                        <p>{address.addressLine1}</p>
                                        {address.addressLine2 && <p>{address.addressLine2}</p>}
                                        <p>
                                            {address.city}
                                            {address.zone && `, ${address.zone}`}
                                            {address.postalCode && ` ${address.postalCode}`}
                                        </p>
                                        <p>{address.country}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-2 pt-4 border-t border-border dark:border-border-dark">
                                {!address.isDefault && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="flex-1"
                                        onClick={() => handleSetDefault(address.id)}
                                        leftIcon={<Star className="w-4 h-4" />}
                                    >
                                        Set Default
                                    </Button>
                                )}
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className={address.isDefault ? 'flex-1' : ''}
                                    onClick={() => handleEdit(address)}
                                    leftIcon={<Edit className="w-4 h-4" />}
                                >
                                    Edit
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleDelete(address.id)}
                                    className="text-error hover:bg-error/10 hover:border-error"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        </Card>
                    ))}
                </div>
            ) : (
                <Card variant="default" className="p-16 text-center">
                    <div className="max-w-md mx-auto space-y-4">
                        <div className="h-16 w-16 bg-background dark:bg-background-dark rounded-2xl border border-border dark:border-border-dark flex items-center justify-center mx-auto text-text-dim dark:text-text-dim-dark">
                            <MapPin size={32} />
                        </div>
                        <div>
                            <p className="text-lg font-semibold text-text-main dark:text-text-main-dark">
                                {searchQuery ? 'No addresses found' : 'No saved addresses yet'}
                            </p>
                            <p className="text-sm text-text-dim dark:text-text-dim-dark mt-2">
                                {searchQuery
                                    ? 'Try adjusting your search criteria'
                                    : 'Save addresses to quickly fill in recipient details when creating orders'}
                            </p>
                        </div>
                        {!searchQuery && (
                            <Button
                                variant="primary"
                                leftIcon={<Plus className="w-5 h-5" />}
                                onClick={handleCreate}
                            >
                                Add Your First Address
                            </Button>
                        )}
                    </div>
                </Card>
            )}

            {/* Address Form Modal */}
            <AddressFormModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleSubmit}
                address={editingAddress}
                isLoading={isSubmitting}
            />
        </div>
    );
}
