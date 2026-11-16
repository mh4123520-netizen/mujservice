import { useState, type FormEvent } from 'react';
import { Lock, ArrowLeft } from 'lucide-react';
import { motion } from 'motion/react';
import { authApi } from '../../lib/api.ts';
import type { AdminUser } from '../../types/index.ts';

interface AdminLoginProps {
  companyName: string;
  onSuccess: (user: AdminUser) => void;
  onBackToSite: () => void;
}

export function AdminLogin({ companyName, onSuccess, onBackToSite }: AdminLoginProps) {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const { user } = await authApi.login(identifier, password);
      onSuccess(user);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#fbfbfd] flex flex-col justify-center items-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 18, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md bg-white/85 backdrop-blur-xl border border-black/[0.06] rounded-[32px] shadow-[0_24px_60px_-15px_rgba(0,0,0,0.08)] p-8 sm:p-10"
      >
        <div className="flex items-center gap-3.5 mb-7">
          <div className="w-11 h-11 rounded-2xl bg-[#1d1d1f] text-white flex items-center justify-center shrink-0">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-[#1d1d1f]">{companyName}</h1>
            <p className="text-xs text-[#6e6e73]">Administrator Operations Portal</p>
          </div>
        </div>

        {error && (
          <div
            role="alert"
            className="mb-5 p-3.5 bg-red-50 border border-red-200 text-red-800 text-xs rounded-2xl"
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="admin-identifier" className="block text-xs font-medium text-[#424245] mb-1.5">
              Username or Email
            </label>
            <input
              id="admin-identifier"
              type="text"
              required
              autoComplete="username"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="admin"
              className="w-full px-4 py-3 text-sm bg-[#f5f5f7] border border-black/[0.08] rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#0071e3]/30 focus:bg-white transition-all"
            />
          </div>

          <div>
            <label htmlFor="admin-password" className="block text-xs font-medium text-[#424245] mb-1.5">
              Password
            </label>
            <input
              id="admin-password"
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 text-sm bg-[#f5f5f7] border border-black/[0.08] rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#0071e3]/30 focus:bg-white transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 px-5 text-sm font-medium text-white bg-[#0071e3] rounded-full hover:bg-[#0077ed] disabled:opacity-60 transition-colors cursor-pointer mt-2"
          >
            {submitting ? 'Verifying...' : 'Sign In to Admin Panel'}
          </button>
        </form>

        <div className="mt-7 pt-5 border-t border-black/[0.06] flex items-center justify-between text-xs text-[#86868b]">
          <button
            type="button"
            onClick={onBackToSite}
            className="inline-flex items-center gap-1.5 text-[#1d1d1f] hover:text-[#0071e3] font-medium transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Public Website</span>
          </button>
          <span>Protected Access</span>
        </div>
      </motion.div>
    </div>
  );
}
