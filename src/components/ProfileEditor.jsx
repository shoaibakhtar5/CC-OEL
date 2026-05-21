import { Save } from 'lucide-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { supabase } from '../lib/supabaseClient';

export default function ProfileEditor({ user }) {
  const [displayName, setDisplayName] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function loadProfile() {
      const { data, error } = await supabase
        .from('profiles')
        .select('display_name')
        .eq('id', user.id)
        .single();

      if (!mounted) return;
      if (error && error.code !== 'PGRST116') {
        toast.error(`Profile load failed: ${error.message}`);
        return;
      }
      setDisplayName(data?.display_name ?? '');
    }

    loadProfile();
    return () => {
      mounted = false;
    };
  }, [user.id]);

  async function handleSave(event) {
    event.preventDefault();
    setSaving(true);

    const { error } = await supabase
      .from('profiles')
      .update({ display_name: displayName.trim() || null })
      .eq('id', user.id);

    setSaving(false);
    if (error) {
      toast.error(`Profile update failed: ${error.message}`);
      return;
    }
    toast.success('Profile updated');
  }

  return (
    <aside className="panel">
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
        Profile
      </p>
      <form className="mt-4 space-y-4" onSubmit={handleSave}>
        <label className="field-label" htmlFor="display-name">
          Display name
          <input
            className="input input-standalone"
            id="display-name"
            placeholder="Shown on your notices"
            value={displayName}
            onChange={(event) => setDisplayName(event.target.value)}
          />
        </label>
        <button className="btn-secondary w-full justify-center" disabled={saving} type="submit">
          {saving ? <span className="spinner" /> : <Save size={17} />}
          Save profile
        </button>
      </form>
    </aside>
  );
}
