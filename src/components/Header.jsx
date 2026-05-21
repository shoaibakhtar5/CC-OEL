import { LogIn, LogOut, Moon, Sun, UserCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { supabase } from '../lib/supabaseClient';

export default function Header({
  authLoading,
  isDark,
  onAuthOpen,
  setIsDark,
  user,
}) {
  async function handleSignOut() {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success('Signed out successfully');
  }

  return (
    <header className="sticky top-0 z-30 border-b border-white/60 bg-white/70 backdrop-blur-2xl dark:border-white/10 dark:bg-slate-950/70">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-2xl bg-red-900 font-black text-white shadow-glow dark:bg-red-700">
            BU
          </div>
          <div>
            <p className="text-sm font-bold leading-4">Bahria Notice Board</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Supabase Realtime
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            aria-label="Toggle dark mode"
            className="icon-button"
            title="Toggle dark mode"
            type="button"
            onClick={() => setIsDark((value) => !value)}
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {authLoading ? (
            <div className="h-10 w-28 animate-pulse rounded-full bg-slate-200 dark:bg-slate-800" />
          ) : user ? (
            <>
              <div className="hidden items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 shadow-sm dark:border-white/10 dark:bg-white/5 dark:text-slate-300 sm:flex">
                <UserCircle size={17} />
                <span className="max-w-[190px] truncate">{user.email}</span>
              </div>
              <button
                className="btn-secondary"
                type="button"
                onClick={handleSignOut}
              >
                <LogOut size={17} />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </>
          ) : (
            <button className="btn-primary" type="button" onClick={onAuthOpen}>
              <LogIn size={17} />
              Login
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
