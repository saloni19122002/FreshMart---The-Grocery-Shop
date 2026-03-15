import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { LogIn, Loader2 } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

const Login = () => {
  const { login, loginWithGoogle, currentUser, role } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const from = location.state?.from?.pathname || null;

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(loginSchema)
  });

  useEffect(() => {
    if (currentUser && role) {
      if (from) {
        navigate(from);
      } else {
        if (role === 'admin') navigate('/admin');
        else if (role === 'farmer') navigate('/farmer');
        else navigate('/');
      }
    }
  }, [currentUser, role, navigate, from]);

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      await login(data.email, data.password);
      toast.success('Logged in successfully!');
    } catch (error) {
      console.error(error);
      toast.error('Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setIsGoogleLoading(true);
      await loginWithGoogle();
      toast.success('Signed in with Google!');
    } catch (error) {
      console.error(error);
      toast.error('Google sign-in failed');
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto scale-in duration-300">
      <div className="bg-white p-10 shadow-2xl shadow-emerald-100/50 border border-gray-100 rounded-[2.5rem]">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 mb-6 transform rotate-3 hover:rotate-0 transition-transform duration-300 shadow-inner">
            <LogIn size={32} />
          </div>
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">Welcome Back</h2>
          <p className="text-gray-500 mt-2 font-medium">Continue your fresh journey</p>
        </div>

        <button 
          onClick={handleGoogleLogin}
          disabled={isGoogleLoading || isLoading}
          className="w-full flex justify-center items-center gap-3 py-4 border-2 border-gray-100 rounded-2xl text-gray-700 font-bold hover:bg-gray-50 transition-all active:scale-[0.98] mb-8"
        >
          {isGoogleLoading ? <Loader2 className="animate-spin text-emerald-500" size={20} /> : (
            <>
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#EA4335" d="M12 5.04c1.9 0 3.51.68 4.71 1.8l3.39-3.39C17.9 1.51 15.21 1 12 1 7.24 1 3.2 3.73 1.25 7.74l3.84 2.98C6.01 7.73 8.78 5.04 12 5.04z" />
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#FBBC05" d="M5.09 14.28c-.21-.63-.33-1.3-.33-2s.12-1.37.33-2l-3.84-2.98C.46 8.72 0 10.31 0 12s.46 3.28 1.25 4.7l3.84-2.98c-.21-.63-.33-1.3-.33-2.42z" />
                <path fill="#34A853" d="M12 23c3.21 0 5.9-1.06 7.87-2.87l-3.57-2.77c-1.1.74-2.5 1.18-4.3 1.18-3.22 0-5.99-2.69-6.91-4.68l-3.84 2.98C3.2 20.27 7.24 23 12 23z" />
              </svg>
              <span>Sign in with Google</span>
            </>
          )}
        </button>

        <div className="relative mb-8 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-100"></div>
          </div>
          <span className="relative px-4 bg-white text-xs font-black text-gray-400 uppercase tracking-[0.2em]">Or use email</span>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Email Address</label>
            <input 
              type="email" 
              {...register('email')} 
              className="input-field !py-4" 
              placeholder="you@example.com"
            />
            {errors.email && <p className="text-red-500 text-xs font-bold pl-1">{errors.email.message}</p>}
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center pl-1">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Password</label>
              <Link to="/forgot-password" size="sm" className="text-xs text-emerald-600 font-bold hover:underline">
                Forgot?
              </Link>
            </div>
            <input 
              type="password" 
              {...register('password')} 
              className="input-field !py-4" 
              placeholder="••••••••"
            />
            {errors.password && <p className="text-red-500 text-xs font-bold pl-1">{errors.password.message}</p>}
          </div>

          <button 
            type="submit" 
            disabled={isLoading || isGoogleLoading}
            className="w-full btn-primary flex justify-center items-center py-4 mt-8 text-sm font-black rounded-2xl shadow-xl shadow-emerald-100"
          >
            {isLoading ? <Loader2 className="animate-spin mr-2" size={18} /> : null}
            {isLoading ? 'WELCOME BACK...' : 'LOG IN TO ACCOUNT'}
          </button>
        </form>

        <div className="mt-10 text-center">
          <p className="text-sm text-gray-500 font-medium">
            New here?{' '}
            <Link to="/signup" className="text-emerald-600 font-black hover:underline underline-offset-4">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
