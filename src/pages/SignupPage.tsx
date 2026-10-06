import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { ShieldCheck, ArrowRight } from 'lucide-react';

export function SignupPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    
    try {
      if (register) {
        await register({ firstName, lastName, email, phone, password });
        navigate('/'); // On successful registration and subsequent auto-login
      }
    } catch (err: any) {
      if (err?.response?.data?.details?.length > 0) {
        const detail = err.response.data.details[0].message;
        setError(typeof detail === 'string' ? detail : 'Validation failed');
      } else {
        const rawError = err?.response?.data?.error;
        setError(typeof rawError === 'string' ? rawError : (rawError?.message || 'Registration failed'));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-background p-4">
      <div className="absolute inset-0 bg-grid opacity-20" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
      
      <Card className="w-full max-w-md p-8 relative z-10 glass-strong border-white/10 animate-scale-in">
        <div className="flex flex-col items-center mb-8">
          <div className="h-12 w-12 bg-primary rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-primary/25">
            <span className="text-3xl font-bold text-white">V</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Create an Account</h1>
          <p className="text-gray-400 text-sm mt-1">Join VaultPay Premium Banking</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">First Name</label>
              <Input 
                type="text" 
                placeholder="John"
                value={firstName}
                onChange={e => setFirstName(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Last Name</label>
              <Input 
                type="text" 
                placeholder="Doe"
                value={lastName}
                onChange={e => setLastName(e.target.value)}
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Email address</label>
            <Input 
              type="email" 
              placeholder="name@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Phone Number</label>
            <Input 
              type="tel" 
              placeholder="+91 9876543210"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Password</label>
            <Input 
              type="password" 
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              minLength={8}
            />
          </div>
          {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
          <Button type="submit" className="w-full mt-6" size="lg" disabled={isSubmitting}>
            {isSubmitting ? 'Creating Account...' : 'Sign Up'}
            {!isSubmitting && <ArrowRight className="ml-2 h-4 w-4" />}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm">
          <span className="text-gray-400">Already have an account? </span>
          <Link to="/login" className="text-primary hover:underline">Sign In</Link>
        </div>

        <div className="mt-6 flex items-center justify-center text-sm text-gray-400 gap-1">
          <ShieldCheck className="h-4 w-4 text-emerald-500" />
          <span>Secured by VaultPay Enterprise</span>
        </div>
      </Card>
    </div>
  );
}
