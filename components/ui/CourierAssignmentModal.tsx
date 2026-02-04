'use client';

import { useState, useEffect } from 'react';
import {
    Users,
    Search,
    MapPin,
    Truck,
    CheckCircle2,
    Clock,
    X,
    UserCircle2
} from 'lucide-react';
import { Modal } from './Modal';
import { Button } from './Button';
import { Input } from './Input';
import { Badge } from './Badge';
import { Loading } from './Loading';
import { usersService } from '@/lib/services/usersService';
import { ordersApiService } from '@/lib/services/ordersApiService';
import { User, UserRole } from '@/types/models';

interface CourierAssignmentModalProps {
    isOpen: boolean;
    onClose: () => void;
    orderIds: string[];
    trackingNumber: string;
    onAssigned: () => void;
}

export function CourierAssignmentModal({
    isOpen,
    onClose,
    orderIds,
    trackingNumber,
    onAssigned,
}: CourierAssignmentModalProps) {
    const [couriers, setCouriers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isAssigning, setIsAssigning] = useState(false);

    useEffect(() => {
        if (isOpen) {
            loadCouriers();
        }
    }, [isOpen]);

    const loadCouriers = async () => {
        try {
            setIsLoading(true);
            const response = await usersService.getUsers();
            // Filter only couriers
            const allCouriers = (response.data || []).filter(u => u.role === UserRole.COURIER);
            setCouriers(allCouriers);
        } catch (error) {
            console.error('Error loading couriers:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAssign = async (courierId: string) => {
        try {
            setIsAssigning(true);
            if (orderIds.length === 1) {
                await ordersApiService.assignCourier(orderIds[0], courierId);
            } else {
                await ordersApiService.bulkAssignCourier(orderIds, courierId);
            }
            onAssigned();
            onClose();
        } catch (error) {
            console.error('Error assigning courier:', error);
            alert('Failed to assign courier. Please try again.');
        } finally {
            setIsAssigning(false);
        }
    };

    const filteredCouriers = couriers.filter(c =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={`LOGISTICS ASSIGNMENT: ${trackingNumber}`}
            size="md"
        >
            <div className="space-y-6">
                <div className="relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-primary-light/30 group-focus-within:text-accent transition-colors" />
                    <Input
                        placeholder="Search active agents..."
                        className="pl-12 h-12 bg-surface/20 border-accent/10 focus:border-accent/40 rounded-xl"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <div className="max-h-[400px] overflow-y-auto space-y-3 pr-2 custom-scrollbar">
                    {isLoading ? (
                        <div className="py-20 text-center">
                            <Loading text="Scanning neural grid for available agents..." />
                        </div>
                    ) : filteredCouriers.length > 0 ? (
                        filteredCouriers.map((courier) => (
                            <div
                                key={courier.id}
                                className="flex items-center justify-between p-4 rounded-2xl glass border border-accent/5 hover:border-accent/20 transition-all duration-300 group"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="h-12 w-12 rounded-xl bg-accent/5 border border-accent/10 flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-primary-dark transition-all duration-500">
                                        <UserCircle2 className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <p className="font-black text-primary-light uppercase tracking-tight group-hover:text-accent transition-colors">{courier.name}</p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <Badge variant={courier.courierProfile?.isAvailable ? 'success' : 'info'} className="text-[10px] py-0">
                                                {courier.courierProfile?.isAvailable ? 'AVAILABLE' : 'IN_TRANSIT'}
                                            </Badge>
                                            <span className="text-[10px] font-bold text-primary-light/30 uppercase tracking-widest">{courier.email}</span>
                                        </div>
                                    </div>
                                </div>
                                <Button
                                    variant={courier.courierProfile?.isAvailable ? 'primary' : 'secondary'}
                                    size="sm"
                                    onClick={() => handleAssign(courier.id)}
                                    disabled={isAssigning}
                                    className="h-10 px-6 rounded-xl text-[10px] font-black"
                                >
                                    {isAssigning ? '...' : 'SECURE'}
                                </Button>
                            </div>
                        ))
                    ) : (
                        <div className="py-20 text-center text-primary-light/30 font-bold uppercase tracking-widest text-xs">
                            No field agents detected.
                        </div>
                    )}
                </div>

                <div className="flex justify-end pt-4 border-t border-accent/5">
                    <Button variant="ghost" onClick={onClose} disabled={isAssigning} className="rounded-xl px-8 text-[10px] font-black tracking-widest">
                        Cancel
                    </Button>
                </div>
            </div>
        </Modal>
    );
}
