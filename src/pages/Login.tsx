import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Role } from '../lib/types';
import { Store, Truck, ShieldCheck, LogIn } from 'lucide-react';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<Role>('merchant');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    const success = login(email, password, role);
    if (success) {
      // Redirect based on role
      switch (role) {
        case 'merchant':
          navigate('/merchant/dashboard');
          break;
        case 'courier':
          navigate('/courier/dashboard');
          break;
        case 'admin':
          navigate('/admin/dashboard');
          break;
      }
    } else {
      setError('Login failed. Please try again.');
    }
  };

  const roleOptions: { value: Role; label: string; icon: React.ReactNode }[] = [
    { value: 'merchant', label: 'Merchant', icon: <Store className="h-5 w-5" /> },
    { value: 'courier', label: 'Courier', icon: <Truck className="h-5 w-5" /> },
    { value: 'admin', label: 'Admin', icon: <ShieldCheck className="h-5 w-5" /> },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Shipex</h1>
          <p className="text-gray-600">Shipping Management System</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {/* Role Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Select Role
            </label>
            <div className="grid grid-cols-3 gap-2">
              {roleOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setRole(option.value)}
                  className={`flex flex-col items-center justify-center p-3 rounded-lg border-2 transition-all ${
                    role === option.value
                      ? 'border-indigo-600 bg-indigo-50'
                      : 'border-gray-200 bg-gray-50 hover:border-gray-300'
                  }`}
                >
                  <span className={`mb-1 ${role === option.value ? 'text-indigo-600' : 'text-gray-600'}`}>
                    {option.icon}
                  </span>
                  <span className={`text-xs font-medium ${role === option.value ? 'text-indigo-600' : 'text-gray-600'}`}>
                    {option.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="you@example.com"
            />
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="••••••••"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200 flex items-center justify-center gap-2"
          >
            <LogIn className="h-5 w-5" />
            Sign In
          </button>
        </form>

        {/* Demo Credentials */}
        <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-gray-700 font-semibold mb-2">Demo Credentials:</p>
          <ul className="text-xs text-gray-600 space-y-1">
            <li>• <strong>Merchant:</strong> alice@shipex.com / password</li>
            <li>• <strong>Courier:</strong> bob@shipex.com / password</li>
            <li>• <strong>Admin:</strong> charlie@shipex.com / password</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Login;
