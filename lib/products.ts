export interface ProductVolume {
  label: string;
  price: number;
  originalPrice?: number;
}

export interface Product {
  slug: string;
  name: string;
  tagline: string;
  category: string;
  image: string;
  volumes: ProductVolume[];
  description: string;
  ingredients: string;
  howToEnjoy: string;
  storage: string;
  bestBefore: string;
  deliveryDetails: string;
  tags?: string[];
}

export const products: Product[] = [
  {
    slug: "gourmet-brown-butter-cookies",
    name: "Gourmet Brown Butter Cookies",
    tagline: "Crisp edges. Soft centre. Worth every bite.",
    category: "Cookies",
    image: "/images/cookie-01.png",
    volumes: [
      { label: "Pack of 4", price: 299, originalPrice: 349 },
      { label: "Pack of 8", price: 549, originalPrice: 649 },
    ],
    description:
      "These cookies begin with patience. We slowly brown the butter until it turns nutty, aromatic, and golden, then fold it into a dough that's crisp on the edges, soft at the centre filled with a mix of organically sourced dark & milk chocolate. Each bite tastes like warmth, nostalgia, and a quiet luxury you didn't know you needed. This is not a \"guilt-free\" cookie. It's a worth-it cookie.",
    ingredients:
      "Browned butter, organic flour, raw sugar & jaggery, eggs, natural vanilla, baking soda, Himalayan salt",
    howToEnjoy:
      "Perfect with black coffee, cup of cold milk, evening tea, or eaten straight from the jar while standing in your kitchen.",
    storage: "Store in an airtight container at room temperature.",
    bestBefore: "7 days from date of manufacture",
    deliveryDetails:
      "We deliver on Wednesdays and Sundays. Orders placed before 8 PM the previous day will be delivered on the next delivery day.",
    tags: ["Bestseller"],
  },
  {
    slug: "strawberry-cheesecake-jar",
    name: "Strawberry Cheesecake Jar",
    tagline: "Gentle indulgence in every spoon.",
    category: "Dessert Jars · V/GF",
    image: "/images/strawberry-cheesecake-jar-05.png",
    volumes: [
      { label: "Pack of 4", price: 399, originalPrice: 449 },
      { label: "Pack of 8", price: 749, originalPrice: 849 },
    ],
    description:
      "A soft, creamy cheesecake layered with real strawberries, no artificial flavours, no loud sweetness, just gentle indulgence. This jar is for slow spoons, quiet afternoons, and moments when you want dessert that feels comforting and intentional. Made in small batches, just like it should be.",
    ingredients:
      "Fermented cashew cream, Greek yogurt, fresh strawberries, raw honey, coconut oil, gluten free blend, vanilla extract, lemon",
    howToEnjoy: "Best enjoyed chilled. Take a moment. Eat slowly. Let it melt.",
    storage: "Refrigerate at all times.",
    bestBefore: "3 days from date of manufacture",
    deliveryDetails:
      "We deliver on Wednesdays and Sundays. Orders placed before 8 PM the previous day will be delivered on the next delivery day. Perishable — handle with care.",
    tags: ["Bestseller"],
  },
  {
    slug: "strawberry-dipped-chocolate",
    name: "Strawberry-Dipped Chocolate",
    tagline: "Playful, romantic, and just indulgent enough.",
    category: "Chocolates · V/GF",
    image: "/images/chocolate-dipped-strawberries.png",
    volumes: [
      { label: "Pack of 4", price: 349, originalPrice: 399 },
      { label: "Pack of 8", price: 649, originalPrice: 749 },
    ],
    description:
      "Juicy strawberries kissed by rich, dark chocolate — simple, sensual, and wildly satisfying. This is what happens when fruit and cacao meet without interference. A treat that feels playful, romantic, and just indulgent enough.",
    ingredients:
      "Fresh strawberries, high-quality dark chocolate, coconut butter",
    howToEnjoy: "Eat fresh. Share if you must. Best enjoyed the same day.",
    storage: "Refrigerate and consume within 24–72 hours.",
    bestBefore: "3 days from preparation",
    deliveryDetails:
      "We deliver on Wednesdays and Sundays. Perishable item — delivered in insulated packaging. Please refrigerate immediately upon receipt.",
    tags: ["Fresh"],
  },
  {
    slug: "moringa-dust",
    name: "Moringa Dust",
    tagline: "Slow, intentional, and alive.",
    category: "Podi · Condiments",
    image: "/images/moringa_podi-02.png",
    volumes: [
      { label: "Pack of 4", price: 249, originalPrice: 299 },
      { label: "Pack of 8", price: 449, originalPrice: 549 },
    ],
    description:
      "This is moringa the way it was meant to be — slow, intentional, and alive. Our moringa podi is hand-pounded, not machine-blasted, preserving the leaf's natural oils, aroma, and prana. The result is a deeply green, earthy condiment that supports digestion, liver health, skin clarity, and daily vitality. Made the ancestral way, because some things can't be rushed — especially nourishment.",
    ingredients:
      "Sun-dried moringa leaves, roasted chana dal, dried curry leaves, cumin seeds, black pepper, Himalayan salt, cold-pressed coconut oil. No seed oils. No fillers.",
    howToEnjoy:
      "Sprinkle over rice with ghee, add it to your dosa or idlis. Mix into yoghurt or curd with vegetables. Add to your pasta or pizza as a seasoning. Our favourite: Add it on lightly toasted sourdough with a drizzle of coconut oil & a heaped spoon of Moringa dust.",
    storage:
      "Store in a cool, dry place in an airtight container. Avoid moisture.",
    bestBefore: "4 months from date of preparation",
    deliveryDetails:
      "We deliver on Wednesdays and Sundays. Non-perishable item — ships in sealed packaging.",
    tags: ["Ancestral"],
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}
