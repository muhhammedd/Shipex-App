'use client';

import { useState, useEffect } from 'react';
import { adminService, Zone } from '@/lib/services/adminService';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Plus, Edit, Loader2, Map, DollarSign, Tag } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function PricingPage() {
  const [zones, setZones] = useState<Zone[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New Zone Form State
  const [formData, setFormData] = useState({
    name: '',
    basePrice: '',
    pricePerKg: '',
    description: ''
  });

  useEffect(() => {
    loadZones();
  }, []);

  const loadZones = async () => {
    try {
      const data = await adminService.getZones();
      setZones(data);
    } catch (error) {
      toast.error("Failed to load zones");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await adminService.createZone({
        name: formData.name,
        basePrice: Number(formData.basePrice),
        pricePerKg: Number(formData.pricePerKg),
        description: formData.description,
        isActive: true
      });
      toast.success("Zone created successfully");
      setIsModalOpen(false);
      setFormData({ name: '', basePrice: '', pricePerKg: '', description: '' });
      loadZones();
    } catch (error) {
      toast.error("Failed to create zone");
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-text-main dark:text-text-main-dark tracking-tight">
            Pricing Configuration
          </h1>
          <p className="text-text-dim mt-2">
            Manage shipping zones and delivery rates.
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => setIsModalOpen(true)}
          leftIcon={<Plus className="h-4 w-4" />}
        >
          Add New Zone
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center min-h-[40vh]">
          <Loader2 className="animate-spin text-primary h-8 w-8" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {zones.map((zone) => (
            <Card key={zone.id} variant="default" className="p-6 relative group overflow-hidden">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg text-primary">
                    <Map className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-text-main dark:text-text-main-dark">{zone.name}</h3>
                    <Badge variant={zone.isActive ? 'success' : 'secondary'} size="sm">
                      {zone.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => toast.success("Edit coming soon")}>
                  <Edit className="h-4 w-4 text-text-dim" />
                </Button>
              </div>

              <p className="text-sm text-text-dim mb-6 line-clamp-2 min-h-[2.5rem]">
                {zone.description || 'No description provided for this zone.'}
              </p>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border dark:border-border-dark">
                <div>
                  <p className="text-xs text-text-dim uppercase tracking-wider mb-1">Base Fee</p>
                  <p className="text-xl font-bold text-text-main dark:text-text-main-dark flex items-center gap-1">
                    <span className="text-sm font-normal text-text-dim">$</span>
                    {zone.basePrice}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-text-dim uppercase tracking-wider mb-1">Per Kg</p>
                  <p className="text-xl font-bold text-text-main dark:text-text-main-dark flex items-center gap-1">
                    <span className="text-sm font-normal text-text-dim">$</span>
                    {zone.pricePerKg}
                  </p>
                </div>
              </div>
            </Card>
          ))}

          {/* Add New Placeholder Card */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="border-2 border-dashed border-border dark:border-border-dark rounded-xl p-6 flex flex-col items-center justify-center text-center hover:border-primary hover:bg-primary/5 transition-all group min-h-[260px]"
          >
            <div className="h-12 w-12 rounded-full bg-background-card dark:bg-background-card-dark flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Plus className="h-6 w-6 text-text-dim group-hover:text-primary" />
            </div>
            <h3 className="font-bold text-text-main dark:text-text-main-dark">Add Zone</h3>
            <p className="text-sm text-text-dim mt-1">Configure a new delivery area</p>
          </button>
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Zone">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-text-main dark:text-text-main-dark mb-1.5 block">Zone Name</label>
              <Input
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Downtown Metro"
                required
                leftIcon={<Tag className="h-4 w-4 text-text-dim" />}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-text-main dark:text-text-main-dark mb-1.5 block">Description</label>
              <Input
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                placeholder="Brief description of the coverage area"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-text-main dark:text-text-main-dark mb-1.5 block">Base Price</label>
                <Input
                  type="number"
                  value={formData.basePrice}
                  onChange={e => setFormData({ ...formData, basePrice: e.target.value })}
                  placeholder="0.00"
                  required
                  leftIcon={<DollarSign className="h-4 w-4 text-text-dim" />}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-text-main dark:text-text-main-dark mb-1.5 block">Price / KG</label>
                <Input
                  type="number"
                  value={formData.pricePerKg}
                  onChange={e => setFormData({ ...formData, pricePerKg: e.target.value })}
                  placeholder="0.00"
                  required
                  leftIcon={<DollarSign className="h-4 w-4 text-text-dim" />}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary">Create Zone</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}