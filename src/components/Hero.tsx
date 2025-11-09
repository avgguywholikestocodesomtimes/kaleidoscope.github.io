import { Button } from "@/components/ui/button";
import { Play, Sparkles } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative min-h-[600px] flex items-center justify-center overflow-hidden">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-hero opacity-20 animate-pulse" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/20 via-background to-background" />
      
      {/* Content */}
      <div className="container relative z-10 text-center px-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6 animate-fade-in">
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-primary">Welcome to the Future of Video</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-hero bg-clip-text text-transparent animate-fade-in">
          Kaleidoscope
        </h1>
        
        <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto animate-fade-in">
          Discover, create, and share moments that matter. 
          Join a vibrant community of creators and viewers.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in">
          <Button variant="gradient" size="lg" className="gap-2">
            <Play className="w-5 h-5" fill="white" />
            Start Watching
          </Button>
          <Button variant="outline" size="lg" className="border-primary/30 hover:border-primary">
            Become a Creator
          </Button>
        </div>

        <div className="mt-12 grid grid-cols-3 gap-8 max-w-2xl mx-auto animate-fade-in">
          <div>
            <div className="text-3xl font-bold text-primary mb-1">10M+</div>
            <div className="text-sm text-muted-foreground">Videos</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-accent mb-1">5M+</div>
            <div className="text-sm text-muted-foreground">Creators</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-primary mb-1">100M+</div>
            <div className="text-sm text-muted-foreground">Viewers</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
