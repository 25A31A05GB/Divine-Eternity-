export interface MainCollection {
  id: string;
  name: string;
  slug: string;
  badge?: string;
  description: string;
  iconName: string;
  subcategories?: {
    name: string;
    slug: string;
    description: string;
    iconName?: string;
  }[];
}

export const STRICT_COLLECTIONS: MainCollection[] = [
  {
    id: 'products',
    name: 'Products',
    slug: 'products',
    description: 'Discover the world of Divine’s Eternity, where every gift is created to make your special moments more memorable.',
    iconName: 'gift',
    subcategories: [
      {
        name: 'Names on Gifts',
        slug: 'names-on-gifts',
        description: 'Make your gifts extra special with personalized names, initials, or meaningful messages.',
        iconName: 'sparkles',
      },
      {
        name: 'Personalized Jewellery',
        slug: 'personalized-jewellery',
        description: 'Create jewellery that is uniquely yours with names, initials, dates, or special details.',
        iconName: 'gem',
      },
      {
        name: 'Customize Your Caricature or Miniature',
        slug: 'customize-caricature-miniature',
        description: 'Turn your favourite memories and people into adorable customized caricatures or miniatures.',
        iconName: 'smile',
      },
      {
        name: 'Personalize Your Bouquets',
        slug: 'personalize-bouquets',
        description: 'Create beautiful bouquets with your preferred colours, pictures, names, messages, and special details.',
        iconName: 'flower',
      },
      {
        name: 'Special Hampers',
        slug: 'special-hampers',
        description: 'Thoughtfully curated hampers filled with beautiful gifts and personalized surprises for every occasion.',
        iconName: 'package',
      },
      {
        name: 'Hair Accessories',
        slug: 'hair-accessories',
        description: 'Discover cute, stylish, and elegant hair accessories perfect for everyday looks and special occasions.',
        iconName: 'heart',
      },
      {
        name: 'Paradise of Jewels',
        slug: 'paradise-of-jewels',
        description: 'Explore our collection of elegant, trendy, traditional, and everyday jewellery pieces designed to add a little sparkle to every outfit.',
        iconName: 'crown',
      },
    ],
  },
  {
    id: 'personalization',
    name: 'Personalization',
    slug: 'personalization',
    badge: 'WhatsApp Verified',
    description: 'Make your gift truly yours. Choose your preferred colour, design, theme, or other requirements while placing your order through our personalization option. We’ll check the availability and confirm your request with you through WhatsApp.',
    iconName: 'palette',
  },
  {
    id: 'collaboration',
    name: 'Collaboration',
    slug: 'collaboration',
    badge: 'Open for Creators & Brands',
    description: 'We love creating meaningful collaborations with creators, influencers, brands, and businesses. From product promotions and UGC to paid collaborations and creative campaigns, let’s work together to create content that connects.',
    iconName: 'users',
  },
  {
    id: 'upcoming-campaigns',
    name: 'Upcoming Campaigns',
    slug: 'upcoming-campaigns',
    badge: '@divineseternity',
    description: 'follow us on Instagram, Stay updated with the latest campaigns and exciting opportunities from Divine’s Eternity. Explore upcoming campaigns, participation details, creator opportunities, rewards, and everything you need to know to be a part of them.',
    iconName: 'calendar',
  },
  {
    id: 'creator-club',
    name: 'Creator Club',
    slug: 'creator-club',
    badge: 'Earn up to ₹7k',
    description: 'Welcome to the Divine’s Eternity Creator Club — a space created for aspiring and growing creators to create, learn, collaborate, and earn upto 7k. Get access to exciting brand opportunities, campaigns, guidance, creator resources, and a supportive creator community.',
    iconName: 'award',
  },
  {
    id: 'affiliate-marketing',
    name: 'Affiliate Marketing',
    slug: 'affiliate-marketing',
    badge: '15-20% Commission',
    description: 'Turn your content into an earning opportunity with Divine’s Eternity Affiliate Marketing. Share our products with your audience, promote them through your unique affiliate link or code, and earn commissions from successful sales.',
    iconName: 'trending-up',
  },
  {
    id: 'podcast',
    name: 'Podcast',
    slug: 'podcast',
    badge: 'Inspiring Stories',
    description: 'Welcome to the Divine’s Eternity Podcast — where creativity, entrepreneurship, content creation, and real-life journeys come together. Discover inspiring conversations, creator stories, business experiences, and practical insights to help you learn, grow, and dream bigger.',
    iconName: 'headphones',
  },
];

