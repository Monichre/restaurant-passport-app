#!/usr/bin/env node

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory where this script is located
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..', '..');

// Function to run a command and print output
function runCommand(command) {
  console.log(`\n> ${command}`);
  try {
    execSync(command, { stdio: 'inherit', cwd: rootDir });
    return true;
  } catch (error) {
    console.error(`Command failed: ${command}`);
    return false;
  }
}

// Update package.json with new scripts
function updatePackageJson() {
  const packageJsonPath = path.join(rootDir, 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

  // Add new scripts
  packageJson.scripts = {
    ...packageJson.scripts,
    'batch:create-users': 'node scripts/supabase-batch/index.js create-users',
    'batch:create-punch-cards': 'node scripts/supabase-batch/index.js create-punch-cards',
    'supabase:local': 'supabase start',
    'supabase:stop': 'supabase stop',
    'supabase:status': 'supabase status',
  };

  // Write updated package.json
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
  console.log('✅ Added batch scripts to package.json');
}

// Check and update .env file
function updateEnvFile() {
  const envPath = path.join(rootDir, '.env');
  const envExamplePath = path.join(rootDir, '.env.example');
  
  // Check if .env exists
  if (!fs.existsSync(envPath)) {
    console.error('❌ .env file not found. Please create one based on .env.example');
    return false;
  }
  
  // Read current .env
  let envContent = fs.readFileSync(envPath, 'utf8');
  
  // Check for required variables
  const requiredVars = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'DATABASE_URL'
  ];
  
  const missingVars = [];
  for (const v of requiredVars) {
    if (!envContent.includes(`${v}=`)) {
      missingVars.push(v);
    }
  }
  
  // Add missing variables if any
  if (missingVars.length > 0) {
    console.log(`Adding missing environment variables: ${missingVars.join(', ')}`);
    
    // Add Supabase URL if missing
    if (missingVars.includes('NEXT_PUBLIC_SUPABASE_URL')) {
      envContent += '\nNEXT_PUBLIC_SUPABASE_URL=http://localhost:54321\n';
    }
    
    // Add Database URL if missing
    if (missingVars.includes('DATABASE_URL')) {
      envContent += '\nDATABASE_URL=postgres://postgres:postgres@localhost:54322/postgres\n';
    }
    
    // For the anon key, we need to recommend getting it from local Supabase
    if (missingVars.includes('NEXT_PUBLIC_SUPABASE_ANON_KEY')) {
      envContent += '\n# Get your anon key from the local Supabase Studio at http://localhost:54323\n';
      envContent += '# Or by running: supabase status\n';
      envContent += 'NEXT_PUBLIC_SUPABASE_ANON_KEY=\n';
      
      console.log('⚠️ Please add your Supabase anon key to .env manually');
      console.log('   You can get it by running: supabase status');
    }
    
    // Write updated .env
    fs.writeFileSync(envPath, envContent);
    console.log('✅ Updated .env file with required variables');
  } else {
    console.log('✅ All required environment variables are present');
  }
  
  return true;
}

// Install dependencies
function installDependencies() {
  const dependencies = ['@faker-js/faker', 'nanoid', 'commander'];
  
  console.log(`Installing dependencies: ${dependencies.join(', ')}`);
  return runCommand(`npm install ${dependencies.join(' ')} --save-dev`);
}

// Main function
async function main() {
  console.log('🚀 Setting up local Supabase batch client...');
  
  // Install dependencies
  if (!installDependencies()) {
    console.error('❌ Failed to install dependencies');
    process.exit(1);
  }
  
  // Update package.json
  updatePackageJson();
  
  // Update .env file
  updateEnvFile();
  
  console.log('\n🎉 Setup completed!');
  console.log('\nYou can now run the following commands:');
  console.log('  npm run supabase:local   - Start local Supabase');
  console.log('  npm run supabase:status  - Check local Supabase status');
  console.log('  npm run batch:create-users -- --count 20 --staff 5 --admin 2');
  console.log('  npm run batch:create-punch-cards -- --count 3 --users 20 --punches 0-10');
  
  console.log('\nMake sure your local Supabase is running with:');
  console.log('  npm run supabase:local');
}

main().catch(error => {
  console.error('Error during setup:', error);
  process.exit(1);
});
