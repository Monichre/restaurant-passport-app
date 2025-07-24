# Restaurant Image Update Pseudocode

## Objective
Update restaurant imageUrl fields in the database by matching restaurant names from the new images list with existing database entries.

## Data Analysis
### New Images Available (23 restaurants):
1. Tono Pizzeria + Cheesesteaks
2. 3 Squares Restaurant  
3. Lotus
4. Riviera Maya Cantina & Restaurant
5. Brick & Bourbon
6. Highlander Pub (Rush Creek Golf Club)
7. Nautical Bowls
8. Frankie's Chicago Style Pizza
9. Pittsburgh Blue Steakhouse
10. Lookout Bar & Grill
11. Malone's Bar & Grill
12. OMNI Brewing Company
13. Broadway Pizza
14. Granite City Food & Brewery
15. Grackle
16. Chanticlear Pizza
17. Biaggi's Ristorante Italiano
18. El Rodeo
19. Paris Baguette
20. Sawatdee
21. Rojo Mexican Grill
22. Pints & Paddle
23. Paulie's

### Current Database Entries (23 restaurants):
- All restaurants use placeholder images or old URLs
- Need to match by restaurant name (with variations)

## Mapping Strategy
```
FUNCTION mapRestaurantImages():
  FOR each restaurant IN newImages:
    currentDbEntry = findMatchingRestaurant(restaurant.name, currentDb)
    IF currentDbEntry EXISTS:
      updateMapping.add({
        id: currentDbEntry.id,
        currentUrl: currentDbEntry.imageUrl,
        newUrl: restaurant.imageUrl,
        name: restaurant.name
      })
```

## Name Matching Logic
```
FUNCTION findMatchingRestaurant(newName, database):
  // Direct matches
  FOR each entry IN database:
    IF entry.name EQUALS newName:
      RETURN entry
    
  // Partial matches (handle variations)
  FOR each entry IN database:
    IF entry.name CONTAINS core_keywords(newName):
      RETURN entry
      
  // Special cases:
  // "Highlander Pub (Rush Creek Golf Club)" -> "Highlander Pub at Rush Creek Golf Club"
  // Handle slight naming variations
```

## Update Process
```
FUNCTION updateRestaurantImages():
  1. CONNECT to database (Supabase)
  2. FOR each mapping IN updateMappings:
    3. EXECUTE UPDATE restaurants 
       SET imageUrl = mapping.newUrl 
       WHERE id = mapping.id
    4. LOG update success/failure
  5. GENERATE summary report
```

## Implementation Steps
1. Identify database connection method (Supabase client)
2. Create mapping array of updates needed
3. Execute batch update or individual updates
4. Verify updates were successful
5. Document changes made

## Expected Matches (23 total):
All restaurants in the new images list should have corresponding entries in the current database, as the counts match exactly. 