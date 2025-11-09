export interface Video {
  id: string;
  title: string;
  channel: string;
  views: string;
  duration: string;
  thumbnail: string;
  avatar?: string;
}

export const mockVideos: Video[] = [
  {
    id: "1",
    title: "Building a Modern React Application with TypeScript and Tailwind CSS",
    channel: "Tech Tutorials",
    views: "1.2M views",
    duration: "15:42",
    thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80",
    avatar: "avatar1"
  },
  {
    id: "2",
    title: "Epic Mountain Bike Trail Ride - Breathtaking Views",
    channel: "Adventure Time",
    views: "856K views",
    duration: "12:18",
    thumbnail: "https://images.unsplash.com/photo-1511994477422-b69e44ed43b5?w=800&q=80",
    avatar: "avatar2"
  },
  {
    id: "3",
    title: "Jazz Piano Improvisation - Late Night Session",
    channel: "Music Studio",
    views: "542K views",
    duration: "8:30",
    thumbnail: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800&q=80",
    avatar: "avatar3"
  },
  {
    id: "4",
    title: "Understanding Machine Learning in 10 Minutes",
    channel: "AI Explained",
    views: "2.1M views",
    duration: "10:05",
    thumbnail: "https://images.unsplash.com/photo-1555255707-c07966088b7b?w=800&q=80",
    avatar: "avatar4"
  },
  {
    id: "5",
    title: "Street Food Tour - Tokyo's Hidden Gems",
    channel: "Food Explorer",
    views: "678K views",
    duration: "18:22",
    thumbnail: "https://images.unsplash.com/photo-1554998171-706f21465ad0?w=800&q=80",
    avatar: "avatar5"
  },
  {
    id: "6",
    title: "Abstract Art Time-lapse - Creating Chaos and Order",
    channel: "Art Studio",
    views: "234K views",
    duration: "6:45",
    thumbnail: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800&q=80",
    avatar: "avatar6"
  },
  {
    id: "7",
    title: "Space Documentary - Journey Through the Cosmos",
    channel: "Science Channel",
    views: "3.4M views",
    duration: "42:15",
    thumbnail: "https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=800&q=80",
    avatar: "avatar7"
  },
  {
    id: "8",
    title: "Fashion Week 2024 - Behind the Scenes",
    channel: "Style Magazine",
    views: "921K views",
    duration: "14:33",
    thumbnail: "https://images.unsplash.com/photo-1558769132-cb1aea1f782b?w=800&q=80",
    avatar: "avatar8"
  }
];
