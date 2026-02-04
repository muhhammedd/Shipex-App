'use client';

import React, { useEffect, useState } from 'react';
import {
  Users,
  Search,
  Plus,
  Mail,
  Truck,
  Star,
  Shield,
  MoreVertical,
  MapPin,
  Circle,
  FileBarChart
} from 'lucide-react';
import { usersService } from '@/lib/services/usersService';
import { User } from '@/types/models';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { StatCard } from '@/components/ui/StatCard';
import { Loading } from '@/components/ui/Loading';

export default function DriversPage() {
  const [drivers, setDrivers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const response = await usersService.getUsers('COURIER');
        const data = Array.isArray(response) ? response : response.data;
        setDrivers(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Failed to fetch couriers:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDrivers();
  }, []);

  if (loading) return <Loading fullScreen text="Loading courier fleet..." />;

  // Mock stats
  const activeDrivers = drivers.filter(d => d.isActive).length;
  const totalFleet = drivers.length;

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-text-main dark:text-text-main-dark">
            Courier <span className="text-primary">Fleet</span>
          </h1>
          <p className="text-text-dim mt-2">Manage driver assignments and monitor fleet performance.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" leftIcon={<FileBarChart className="w-4 h-4" />}>
            Fleet Analytics
          </Button>
          <Button variant="primary" leftIcon={<Plus className="w-4 h-4" />}>
            Onboard Driver
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Total Fleet"
          value={totalFleet.toString()}
          icon={Truck}
          variant="default"
          iconClassName="text-primary"
        />
        <StatCard
          title="Active Drivers"
          value={activeDrivers.toString()}
          icon={Users}
          variant="gradient-primary"
        />
        <StatCard
          title="Avg Rating"
          value="4.8"
          icon={Star}
          variant="default"
          iconClassName="text-yellow-500"
        />
      </div>

      {/* Driver Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {drivers.length === 0 ? (
          <div className="col-span-full py-20 text-center">
            <Truck className="mx-auto h-12 w-12 text-text-dim/20 mb-4" />
            <p className="text-text-dim">No couriers currently active in the fleet.</p>
          </div>
        ) : (
          drivers.map((driver) => (
            <Card key={driver.id} variant="default" className="group overflow-hidden hover:border-primary/50 transition-colors">
              {/* Header / Avatar */}
              <div className="p-6 pb-4 relative">
                <div className="flex justify-between items-start mb-4">
                  <div className="relative">
                    <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-primary to-indigo-600 flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-primary/20">
                      {driver.email.charAt(0).toUpperCase()}
                    </div>
                    <div className={`absolute -bottom-1 -right-1 h-5 w-5 rounded-full border-2 border-background-card dark:border-background-card-dark flex items-center justify-center ${driver.isActive ? 'bg-success' : 'bg-text-dim'}`}>
                      {driver.isActive && <div className="h-2 w-2 rounded-full bg-white animate-pulse" />}
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-text-dim hover:text-primary">
                    <MoreVertical size={16} />
                  </Button>
                </div>

                <div className="space-y-1">
                  <h3 className="font-bold text-lg text-text-main dark:text-text-main-dark truncate group-hover:text-primary transition-colors">
                    {driver.name || `Driver ${driver.id.slice(0, 4)}`}
                  </h3>
                  <div className="flex items-center gap-2 text-xs font-semibold text-text-dim uppercase tracking-wider">
                    <Truck size={12} />
                    <span>{driver.courierProfile?.vehicleInfo || 'Light Van'}</span>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 border-y border-border dark:border-border-dark divide-x divide-border dark:divide-border-dark bg-background/50 dark:bg-background-dark/50">
                <div className="p-3 flex flex-col items-center">
                  <span className="text-[10px] font-bold uppercase text-text-dim tracking-wider mb-1">Rating</span>
                  <div className="flex items-center gap-1 text-yellow-500">
                    <span className="text-sm font-bold">4.9</span>
                    <Star size={10} fill="currentColor" />
                  </div>
                </div>
                <div className="p-3 flex flex-col items-center">
                  <span className="text-[10px] font-bold uppercase text-text-dim tracking-wider mb-1">Status</span>
                  {driver.isActive ? (
                    <span className="text-xs font-bold text-success">AVAILABLE</span>
                  ) : (
                    <span className="text-xs font-bold text-text-dim">OFFLINE</span>
                  )}
                </div>
              </div>

              {/* Info */}
              <div className="p-6 pt-4 space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-text-dim">
                    <MapPin size={14} className="text-primary/60" />
                    <span className="truncate">North Zone</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-text-dim">
                    <Mail size={14} className="text-primary/60" />
                    <span className="truncate">{driver.email}</span>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold uppercase text-text-dim tracking-wider">Wallet</span>
                    <span className="text-sm font-bold text-text-main dark:text-text-main-dark">${Number(driver.courierProfile?.wallet || 0).toFixed(2)}</span>
                  </div>
                  <Button variant="outline" size="sm" className="h-8 text-xs">
                    View Profile
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}