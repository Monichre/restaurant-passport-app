#!/usr/bin/env node

import { Command } from 'commander';
import { batchCreateUsers } from './batch-create-users.js';
import { batchCreatePunchCards } from './batch-create-punch-cards.js';

// Create a new command-line program
const program = new Command();

program
  .name('supabase-batch')
  .description('Batch operations for Supabase local development')
  .version('1.0.0');

// Command for creating users
program
  .command('create-users')
  .description('Batch create users in the local Supabase instance')
  .option('-c, --count <number>', 'Number of users to create', '10')
  .option('-s, --staff <number>', 'Number of staff users to create', '0')
  .option('-a, --admin <number>', 'Number of admin users to create', '0')
  .option('-p, --prefix <string>', 'Prefix for user names', 'test-user')
  .action(async (options) => {
    const count = parseInt(options.count);
    const staffCount = parseInt(options.staff);
    const adminCount = parseInt(options.admin);
    const prefix = options.prefix;

    console.log(`Creating ${count} users (${staffCount} staff, ${adminCount} admin)...`);
    
    try {
      await batchCreateUsers({
        count,
        staffCount,
        adminCount,
        prefix,
      });
      console.log('✅ Users created successfully');
    } catch (error) {
      console.error('❌ Error creating users:', error.message);
      process.exit(1);
    }
  });

// Command for creating punch cards
program
  .command('create-punch-cards')
  .description('Batch create punch cards in the local Supabase instance')
  .option('-c, --count <number>', 'Number of punch cards to create per user', '3')
  .option('-u, --users <number>', 'Number of users to create punch cards for', '10')
  .option('-p, --punches <min-max>', 'Range of punches (format: min-max)', '0-5')
  .option('--completed <percentage>', 'Percentage of completed cards', '20')
  .action(async (options) => {
    const count = parseInt(options.count);
    const userCount = parseInt(options.users);
    const [minPunches, maxPunches] = options.punches.split('-').map(Number);
    const completedPercentage = parseInt(options.completed);

    console.log(`Creating ${count} punch cards for ${userCount} users...`);
    
    try {
      await batchCreatePunchCards({
        cardsPerUser: count,
        userCount,
        minPunches,
        maxPunches,
        completedPercentage,
      });
      console.log('✅ Punch cards created successfully');
    } catch (error) {
      console.error('❌ Error creating punch cards:', error.message);
      process.exit(1);
    }
  });

// Parse command-line arguments
program.parse();
