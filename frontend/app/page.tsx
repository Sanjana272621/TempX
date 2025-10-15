import { getTemperatureLogs } from '@/lib/data';
import TemperatureDashboard from '@/components/TemperatureDashboard';

export default async function Home() {
  const temperatureLogs = await getTemperatureLogs();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">IoT Cold Chain Dashboard</h1>
          <p className="mt-2 text-gray-600">
            Real-time temperature monitoring for vaccine cold chain management
          </p>
        </div>
        
        <TemperatureDashboard initialLogs={temperatureLogs} />
      </div>
    </div>
  );
}
