const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

// Setup Clerk
const envContent = fs.readFileSync('../../.env.production', 'utf-8');
const secretKey = envContent.split('\n').find(line => line.startsWith('CLERK_SECRET_KEY='))?.split('=')[1];
const supabaseUrl = envContent.split('\n').find(line => line.startsWith('NEXT_PUBLIC_SUPABASE_URL='))?.split('=')[1];
const supabaseServiceKey = envContent.split('\n').find(line => line.startsWith('SUPABASE_SERVICE_ROLE_KEY='))?.split('=')[1];

process.env.CLERK_SECRET_KEY = secretKey;

const { clerkClient } = require('@clerk/clerk-sdk-node');
const supabase = createClient(supabaseUrl, supabaseServiceKey);

console.log('🔄 Updating Supabase clerk_id using Clerk metadata...');

async function updateSupabaseClerkIds() {
  try {
    // Fetch all production Clerk users
    console.log('🌐 Fetching production Clerk users...');
    const allUsers = [];
    let offset = 0;
    
    while (true) {
      const response = await clerkClient.users.getUserList({ 
        offset, 
        limit: 100,
        orderBy: '+created_at'
      });
      
      if (response.data.length === 0) break;
      allUsers.push(...response.data);
      offset += 100;
      console.log(`   Fetched ${allUsers.length} users...`);
      
      if (response.data.length < 100) break;
    }
    
    console.log(`📥 Total production users: ${allUsers.length}`);
    
    // Extract users with supabaseUserId metadata
    const usersWithSupabaseIds = [];
    
    for (const user of allUsers) {
      const supabaseUserId = user.privateMetadata?.supabaseUserId || user.privateMetadata?.databaseId;
      
      if (supabaseUserId) {
        usersWithSupabaseIds.push({
          supabase_user_id: supabaseUserId.toString(),
          new_clerk_id: user.id,
          email: user.emailAddresses[0]?.emailAddress || 'no-email'
        });
      }
    }
    
    console.log(`🎯 Found ${usersWithSupabaseIds.length} users with Supabase IDs`);
    
    if (usersWithSupabaseIds.length === 0) {
      console.log('❌ No users with supabaseUserId metadata found!');
      return;
    }
    
    // Show first few for verification
    console.log('\n📋 Sample updates:');
    usersWithSupabaseIds.slice(0, 3).forEach((record, i) => {
      console.log(`${i + 1}. User ID ${record.supabase_user_id} → Clerk ID ${record.new_clerk_id} (${record.email})`);
    });
    
    // Update Supabase records
    console.log(`\n🔄 Updating ${usersWithSupabaseIds.length} Supabase records...`);
    
    let successful = 0;
    let failed = 0;
    
    for (const record of usersWithSupabaseIds) {
      try {
        const { error } = await supabase
          .from('users')
          .update({ clerk_id: record.new_clerk_id })
          .eq('id', parseInt(record.supabase_user_id));
        
        if (error) {
          console.log(`❌ Failed to update user ${record.supabase_user_id}: ${error.message}`);
          failed++;
        } else {
          successful++;
          if (successful % 10 === 0) {
            console.log(`   Updated ${successful}/${usersWithSupabaseIds.length} records...`);
          }
        }
        
      } catch (error) {
        console.log(`❌ Error updating user ${record.supabase_user_id}: ${error}`);
        failed++;
      }
    }
    
    console.log('\n✅ Supabase update complete!');
    console.log(`✅ Successfully updated: ${successful}`);
    console.log(`❌ Failed updates: ${failed}`);
    console.log(`📊 Success rate: ${Math.round(successful / usersWithSupabaseIds.length * 100)}%`);
    
    if (failed === 0) {
      console.log('\n🎉 PERFECT! All Supabase records updated successfully!');
      console.log('✅ Migration complete - users can now sign in with production Clerk!');
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

updateSupabaseClerkIds();