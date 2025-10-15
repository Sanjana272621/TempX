import { supabase } from './supabaseClient';

export interface Device {
  id: string;
  name: string;
  location: string;
  owner_id: string;
}

export interface TemperatureLog {
  id: string;
  device_id: string;
  temperature: number;
  timestamp: string;
  breach: boolean;
  acknowledged: boolean;
  devices?: Device;
}

export async function getTemperatureLogs(): Promise<TemperatureLog[]> {
  const { data, error } = await supabase
    .from('temperature_logs')
    .select(`
      *,
      devices (
        id,
        name,
        location,
        owner_id
      )
    `)
    .order('timestamp', { ascending: false });

  if (error) {
    console.error('Error fetching temperature logs:', error);
    throw new Error('Failed to fetch temperature logs');
  }

  return data || [];
}

export async function acknowledgeBreach(logId: string): Promise<void> {
  const { error } = await supabase
    .from('temperature_logs')
    .update({ acknowledged: true })
    .eq('id', logId);

  if (error) {
    console.error('Error acknowledging breach:', error);
    throw new Error('Failed to acknowledge breach');
  }
}
