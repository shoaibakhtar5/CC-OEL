import { Send } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { categories } from '../constants/categories';
import { createNotice } from '../lib/noticesApi';

const initialForm = {
  title: '',
  body: '',
  category: 'General',
};

export default function NoticeForm({ onNoticeCreated, user }) {
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);

  if (!user) {
    return (
      <aside className="panel">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
          Posting locked
        </p>
        <h2 className="mt-2 text-2xl font-black">Login to publish</h2>
        <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
          Visitors can read notices publicly. Creating notices requires a
          verified Supabase Auth session.
        </p>
      </aside>
    );
  }

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);

    try {
      await createNotice({
        ...form,
        title: form.title.trim(),
        body: form.body.trim(),
        userId: user.id,
      });
      setForm(initialForm);
      toast.success('Notice published');
      onNoticeCreated({ quiet: true });
    } catch (error) {
      toast.error(`Could not publish notice: ${error.message}`);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <aside className="panel">
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-red-800 dark:text-red-200">
        Create notice
      </p>
      <h2 className="mt-2 text-2xl font-black">Publish an update</h2>
      <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
        <label className="field-label" htmlFor="notice-title">
          Title
          <input
            required
            className="input input-standalone"
            id="notice-title"
            maxLength={120}
            value={form.title}
            onChange={(event) => updateField('title', event.target.value)}
          />
        </label>

        <label className="field-label" htmlFor="notice-category">
          Category
          <select
            className="input input-standalone"
            id="notice-category"
            value={form.category}
            onChange={(event) => updateField('category', event.target.value)}
          >
            {categories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>

        <label className="field-label" htmlFor="notice-body">
          Body
          <textarea
            required
            className="input input-standalone min-h-36 resize-y"
            id="notice-body"
            placeholder="Markdown is supported: **bold**, lists, and links."
            value={form.body}
            onChange={(event) => updateField('body', event.target.value)}
          />
        </label>

        <button
          className="btn-primary w-full justify-center"
          disabled={submitting || !form.title.trim() || !form.body.trim()}
          type="submit"
        >
          {submitting ? <span className="spinner" /> : <Send size={17} />}
          Publish notice
        </button>
      </form>
    </aside>
  );
}
