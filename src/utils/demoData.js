import { v4 as uuidv4 } from 'uuid';

// Set dates (start date is 30 days from now)
const today = new Date();
const startDate = new Date();
startDate.setDate(today.getDate() + 30);

const endDate = new Date(startDate);
endDate.setDate(startDate.getDate() + 7);

// Format dates to ISO string (YYYY-MM-DD)
const formatDate = (date) => {
    return date.toISOString().split('T')[0];
};

// Demo trip data
export const demoTrip = {
    destination: "Tokyo, Japan",
    startDate: formatDate(startDate),
    endDate: formatDate(endDate),
    itinerary: [
        {
            day: 1,
            date: formatDate(startDate),
            dayName: "Day 1 - Arrival",
            activities: [
                {
                    id: uuidv4(),
                    time: "14:00",
                    title: "Arrive at Narita Airport",
                    description: "Flight JL123",
                    type: "travel",
                    location: "Narita International Airport",
                    notes: "Terminal 2, Pickup luggage at Carousel 4"
                },
                {
                    id: uuidv4(),
                    time: "16:30",
                    title: "Check-in at Hotel",
                    description: "Hotel Sunroute Plaza Shinjuku",
                    type: "accommodation",
                    location: "Shinjuku",
                    notes: "Reservation confirmation: #12345ABC"
                },
                {
                    id: uuidv4(),
                    time: "19:00",
                    title: "Dinner at Ichiran Ramen",
                    description: "Famous tonkotsu ramen chain",
                    type: "food",
                    location: "Shinjuku",
                    notes: "Often has a wait, but moves quickly"
                }
            ]
        },
        {
            day: 2,
            date: (() => {
                const day2 = new Date(startDate);
                day2.setDate(startDate.getDate() + 1);
                return formatDate(day2);
            })(),
            dayName: "Day 2 - Explore Tokyo",
            activities: [
                {
                    id: uuidv4(),
                    time: "09:00",
                    title: "Visit Meiji Shrine",
                    description: "Beautiful shrine in a forest setting",
                    type: "sightseeing",
                    location: "Shibuya",
                    notes: "Early morning to avoid crowds"
                },
                {
                    id: uuidv4(),
                    time: "12:00",
                    title: "Lunch at Harajuku",
                    description: "Street food exploration",
                    type: "food",
                    location: "Harajuku",
                    notes: "Try the crepes!"
                },
                {
                    id: uuidv4(),
                    time: "14:00",
                    title: "Shop at Takeshita Street",
                    description: "Famous shopping street",
                    type: "shopping",
                    location: "Harajuku",
                    notes: "Crowded but fun atmosphere"
                },
                {
                    id: uuidv4(),
                    time: "18:00",
                    title: "Shibuya Crossing & Dinner",
                    description: "World's busiest pedestrian crossing",
                    type: "sightseeing",
                    location: "Shibuya",
                    notes: "Great photo opportunity"
                }
            ]
        },
        {
            day: 3,
            date: (() => {
                const day3 = new Date(startDate);
                day3.setDate(startDate.getDate() + 2);
                return formatDate(day3);
            })(),
            dayName: "Day 3 - Traditional Tokyo",
            activities: [
                {
                    id: uuidv4(),
                    time: "08:30",
                    title: "Tsukiji Outer Market",
                    description: "Famous fish market and food stalls",
                    type: "food",
                    location: "Tsukiji",
                    notes: "Best for breakfast/brunch seafood"
                },
                {
                    id: uuidv4(),
                    time: "11:30",
                    title: "Asakusa & Senso-ji Temple",
                    description: "Tokyo's oldest temple",
                    type: "sightseeing",
                    location: "Asakusa",
                    notes: "Shop for souvenirs on Nakamise Street"
                },
                {
                    id: uuidv4(),
                    time: "15:00",
                    title: "Tokyo Skytree",
                    description: "Tallest tower in Japan",
                    type: "sightseeing",
                    location: "Sumida",
                    notes: "Buy tickets in advance to avoid lines"
                },
                {
                    id: uuidv4(),
                    time: "19:00",
                    title: "Dinner at Gonpachi",
                    description: "Inspiration for Kill Bill restaurant",
                    type: "food",
                    location: "Roppongi",
                    notes: "Reservation recommended"
                }
            ]
        }
    ],
    packingList: [
        {
            id: uuidv4(),
            name: "Passport",
            category: "essentials",
            packed: false,
            priority: "high"
        },
        {
            id: uuidv4(),
            name: "Flight Tickets",
            category: "essentials",
            packed: false,
            priority: "high"
        },
        {
            id: uuidv4(),
            name: "Travel Insurance",
            category: "essentials",
            packed: false,
            priority: "high"
        },
        {
            id: uuidv4(),
            name: "Japan Rail Pass",
            category: "essentials",
            packed: false,
            priority: "high"
        },
        {
            id: uuidv4(),
            name: "Credit Cards",
            category: "essentials",
            packed: false,
            priority: "high"
        },
        {
            id: uuidv4(),
            name: "Cash (Yen)",
            category: "essentials",
            packed: false,
            priority: "high"
        },
        {
            id: uuidv4(),
            name: "Power Adapter",
            category: "electronics",
            packed: false,
            priority: "medium"
        },
        {
            id: uuidv4(),
            name: "Phone Charger",
            category: "electronics",
            packed: false,
            priority: "high"
        },
        {
            id: uuidv4(),
            name: "Camera",
            category: "electronics",
            packed: false,
            priority: "medium"
        },
        {
            id: uuidv4(),
            name: "Portable Power Bank",
            category: "electronics",
            packed: false,
            priority: "medium"
        },
        {
            id: uuidv4(),
            name: "T-Shirts (5)",
            category: "clothing",
            packed: false,
            priority: "medium"
        },
        {
            id: uuidv4(),
            name: "Pants/Jeans (3)",
            category: "clothing",
            packed: false,
            priority: "medium"
        },
        {
            id: uuidv4(),
            name: "Underwear (7)",
            category: "clothing",
            packed: false,
            priority: "high"
        },
        {
            id: uuidv4(),
            name: "Socks (7)",
            category: "clothing",
            packed: false,
            priority: "high"
        },
        {
            id: uuidv4(),
            name: "Walking Shoes",
            category: "clothing",
            packed: false,
            priority: "high"
        },
        {
            id: uuidv4(),
            name: "Light Jacket",
            category: "clothing",
            packed: false,
            priority: "medium"
        },
        {
            id: uuidv4(),
            name: "Toothbrush & Toothpaste",
            category: "toiletries",
            packed: false,
            priority: "high"
        },
        {
            id: uuidv4(),
            name: "Deodorant",
            category: "toiletries",
            packed: false,
            priority: "high"
        },
        {
            id: uuidv4(),
            name: "Shampoo & Conditioner",
            category: "toiletries",
            packed: false,
            priority: "medium"
        },
        {
            id: uuidv4(),
            name: "Travel First Aid Kit",
            category: "health",
            packed: false,
            priority: "medium"
        },
        {
            id: uuidv4(),
            name: "Medications",
            category: "health",
            packed: false,
            priority: "high"
        },
        {
            id: uuidv4(),
            name: "Hand Sanitizer",
            category: "health",
            packed: false,
            priority: "medium"
        },
        {
            id: uuidv4(),
            name: "Face Masks",
            category: "health",
            packed: false,
            priority: "medium"
        },
        {
            id: uuidv4(),
            name: "Travel Pillow",
            category: "comfort",
            packed: false,
            priority: "low"
        },
        {
            id: uuidv4(),
            name: "Eye Mask",
            category: "comfort",
            packed: false,
            priority: "low"
        },
        {
            id: uuidv4(),
            name: "Ear Plugs",
            category: "comfort",
            packed: false,
            priority: "low"
        }
    ]
};