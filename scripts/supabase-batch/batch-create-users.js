import { supabase } from './config.js';
import { faker } from '@faker-js/faker';
import { nanoid } from 'nanoid';

/**
 * Batch create users in Supabase for local development
 * 
 * @param {Object} options - Configuration options
 * @param {number} options.count - Total number of users to create
 * @param {number} options.staffCount - Number of staff users to create
 * @param {number} options.adminCount - Number of admin users to create
 * @param {string} options.prefix - Prefix for user names
 * @param {number} options.batchSize - Size of each batch (default: 100)
 * @returns {Promise<Array>} - Array of created users
 */
export async function batchCreateUsers({
  count = 10,
  staffCount = 0,
  adminCount = 0,
  prefix = 'test-user',
  batchSize = 100,
}) {
  console.log(`Preparing to create ${count} users in batches of ${batchSize}...`);
  
  // Ensure counts are valid
  if (staffCount + adminCount > count) {
    throw new Error('Staff count + admin count cannot exceed total count');
  }

  const users = [];
  const createdUsers = [];
  
  // Generate user data
  for (let i = 0; i < count; i++) {
    const isStaff = i < staffCount;
    const isAdmin = i < adminCount;
    const name = `${prefix}-${i + 1}`;
    const email = `${name.toLowerCase().replace(/\s+/g, '.')}@example.com`;
    const phone = faker.phone.number('+1##########');
    
    users.push({
      clerkId: `test_${nanoid(10)}`, // Generate a fake Clerk ID
      name,
      isStaff,
      isAdmin,
      email,
      phone,
    });
  }
  
  // Process in batches
  for (let i = 0; i < users.length; i += batchSize) {
    const batch = users.slice(i, i + batchSize);
    console.log(`Processing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(users.length / batchSize)}...`);
    
    // Create users in the current batch
    for (const userData of batch) {
      try {
        // Check if user with this email already exists
        const { data: existingUsers } = await supabase
          .from('users')
          .select('id')
          .eq('email', userData.email)
          .limit(1);
        
        if (existingUsers && existingUsers.length > 0) {
          console.log(`User with email ${userData.email} already exists, skipping...`);
          continue;
        }
        
        // Insert the user
        const { data, error } = await supabase
          .from('users')
          .insert([userData])
          .select();
        
        if (error) {
          console.error(`Error creating user ${userData.email}:`, error.message);
        } else {
          console.log(`Created user: ${userData.name} (${userData.email})`);
          createdUsers.push(data[0]);
        }
      } catch (error) {
        console.error(`Unexpected error creating user ${userData.email}:`, error.message);
      }
      
      // Add a small delay to avoid overwhelming the database
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }
  
  console.log(`Created ${createdUsers.length} out of ${count} users`);
  return createdUsers;
}

// Allow direct execution
if (process.argv[1].endsWith('batch-create-users.js')) {
  const args = process.argv.slice(2);
  const count = parseInt(args[0]) || 10;
  const staffCount = parseInt(args[1]) || 0;
  const adminCount = parseInt(args[2]) || 0;
  
  batchCreateUsers({ count, staffCount, adminCount })
    .then(() => {
      console.log('Users creation completed!');
      process.exit(0);
    })
    .catch(error => {
      console.error('Error:', error.message);
      process.exit(1);
    });
}
