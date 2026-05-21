import { useMemo, useState } from 'react';
import Auth from './components/Auth';
import Header from './components/Header';
import NoticeBoard from './components/NoticeBoard';
import { useDarkMode } from './hooks/useDarkMode';
import { useSession } from './hooks/useSession';

export default function App() {
  const { session, authLoading } = useSession();
  const { isDark, setIsDark } = useDarkMode();
  const [authOpen, setAuthOpen] = useState(false);

  const user = useMemo(() => session?.user ?? null, [session]);

  return (
    <div className="min-h-screen overflow-hidden bg-slate-50 text-slate-950 transition-colors dark:bg-slate-950 dark:text-white">
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(20,184,166,0.22),transparent_34%),radial-gradient(circle_at_80%_0%,rgba(99,102,241,0.16),transparent_32%),linear-gradient(180deg,rgba(255,255,255,0.9),rgba(248,250,252,0.96))] dark:bg-[radial-gradient(circle_at_top_left,rgba(20,184,166,0.18),transparent_34%),radial-gradient(circle_at_80%_0%,rgba(99,102,241,0.18),transparent_32%),linear-gradient(180deg,rgba(2,6,23,0.94),rgba(15,23,42,0.98))]" />
      <Header
        authLoading={authLoading}
        isDark={isDark}
        onAuthOpen={() => setAuthOpen(true)}
        setIsDark={setIsDark}
        user={user}
      />
      <main className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 pb-12 pt-6 sm:px-6 lg:px-8">
        <section className="grid gap-6 pt-4 lg:grid-cols-[minmax(0,1fr)_390px] lg:items-start">
          <div className="animate-fade-in">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-teal-700 dark:text-teal-300">
              Cloud Computing Lab 10A
            </p>
            <h1 className="mt-4 max-w-4xl text-4xl font-black leading-tight text-slate-950 dark:text-white sm:text-5xl lg:text-6xl">
              Bahria University Campus Notice Board
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600 dark:text-slate-300 sm:text-lg">
              A realtime Supabase-powered board for academic updates, events,
              urgent announcements, and general campus communication.
            </p>
          </div>

          <Auth
            authOpen={authOpen}
            authLoading={authLoading}
            onClose={() => setAuthOpen(false)}
            user={user}
          />
        </section>

        <NoticeBoard user={user} />
      </main>
    </div>
  );
}
