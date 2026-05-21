import { RefreshCw, Search, Wifi, WifiOff } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { categories } from '../constants/categories';
import { fetchNotices } from '../lib/noticesApi';
import { supabase } from '../lib/supabaseClient';
import CategoryFilter from './CategoryFilter';
import NoticeCard from './NoticeCard';
import NoticeForm from './NoticeForm';
import ProfileEditor from './ProfileEditor';
import SkeletonNotice from './SkeletonNotice';

export default function NoticeBoard({ user }) {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [realtimeStatus, setRealtimeStatus] = useState('CONNECTING');
  const [category, setCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const loadNotices = useCallback(async ({ quiet = false } = {}) => {
    try {
      if (!quiet) setLoading(true);
      const data = await fetchNotices();
      setNotices(data);
    } catch (error) {
      toast.error(`Could not load notices: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadNotices();
  }, [loadNotices]);

  useEffect(() => {
    const fallbackRefresh = window.setInterval(() => {
      loadNotices({ quiet: true });
    }, 15000);

    const connectingTimeout = window.setTimeout(() => {
      setRealtimeStatus((currentStatus) =>
        currentStatus === 'CONNECTING' ? 'POLLING' : currentStatus,
      );
    }, 8000);

    const channel = supabase
      .channel('public:notices')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'notices' },
        async () => {
          setRealtimeStatus('SUBSCRIBED');
          await loadNotices({ quiet: true });
        },
      )
      .subscribe((status) => {
        setRealtimeStatus(status);
        if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
          toast.error('Realtime delayed. Auto-refresh fallback is active.');
        }
      });

    return () => {
      window.clearInterval(fallbackRefresh);
      window.clearTimeout(connectingTimeout);
      supabase.removeChannel(channel);
    };
  }, [loadNotices]);

  const isRealtimeLive = realtimeStatus === 'SUBSCRIBED';
  const isPolling = realtimeStatus === 'POLLING' || realtimeStatus === 'TIMED_OUT';
  const statusLabel = isRealtimeLive
    ? 'Live'
    : isPolling
      ? 'Auto-sync'
      : 'Connecting';

  const filteredNotices = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return notices.filter((notice) => {
      const matchesCategory = category === 'All' || notice.category === category;
      const matchesSearch =
        !normalizedSearch ||
        notice.title.toLowerCase().includes(normalizedSearch) ||
        notice.body.toLowerCase().includes(normalizedSearch);

      return matchesCategory && matchesSearch;
    });
  }, [category, notices, searchTerm]);

  return (
    <section className="grid gap-6 lg:grid-cols-[340px_minmax(0,1fr)]">
      <div className="space-y-5">
        <NoticeForm onNoticeCreated={loadNotices} user={user} />
        {user ? <ProfileEditor user={user} /> : null}
      </div>

      <div className="space-y-5">
        <div className="panel">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-black">Live notices</h2>
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${
                    realtimeStatus === 'SUBSCRIBED'
                      ? 'bg-red-100 text-red-800 dark:bg-red-400/15 dark:text-red-200'
                      : 'bg-amber-100 text-amber-800 dark:bg-amber-400/15 dark:text-amber-200'
                  }`}
                >
                  {isRealtimeLive ? (
                    <Wifi size={13} />
                  ) : isPolling ? (
                    <RefreshCw size={13} />
                  ) : (
                    <WifiOff size={13} />
                  )}
                  {statusLabel}
                </span>
              </div>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Newest notices appear first and update automatically.
              </p>
            </div>

            <div className="input-shell min-w-0 xl:w-80">
              <Search size={18} />
              <input
                className="input"
                placeholder="Search notices"
                type="search"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
              />
            </div>
          </div>

          <CategoryFilter
            activeCategory={category}
            categories={['All', ...categories]}
            onChange={setCategory}
          />
        </div>

        {loading ? (
          <div className="grid gap-4">
            <SkeletonNotice />
            <SkeletonNotice />
            <SkeletonNotice />
          </div>
        ) : filteredNotices.length ? (
          <div className="grid gap-4">
            {filteredNotices.map((notice) => (
              <NoticeCard
                key={notice.id}
                notice={notice}
                onNoticeDeleted={loadNotices}
                user={user}
              />
            ))}
          </div>
        ) : (
          <div className="panel grid min-h-72 place-items-center text-center">
            <div>
              <p className="text-lg font-bold">No notices found</p>
              <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500 dark:text-slate-400">
                Try a different category or search term. Authenticated users can
                publish the first matching notice.
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
