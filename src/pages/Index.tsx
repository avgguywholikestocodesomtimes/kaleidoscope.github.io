import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import CategoryNav from "@/components/CategoryNav";
import VideoCard from "@/components/VideoCard";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

interface Video {
  id: string;
  title: string;
  thumbnail_url: string;
  views: number;
  profiles: {
    username: string;
  };
}

const Index = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideos = async () => {
      const { data, error } = await supabase
        .from('videos')
        .select('id, title, thumbnail_url, views, user_id')
        .order('created_at', { ascending: false });

      if (!error && data) {
        // Fetch profiles for each video
        const videosWithProfiles = await Promise.all(
          data.map(async (video) => {
            const { data: profile } = await supabase
              .from('profiles')
              .select('username')
              .eq('id', video.user_id)
              .single();
            
            return {
              ...video,
              profiles: { username: profile?.username || 'Unknown' }
            };
          })
        );
        setVideos(videosWithProfiles);
      }
      setLoading(false);
    };

    fetchVideos();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Hero />
      <CategoryNav />
      
      <main className="container px-4 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-1">Trending Now</h2>
          <p className="text-muted-foreground">Discover what's popular today</p>
        </div>
        
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : videos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {videos.map((video) => (
              <VideoCard
                key={video.id}
                id={video.id}
                title={video.title}
                channel={video.profiles?.username || 'Unknown'}
                views={`${video.views} views`}
                duration="12:34"
                thumbnail={video.thumbnail_url}
                avatar="avatar"
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">No videos yet. Be the first to upload!</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
