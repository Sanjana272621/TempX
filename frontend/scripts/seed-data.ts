import { createClient } from '@supabase/supabase-js';

// You'll need to set these environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!; // Use service role key for admin operations

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const sampleDevices = [
  { name: 'Vaccine Fridge A', location: 'Hospital Main Building - Floor 2' },
  { name: 'Vaccine Fridge B', location: 'Hospital Main Building - Floor 3' },
  { name: 'Transport Cooler 1', location: 'Mobile Unit - Route A' },
  { name: 'Storage Freezer X', location: 'Warehouse - Cold Storage' },
  { name: 'Backup Fridge C', location: 'Emergency Storage - Basement' },
];

const generateTemperatureLogs = (deviceId: string, deviceName: string) => {
  const logs = [];
  const now = new Date();
  
  // Generate logs for the past 7 days
  for (let i = 0; i < 168; i++) { // 7 days * 24 hours
    const timestamp = new Date(now.getTime() - (i * 60 * 60 * 1000)); // Each hour
    
    // Simulate realistic temperature patterns
    let temperature;
    let breach = false;
    
    if (deviceName.includes('Transport')) {
      // Transport coolers are more prone to temperature fluctuations
      temperature = 2 + Math.random() * 8; // 2-10°C range
      if (temperature > 8) breach = true;
    } else if (deviceName.includes('Freezer')) {
      // Freezers should be much colder
      temperature = -20 + Math.random() * 5; // -20 to -15°C
    } else {
      // Regular fridges
      temperature = 2 + Math.random() * 4; // 2-6°C range
      if (temperature > 8) breach = true;
    }
    
    // Add some random breaches for testing
    if (Math.random() < 0.05) { // 5% chance of breach
      temperature = 8 + Math.random() * 5; // 8-13°C
      breach = true;
    }
    
    logs.push({
      device_id: deviceId,
      temperature: parseFloat(temperature.toFixed(1)),
      timestamp: timestamp.toISOString(),
      breach,
      acknowledged: breach ? Math.random() < 0.3 : false, // 30% of breaches are acknowledged
    });
  }
  
  return logs;
};

async function seedData() {
  try {
    console.log('🌱 Starting data seeding...');
    
    // First, create devices
    console.log('📱 Creating devices...');
    const { data: devices, error: devicesError } = await supabase
      .from('devices')
      .insert(sampleDevices)
      .select();
    
    if (devicesError) {
      console.error('Error creating devices:', devicesError);
      return;
    }
    
    console.log(`✅ Created ${devices.length} devices`);
    
    // Then, create temperature logs for each device
    console.log('🌡️ Creating temperature logs...');
    const allLogs = [];
    
    for (const device of devices) {
      const logs = generateTemperatureLogs(device.id, device.name);
      allLogs.push(...logs);
    }
    
    // Insert logs in batches to avoid timeout
    const batchSize = 100;
    for (let i = 0; i < allLogs.length; i += batchSize) {
      const batch = allLogs.slice(i, i + batchSize);
      const { error: logsError } = await supabase
        .from('temperature_logs')
        .insert(batch);
      
      if (logsError) {
        console.error('Error creating temperature logs:', logsError);
        return;
      }
      
      console.log(`📊 Inserted batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(allLogs.length / batchSize)}`);
    }
    
    console.log(`✅ Created ${allLogs.length} temperature logs`);
    console.log('🎉 Data seeding completed successfully!');
    
    // Show some statistics
    const breachCount = allLogs.filter(log => log.breach).length;
    const acknowledgedCount = allLogs.filter(log => log.breach && log.acknowledged).length;
    
    console.log('\n📈 Statistics:');
    console.log(`- Total logs: ${allLogs.length}`);
    console.log(`- Temperature breaches: ${breachCount}`);
    console.log(`- Acknowledged breaches: ${acknowledgedCount}`);
    console.log(`- Unacknowledged breaches: ${breachCount - acknowledgedCount}`);
    
  } catch (error) {
    console.error('❌ Error during seeding:', error);
  }
}

// Run the seeding function
seedData();