export interface PodcastEpisodeItem {
  id: string;
  title: string;
  episodeNumber: number;
  duration: string;
  guest: string;
  guestRole: string;
  category: 'Creativity' | 'Entrepreneurship' | 'Content Creation' | 'Real-Life Journeys';
  summary: string;
  keyTakeaways: string[];
  audioUrl: string;
  coverImage: string;
  publishedDate: string;
  listenCount: string;
}

export const PODCAST_EPISODES: PodcastEpisodeItem[] = [
  {
    id: 'ep-1',
    title: 'From Passion to Brand: How Storytelling Built Divine’s Eternity',
    episodeNumber: 1,
    duration: '42 min',
    guest: 'Ananya & Founders',
    guestRole: 'Creative Directors, Divine’s Eternity',
    category: 'Entrepreneurship',
    summary: 'A deep-dive into the founding days of Divine’s Eternity, how personalized gifting sparked an emotional movement, and the power of crafting timeless keepsakes that stay in people’s hearts.',
    keyTakeaways: [
      'The emotional psychology behind bespoke gifting',
      'How to scale handcrafted luxury without losing personal soul',
      'Turning WhatsApp conversations into loyal lifelong patrons',
    ],
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    coverImage: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=600&q=80',
    publishedDate: 'Oct 02, 2026',
    listenCount: '4.8k',
  },
  {
    id: 'ep-2',
    title: 'Building a Sustainable Creator Career Through Authentic UGC',
    episodeNumber: 2,
    duration: '38 min',
    guest: 'Rhea Mehra',
    guestRole: 'Lifestyle & Aesthetics Creator (180K+)',
    category: 'Content Creation',
    summary: 'Rhea shares her journey from filming with a smartphone on her bedroom table to earning consistent brand sponsorships and running high-performing UGC campaigns for aesthetic brands.',
    keyTakeaways: [
      'Why brands pay top dollar for raw, relatable storytelling',
      'The 3-second hook framework for gifting and jewelry reels',
      'How micro-creators can earn up to ₹7k+ monthly with Divine’s Creator Club',
    ],
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    coverImage: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?auto=format&fit=crop&w=600&q=80',
    publishedDate: 'Sep 24, 2026',
    listenCount: '6.2k',
  },
  {
    id: 'ep-3',
    title: 'The Art of Bespoke Jewellery & Designing Memories in Gold',
    episodeNumber: 3,
    duration: '45 min',
    guest: 'Kavita Sundaram',
    guestRole: 'Master Artisan & Jewel Sculptor',
    category: 'Creativity',
    summary: 'Explore the craftsmanship behind cursive nameplates, 18k gold plating longevity, hand-selected gemstones, and the sentimental symbolism of wearable personalized tokens.',
    keyTakeaways: [
      'Material science: anti-tarnish coating vs standard plating',
      'Translating personal love stories into tangible silhouettes',
      'Why sentimental jewellery outlasts fast-fashion accessories',
    ],
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    coverImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    publishedDate: 'Sep 15, 2026',
    listenCount: '3.9k',
  },
  {
    id: 'ep-4',
    title: 'Overcoming Creative Burnout & Dreaming Bigger as a Modern Entrepreneur',
    episodeNumber: 4,
    duration: '36 min',
    guest: 'Dr. Siddharth Roy',
    guestRole: 'Author & Creative Strategist',
    category: 'Real-Life Journeys',
    summary: 'A candid conversation on staying inspired, finding purpose in daily creation, building supportive creator communities, and maintaining joy when passion becomes work.',
    keyTakeaways: [
      'Daily rituals to protect your creative energy',
      'Community vs competition in the creator economy',
      'How to turn micro-milestones into long-term artistic breakthroughs',
    ],
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
    coverImage: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80',
    publishedDate: 'Sep 05, 2026',
    listenCount: '5.1k',
  },
];
