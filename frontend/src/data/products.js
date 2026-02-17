// Local product dataset for recommendation engine
// 25+ items across categories: Shoes, Tech, Music, Hobby

export const products = [
  // Shoes Category (7 items)
  {
    id: 1,
    name: "Nike Air Max 270",
    category: "Shoes",
    brand: "Nike",
    price: 150,
    featureType: "Comfort",
    featureScore: 9,
    rating: 4.5,
    image: "https://via.placeholder.com/300x300?text=Nike+Air+Max"
  },
  {
    id: 2,
    name: "Adidas Ultraboost 22",
    category: "Shoes",
    brand: "Adidas",
    price: 180,
    featureType: "Performance",
    featureScore: 9.5,
    rating: 4.7,
    image: "https://via.placeholder.com/300x300?text=Adidas+Ultraboost"
  },
  {
    id: 3,
    name: "Puma RS-X3",
    category: "Shoes",
    brand: "Puma",
    price: 110,
    featureType: "Style",
    featureScore: 8,
    rating: 4.2,
    image: "https://via.placeholder.com/300x300?text=Puma+RS-X3"
  },
  {
    id: 4,
    name: "New Balance 990v5",
    category: "Shoes",
    brand: "New Balance",
    price: 175,
    featureType: "Durability",
    featureScore: 9,
    rating: 4.6,
    image: "https://via.placeholder.com/300x300?text=New+Balance+990"
  },
  {
    id: 5,
    name: "Reebok Classic Leather",
    category: "Shoes",
    brand: "Reebok",
    price: 75,
    featureType: "Style",
    featureScore: 7,
    rating: 4.0,
    image: "https://via.placeholder.com/300x300?text=Reebok+Classic"
  },
  {
    id: 6,
    name: "Under Armour HOVR Phantom",
    category: "Shoes",
    brand: "Under Armour",
    price: 140,
    featureType: "Performance",
    featureScore: 8.5,
    rating: 4.4,
    image: "https://via.placeholder.com/300x300?text=UA+HOVR"
  },
  {
    id: 7,
    name: "Converse Chuck Taylor All Star",
    category: "Shoes",
    brand: "Converse",
    price: 60,
    featureType: "Style",
    featureScore: 7.5,
    rating: 4.3,
    image: "https://via.placeholder.com/300x300?text=Converse+Chuck"
  },

  // Tech Category (8 items)
  {
    id: 8,
    name: "Apple AirPods Pro",
    category: "Tech",
    brand: "Apple",
    price: 249,
    featureType: "Sound Quality",
    featureScore: 9,
    rating: 4.6,
    image: "https://via.placeholder.com/300x300?text=AirPods+Pro"
  },
  {
    id: 9,
    name: "Samsung Galaxy Buds 2",
    category: "Tech",
    brand: "Samsung",
    price: 149,
    featureType: "Sound Quality",
    featureScore: 8,
    rating: 4.4,
    image: "https://via.placeholder.com/300x300?text=Galaxy+Buds+2"
  },
  {
    id: 10,
    name: "Sony WH-1000XM5",
    category: "Tech",
    brand: "Sony",
    price: 399,
    featureType: "Noise Cancellation",
    featureScore: 10,
    rating: 4.8,
    image: "https://via.placeholder.com/300x300?text=Sony+WH-1000XM5"
  },
  {
    id: 11,
    name: "Logitech MX Master 3S",
    category: "Tech",
    brand: "Logitech",
    price: 99,
    featureType: "Productivity",
    featureScore: 9,
    rating: 4.7,
    image: "https://via.placeholder.com/300x300?text=MX+Master+3S"
  },
  {
    id: 12,
    name: "Anker PowerCore 20K",
    category: "Tech",
    brand: "Anker",
    price: 45,
    featureType: "Battery Life",
    featureScore: 8.5,
    rating: 4.5,
    image: "https://via.placeholder.com/300x300?text=Anker+PowerCore"
  },
  {
    id: 13,
    name: "JBL Flip 6",
    category: "Tech",
    brand: "JBL",
    price: 129,
    featureType: "Portability",
    featureScore: 8,
    rating: 4.6,
    image: "https://via.placeholder.com/300x300?text=JBL+Flip+6"
  },
  {
    id: 14,
    name: "Razer DeathAdder V3",
    category: "Tech",
    brand: "Razer",
    price: 69,
    featureType: "Gaming",
    featureScore: 9,
    rating: 4.5,
    image: "https://via.placeholder.com/300x300?text=Razer+DeathAdder"
  },
  {
    id: 15,
    name: "Google Nest Hub",
    category: "Tech",
    brand: "Google",
    price: 99,
    featureType: "Smart Home",
    featureScore: 7.5,
    rating: 4.3,
    image: "https://via.placeholder.com/300x300?text=Nest+Hub"
  },

  // Music Category (5 items)
  {
    id: 16,
    name: "Fender Stratocaster",
    category: "Music",
    brand: "Fender",
    price: 799,
    featureType: "Professional",
    featureScore: 9.5,
    rating: 4.8,
    image: "https://via.placeholder.com/300x300?text=Fender+Strat"
  },
  {
    id: 17,
    name: "Yamaha P-125 Digital Piano",
    category: "Music",
    brand: "Yamaha",
    price: 649,
    featureType: "Beginner Friendly",
    featureScore: 8.5,
    rating: 4.6,
    image: "https://via.placeholder.com/300x300?text=Yamaha+P-125"
  },
  {
    id: 18,
    name: "Roland TD-17KV Drum Kit",
    category: "Music",
    brand: "Roland",
    price: 1599,
    featureType: "Professional",
    featureScore: 9,
    rating: 4.7,
    image: "https://via.placeholder.com/300x300?text=Roland+TD-17KV"
  },
  {
    id: 19,
    name: "Audio-Technica AT2020",
    category: "Music",
    brand: "Audio-Technica",
    price: 99,
    featureType: "Recording",
    featureScore: 8,
    rating: 4.5,
    image: "https://via.placeholder.com/300x300?text=AT2020+Mic"
  },
  {
    id: 20,
    name: "Korg Minilogue XD",
    category: "Music",
    brand: "Korg",
    price: 649,
    featureType: "Creative",
    featureScore: 9,
    rating: 4.6,
    image: "https://via.placeholder.com/300x300?text=Korg+Minilogue"
  },

  // Hobby Category (6 items)
  {
    id: 21,
    name: "DJI Mini 3 Pro Drone",
    category: "Hobby",
    brand: "DJI",
    price: 759,
    featureType: "Photography",
    featureScore: 9.5,
    rating: 4.8,
    image: "https://via.placeholder.com/300x300?text=DJI+Mini+3"
  },
  {
    id: 22,
    name: "GoPro Hero 11 Black",
    category: "Hobby",
    brand: "GoPro",
    price: 499,
    featureType: "Adventure",
    featureScore: 9,
    rating: 4.7,
    image: "https://via.placeholder.com/300x300?text=GoPro+Hero+11"
  },
  {
    id: 23,
    name: "Wacom Intuos Pro Tablet",
    category: "Hobby",
    brand: "Wacom",
    price: 379,
    featureType: "Digital Art",
    featureScore: 9,
    rating: 4.6,
    image: "https://via.placeholder.com/300x300?text=Wacom+Intuos"
  },
  {
    id: 24,
    name: "LEGO Technic Bugatti",
    category: "Hobby",
    brand: "LEGO",
    price: 349,
    featureType: "Building",
    featureScore: 8.5,
    rating: 4.9,
    image: "https://via.placeholder.com/300x300?text=LEGO+Bugatti"
  },
  {
    id: 25,
    name: "Tamiya RC Car Kit",
    category: "Hobby",
    brand: "Tamiya",
    price: 189,
    featureType: "RC Racing",
    featureScore: 8,
    rating: 4.5,
    image: "https://via.placeholder.com/300x300?text=Tamiya+RC"
  },
  {
    id: 26,
    name: "Celestron NexStar Telescope",
    category: "Hobby",
    brand: "Celestron",
    price: 899,
    featureType: "Astronomy",
    featureScore: 9,
    rating: 4.7,
    image: "https://via.placeholder.com/300x300?text=Celestron+Telescope"
  }
];

export default products;
