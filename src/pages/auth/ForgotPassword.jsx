import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { KeyRound, Loader2, ArrowLeft } from 'lucide-react';

const resetSchema = z.object({
  email: z.string().email('Invalid email address'),
});

const ForgotPassword = () => {
  const { resetPassword } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(resetSchema)
  });

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      await resetPassword(data.email);
      setIsSent(true);
      toast.success('Password reset email sent!');
    } catch (error) {
      console.error(error);
      toast.error(error.message || 'Failed to send reset email');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="card w-full p-8 shadow-xl bg-white border border-gray-100 rounded-2xl">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary-100 text-primary-600 mb-4">
          <KeyRound size={24} />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Reset Password</h2>
        <p className="text-gray-500 mt-2 text-sm">
          {isSent 
            ? "Check your email for a link to reset your password. If it doesn't appear within a few minutes, check your spam folder."
            : "Enter your email address and we'll send you a link to reset your password."}
        </p>
      </div>

      {!isSent ? (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input 
              type="email" 
              {...register('email')} 
              className="input-field" 
              placeholder="you@example.com"
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="btn-primary w-full flex justify-center items-center py-3 mt-6 text-sm font-semibold rounded-xl"
          >
            {isLoading ? <Loader2 className="animate-spin mr-2" size={18} /> : null}
            {isLoading ? 'Sending link...' : 'Send Reset Link'}
          </button>
        </form>
      ) : (
        <button 
          onClick={() => setIsSent(false)}
          className="btn-secondary w-full flex justify-center items-center py-3 mt-4 text-sm font-semibold rounded-xl"
        >
          Try another email address
        </button>
      )}

      <div className="mt-8 text-center">
        <Link to="/login" className="inline-flex items-center text-sm text-gray-600 font-medium hover:text-gray-900 transition-colors">
          <ArrowLeft size={16} className="mr-2" />
          Back to log in
        </Link>
      </div>
    </div>
  );
};

export default ForgotPassword;
