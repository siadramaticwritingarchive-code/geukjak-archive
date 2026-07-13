import { supabase } from '../lib/supabase';
import type {
  CreateReportInput,
  Report,
  ReportStatus
} from '../types/report';

const unavailableError = new Error(
  'Supabase is not configured.',
);

export const reportService = {
  async listReports() {
    if (!supabase) {
      return [];
    }

    const { data, error } = await supabase
      .from('reports')
      .select('*')
      .order('created_at', {
        ascending: false
      });

    if (error) {
      throw error;
    }

    return (data ?? []) as Report[];
  },

  async createReport(
    input: CreateReportInput
  ) {
    if (!supabase) {
      throw unavailableError;
    }

    const { error } = await supabase
      .from('reports')
      .insert(input);

    if (error) {
      throw error;
    }
  },

  async resolveReport(id: string) {
    if (!supabase) {
      throw unavailableError;
    }

    const { error } = await supabase
      .from('reports')
      .update({
        status: 'resolved' satisfies ReportStatus,
        handled_at: new Date().toISOString()
      })
      .eq('id', id);

    if (error) {
      throw error;
    }
  },

  async dismissReport(id: string) {
    if (!supabase) {
      throw unavailableError;
    }

    const { error } = await supabase
      .from('reports')
      .update({
        status: 'dismissed' satisfies ReportStatus,
        handled_at: new Date().toISOString()
      })
      .eq('id', id);

    if (error) {
      throw error;
    }
  },

  async deleteReport(id: string) {
    if (!supabase) {
      throw unavailableError;
    }

    const { error } = await supabase
      .from('reports')
      .delete()
      .eq('id', id);

    if (error) {
      throw error;
    }
  }
};
