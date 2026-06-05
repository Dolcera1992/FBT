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
  const { error } = await supabase.rpc('execute_sql', {
    sql: 'ALTER TABLE homepage_settings ADD COLUMN IF NOT EXISTS hero_bg_image TEXT;'
  });

  if (error) {
    console.error('Error adding column via RPC:', error.message);
  } else {
    console.log('Column added or already exists.');
  }
}

checkSchema();
