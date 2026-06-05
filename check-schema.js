const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

const envFile = fs.readFileSync('.env.local', 'utf8');
const envVars = {};
envFile.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    envVars[match[1]] = match[2].replace(/['"]/g, '');
  }
});

const supabase = createClient(
  envVars.NEXT_PUBLIC_SUPABASE_URL,
  envVars.SUPABASE_SERVICE_ROLE_KEY
);

async function checkSchema() {
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .limit(1);

  if (error) {
    console.error('Error fetching services:', error);
  } else {
    console.log('Columns in services:', data.length > 0 ? Object.keys(data[0]) : 'No data, but query succeeded.');
  }
}

checkSchema();
