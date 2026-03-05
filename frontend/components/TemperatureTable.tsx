import { TemperatureLog } from '@/lib/data';
import AcknowledgeButton from './AcknowledgeButton';

export function TemperatureTable({ logs }: { logs: TemperatureLog[] }) {
  return (
    <table className="w-full border-collapse mt-4">
      <thead>
        <tr className="bg-gray-100">
          <th>Device</th>
          <th>Temp (°C)</th>
          <th>Time</th>
          <th>Breach</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {logs.map((log) => (
          <tr key={log.id} className={log.breach ? 'bg-red-100' : ''}>
            <td>{log.devices?.name || '—'}</td>
            <td>{log.temperature}</td>
            <td>{new Date(log.timestamp).toLocaleString()}</td>
            <td>{log.breach ? 'Breach' : 'Normal'}</td>
            <td>
              {log.breach && !log.acknowledged ? (
                <AcknowledgeButton logId={log.id} />
              ) : (
                'Acknowledged'
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
