import { supabase } from './supabaseClient';

export async function fetchNotices() {
  const { data, error } = await supabase
    .from('notices')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function createNotice({ title, body, category, userId }) {
  const { data, error } = await supabase
    .from('notices')
    .insert({
      title,
      body,
      category,
      user_id: userId,
    })
    .select('*')
    .single();

  if (error) throw error;
  return data;
}

export async function deleteNotice(id) {
  const { error } = await supabase.from('notices').delete().eq('id', id);
  if (error) throw error;
}
