// Restaurant Data Enricher
// This script reads restaurant data from CSV and uses firecrawl_search to find:
// - Name
// - Address
// - Geo coordinates
// - Images
// - Enhanced descriptions

const fs = require("node:fs");
const path = require("node:path");
const Papa = require("papaparse");
const axios = require("axios");
const { z } = require("zod");

import FirecrawlApp from "@mendable/firecrawl-js";

const app = new FirecrawlApp({
	apiKey: process.env.FIRECRAWL_API_KEY,
});

const restaurants = [
	{
		id: 23,
		name: "3 Squares",
		url: "https://www.3squaresrestaurant.com/",
		"description\r": "\r",
	},
	{
		id: 24,
		name: "Akame Sushi",
		url: "https://akamesushi888.com/index.php",
		"description\r": "\r",
	},
	{
		id: 25,
		name: "Angeno's Pizza",
		url: "https://www.angenospizzamn.com/",
		"description\r": "\r",
	},
	{
		id: 26,
		name: "Applebee's Grill + Bar",
		url: "https://restaurants.applebees.com/en-us/mn/maple-grove/14400-weaver-lake-road-82020",
		"description\r": "\r",
	},
	{
		id: 27,
		name: "Arby's",
		url: "https://locations.arbys.com/mn/maplegrove/7885-wedgewood-lane.html",
		"description\r": "\r",
	},
	{
		id: 28,
		name: "Benihana",
		url: "https://www.benihana.com/locations/maplegrove-mn-mg/",
		"description\r": "\r",
	},
	{
		id: 29,
		name: "Biaggi's",
		url: "https://biaggis.com/",
		"description\r": "\r",
	},
	{
		id: 30,
		name: "Bonchon",
		url: "https://locations.bonchon.com/ll/US/MN/Maple-Grove/11708-Elm-Creek-Blvd-N",
		"description\r": "\r",
	},
	{
		id: 31,
		name: "Brick & Bourbon",
		url: "https://www.brickandbourbon.com/location/maple-grove/",
		"description\r": "\r",
	},
	{
		id: 32,
		name: "Broadway Pizza",
		url: "https://www.broadwaypizza.com/maple-grove/maple-grove",
		"description\r": "\r",
	},
	{
		id: 33,
		name: "Bruegger's Bagels",
		url: "https://locations.brueggers.com/us/mn/maple-grove/13384-bass-lake-rd",
		"description\r": "\r",
	},
	{
		id: 34,
		name: "Buca di Beppo",
		url: "https://locations.bucadibeppo.com/us/mn/maple-grove/12650-elm-creek-blvd",
		"description\r": "\r",
	},
	{
		id: 35,
		name: "Burger King",
		url: "https://www.bk.com/store-locator/store/4507/13840-grove-drive--maple-grove--minnesota--55311-4408",
		"description\r": "\r",
	},
	{
		id: 36,
		name: "Cafe Zupas",
		url: "https://cafezupas.com/",
		"description\r": "\r",
	},
	{
		id: 37,
		name: "Caribou - Bass Lake Rd",
		url: "https://locations.cariboucoffee.com/us/mn/maple-grove/12850-bass-lake-road",
		"description\r": "\r",
	},
	{
		id: 38,
		name: "Caribou - County Rd 30",
		url: "https://locations.cariboucoffee.com/us/mn/maple-grove/16393-county-road-30",
		"description\r": "\r",
	},
	{
		id: 39,
		name: "Caribou - Elm Creek Blvd N",
		url: "https://locations.cariboucoffee.com/us/mn/maple-grove/12880-elm-creek-boulevard",
		"description\r": "\r",
	},
	{
		id: 40,
		name: "Caribou - Grove Dr",
		url: "https://locations.cariboucoffee.com/us/mn/maple-grove/13250-grove-drive",
		"description\r": "\r",
	},
	{
		id: 41,
		name: "Caribou - Maple Grove Pkwy",
		url: "https://locations.cariboucoffee.com/us/mn/maple-grove/9805-maple-grove-parkway",
		"description\r": "\r",
	},
	{
		id: 42,
		name: "Chanticlear Pizza",
		url: "https://chanticlearpizza.com/locations/maple-grove/",
		"description\r": "\r",
	},
	{
		id: 43,
		name: "Chick-Fil-A",
		url: "https://www.chick-fil-a.com/locations/mn/maple-grove?utm_source=yext&utm_medium=link",
		"description\r": "\r",
	},
	{
		id: 44,
		name: "Chipotle - Chipotlane",
		url: "https://www.chipotle.com/",
		"description\r": "\r",
	},
	{
		id: 45,
		name: "Chipotle - Main St",
		url: "https://locations.chipotle.com/mn/maple-grove/7750-main-st-n?utm_source=google&utm_medium=yext&utm_campaign=yext_listings",
		"description\r": "\r",
	},
	{
		id: 46,
		name: "Chipotle - Maple Grove Pkwy",
		url: "https://locations.chipotle.com/mn/maple-grove/9881-maple-grove-pkwy-n?utm_source=google&utm_medium=yext&utm_campaign=yext_listings",
		"description\r": "\r",
	},
	{
		id: 47,
		name: "Chipotle - MG Pkwy N",
		url: "https://www.chipotle.com/",
		"description\r": "\r",
	},
	{
		id: 48,
		name: "Chuck E. Cheese",
		url: "https://locations.chuckecheese.com/us/mn/maplegrove/12945-elm-creek-blvd.",
		"description\r": "\r",
	},
	{
		id: 157,
		name: "Clubhaus Agency",
		url: "3020 Garfield Ave",
		"description\r": "Description here \r",
	},
	{
		id: 49,
		name: "Cold Stone Creamery",
		url: "https://www.coldstonecreamery.com/stores/20294",
		"description\r": "\r",
	},
	{
		id: 50,
		name: "Crave",
		url: "https://craveamerica.com/",
		"description\r": "\r",
	},
	{
		id: 51,
		name: "Crisp & Green",
		url: "https://crispandgreen.com/locations/crisp-and-green-maple-grove/",
		"description\r": "\r",
	},
	{
		id: 52,
		name: "Crumbl",
		url: "https://crumblcookies.com/maplegrove?utm_source=google+business&utm_medium=profile&utm_campaign=CRUMBL-US+7C+STORE+PAGE+7C+CONSIDERATION+%7C+PROFILE",
		"description\r": "\r",
	},
	{
		id: 53,
		name: "Culvers",
		url: "https://www.culvers.com/restaurants/maple-grove",
		"description\r": "\r",
	},
	{
		id: 54,
		name: "Daily Dose Cafe & Espresso",
		url: "https://dailydosemaplegrove.square.site/home",
		"description\r": "\r",
	},
	{
		id: 55,
		name: "Dairy Queen",
		url: "https://www.dairyqueen.com/en-us/locations/mn/maple-grove/13770-83rd-way-n/1411/",
		"description\r": "\r",
	},
	{
		id: 56,
		name: "Dancing Ganesha",
		url: "https://dancingganeshampls.com/#",
		"description\r": "\r",
	},
	{
		id: 57,
		name: "Dave & Busters",
		url: "https://www.daveandbusters.com/us/en/about/locations/maple-grove",
		"description\r": "\r",
	},
	{
		id: 58,
		name: "Domino's Pizza",
		url: "https://pizza.dominos.com/minnesota/maple-grove/13590-grove-drive",
		"description\r": "\r",
	},
	{
		id: 59,
		name: "Dunkin' Donuts",
		url: "https://locations.dunkindonuts.com/en/mn/maple-grove/13530-grove-drive/364094",
		"description\r": "\r",
	},
	{
		id: 60,
		name: "El Rodeo",
		url: "https://www.facebook.com/ElRodeoMexicanRestaurantMN",
		"description\r": "\r",
	},
	{
		id: 61,
		name: "Famous Dave's",
		url: "https://www.famousdaves.com/Maple-Grove",
		"description\r": "\r",
	},
	{
		id: 62,
		name: "Firehouse Subs",
		url: "https://www.firehousesubs.com/store-locator/store/67f17dd0-3b17-492a-9a9c-68ef7afb11eb",
		"description\r": "\r",
	},
	{
		id: 63,
		name: "Five Guys",
		url: "https://restaurants.fiveguys.com/7814-main-street-north",
		"description\r": "\r",
	},
	{
		id: 64,
		name: "Frankie's Pizza",
		url: "https://frankiespizza.com/",
		"description\r": "\r",
	},
	{
		id: 65,
		name: "Freddy's",
		url: "https://www.freddys.com/order",
		"description\r": "\r",
	},
	{
		id: 66,
		name: "Golden Corral",
		url: "https://www.goldencorral.com/locations/location-detail/2677/golden-corral-grove-drive/?utm_source=google&utm_medium=local&utm_campaign=localmaps&utm_content=2677",
		"description\r": "\r",
	},
	{
		id: 67,
		name: "Grabbagreen",
		url: "https://www.grabbagreen.com/pressroom/2017/gr-051117-opens-in-maple-grove.php",
		"description\r": "\r",
	},
	{
		id: 68,
		name: "Grackle",
		url: "https://www.gracklegrove.com/",
		"description\r": "\r",
	},
	{
		id: 69,
		name: "Granite City",
		url: "https://www.gcfb.com/",
		"description\r": "\r",
	},
	{
		id: 70,
		name: "Great Greek Mediterranean Grill",
		url: "https://www.thegreatgreekgrill.com/maple-grove-mn",
		"description\r": "\r",
	},
	{
		id: 71,
		name: "Great Harvest Bread",
		url: "http://maplegrovebread.com/",
		"description\r": "\r",
	},
	{
		id: 72,
		name: "Grill Hall",
		url: "https://grillhallbraziliansteakhouse.com/",
		"description\r": "\r",
	},
	{
		id: 73,
		name: "Hawaii Poke Bowl",
		url: "https://hawaiipokeusa.com/apple-valley-hawaii-poke-bowl-locations",
		"description\r": "\r",
	},
	{
		id: 74,
		name: "Highlander at Rush Creek",
		url: "https://www.rushcreek.com/the-highlander",
		"description\r": "\r",
	},
	{
		id: 75,
		name: "Hometowne pizza",
		url: "https://www.hometownepizza.com/",
		"description\r": "\r",
	},
	{
		id: 76,
		name: "Hong Kong",
		url: "https://hongkongmaplegrove.com/index.html",
		"description\r": "\r",
	},
	{
		id: 77,
		name: "Ichiddo Ramen",
		url: "https://www.maplegrove.ichiddo.com/",
		"description\r": "\r",
	},
	{
		id: 78,
		name: "Jersey Mike's",
		url: "https://www.jerseymikes.com/24009/maple-grove-mn",
		"description\r": "\r",
	},
	{
		id: 79,
		name: "Jet's Pizza",
		url: "https://www.jetspizza.com/stores/minnesota/maple-grove/16338-county-rd-30/",
		"description\r": "\r",
	},
	{
		id: 80,
		name: "Jimmy John's - Bass Lake Rd N",
		url: "https://locations.jimmyjohns.com/mn/maplegrove/sandwiches-1595.html?utm_source=google20business&utm_medium=organic&utm_campaign=website%20link",
		"description\r": "\r",
	},
	{
		id: 81,
		name: "Jimmy John's - Blackoaks Ln N",
		url: "https://locations.jimmyjohns.com/mn/maplegrove/sandwiches-3955.html?utm_source=google20business&utm_medium=organic&utm_campaign=website%20link",
		"description\r": "\r",
	},
	{
		id: 82,
		name: "Jimmy John's - Wedgewood Ln N",
		url: "https://locations.jimmyjohns.com/mn/maplegrove/sandwiches-1184.html?utm_source=google20business&utm_medium=organic&utm_campaign=website%20link",
		"description\r": "\r",
	},
	{
		id: 83,
		name: "K pot",
		url: "https://thekpot.com/location/maple-grove-mn/",
		"description\r": "\r",
	},
	{
		id: 84,
		name: "Kingdom Coffee",
		url: "https://www.kingdomcoffeemn.com/",
		"description\r": "\r",
	},
	{
		id: 85,
		name: "Leeann Chin",
		url: "https://www.leeannchin.com/restaurant/maple-grove-dunkirk-lane-mn/9428-dunkirk-lane-north",
		"description\r": "\r",
	},
	{
		id: 86,
		name: "Lookout Bar & Grill",
		url: "https://www.lookoutbarandgrill.com/",
		"description\r": "\r",
	},
	{
		id: 87,
		name: "Lotus",
		url: "https://www.lotusmaplegrove.com/",
		"description\r": "\r",
	},
	{
		id: 88,
		name: "Lunds & Byerlys Cafe",
		url: "https://lundsandbyerlys.com/our-stores/locations/maple-grove/",
		"description\r": "\r",
	},
	{
		id: 89,
		name: "Malone's Bar & Grill",
		url: "https://malonesbarandgrill.net/",
		"description\r": "\r",
	},
	{
		id: 90,
		name: "Mama G's Restaurant and Bar",
		url: "https://mamags.com/",
		"description\r": "\r",
	},
	{
		id: 91,
		name: "Mango Mango",
		url: "https://www.mangomangodessert.com/",
		"description\r": "\r",
	},
	{
		id: 92,
		name: "McDonald's - 83rd Way N",
		url: "https://www.mcdonalds.com/us/en-us/location/MN/MAPLE-GROVE/13595-83RD-WAY/12407.html?cid=RF:YXT:GMB::Clicks",
		"description\r": "\r",
	},
	{
		id: 93,
		name: "McDonald's - Blackoaks Ln N",
		url: "https://www.mcdonalds.com/us/en-us/location/MN/MAPLE-GROVE/9530-BLACK-OAKS-AVE/24304.html?cid=RF:YXT:GMB::Clicks",
		"description\r": "\r",
	},
	{
		id: 94,
		name: "McDonald's - Sycamore Ln N",
		url: "https://www.mcdonalds.com/us/en-us/location/MN/MAPLE-GROVE/6255-SYCAMORE-LANE-NORTH/5976.html?cid=RF:YXT:GMB::Clicks",
		"description\r": "\r",
	},
	{
		id: 95,
		name: "Nadia Cakes",
		url: "https://www.nadiacakes.com/",
		"description\r": "\r",
	},
	{
		id: 96,
		name: "Naf Naf Grill",
		url: "https://www.nafnafgrill.com/",
		"description\r": "\r",
	},
	{
		id: 97,
		name: "Nautical Bowls",
		url: "https://nauticalbowls.com/",
		"description\r": "\r",
	},
	{
		id: 98,
		name: "Nice 2 Meet Cha",
		url: "https://www.nice2meetchamn.com/",
		"description\r": "\r",
	},
	{
		id: 99,
		name: "Noodles & Company",
		url: "https://www.noodles.com/location",
		"description\r": "\r",
	},
	{
		id: 100,
		name: "Northern Tap House",
		url: "https://northerntaphouse.com/",
		"description\r": "\r",
	},
	{
		id: 101,
		name: "Nothing Bundt Cakes",
		url: "https://www.nothingbundtcakes.com/all-products/?utm_medium=organic&utm_source=gbplisting&location=0199&fulfillment=04/15/2024",
		"description\r": "\r",
	},
	{
		id: 102,
		name: "Olive Garden",
		url: "https://www.olivegarden.com/locations/mn/maple-grove/maple-grove/1534?cmpid=br:og_ag:ie_ch:loc_ca:OGGMB_sn:gmb_gt:maple-grove-mn-1534_pl:locurl_rd:1404",
		"description\r": "\r",
	},
	{
		id: 103,
		name: "Omni Brewery",
		url: "https://www.omnibrewing.com/",
		"description\r": "\r",
	},
	{
		id: 104,
		name: "Optimal Performance Golf",
		url: "https://optimalperformancegolf.com/",
		"description\r": "\r",
	},
	{
		id: 105,
		name: "Original Pancake House",
		url: "https://ophmg.com/",
		"description\r": "\r",
	},
	{
		id: 106,
		name: "P.F Chang's",
		url: "https://www.pfchangs.com/locations/us/mn/maple-grove/12071-elm-creek-blvd/9958-maple-grove.html",
		"description\r": "\r",
	},
	{
		id: 107,
		name: "Pancheros",
		url: "https://pancheros.com/",
		"description\r": "\r",
	},
	{
		id: 108,
		name: "Panda Express",
		url: "https://www.pandaexpress.com/",
		"description\r": "\r",
	},
	{
		id: 109,
		name: "Panera",
		url: "https://www.panerabread.com/en-us/cafe/locations/mn/maple-grove/7778-main-street-n?utm_medium=local&utm_source=google&utm_campaign=dpm-dist&utm_term=601303&utm_content=main",
		"description\r": "\r",
	},
	{
		id: 110,
		name: "Papa Murphy's",
		url: "https://locations.papamurphys.com/mn/maple-grove/8097-wedgewood-lane-north?utm_source=organic&utm_medium=gmb&utm_campaign=yext",
		"description\r": "\r",
	},
	{
		id: 111,
		name: "Paris Baguette",
		url: "https://parisbaguette.com/locations/",
		"description\r": "\r",
	},
	{
		id: 112,
		name: "Perkins",
		url: "https://www.perkinsrestaurants.com/locations/us/mn/maple-grove/11801-73rd-ave-n/",
		"description\r": "\r",
	},
	{
		id: 113,
		name: "Pints & Paddle",
		url: "https://pintsandpaddle.com/",
		"description\r": "\r",
	},
	{
		id: 114,
		name: "Pittsburgh Blue Steakhouse",
		url: "https://pittsburghbluesteak.com/maple-grove/",
		"description\r": "\r",
	},
	{
		id: 115,
		name: "Pizza Hut",
		url: "https://locations.pizzahut.com/mn/maple-grove/6342-vinewood-ln?utm_medium=organic&utm_source=local&utm_campaign=googlelistings&utm_content=website&utm_term=311993",
		"description\r": "\r",
	},
	{
		id: 116,
		name: "Pizza Karma",
		url: "https://order.pizzakarma.com/order/?branchId=5f1955e7a31b160e2fec81eb&branchName=Maple20&search=&servingOptionType=pickup/",
		"description\r": "\r",
	},
	{
		id: 117,
		name: "Pizza Man",
		url: "https://www.pizzamanmg.com/",
		"description\r": "\r",
	},
	{
		id: 118,
		name: "Portillos",
		url: "https://www.portillos.com/locations/maplegrove/?utm_source=google&utm_medium=yext&utm_campaign=website",
		"description\r": "\r",
	},
	{
		id: 119,
		name: "Potbelly",
		url: "https://www.potbelly.com/locations/minnesota/maple-grove",
		"description\r": "\r",
	},
	{
		id: 120,
		name: "Punch Pizza",
		url: "https://punchpizza.com/locations/maple-grove/",
		"description\r": "\r",
	},
	{
		id: 121,
		name: "Raising Cane's",
		url: "https://locations.raisingcanes.com/mn/maple-grove/9875-maple-grove-pkwy",
		"description\r": "\r",
	},
	{
		id: 122,
		name: "Redstone Grill",
		url: "https://www.redstonegrill.com/",
		"description\r": "\r",
	},
	{
		id: 123,
		name: "Riviera Maya",
		url: "https://rivieramayamn.com/",
		"description\r": "\r",
	},
	{
		id: 124,
		name: "Rodizio Grill",
		url: "https://www.rodiziogrill.com/maplegrove/",
		"description\r": "\r",
	},
	{
		id: 125,
		name: "Rojo",
		url: "https://rojomexicangrill.com/",
		"description\r": "\r",
	},
	{
		id: 126,
		name: "Rusty Taco",
		url: "https://rustytaco.com/",
		"description\r": "\r",
	},
	{
		id: 127,
		name: "Sawatdee Thai Cuisine",
		url: "https://www.sawatdee.com/maple-grove",
		"description\r": "\r",
	},
	{
		id: 128,
		name: "Shake Shack",
		url: "https://shakeshack.com/location/maple-grove-mn?utm_source=G&utm_medium=local&utm_campaign=google-local#/",
		"description\r": "\r",
	},
	{
		id: 129,
		name: "Starbucks - 70th Wy N",
		url: "https://www.starbucks.com/store-locator/store/1026660/hy-vee-maple-grove-1401-18755-70th-way-north-maple-grove-mn-55311-us",
		"description\r": "\r",
	},
	{
		id: 130,
		name: "Starbucks - Dunkirk Ln N",
		url: "https://www.starbucks.com/store-locator/store/91096/maple-grove-dunkirk-square-9404-dunkirk-lane-maple-grove-mn-553111220-us",
		"description\r": "\r",
	},
	{
		id: 131,
		name: "Starbucks - Elm Creek Blvd",
		url: "https://www.starbucks.com/store-locator/store/1033274/hemlock-elm-creek-pkwy-11850-elm-creek-boulevard-n-maple-grove-mn-55369-u",
		"description\r": "\r",
	},
	{
		id: 132,
		name: "Starbucks - Grove Cir N",
		url: "https://www.starbucks.com/store-locator/store/6527/target-maple-grove-2193-15300-grove-circle-n-maple-grove-mn-553694469-us",
		"description\r": "\r",
	},
	{
		id: 133,
		name: "Starbucks - Wedgewood Ln",
		url: "https://www.starbucks.com/store-locator/store/12142/7979-wedgewood-lane-7979-wedgewood-lane-maple-grove-mn-553699411-us",
		"description\r": "\r",
	},
	{
		id: 134,
		name: "Subway - 63rd Ave N",
		url: "https://restaurants.subway.com/united-states/mn/maple-grove/9660-63rd-ave-n?utm_source=yxt-goog&utm_medium=local&utm_term=acq&utm_content=35292&utm_campaign=evergreen-2020",
		"description\r": "\r",
	},
	{
		id: 135,
		name: "Subway - Bass Lake Ctr",
		url: "https://restaurants.subway.com/united-states/mn/maple-grove/12744-bass-lake-rd?utm_source=yxt-goog&utm_medium=local&utm_term=acq&utm_content=16428&utm_campaign=evergreen-2020",
		"description\r": "\r",
	},
	{
		id: 136,
		name: "Subway - Dunkirk Ln N",
		url: "https://restaurants.subway.com/united-states/mn/maple-grove/9451-dunkirk-ln-n?utm_source=yxt-goog&utm_medium=local&utm_term=acq&utm_content=12949&utm_campaign=evergreen-2020",
		"description\r": "\r",
	},
	{
		id: 137,
		name: "Subway - Grove Village shopping ctr",
		url: "https://restaurants.subway.com/united-states/mn/maple-grove/9869-maple-grove-parkway-north?utm_source=yxt-goog&utm_medium=local&utm_term=acq&utm_content=43871&utm_campaign=evergreen-2020",
		"description\r": "\r",
	},
	{
		id: 138,
		name: "Subway - Rice Lake Plaza",
		url: "https://restaurants.subway.com/united-states/mn/maple-grove/13758-83rd-way?utm_source=yxt-goog&utm_medium=local&utm_term=acq&utm_content=5063&utm_campaign=evergreen-2020",
		"description\r": "\r",
	},
	{
		id: 139,
		name: "Taco Bell - Grove Dr",
		url: "https://locations.tacobell.com/mn/maple-grove/13910-grove-dr.html?utm_source=yext&utm_campaign=googlelistings&utm_medium=referral&utm_term=004850&utm_content=website&y_source=1_NjE0NjQwMi03MTUtbG9jYXRpb24ud2Vic2l0ZQ3D",
		"description\r": "\r",
	},
	{
		id: 140,
		name: "Taco Bell - Hospital Dr",
		url: "https://locations.tacobell.com/mn/maple-grove/9816-hospital-drive-n-.html?utm_source=yext&utm_campaign=googlelistings&utm_medium=referral&utm_term=036439&utm_content=website&y_source=1_MTk3Nzc3MDMtNzE1LWxvY2F0aW9uLndlYnNpdGU%3D",
		"description\r": "\r",
	},
	{
		id: 141,
		name: "Taco John's",
		url: "https://locations.tacojohns.com/mn/maple-grove/13320-grove-dr/",
		"description\r": "\r",
	},
	{
		id: 142,
		name: "Tandoor",
		url: "https://www.grovetandoor.com/",
		"description\r": "\r",
	},
	{
		id: 143,
		name: "Ten Sushi",
		url: "https://www.tensushimn.com/",
		"description\r": "\r",
	},
	{
		id: 144,
		name: "Teresa's",
		url: "https://teresasmn.com/",
		"description\r": "\r",
	},
	{
		id: 156,
		name: "Test",
		url: "4253 Browndale Ave",
		"description\r": "great spot\r",
	},
	{
		id: 158,
		name: "Test sam",
		url: "3020 Garfield Ave",
		"description\r": "Gfjdjdj\r",
	},
	{
		id: 145,
		name: "TGI Fridays",
		url: "https://locations.tgifridays.com/mn/maple-grove/11830-fountains-way.html",
		"description\r": "\r",
	},
	{
		id: 146,
		name: "Thai Express",
		url: "https://www.thaiexpressfood.com/stores/60398?utm_source=gmb&utm_medium=gmb&utm_campaign=gmb&utm_id=gmb",
		"description\r": "\r",
	},
	{
		id: 147,
		name: "Tono Pizzeria + Cheesesteaks",
		url: "https://tonomn.com/locations/maplegrove/",
		"description\r": "\r",
	},
	{
		id: 148,
		name: "Uffda Donuts",
		url: "https://uffdadonuts.com/",
		"description\r": "\r",
	},
	{
		id: 149,
		name: "Urban Wok",
		url: "https://www.urbanwokusa.com/locations",
		"description\r": "\r",
	},
	{
		id: 150,
		name: "Village Inn",
		url: "https://www.villageinn.com/maplegrove-mn",
		"description\r": "\r",
	},
	{
		id: 151,
		name: "Wendy's",
		url: "https://locations.wendys.com/united-states/mn/maple-grove/13645-83rd-way-n",
		"description\r": "\r",
	},
	{
		id: 152,
		name: "WhirlyBall",
		url: "https://www.whirlyballtwincities.com/",
		"description\r": "\r",
	},
	{
		id: 153,
		name: "White Castle",
		url: "https://www.whitecastle.com/locations/1324",
		"description\r": "\r",
	},
	{
		id: 154,
		name: "Yogurt Lab",
		url: "http://www.yogurtlabs.com/",
		"description\r": "\r",
	},
	{
		id: 155,
		name: "Yu Fong",
		url: "http://doyufong.com/lander",
		"description\r": "",
	},
];

