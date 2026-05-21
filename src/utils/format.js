import { formatDistanceToNow } from 'date-fns';

export function formatNoticeTime(value) {
  if (!value) return 'Just now';
  return `${formatDistanceToNow(new Date(value), { addSuffix: true })}`;
}

export function getAuthorName(notice) {
  return (
    notice.profiles?.display_name ||
    notice.profiles?.email ||
    'Bahria community member'
  );
}
