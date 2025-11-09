import { Play, Eye, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";

interface VideoCardProps {
  id?: string;
  title: string;
  channel: string;
  views: string;
  duration: string;
  thumbnail: string;
  avatar?: string;
}

const VideoCard = ({ id, title, channel, views, duration, thumbnail, avatar }: VideoCardProps) => {
  const content = (
    <Card className="group overflow-hidden bg-card border-border hover:border-primary/50 transition-all duration-300 hover:shadow-card cursor-pointer">
      <div className="relative aspect-video overflow-hidden bg-secondary">
        <img 
          src={thumbnail} 
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-primary/90 flex items-center justify-center transform scale-75 group-hover:scale-100 transition-transform duration-300">
            <Play className="w-8 h-8 text-white ml-1" fill="white" />
          </div>
        </div>
        <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {duration}
        </div>
      </div>
      
      <div className="p-3">
        <div className="flex gap-3">
          {avatar && (
            <div className="w-9 h-9 rounded-full bg-gradient-primary flex-shrink-0" />
          )}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm line-clamp-2 mb-1 group-hover:text-primary transition-colors">
              {title}
            </h3>
            <p className="text-xs text-muted-foreground mb-1">{channel}</p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Eye className="w-3 h-3" />
                {views}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );

  if (id) {
    return <Link to={`/watch/${id}`}>{content}</Link>;
  }

  return content;
};

export default VideoCard;