// const CONFIG = {
// 	inputFile: path.join(__dirname, "restaurants-export.csv"),
// 	outputJsonFile: path.join(__dirname, "enriched_restaurants.json"),
// 	outputCsvFile: path.join(__dirname, "enriched_restaurants.csv"),
// 	location: "Maple Grove MN",
// 	batchSize: 10, // Save after every X restaurants
// 	delayBetweenSearches: 2000, // Milliseconds
// 	firecrawlApiEndpoint:
// 		process.env.FIRECRAWL_API_ENDPOINT || "https://api.firecrawl.dev/v1/search",
// 	firecrawlApiKey: process.env.FIRECRAWL_API_KEY || "your-api-key-here",
// };

async function processRestaurants() {
	// Create a new instance of FirecrawlApp

	console.log("🚀 ~ processRestaurants ~ app:", app);

	// Read and parse the CSV file
	const schema = z.object({
		name: z.string(),
		url: z.string(),
		description: z.string(),
		physicalAddress: z.string(),
		scrapedDescription: z.string(),
		imageUrl: z.string(),
	});

	const urls = restaurants.map((restaurant) => {
		const url = restaurant.url.trim();

		return `${url}`;
	});

	const batchScrapeJob = await app.asyncBulkScrapeUrls(urls, {
		formats: ["extract"],
		extract: {
			prompt:
				"Extract the name, full, address, image, and description of the restaurant",
			schema,
		},
	});
	console.log(batchScrapeJob);
	// (async) You can then use the job ID to check the status of the batch scrape:
	const batchScrapeStatus = await app.checkBatchScrapeStatus(batchScrapeJob.id);
	console.log(batchScrapeStatus);

	if (urls.length === 0) {
		console.log("No URLs to process");
		return;
	}
	console.log("🚀 ~ urls ~ urls:", urls);

	const extractedInfo = await app.extract(urls, {
		prompt:
			"Extract the name, full, address, image, and description of the restaurant",
		schema,
		enableWebSearch: true, // Enable web search for better context
	});

	if (!extractedInfo.success) {
		throw new Error(`Failed to scrape: ${extractedInfo.error}`);
	}

	// Get the status of the extraction job
	const jobStatus = await app.getExtractStatus(extractedInfo.jobId);

	console.log(jobStatus);
	// console.log("🚀 ~ processRestaurants ~ extractedInfo:", extractedInfo);

	// console.log(results);
	// Save results to JSON file
	// await fs.promises.writeFile(
	// 	"restaurant_data.json",
	// 	JSON.stringify(results, null, 2),
	// );

	return jobStatus;

	// return resulrets
}

processRestaurants();
