import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import VideoCard from "@/components/VideoCard";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ThumbsUp, ThumbsDown, Share2, Eye, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface Video {
  id: string;
  title: string;
  description: string;
  video_url: string;
  thumbnail_url: string;
  views: number;
  created_at: string;
  user_id: string;
  profiles: {
    username: string;
    avatar_url: string;
  };
}

const Watch = () => {
  const { id } = useParams();
  const [video, setVideo] = useState<Video | null>(null);
  const [relatedVideos, setRelatedVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchVideo = async () => {
      if (!id) return;

      try {
        const { data: videoData, error } = await supabase
          .from('videos')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;

        // Fetch profile separately
        const { data: profile } = await supabase
          .from('profiles')
          .select('username, avatar_url')
          .eq('id', videoData.user_id)
          .single();

        setVideo({
          ...videoData,
          profiles: profile || { username: 'Unknown', avatar_url: '' }
        });

        // Increment view count
        await supabase
          .from('videos')
          .update({ views: (videoData.views || 0) + 1 })
          .eq('id', id);

        // Fetch related videos
        const { data: related } = await supabase
          .from('videos')
          .select('id, title, thumbnail_url, views, user_id')
          .neq('id', id)
          .limit(8);

        if (related) {
          const relatedWithProfiles = await Promise.all(
            related.map(async (vid) => {
              const { data: vidProfile } = await supabase
                .from('profiles')
                .select('username')
                .eq('id', vid.user_id)
                .single();
              
              return {
                ...vid,
                profiles: { username: vidProfile?.username || 'Unknown' }
              };
            })
          );
          setRelatedVideos(relatedWithProfiles);
        }
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message || "Failed to load video",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchVideo();
  }, [id, toast]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Link copied!",
      description: "Video link copied to clipboard",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (!video) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container px-4 py-8">
          <p className="text-center text-muted-foreground">Video not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container px-4 py-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
          <div className="space-y-4">
            <div className="aspect-video bg-black rounded-lg overflow-hidden">
              <video
                src={video.video_url}
                controls
                autoPlay
                className="w-full h-full"
              />
            </div>

            <div>
              <h1 className="text-2xl font-bold mb-2">{video.title}</h1>
              
              <div className="flex items-center justify-between flex-wrap gap-4 mb-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-gradient-primary" />
                    <div>
                      <p className="font-semibold">{video.profiles?.username}</p>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        {video.views} views
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button variant="secondary" size="sm">
                    <ThumbsUp className="w-4 h-4" />
                  </Button>
                  <Button variant="secondary" size="sm">
                    <ThumbsDown className="w-4 h-4" />
                  </Button>
                  <Button variant="secondary" size="sm" onClick={handleShare}>
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                </div>
              </div>

              <Card className="p-4 bg-secondary">
                <p className="text-sm whitespace-pre-wrap">{video.description}</p>
              </Card>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Related Videos</h2>
            <div className="space-y-4">
              {relatedVideos.map((vid) => (
                <div key={vid.id} className="cursor-pointer" onClick={() => window.location.href = `/watch/${vid.id}`}>
                  <VideoCard
                    title={vid.title}
                    channel={vid.profiles?.username || 'Unknown'}
                    views={`${vid.views} views`}
                    duration="12:34"
                    thumbnail={vid.thumbnail_url}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Watch;
