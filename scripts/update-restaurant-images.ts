#!/usr/bin/env tsx

import { updateRestaurant, getRestaurants } from "../src/db/models/restaurants/restaurants";

// New image URLs mapping
const imageUpdates = [
  { name: "Tono Pizzeria + Cheesesteaks", imageUrl: "https://s3-media0.fl.yelpcdn.com/bphoto/rDZ0fkKydPl31MNH8RxRHA/348s.jpg" },
  { name: "3 Squares Restaurant", imageUrl: "https://s3-media4.fl.yelpcdn.com/bphoto/EuLd_ohTxB1l2KuGTc-Mlg/ls.jpg" },
  { name: "Lotus", imageUrl: "https://lh3.googleusercontent.com/places/AKR5kUij5ffubbjyKwe7Trx56GRCQXy4BrxWlr7iluoBcf9tt0TNcchtRrdjqnUhoDGoN91C23rvUUgfxrlQOKMjF8aAmiYAbtt8ui8=s1600-w300-h300" },
  { name: "Riviera Maya Cantina & Restaurant", imageUrl: "https://lh5.googleusercontent.com/p/AF1QipPvOWEzooqF-oulaVpDjGNCd_pXJLWAH2IWuQSn=s1024" },
  { name: "Brick & Bourbon", imageUrl: "https://s3-media0.fl.yelpcdn.com/bphoto/hgx4mcKShrOFNmTtzbaxMw/258s.jpg" },
  { name: "Highlander Pub (Rush Creek Golf Club)", imageUrl: "https://www.rushcreek.com/images/building_image_2.jpg" },
  { name: "Nautical Bowls", imageUrl: "https://s3-media0.fl.yelpcdn.com/bphoto/Jk1kL92LWSUCkOBbNZbAzw/l.jpg" },
  { name: "Frankie's Chicago Style Pizza", imageUrl: "https://frankiespizza.com/wp-content/uploads/2024/08/frankies-chicago-style-pizza-maple-grove-minnesota-restaurant-patio.jpg" },
  { name: "Pittsburgh Blue Steakhouse", imageUrl: "https://pittsburghbluesteak.com/wp-content/uploads/header-pbedina-exterior-1200-1024x683.jpg" },
  { name: "Lookout Bar & Grill", imageUrl: "https://th.bing.com/th/id/OIP.Pn2pgm9W1fVLoiFkg7c_PAHaEK?r=0&rs=1&pid=ImgDetMain" },
  { name: "Malone's Bar & Grill", imageUrl: "https://malonesbarandgrill.net/wp-content/uploads/2014/02/Maple-Grove-Bar-and-Grill-721-300x164.jpg" },
  { name: "OMNI Brewing Company", imageUrl: "https://media-cdn.tripadvisor.com/media/photo-s/10/40/a7/6d/photo0jpg.jpg" },
  { name: "Broadway Pizza", imageUrl: "https://img.hoodline.com/2024/4/maple-groves-broadway-bar-and-pizza-reopens-with-new-axe-throwing-feature-3.webp" },
  { name: "Granite City Food & Brewery", imageUrl: "https://patch.com/img/cdn20/users/24075954/20220520/121311/styles/patch_image/public/granitecitybrewery___20113643437.png?width=1200" },
  { name: "Grackle", imageUrl: "https://s3-media0.fl.yelpcdn.com/bphoto/7MFDuS8cA4UnvZTH3k0jfA/o.jpg" },
  { name: "Chanticlear Pizza", imageUrl: "https://s3-media0.fl.yelpcdn.com/bphoto/4z0CRZT0T46Xpsjd323NZQ/258s.jpg" },
  { name: "Biaggi's Ristorante Italiano", imageUrl: "https://biaggis.com/wp-content/uploads/LV-Exterior-Full.jpg" },
  { name: "El Rodeo", imageUrl: "https://th.bing.com/th/id/OIP.p_GNb2PItLEEIzzIM8Xo6gHaFD?r=0&rs=1&pid=ImgDetMain" },
  { name: "Paris Baguette", imageUrl: "https://th.bing.com/th/id/OIP.ozbJbuwdTmW8br127zqPYwHaFj?r=0&rs=1&pid=ImgDetMain" },
  { name: "Sawatdee", imageUrl: "https://static.wixstatic.com/media/4e6ae0_78c4a2d6b9d24438bd27dfaa7b141981~mv2.png/v1/fit/w_554,h_416,q_90/4e6ae0_78c4a2d6b9d24438bd27dfaa7b141981~mv2.png" },
  { name: "Rojo Mexican Grill", imageUrl: "https://resizer.otstatic.com/v2/photos/xlarge/2/60990214.webp" },
  { name: "Pints & Paddle", imageUrl: "https://patch.com/img/cdn20/users/22887410/20221121/111529/styles/patch_image/public/pints-paddle-maple-grove-exterior-rendering___21105255017.jpg" },
  { name: "Paulie's", imageUrl: "https://www.ugaminggroup.com/wp-content/uploads/2018/10/Paulie_s-Pub.jpg" }
];

