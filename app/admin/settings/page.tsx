'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { User, Lock, Bell, Globe, Shield, Mail, Phone, Moon, Sun } from 'lucide-react';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'system'>('profile');

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'system', label: 'System', icon: Globe },
  ] as const;

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div>
        <h1 className="text-3xl font-bold text-text-main dark:text-text-main-dark tracking-tight">
          Settings
        </h1>
        <p className="text-text-dim mt-2">
          Manage your account and platform preferences.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Navigation */}
        <Card variant="default" className="lg:w-64 h-fit p-2 space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === tab.id
                  ? 'bg-primary/10 text-primary'
                  : 'text-text-dim hover:bg-background-card dark:hover:bg-background-card-dark hover:text-text-main dark:hover:text-text-main-dark'
                }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </Card>

        {/* Content Area */}
        <div className="flex-1 space-y-6">
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <Card variant="glass" className="p-6">
                <h2 className="text-lg font-bold text-text-main dark:text-text-main-dark mb-4">Personal Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-sm text-text-dim">Full Name</label>
                    <Input placeholder="Admin User" leftIcon={<User className="h-4 w-4 text-text-dim" />} />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm text-text-dim">Email Address</label>
                    <Input placeholder="admin@shipex.com" type="email" leftIcon={<Mail className="h-4 w-4 text-text-dim" />} />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm text-text-dim">Phone Number</label>
                    <Input placeholder="+1 234 567 890" leftIcon={<Phone className="h-4 w-4 text-text-dim" />} />
                  </div>
                </div>
                <div className="mt-6 flex justify-end">
                  <Button variant="primary">Save Changes</Button>
                </div>
              </Card>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-6">
              <Card variant="glass" className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-bold text-text-main dark:text-text-main-dark">Password</h2>
                  <Badge variant="success">Secure</Badge>
                </div>
                <div className="space-y-4 max-w-md">
                  <div className="space-y-1.5">
                    <label className="text-sm text-text-dim">Current Password</label>
                    <Input type="password" leftIcon={<Lock className="h-4 w-4 text-text-dim" />} />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm text-text-dim">New Password</label>
                    <Input type="password" leftIcon={<Lock className="h-4 w-4 text-text-dim" />} />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm text-text-dim">Confirm New Password</label>
                    <Input type="password" leftIcon={<Lock className="h-4 w-4 text-text-dim" />} />
                  </div>
                </div>
                <div className="mt-6">
                  <Button variant="primary">Update Password</Button>
                </div>
              </Card>

              <Card variant="default" className="p-6">
                <h2 className="text-lg font-bold text-text-main dark:text-text-main-dark mb-4">Two-Factor Authentication</h2>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-text-main dark:text-text-main-dark">Authenticator App</p>
                    <p className="text-sm text-text-dim">Secure your account with 2FA.</p>
                  </div>
                  <Button variant="outline">Setup</Button>
                </div>
              </Card>
            </div>
          )}

          {activeTab === 'system' && (
            <div className="space-y-6">
              <Card variant="glass" className="p-6">
                <h2 className="text-lg font-bold text-text-main dark:text-text-main-dark mb-4">Appearance</h2>
                <div className="flex items-center gap-4">
                  <div className="flex-1 p-4 rounded-xl border border-primary bg-primary/5 cursor-pointer">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 bg-background dark:bg-background-dark rounded-full shadow-sm">
                        <Moon className="h-4 w-4 text-text-main dark:text-text-main-dark" />
                      </div>
                      <span className="font-semibold text-text-main dark:text-text-main-dark">Dark Mode</span>
                    </div>
                    <p className="text-xs text-text-dim">Default system theme</p>
                  </div>
                  <div className="flex-1 p-4 rounded-xl border border-border dark:border-border-dark cursor-pointer opacity-50">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 bg-background dark:bg-background-dark rounded-full shadow-sm">
                        <Sun className="h-4 w-4 text-text-dim" />
                      </div>
                      <span className="font-semibold text-text-main dark:text-text-main-dark">Light Mode</span>
                    </div>
                    <p className="text-xs text-text-dim">Coming soon</p>
                  </div>
                </div>
              </Card>

              <Card variant="default" className="p-6">
                <h2 className="text-lg font-bold text-text-main dark:text-text-main-dark mb-4">Notifications</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Bell className="h-5 w-5 text-text-dim" />
                      <div>
                        <p className="font-medium text-text-main dark:text-text-main-dark">Email Alerts</p>
                        <p className="text-xs text-text-dim">Receive daily summaries</p>
                      </div>
                    </div>
                    <input type="checkbox" className="toggle" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Shield className="h-5 w-5 text-text-dim" />
                      <div>
                        <p className="font-medium text-text-main dark:text-text-main-dark">Security Alerts</p>
                        <p className="text-xs text-text-dim">Login attempts and password changes</p>
                      </div>
                    </div>
                    <input type="checkbox" className="toggle" defaultChecked />
                  </div>
                </div>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}