import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Video, Upload as UploadIcon, Camera, Loader2 } from "lucide-react";
import Header from "@/components/Header";

const Upload = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [recording, setRecording] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/auth");
    }
  }, [user, navigate]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'video/webm;codecs=vp9',
      });

      mediaRecorderRef.current = mediaRecorder;
      const chunks: Blob[] = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        const file = new File([blob], 'recorded-video.webm', { type: 'video/webm' });
        setVideoFile(file);
        setVideoUrl(URL.createObjectURL(blob));
        setRecordedChunks(chunks);
      };

      mediaRecorder.start();
      setRecording(true);
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not access camera/microphone",
        variant: "destructive",
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && recording) {
      mediaRecorderRef.current.stop();
      setRecording(false);
      
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setVideoFile(file);
      setVideoUrl(URL.createObjectURL(file));
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!videoFile || !user) return;

    setUploading(true);

    try {
      // Upload video
      const videoPath = `${user.id}/${Date.now()}-${videoFile.name}`;
      const { error: uploadError } = await supabase.storage
        .from('videos')
        .upload(videoPath, videoFile);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('videos')
        .getPublicUrl(videoPath);

      // Create video record
      const { error: insertError } = await supabase
        .from('videos')
        .insert({
          user_id: user.id,
          title,
          description,
          video_url: publicUrl,
          thumbnail_url: publicUrl, // In production, generate actual thumbnail
        });

      if (insertError) throw insertError;

      toast({
        title: "Success",
        description: "Video uploaded successfully!",
      });

      navigate("/");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to upload video",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container max-w-4xl px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Upload Video</h1>
          <p className="text-muted-foreground">Share your content with the world</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="p-6 bg-card">
            <h2 className="text-xl font-semibold mb-4">Video Source</h2>
            
            <div className="space-y-4">
              <div className="aspect-video bg-secondary rounded-lg overflow-hidden flex items-center justify-center">
                {videoUrl ? (
                  <video
                    src={videoUrl}
                    controls
                    className="w-full h-full"
                  />
                ) : (
                  <video
                    ref={videoRef}
                    autoPlay
                    muted
                    className="w-full h-full"
                  />
                )}
              </div>

              <div className="flex gap-2">
                {!recording ? (
                  <>
                    <Button
                      type="button"
                      variant="gradient"
                      className="flex-1"
                      onClick={startRecording}
                      disabled={uploading}
                    >
                      <Camera className="w-4 h-4 mr-2" />
                      Record Video
                    </Button>
                    
                    <label className="flex-1">
                      <Button
                        type="button"
                        variant="secondary"
                        className="w-full"
                        disabled={uploading}
                        asChild
                      >
                        <span>
                          <UploadIcon className="w-4 h-4 mr-2" />
                          Choose File
                        </span>
                      </Button>
                      <input
                        type="file"
                        accept="video/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                  </>
                ) : (
                  <Button
                    type="button"
                    variant="destructive"
                    className="w-full"
                    onClick={stopRecording}
                  >
                    Stop Recording
                  </Button>
                )}
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-card">
            <h2 className="text-xl font-semibold mb-4">Video Details</h2>
            
            <form onSubmit={handleUpload} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter video title"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Tell viewers about your video"
                  rows={5}
                />
              </div>

              <Button
                type="submit"
                variant="gradient"
                className="w-full"
                disabled={!videoFile || uploading}
              >
                {uploading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Video className="w-4 h-4 mr-2" />
                    Publish Video
                  </>
                )}
              </Button>
            </form>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Upload;
