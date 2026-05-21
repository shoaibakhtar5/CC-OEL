import { Trash2 } from 'lucide-react';
import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import toast from 'react-hot-toast';
import { categoryStyles } from '../constants/categories';
import { deleteNotice } from '../lib/noticesApi';
import { formatNoticeTime, getAuthorName } from '../utils/format';

export default function NoticeCard({ notice, onNoticeDeleted, user }) {
  const [deleting, setDeleting] = useState(false);
  const isOwner = user?.id === notice.user_id;

  async function handleDelete() {
    const previousMessage = notice.title;
    setDeleting(true);

    try {
      await deleteNotice(notice.id);
      toast.success(`Deleted "${previousMessage}"`);
      onNoticeDeleted({ quiet: true });
    } catch (error) {
      toast.error(`Delete failed: ${error.message}`);
    } finally {
      setDeleting(false);
    }
  }

  return (
    <article className="notice-card">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`rounded-full px-3 py-1 text-xs font-bold ring-1 ${categoryStyles[notice.category] ?? categoryStyles.General}`}
            >
              {notice.category}
            </span>
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              {formatNoticeTime(notice.created_at)}
            </span>
          </div>
          <h3 className="mt-3 break-words text-xl font-black leading-7">
            {notice.title}
          </h3>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Posted by {getAuthorName(notice)}
          </p>
        </div>

        {isOwner ? (
          <button
            aria-label={`Delete ${notice.title}`}
            className="icon-button text-rose-600 hover:border-rose-200 hover:bg-rose-50 dark:text-rose-300 dark:hover:border-rose-400/30 dark:hover:bg-rose-400/10"
            disabled={deleting}
            title="Delete notice"
            type="button"
            onClick={handleDelete}
          >
            {deleting ? <span className="spinner" /> : <Trash2 size={18} />}
          </button>
        ) : null}
      </div>

      <div className="prose-notice mt-5">
        <ReactMarkdown>{notice.body}</ReactMarkdown>
      </div>
    </article>
  );
}
