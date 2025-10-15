# IoT Cold Chain Dashboard Setup

This is a professional IoT dashboard for monitoring vaccine cold chain temperatures using Next.js 14 and Supabase.

## Features

- **Real-time Temperature Monitoring**: Display temperature logs from multiple devices
- **Breach Detection**: Visual highlighting of temperature breaches (>8°C)
- **Acknowledgment System**: Mark breaches as acknowledged
- **Responsive Design**: Clean, professional UI suitable for enterprise environments
- **Summary Statistics**: Overview cards showing total logs, breaches, and unacknowledged issues

## Prerequisites

1. **Supabase Project**: Create a new project at [supabase.com](https://supabase.com)
2. **Node.js**: Version 18 or higher
3. **Environment Variables**: Set up your Supabase credentials

## Database Setup

### 1. Create Tables

Run these SQL commands in your Supabase SQL editor:

```sql
-- Create devices table
CREATE TABLE devices (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  owner_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create temperature_logs table
CREATE TABLE temperature_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  device_id UUID NOT NULL REFERENCES devices(id) ON DELETE CASCADE,
  temperature FLOAT NOT NULL,
  timestamp TIMESTAMPTZ NOT NULL,
  breach BOOLEAN NOT NULL DEFAULT FALSE,
  acknowledged BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_temperature_logs_device_id ON temperature_logs(device_id);
CREATE INDEX idx_temperature_logs_timestamp ON temperature_logs(timestamp);
CREATE INDEX idx_temperature_logs_breach ON temperature_logs(breach);
```

### 2. Set Up Row Level Security (RLS)

```sql
-- Enable RLS
ALTER TABLE devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE temperature_logs ENABLE ROW LEVEL SECURITY;

-- Create policies (adjust based on your authentication needs)
-- For now, allow all operations (suitable for demo/testing)
CREATE POLICY "Allow all operations on devices" ON devices FOR ALL USING (true);
CREATE POLICY "Allow all operations on temperature_logs" ON temperature_logs FOR ALL USING (true);
```

## Environment Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Variables

Create a `.env.local` file in the `frontend` directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### 3. Seed Sample Data (Optional)

To populate your database with sample data for testing:

```bash
# Install ts-node if you haven't already
npm install -g ts-node

# Run the seed script
npx ts-node scripts/seed-data.ts
```

This will create:
- 5 sample devices with realistic names and locations
- 168 temperature logs per device (7 days of hourly data)
- Mix of normal temperatures and breaches
- Some breaches already acknowledged

## Running the Application

### Development Mode

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the dashboard.

### Production Build

```bash
npm run build
npm start
```

## Dashboard Features

### Summary Cards
- **Total Logs**: Shows the total number of temperature readings
- **Temperature Breaches**: Count of readings above 8°C
- **Unacknowledged**: Number of breaches that haven't been acknowledged

### Temperature Logs Table
- **Device Information**: Name and location of each device
- **Temperature Readings**: Current temperature with °C formatting
- **Timestamps**: Formatted date and time
- **Status Indicators**: 
  - Green "Normal" badge for temperatures ≤8°C
  - Red "Breach" badge for temperatures >8°C
  - Blue "Acknowledged" badge for handled breaches
- **Actions**: Acknowledge button for unhandled breaches

### Visual Design
- **Breach Highlighting**: Rows with temperature breaches are highlighted in red
- **Responsive Layout**: Works on desktop, tablet, and mobile devices
- **Professional Styling**: Clean, enterprise-ready design
- **Loading States**: Smooth interactions with loading indicators

## Customization

### Temperature Threshold
The breach threshold is set to 8°C. To change this:

1. Update the logic in `lib/data.ts`
2. Modify the breach detection in your data insertion scripts
3. Update the UI text and styling as needed

### Styling
The dashboard uses Tailwind CSS. Key customization points:
- Color scheme in `components/TemperatureDashboard.tsx`
- Layout spacing in `app/page.tsx`
- Global styles in `app/globals.css`

## Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Other Platforms
- **Netlify**: Similar to Vercel, supports Next.js out of the box
- **Railway**: Good for full-stack deployments
- **AWS/GCP/Azure**: Use their Next.js deployment guides

## Troubleshooting

### Common Issues

1. **Database Connection**: Ensure your Supabase URL and keys are correct
2. **RLS Policies**: Make sure your Row Level Security policies allow the operations you need
3. **Environment Variables**: Check that all required variables are set
4. **Build Errors**: Run `npm run lint` to check for code issues

### Getting Help

- Check the [Next.js documentation](https://nextjs.org/docs)
- Review [Supabase documentation](https://supabase.com/docs)
- Check the browser console for client-side errors
- Review server logs for build/runtime errors

## Next Steps

This dashboard provides a solid foundation for an IoT monitoring system. Consider adding:

- **Real-time Updates**: WebSocket connections for live data
- **Historical Charts**: Temperature trends over time
- **Alerting System**: Email/SMS notifications for breaches
- **User Authentication**: Multi-user access with different permissions
- **Device Management**: Add/edit/remove devices
- **Export Features**: Download logs as CSV/PDF
- **Mobile App**: React Native version for field monitoring
