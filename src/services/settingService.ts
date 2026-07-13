import { supabase } from '../lib/supabase';

const unavailableError = new Error(
  'Supabase is not configured.'
);

export type SiteSettings = {
  id: string;
  service_intro: string;
  main_banner_title: string;
  main_banner_description: string;
  copyright_policy: string;
  terms_of_service: string;
};

export const settingService = {
  async getSettings() {
    if (!supabase) {
      throw unavailableError;
    }

    const { data, error } = await supabase
      .from('site_settings')
      .select('*')
      .limit(1)
      .single();

    if (error) {
      throw error;
    }

    return data as SiteSettings;
  },

  async updateSettings(
    id: string,
    values: Omit<SiteSettings, 'id'>
  ) {
    if (!supabase) {
      throw unavailableError;
    }

    const { error } = await supabase
      .from('site_settings')
      .update({
        ...values,
        updated_at: new Date().toISOString()
      })
      .eq('id', id);

    if (error) {
      throw error;
    }
  }
};
