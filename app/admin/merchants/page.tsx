'use client';

import React, { useEffect, useState } from 'react';
import {
  Store,
  Search,
  Plus,
  Mail,
  Phone,
  Package,
  TrendingUp,
  MoreVertical,
  ExternalLink,
  ShieldCheck,
  Ban,
  MapPin
} from 'lucide-react';
import { usersService } from '@/lib/services/usersService';
import { User } from '@/types/models';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { StatCard } from '@/components/ui/StatCard';
import { Input } from '@/components/ui/Input';
import { Loading } from '@/components/ui/Loading';

export default function MerchantsPage() {
  const [merchants, setMerchants] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchMerchants = async () => {
      try {
        const response = await usersService.getUsers('MERCHANT');
        const data = Array.isArray(response) ? response : response.data;
        setMerchants(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Failed to fetch merchants:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchMerchants();
  }, []);

  const filteredMerchants = merchants.filter(merchant =>
    merchant.merchantProfile?.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    merchant.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <Loading fullScreen text="Loading merchants..." />;

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-text-main dark:text-text-main-dark">
            Merchant <span className="text-primary">Partners</span>
          </h1>
          <p className="text-text-dim mt-2">Manage merchant accounts and oversee network growth.</p>
        </div>
        <Button variant="primary" leftIcon={<Plus className="w-4 h-4" />}>
          Onboard Merchant
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Active Merchants"
          value={merchants.length.toString()}
          icon={Store}
          variant="default"
          iconClassName="text-primary"
        />
        <StatCard
          title="Growth Rate"
          value="+12.5%"
          icon={TrendingUp}
          variant="gradient-success"
          trend="+2.1%"
          trendValue={2.1}
        />
        <StatCard
          title="Avg Daily Volume"
          value="450"
          icon={Package}
          variant="default"
          iconClassName="text-indigo-600"
        />
      </div>

      {/* Search Bar */}
      <Card variant="glass" className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-dim" />
          <Input
            placeholder="Search by company name or email..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </Card>

      {/* Merchants Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMerchants.length === 0 ? (
          <div className="col-span-full py-20 text-center">
            <Store className="mx-auto h-12 w-12 text-text-dim/20 mb-4" />
            <p className="text-text-dim">No merchants found matching your search.</p>
          </div>
        ) : (
          filteredMerchants.map((merchant) => (
            <Card key={merchant.id} variant="default" className="group hover:border-primary/50 transition-colors">
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-bold text-xl group-hover:bg-primary group-hover:text-white transition-all duration-300">
                    {merchant.merchantProfile?.companyName?.charAt(0) || 'M'}
                  </div>
                  <Badge variant={merchant.isActive ? 'success' : 'secondary'}>
                    {merchant.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>

                <div className="space-y-1 mb-6">
                  <h3 className="font-bold text-lg text-text-main dark:text-text-main-dark truncate">
                    {merchant.merchantProfile?.companyName || 'Unnamed Merchant'}
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-text-dim bg-background-card dark:bg-background-card-dark px-2 py-0.5 rounded">
                      {merchant.id.slice(0, 8)}
                    </span>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3 text-sm text-text-dim">
                    <Mail size={14} className="text-primary/60" />
                    <span className="truncate">{merchant.email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-text-dim">
                    <MapPin size={14} className="text-primary/60" />
                    <span className="truncate">{merchant.merchantProfile?.businessAddress || 'No Address'}</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-border dark:border-border-dark flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold uppercase text-text-dim tracking-wider">Balance</span>
                    <span className="text-sm font-bold text-text-main dark:text-text-main-dark">${Number(merchant.merchantProfile?.balance || 0).toFixed(2)}</span>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-text-dim hover:text-primary">
                      <ExternalLink size={16} />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-text-dim hover:text-error">
                      <Ban size={16} />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}