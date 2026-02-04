'use client';

import React, { useState } from 'react';
import { X, Shield, Globe, Zap, CheckCircle2, Building2, Terminal } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { tenantsService } from '@/lib/services/tenantsService';

interface ProvisionTenantModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export const ProvisionTenantModal: React.FC<ProvisionTenantModalProps> = ({ isOpen, onClose, onSuccess }) => {
    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        adminEmail: '',
        adminPassword: '',
    });

    if (!isOpen) return null;

    const handleProvision = async () => {
        setIsLoading(true);
        try {
            // Simulate provisioning delay for effect
            await new Promise(r => setTimeout(r, 2000));
            // In a real scenario, we'd call the API here
            // await tenantsService.createTenant(formData); 
            setStep(4);
            onSuccess();
        } catch (error) {
            console.error('Provisioning failed:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const nextStep = () => setStep(s => s + 1);
    const prevStep = () => setStep(s => s - 1);

    const steps = [
        { title: "Identity", icon: Building2 },
        { title: "Network", icon: Globe },
        { title: "Authority", icon: Shield },
        { title: "Deployment", icon: Zap }
    ];

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-primary-dark/80 backdrop-blur-xl" onClick={onClose} />

            <div className="relative w-full max-w-2xl glass-card rounded-[3rem] border-white/10 shadow-[0_0_100px_rgba(99,102,241,0.2)] overflow-hidden animate-fade-in-up">
                {/* Header */}
                <div className="px-10 py-8 border-b border-white/5 flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-black text-white tracking-tight">Provision New Node</h2>
                        <p className="text-xs text-text-dim mt-1 uppercase tracking-widest font-bold">Protocol: SHIPEX-INITIALIZE-V1</p>
                    </div>
                    <button onClick={onClose} className="h-12 w-12 rounded-2xl bg-white/5 flex items-center justify-center hover:bg-rose-500/20 hover:text-rose-400 transition-all">
                        <X size={20} />
                    </button>
                </div>

                {/* Progress Tracker */}
                <div className="px-10 py-6 bg-white/[0.02] flex justify-between items-center">
                    {steps.map((s, i) => (
                        <div key={i} className="flex items-center gap-3">
                            <div className={`
                                h-8 w-8 rounded-xl flex items-center justify-center transition-all duration-500
                                ${step > i + 1 ? 'bg-emerald-500 text-white' : step === i + 1 ? 'bg-accent-indigo text-white shadow-glow-indigo' : 'bg-white/5 text-text-dim'}
                            `}>
                                {step > i + 1 ? <CheckCircle2 size={16} /> : <s.icon size={16} />}
                            </div>
                            <span className={`text-[10px] font-black uppercase tracking-widest hidden md:block ${step === i + 1 ? 'text-white' : 'text-text-dim'}`}>
                                {s.title}
                            </span>
                            {i < steps.length - 1 && <div className="h-px w-8 bg-white/5 hidden lg:block" />}
                        </div>
                    ))}
                </div>

                {/* Step Content */}
                <div className="p-10 min-h-[300px]">
                    {step === 1 && (
                        <div className="space-y-6 animate-fade-in-up">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-accent-cyan uppercase tracking-[0.2em] pl-1">Organization Name</label>
                                <Input
                                    placeholder="e.g. Orion Logistics Group"
                                    className="bg-white/5 border-white/5 h-14 rounded-2xl focus:border-accent-cyan/40"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-accent-indigo uppercase tracking-[0.2em] pl-1">Network Slug (Identifier)</label>
                                <div className="relative">
                                    <Input
                                        placeholder="orion-logistics"
                                        className="bg-white/5 border-white/5 h-14 rounded-2xl pl-6 pr-32 focus:border-accent-indigo/40"
                                        value={formData.slug}
                                        onChange={e => setFormData({ ...formData, slug: e.target.value })}
                                    />
                                    <span className="absolute right-6 top-1/2 -translate-y-1/2 text-[10px] font-black text-text-dim">.shipex.io</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-8 animate-fade-in-up">
                            <div className="p-6 rounded-3xl bg-accent-indigo/5 border border-accent-indigo/10">
                                <p className="text-xs text-accent-indigo font-bold leading-relaxed">
                                    Nodes are automatically deployed to the nearest cluster (US-EAST-1). Ensure your organization's identifier is unique to prevent hash collisions.
                                </p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                {['Zero-Trust Isolation', 'Edge Caching', 'Real-time Telemetry', 'Auto-Scaling'].map(feature => (
                                    <div key={feature} className="flex items-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/5">
                                        <div className="h-2 w-2 rounded-full bg-emerald-400" />
                                        <span className="text-[10px] font-black uppercase text-text-dim">{feature}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="space-y-6 animate-fade-in-up">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-accent-pink uppercase tracking-[0.2em] pl-1">Master Administrator Email</label>
                                <Input
                                    type="email"
                                    placeholder="admin@orion.com"
                                    className="bg-white/5 border-white/5 h-14 rounded-2xl"
                                    value={formData.adminEmail}
                                    onChange={e => setFormData({ ...formData, adminEmail: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-accent-pink uppercase tracking-[0.2em] pl-1">Authority Security Key</label>
                                <Input
                                    type="password"
                                    placeholder="••••••••••••"
                                    className="bg-white/5 border-white/5 h-14 rounded-2xl"
                                    value={formData.adminPassword}
                                    onChange={e => setFormData({ ...formData, adminPassword: e.target.value })}
                                />
                            </div>
                        </div>
                    )}

                    {step === 4 && (
                        <div className="flex flex-col items-center justify-center text-center space-y-6 py-10">
                            <div className="h-24 w-24 rounded-[2.5rem] bg-emerald-500 text-white flex items-center justify-center shadow-glow-emerald animate-bounce">
                                <CheckCircle2 size={48} />
                            </div>
                            <div>
                                <h3 className="text-2xl font-black text-white">Node Successfully Provisioned</h3>
                                <p className="text-sm text-text-dim mt-2">The organization "{formData.name}" is now active in the ecosystem.</p>
                            </div>
                            <div className="p-4 rounded-2xl bg-white/5 border border-white/5 font-mono text-[10px] text-accent-cyan">
                                HASH: {Math.random().toString(36).substring(2, 15).toUpperCase()}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Actions */}
                <div className="px-10 py-8 bg-white/[0.02] border-t border-white/5 flex items-center justify-between">
                    {step < 4 ? (
                        <>
                            <Button
                                variant="ghost"
                                onClick={step === 1 ? onClose : prevStep}
                                className="text-text-dim hover:text-white"
                            >
                                {step === 1 ? "Terminate Protocol" : "Previous Stage"}
                            </Button>

                            <Button
                                className="bg-gradient-aurora text-white min-w-[160px] h-14 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-glow-indigo border-none"
                                onClick={step === 3 ? handleProvision : nextStep}
                                isLoading={isLoading}
                                disabled={step === 1 && (!formData.name || !formData.slug)}
                            >
                                {step === 3 ? "Initiate Provisioning" : "Next Stage"}
                            </Button>
                        </>
                    ) : (
                        <Button
                            className="w-full bg-white text-primary-dark h-14 rounded-2xl font-black uppercase tracking-widest text-[10px]"
                            onClick={onClose}
                        >
                            Return to Shipex Control
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
};
