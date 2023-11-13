import { GroupTypes } from "../types/groups";

export const RECOMMENDED_GROUPS: GroupTypes[] = [
  {
    id: 1,
    name: "Navy",
    location: "Springfield",
    description:
      "Join our vibrant community of Navy wives! We're all about jogging, cooking, and outdoor fun. Connect with us and thrive together!",
    isOnline: true,
    tags: [
      { name: "Jogging", colour: "red" },
      { name: "Tennis", colour: "red" },
      { name: "Cooking", colour: "green" },
    ],
    background:
      "https://www.worldatlas.com/r/w1200-q80/upload/27/56/59/shutterstock-1507067762.jpg",
  },
  {
    id: 2,
    name: "Marine Corps",
    location: "Kansas City",
    tags: [
      { name: "Football", colour: "red" },
      { name: "Reading", colour: "green" },
    ],
    description:
      "Calling all Kansas City Marine Corps wives! Dive into our community of football enthusiasts and bookworms. Join us for meaningful connections and shared interests!",
    isOnline: true,
    background:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/Downtown_-_panoramio_%2815%29.jpg/1200px-Downtown_-_panoramio_%2815%29.jpg",
  },
  {
    id: 3,
    name: "Baptist",
    location: "St. Louis",
    tags: [
      { name: "Hiking", colour: "red" },
      { name: "Painting", colour: "green" },
    ],
    isOnline: false,
    description:
      "Kansas City Baptist wives, unite! Explore our world of hiking and painting enthusiasts. Connect, create, and embrace shared passions with us!",
    background:
      "https://www.visittheusa.com/sites/default/files/styles/hero_l/public/images/hero_media_image/2017-02/0%20HERO_StLouis%20-%20shutterstock_166920155_Web72DPI_crop.jpg?h=58765dd8&itok=OgvAlZjy",
  },
  {
    id: 4,
    name: "Marine Corps",
    location: "Midwest",
    tags: [
      { name: "Hiking", colour: "red" },
      { name: "Painting", colour: "green" },
      { name: "Gaming", colour: "green" },
      { name: "Reading", colour: "green" },
    ],
    description:
      "Midwest Marine Corps spouses, discover the great outdoors with our hiking and painting enthusiasts. Join us for gaming and book club fun!",
    isOnline: false,
    background:
      "https://i0.wp.com/images-prod.healthline.com/hlcmsresource/images/topic_centers/2019-8/couple-hiking-mountain-climbing-1296x728-header.jpg?w=1155&h=1528",
  },
  {
    id: 5,
    name: "Navy",
    location: "West Coast",
    tags: [
      { name: "Cooking", colour: "green" },
      { name: "Travel", colour: "green" },
    ],
    description:
      "West Coast Navy spouses, come together with our diverse community! From cooking to travel, we're here to connect and share our passions.",
    isOnline: true,
    background:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/US_Pacific_States.svg/1200px-US_Pacific_States.svg.png",
  },
];