interface UpdateResult {
  id: bigint;
  name: string;
  success: boolean;
  oldUrl?: string;
  newUrl?: string;
  error?: string;
}

/**
 * Find matching restaurant in database by name
 * Handles variations in naming conventions
 */
function findMatchingRestaurant(targetName: string, restaurants: any[]) {
  // Direct name match
  let match = restaurants.find(r => r.name === targetName);
  if (match) return match;

  // Handle specific naming variations
  const nameVariations: { [key: string]: string[] } = {
    "Highlander Pub (Rush Creek Golf Club)": ["Highlander Pub at Rush Creek Golf Club"],
    "3 Squares Restaurant": ["3 Squares"],
    "Frankie's Chicago Style Pizza": ["Frankie's Pizza"],
    "Biaggi's Ristorante Italiano": ["Biaggi's"],
    "Granite City Food & Brewery": ["Granite City"]
  };

  // Check variations
  if (nameVariations[targetName]) {
    for (const variation of nameVariations[targetName]) {
      match = restaurants.find(r => r.name === variation);
      if (match) return match;
    }
  }

  // Partial match - check if database name contains key words from target
  const targetWords = targetName.toLowerCase().split(/\s+/);
  match = restaurants.find(r => {
    const dbWords = r.name.toLowerCase().split(/\s+/);
    return targetWords.some(word => dbWords.includes(word) && word.length > 3);
  });

  return match;
}

/**
 * Main function to update restaurant images
 */
async function updateRestaurantImages() {
  console.log("🚀 Starting restaurant image updates...");
  
  try {
    // Get all restaurants from database
    console.log("📊 Fetching restaurants from database...");
    const restaurants = await getRestaurants();
    console.log(`Found ${restaurants.length} restaurants in database`);

    const results: UpdateResult[] = [];
    let successCount = 0;
    let failureCount = 0;

    // Process each image update
    for (const imageUpdate of imageUpdates) {
      console.log(`\n🔍 Processing: ${imageUpdate.name}`);
      
      const restaurant = findMatchingRestaurant(imageUpdate.name, restaurants);
      
      if (!restaurant) {
        console.log(`❌ No matching restaurant found for: ${imageUpdate.name}`);
        results.push({
          id: BigInt(0),
          name: imageUpdate.name,
          success: false,
          error: "No matching restaurant found"
        });
        failureCount++;
        continue;
      }

      console.log(`✅ Found match: ${restaurant.name} (ID: ${restaurant.id})`);
      console.log(`🔄 Updating image URL...`);
      console.log(`   Old: ${restaurant.imageUrl}`);
      console.log(`   New: ${imageUpdate.imageUrl}`);

      try {
        await updateRestaurant(restaurant.id, { 
          imageUrl: imageUpdate.imageUrl 
        });
        
        console.log(`✅ Successfully updated ${restaurant.name}`);
        results.push({
          id: restaurant.id,
          name: restaurant.name,
          success: true,
          oldUrl: restaurant.imageUrl,
          newUrl: imageUpdate.imageUrl
        });
        successCount++;
        
        // Add small delay to avoid overwhelming the database
        await new Promise(resolve => setTimeout(resolve, 100));
        
      } catch (error) {
        console.log(`❌ Failed to update ${restaurant.name}: ${error}`);
        results.push({
          id: restaurant.id,
          name: restaurant.name,
          success: false,
          oldUrl: restaurant.imageUrl,
          newUrl: imageUpdate.imageUrl,
          error: error instanceof Error ? error.message : String(error)
        });
        failureCount++;
      }
    }

    // Summary report
    console.log("\n" + "=".repeat(60));
    console.log("📋 UPDATE SUMMARY");
    console.log("=".repeat(60));
    console.log(`Total restaurants processed: ${imageUpdates.length}`);
    console.log(`✅ Successful updates: ${successCount}`);
    console.log(`❌ Failed updates: ${failureCount}`);
    
    if (failureCount > 0) {
      console.log("\n❌ FAILED UPDATES:");
      results
        .filter(r => !r.success)
        .forEach(r => {
          console.log(`- ${r.name}: ${r.error}`);
        });
    }
    
    if (successCount > 0) {
      console.log("\n✅ SUCCESSFUL UPDATES:");
      results
        .filter(r => r.success)
        .forEach(r => {
          console.log(`- ${r.name} (ID: ${r.id})`);
        });
    }

    console.log("\n🎉 Restaurant image update process completed!");
    
  } catch (error) {
    console.error("💥 Fatal error during update process:", error);
    process.exit(1);
  }
}

// Run the update script
if (require.main === module) {
  updateRestaurantImages()
    .then(() => process.exit(0))
    .catch(error => {
      console.error("💥 Script failed:", error);
      process.exit(1);
    });
}

export { updateRestaurantImages }; 