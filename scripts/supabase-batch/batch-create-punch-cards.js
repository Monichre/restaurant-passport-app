import { supabase } from './config.js';
import { faker } from '@faker-js/faker';

/**
 * Batch create punch cards in Supabase for local development
 * 
 * @param {Object} options - Configuration options
 * @param {number} options.cardsPerUser - Number of punch cards to create per user
 * @param {number} options.userCount - Number of users to create punch cards for
 * @param {number} options.minPunches - Minimum punches per card
 * @param {number} options.maxPunches - Maximum punches per card
 * @param {number} options.completedPercentage - Percentage of cards that should be marked as completed (0-100)
 * @param {number} options.batchSize - Size of each batch (default: 100)
 * @returns {Promise<Array>} - Array of created punch cards
 */
export async function batchCreatePunchCards({
  cardsPerUser = 3,
  userCount = 10,
  minPunches = 0,
  maxPunches = 5,
  completedPercentage = 20,
  batchSize = 100,
}) {
  console.log(`Preparing to create punch cards for ${userCount} users with ${cardsPerUser} cards each...`);
  
  // Validate input
  if (minPunches > maxPunches) {
    throw new Error('Minimum punches cannot be greater than maximum punches');
  }
  
  if (completedPercentage < 0 || completedPercentage > 100) {
    throw new Error('Completed percentage must be between 0 and 100');
  }
  
  // Fetch users
  const { data: users, error: usersError } = await supabase
    .from('users')
    .select('id')
    .limit(userCount);
  
  if (usersError) {
    throw new Error(`Error fetching users: ${usersError.message}`);
  }
  
  if (!users || users.length === 0) {
    throw new Error('No users found. Please create users first.');
  }
  
  console.log(`Found ${users.length} users`);
  
  // Fetch restaurants
  const { data: restaurants, error: restaurantsError } = await supabase
    .from('restaurants')
    .select('id');
  
  if (restaurantsError) {
    throw new Error(`Error fetching restaurants: ${restaurantsError.message}`);
  }
  
  if (!restaurants || restaurants.length === 0) {
    throw new Error('No restaurants found. Please create restaurants first.');
  }
  
  console.log(`Found ${restaurants.length} restaurants`);
  
  // Generate punch card data
  const punchCards = [];
  
  for (const user of users) {
    // Shuffle restaurants to randomly assign them to users
    const shuffledRestaurants = [...restaurants].sort(() => 0.5 - Math.random());
    
    // Create punch cards for this user
    for (let i = 0; i < Math.min(cardsPerUser, shuffledRestaurants.length); i++) {
      const punches = faker.number.int({ min: minPunches, max: maxPunches });
      const isCompleted = faker.number.int({ min: 1, max: 100 }) <= completedPercentage;
      
      punchCards.push({
        userId: user.id,
        restaurantId: shuffledRestaurants[i].id,
        punches,
        completed: isCompleted,
        updatedAt: faker.date.recent({ days: 30 }).toISOString(),
      });
    }
  }
  
  console.log(`Generated ${punchCards.length} punch cards to create`);
  
  // Process in batches
  const createdPunchCards = [];
  
  for (let i = 0; i < punchCards.length; i += batchSize) {
    const batch = punchCards.slice(i, i + batchSize);
    console.log(`Processing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(punchCards.length / batchSize)}...`);
    
    // Check for existing punch cards to avoid duplicates
    for (const cardData of batch) {
      try {
        // Check if a punch card already exists for this user and restaurant
        const { data: existingCards } = await supabase
          .from('punch_cards')
          .select('id')
          .eq('userId', cardData.userId)
          .eq('restaurantId', cardData.restaurantId)
          .limit(1);
        
        if (existingCards && existingCards.length > 0) {
          console.log(`Punch card for user ${cardData.userId} and restaurant ${cardData.restaurantId} already exists, skipping...`);
          continue;
        }
        
        // Insert the punch card
        const { data, error } = await supabase
          .from('punch_cards')
          .insert([cardData])
          .select();
        
        if (error) {
          console.error(`Error creating punch card:`, error.message);
        } else {
          console.log(`Created punch card: User ${cardData.userId}, Restaurant ${cardData.restaurantId}, Punches: ${cardData.punches}`);
          createdPunchCards.push(data[0]);
        }
      } catch (error) {
        console.error(`Unexpected error creating punch card:`, error.message);
      }
      
      // Add a small delay to avoid overwhelming the database
      await new Promise(resolve => setTimeout(resolve, 50));
    }
  }
  
  console.log(`Created ${createdPunchCards.length} out of ${punchCards.length} punch cards`);
  return createdPunchCards;
}

// Allow direct execution
if (process.argv[1].endsWith('batch-create-punch-cards.js')) {
  const args = process.argv.slice(2);
  const cardsPerUser = parseInt(args[0]) || 3;
  const userCount = parseInt(args[1]) || 10;
  const minPunches = parseInt(args[2]) || 0;
  const maxPunches = parseInt(args[3]) || 5;
  const completedPercentage = parseInt(args[4]) || 20;
  
  batchCreatePunchCards({
    cardsPerUser,
    userCount,
    minPunches,
    maxPunches,
    completedPercentage,
  })
    .then(() => {
      console.log('Punch cards creation completed!');
      process.exit(0);
    })
    .catch(error => {
      console.error('Error:', error.message);
      process.exit(1);
    });
}
