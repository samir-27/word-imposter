// backend/src/game/wordBank.ts
import { WordPair } from "../types/socket.js";

export const WORD_PAIRS: WordPair[] = [
  // ==================== FOOD ====================

  { id: "1", category: "Food", innocentWord: "Pizza", imposterWord: "Burger" },
  { id: "2", category: "Food", innocentWord: "Biryani", imposterWord: "Fried Rice" },
  { id: "3", category: "Food", innocentWord: "Pasta", imposterWord: "Lasagna" },
  { id: "4", category: "Food", innocentWord: "Sandwich", imposterWord: "Hot Dog" },
  { id: "5", category: "Food", innocentWord: "Taco", imposterWord: "Nachos" },
  { id: "6", category: "Food", innocentWord: "Dosa", imposterWord: "Idli" },
  { id: "7", category: "Food", innocentWord: "Samosa", imposterWord: "Spring Roll" },
  { id: "8", category: "Food", innocentWord: "Noodles", imposterWord: "Macaroni" },
  { id: "9", category: "Food", innocentWord: "Pancake", imposterWord: "French Toast" },
  { id: "10", category: "Food", innocentWord: "Donut", imposterWord: "Cupcake" },
  { id: "11", category: "Food", innocentWord: "Ice Cream", imposterWord: "Chocolate" },
  { id: "12", category: "Food", innocentWord: "Popcorn", imposterWord: "Chips" },
  { id: "13", category: "Food", innocentWord: "Soup", imposterWord: "Salad" },
  { id: "14", category: "Food", innocentWord: "Steak", imposterWord: "Grilled Chicken" },
  { id: "15", category: "Food", innocentWord: "Mango", imposterWord: "Watermelon" },

  // ==================== ANIMALS ====================

  { id: "16", category: "Animals", innocentWord: "Dog", imposterWord: "Parrot" },
  { id: "17", category: "Animals", innocentWord: "Cat", imposterWord: "Rabbit" },
  { id: "18", category: "Animals", innocentWord: "Lion", imposterWord: "Tiger" },
  { id: "19", category: "Animals", innocentWord: "Elephant", imposterWord: "Giraffe" },
  { id: "20", category: "Animals", innocentWord: "Monkey", imposterWord: "Gorilla" },
  { id: "21", category: "Animals", innocentWord: "Horse", imposterWord: "Zebra" },
  { id: "22", category: "Animals", innocentWord: "Cow", imposterWord: "Buffalo" },
  { id: "23", category: "Animals", innocentWord: "Wolf", imposterWord: "Fox" },
  { id: "24", category: "Animals", innocentWord: "Eagle", imposterWord: "Owl" },
  { id: "25", category: "Animals", innocentWord: "Dolphin", imposterWord: "Shark" },
  { id: "26", category: "Animals", innocentWord: "Penguin", imposterWord: "Polar Bear" },
  { id: "27", category: "Animals", innocentWord: "Crocodile", imposterWord: "Hippo" },
  { id: "28", category: "Animals", innocentWord: "Snake", imposterWord: "Frog" },
  { id: "29", category: "Animals", innocentWord: "Butterfly", imposterWord: "Bee" },
  { id: "30", category: "Animals", innocentWord: "Kangaroo", imposterWord: "Panda" },

  // ==================== VEHICLES ====================

  { id: "31", category: "Vehicles", innocentWord: "Airplane", imposterWord: "Helicopter" },
  { id: "32", category: "Vehicles", innocentWord: "Car", imposterWord: "Motorcycle" },
  { id: "33", category: "Vehicles", innocentWord: "Bus", imposterWord: "Train" },
  { id: "34", category: "Vehicles", innocentWord: "Taxi", imposterWord: "Rickshaw" },
  { id: "35", category: "Vehicles", innocentWord: "Bicycle", imposterWord: "Scooter" },
  { id: "36", category: "Vehicles", innocentWord: "Ship", imposterWord: "Submarine" },
  { id: "37", category: "Vehicles", innocentWord: "Speedboat", imposterWord: "Jet Ski" },
  { id: "38", category: "Vehicles", innocentWord: "Truck", imposterWord: "Jeep" },
  { id: "39", category: "Vehicles", innocentWord: "Ambulance", imposterWord: "Fire Truck" },
  { id: "40", category: "Vehicles", innocentWord: "Rocket", imposterWord: "Airplane" },
  { id: "41", category: "Vehicles", innocentWord: "Metro", imposterWord: "Tram" },
  { id: "42", category: "Vehicles", innocentWord: "Van", imposterWord: "Minibus" },
  { id: "43", category: "Vehicles", innocentWord: "Tractor", imposterWord: "Truck" },
  { id: "44", category: "Vehicles", innocentWord: "Cruise Ship", imposterWord: "Ferry" },
  { id: "45", category: "Vehicles", innocentWord: "Skateboard", imposterWord: "Bicycle" },

  // ==================== TECHNOLOGY ====================

  { id: "46", category: "Technology", innocentWord: "Laptop", imposterWord: "Smartphone" },
  { id: "47", category: "Technology", innocentWord: "Tablet", imposterWord: "Laptop" },
  { id: "48", category: "Technology", innocentWord: "Keyboard", imposterWord: "Game Controller" },
  { id: "49", category: "Technology", innocentWord: "Mouse", imposterWord: "Touchpad" },
  { id: "50", category: "Technology", innocentWord: "Television", imposterWord: "Projector" },
  { id: "51", category: "Technology", innocentWord: "Headphones", imposterWord: "Bluetooth Speaker" },
  { id: "52", category: "Technology", innocentWord: "Camera", imposterWord: "Drone" },
  { id: "53", category: "Technology", innocentWord: "Smartwatch", imposterWord: "Fitness Band" },
  { id: "54", category: "Technology", innocentWord: "Printer", imposterWord: "Scanner" },
  { id: "55", category: "Technology", innocentWord: "Router", imposterWord: "WiFi Extender" },
  { id: "56", category: "Technology", innocentWord: "PlayStation", imposterWord: "Gaming PC" },
  { id: "57", category: "Technology", innocentWord: "Microphone", imposterWord: "Webcam" },
  { id: "58", category: "Technology", innocentWord: "USB Drive", imposterWord: "Memory Card" },
  { id: "59", category: "Technology", innocentWord: "VR Headset", imposterWord: "Gaming Monitor" },
  { id: "60", category: "Technology", innocentWord: "Smart TV", imposterWord: "Laptop" },

  // ==================== SPORTS ====================

  { id: "61", category: "Sports", innocentWord: "Cricket", imposterWord: "Football" },
  { id: "62", category: "Sports", innocentWord: "Tennis", imposterWord: "Badminton" },
  { id: "63", category: "Sports", innocentWord: "Basketball", imposterWord: "Volleyball" },
  { id: "64", category: "Sports", innocentWord: "Boxing", imposterWord: "Wrestling" },
  { id: "65", category: "Sports", innocentWord: "Swimming", imposterWord: "Running" },
  { id: "66", category: "Sports", innocentWord: "Golf", imposterWord: "Cricket" },
  { id: "67", category: "Sports", innocentWord: "Hockey", imposterWord: "Football" },
  { id: "68", category: "Sports", innocentWord: "Archery", imposterWord: "Shooting" },
  { id: "69", category: "Sports", innocentWord: "Cycling", imposterWord: "Skateboarding" },
  { id: "70", category: "Sports", innocentWord: "Skiing", imposterWord: "Snowboarding" },
  { id: "71", category: "Sports", innocentWord: "Surfing", imposterWord: "Swimming" },
  { id: "72", category: "Sports", innocentWord: "Karate", imposterWord: "Judo" },
  { id: "73", category: "Sports", innocentWord: "Formula 1", imposterWord: "Rally Racing" },
  { id: "74", category: "Sports", innocentWord: "Baseball", imposterWord: "Cricket" },
  { id: "75", category: "Sports", innocentWord: "Chess", imposterWord: "Poker" },

  // ==================== PLACES ====================

  { id: "76", category: "Places", innocentWord: "Beach", imposterWord: "Mountain" },
  { id: "77", category: "Places", innocentWord: "Airport", imposterWord: "Train Station" },
  { id: "78", category: "Places", innocentWord: "Hospital", imposterWord: "Police Station" },
  { id: "79", category: "Places", innocentWord: "School", imposterWord: "College" },
  { id: "80", category: "Places", innocentWord: "Library", imposterWord: "Bookstore" },
  { id: "81", category: "Places", innocentWord: "Restaurant", imposterWord: "Cafe" },
  { id: "82", category: "Places", innocentWord: "Cinema", imposterWord: "Theater" },
  { id: "83", category: "Places", innocentWord: "Hotel", imposterWord: "Resort" },
  { id: "84", category: "Places", innocentWord: "Museum", imposterWord: "Art Gallery" },
  { id: "85", category: "Places", innocentWord: "Zoo", imposterWord: "Safari Park" },
  { id: "86", category: "Places", innocentWord: "Stadium", imposterWord: "Gym" },
  { id: "87", category: "Places", innocentWord: "Mall", imposterWord: "Supermarket" },
  { id: "88", category: "Places", innocentWord: "Temple", imposterWord: "Mosque" },
  { id: "89", category: "Places", innocentWord: "Park", imposterWord: "Garden" },
  { id: "90", category: "Places", innocentWord: "Amusement Park", imposterWord: "Water Park" },

  // ==================== PROFESSIONS ====================

  { id: "91", category: "Professions", innocentWord: "Doctor", imposterWord: "Dentist" },
  { id: "92", category: "Professions", innocentWord: "Teacher", imposterWord: "Professor" },
  { id: "93", category: "Professions", innocentWord: "Chef", imposterWord: "Waiter" },
  { id: "94", category: "Professions", innocentWord: "Pilot", imposterWord: "Astronaut" },
  { id: "95", category: "Professions", innocentWord: "Police Officer", imposterWord: "Detective" },
  { id: "96", category: "Professions", innocentWord: "Firefighter", imposterWord: "Paramedic" },
  { id: "97", category: "Professions", innocentWord: "Lawyer", imposterWord: "Journalist" },
  { id: "98", category: "Professions", innocentWord: "Programmer", imposterWord: "Game Developer" },
  { id: "99", category: "Professions", innocentWord: "Photographer", imposterWord: "Filmmaker" },
  { id: "100", category: "Professions", innocentWord: "Architect", imposterWord: "Interior Designer" },
  { id: "101", category: "Professions", innocentWord: "Farmer", imposterWord: "Gardener" },
  { id: "102", category: "Professions", innocentWord: "Mechanic", imposterWord: "Engineer" },
  { id: "103", category: "Professions", innocentWord: "Singer", imposterWord: "Actor" },
  { id: "104", category: "Professions", innocentWord: "Writer", imposterWord: "Poet" },
  { id: "105", category: "Professions", innocentWord: "Scientist", imposterWord: "Researcher" },

  // ==================== NATURE ====================

  { id: "106", category: "Nature", innocentWord: "River", imposterWord: "Lake" },
  { id: "107", category: "Nature", innocentWord: "Ocean", imposterWord: "Desert" },
  { id: "108", category: "Nature", innocentWord: "Forest", imposterWord: "Jungle" },
  { id: "109", category: "Nature", innocentWord: "Mountain", imposterWord: "Volcano" },
  { id: "110", category: "Nature", innocentWord: "Waterfall", imposterWord: "River" },
  { id: "111", category: "Nature", innocentWord: "Rain", imposterWord: "Snow" },
  { id: "112", category: "Nature", innocentWord: "Thunder", imposterWord: "Lightning" },
  { id: "113", category: "Nature", innocentWord: "Sun", imposterWord: "Moon" },
  { id: "114", category: "Nature", innocentWord: "Cloud", imposterWord: "Fog" },
  { id: "115", category: "Nature", innocentWord: "Flower", imposterWord: "Tree" },
  { id: "116", category: "Nature", innocentWord: "Cactus", imposterWord: "Palm Tree" },
  { id: "117", category: "Nature", innocentWord: "Volcano", imposterWord: "Earthquake" },
  { id: "118", category: "Nature", innocentWord: "Rainbow", imposterWord: "Sunset" },
  { id: "119", category: "Nature", innocentWord: "Cave", imposterWord: "Waterfall" },
  { id: "120", category: "Nature", innocentWord: "Island", imposterWord: "Peninsula" },

  // ==================== ENTERTAINMENT ====================

  { id: "121", category: "Entertainment", innocentWord: "Movie", imposterWord: "TV Series" },
  { id: "122", category: "Entertainment", innocentWord: "Comedy", imposterWord: "Horror" },
  { id: "123", category: "Entertainment", innocentWord: "Thriller", imposterWord: "Mystery" },
  { id: "124", category: "Entertainment", innocentWord: "Guitar", imposterWord: "Piano" },
  { id: "125", category: "Entertainment", innocentWord: "Concert", imposterWord: "Festival" },
  { id: "126", category: "Entertainment", innocentWord: "Video Game", imposterWord: "Board Game" },
  { id: "127", category: "Entertainment", innocentWord: "Chess", imposterWord: "Carrom" },
  { id: "128", category: "Entertainment", innocentWord: "Book", imposterWord: "Comic" },
  { id: "129", category: "Entertainment", innocentWord: "Magic Show", imposterWord: "Circus" },
  { id: "130", category: "Entertainment", innocentWord: "Singer", imposterWord: "Dancer" },
  { id: "131", category: "Entertainment", innocentWord: "Guitar", imposterWord: "Drums" },
  { id: "132", category: "Entertainment", innocentWord: "Podcast", imposterWord: "Radio Show" },
  { id: "133", category: "Entertainment", innocentWord: "Stand-up Comedy", imposterWord: "Theater" },
  { id: "134", category: "Entertainment", innocentWord: "Anime", imposterWord: "Cartoon" },
  { id: "135", category: "Entertainment", innocentWord: "Documentary", imposterWord: "News" },

  // ==================== HOUSEHOLD ====================

  { id: "136", category: "Household", innocentWord: "Sofa", imposterWord: "Bed" },
  { id: "137", category: "Household", innocentWord: "Table", imposterWord: "Desk" },
  { id: "138", category: "Household", innocentWord: "Chair", imposterWord: "Stool" },
  { id: "139", category: "Household", innocentWord: "Refrigerator", imposterWord: "Oven" },
  { id: "140", category: "Household", innocentWord: "Microwave", imposterWord: "Toaster" },
  { id: "141", category: "Household", innocentWord: "Fan", imposterWord: "Air Conditioner" },
  { id: "142", category: "Household", innocentWord: "Washing Machine", imposterWord: "Dishwasher" },
  { id: "143", category: "Household", innocentWord: "Mirror", imposterWord: "Window" },
  { id: "144", category: "Household", innocentWord: "Lamp", imposterWord: "Candle" },
  { id: "145", category: "Household", innocentWord: "Clock", imposterWord: "Calendar" },
  { id: "146", category: "Household", innocentWord: "Pillow", imposterWord: "Blanket" },
  { id: "147", category: "Household", innocentWord: "Broom", imposterWord: "Mop" },
  { id: "148", category: "Household", innocentWord: "Cup", imposterWord: "Bottle" },
  { id: "149", category: "Household", innocentWord: "Knife", imposterWord: "Spoon" },
  { id: "150", category: "Household", innocentWord: "Backpack", imposterWord: "Suitcase" },
];

export function getRandomWordPair(): WordPair {
  const index = Math.floor(Math.random() * WORD_PAIRS.length);
  return WORD_PAIRS[index];
}