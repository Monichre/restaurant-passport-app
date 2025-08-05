const fs = require('fs');

// Setup Clerk
const envContent = fs.readFileSync('../../.env.production', 'utf-8');
const secretKey = envContent.split('\n').find(line => line.startsWith('CLERK_SECRET_KEY='))?.split('=')[1];
process.env.CLERK_SECRET_KEY = secretKey;
const { clerkClient } = require('@clerk/clerk-sdk-node');

console.log('🔄 Creating complete ID mapping...');

// Read dev users
const devUsers = JSON.parse(fs.readFileSync('./clerk-merged-export.json', 'utf-8'));
console.log(`📖 Dev users: ${devUsers.length}`);

// Fetch production users and create mapping
console.log('🌐 Fetching production users...');

async function fetchAllUsers() {
  const prodUsers = [];
  let offset = 0;
  
  while (true) {
    const response = await clerkClient.users.getUserList({ 
      offset, 
      limit: 100,
      orderBy: '+created_at'
    });
    
    if (response.data.length === 0) break;
    prodUsers.push(...response.data);
    offset += 100;
    console.log(`   Fetched ${prodUsers.length} users...`);
    
    if (response.data.length < 100) break;
  }
  
  return prodUsers;
}

fetchAllUsers()
  .then(prodUsers => {
    console.log(`📥 Total production users: ${prodUsers.length}`);
    
    // Create mappings
    const mappings = [];
    let successful = 0;
    let failed = 0;
    let withSupabase = 0;
    
    for (const devUser of devUsers) {
      const email = devUser.primary_email_address;
      
      // Find matching production user by email
      const prodUser = prodUsers.find(p => 
        p.emailAddresses.some(e => 
          e.emailAddress.toLowerCase() === email.toLowerCase()
        )
      );
      
      const mapping = {
        dev_clerk_id: devUser.id,
        prod_clerk_id: prodUser ? prodUser.id : null,
        email: email,
        supabase_user_id: devUser.supabase_user_id || null,
        migrated: !!prodUser
      };
      
      mappings.push(mapping);
      
      if (prodUser) {
        successful++;
      } else {
        failed++;
        console.log(`❌ No match for: ${email}`);
      }
      
      if (devUser.supabase_user_id) {
        withSupabase++;
      }
    }
    
    // Write mapping file
    fs.writeFileSync('./dev-to-prod-mapping.json', JSON.stringify(mappings, null, 2));
    
    console.log('\n✅ Mapping complete!');
    console.log(`📁 File: ./dev-to-prod-mapping.json`);
    console.log(`✅ Successful mappings: ${successful}/${devUsers.length}`);
    console.log(`❌ Failed mappings: ${failed}/${devUsers.length}`);
    console.log(`🗄️  Users with Supabase IDs: ${withSupabase}`);
    console.log('\n🎉 Ready for Supabase update!');
  })
  .catch(error => {
    console.error('❌ Error:', error);
    process.exit(1);
  });