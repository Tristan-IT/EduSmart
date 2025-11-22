import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PlayCircle, ExternalLink, Youtube, Clock, Eye } from "lucide-react";
import { fadeIn, scaleIn } from "@/lib/animations";

interface VideoPlayerProps {
  title: string;
  description?: string;
  youtubeUrl: string;
  duration?: string;
  views?: string;
  category?: string;
  autoplay?: boolean;
  className?: string;
}

export const VideoPlayer = ({
  title,
  description,
  youtubeUrl,
  duration,
  views,
  category,
  autoplay = false,
  className = ""
}: VideoPlayerProps) => {
  const [isEmbedded, setIsEmbedded] = useState(autoplay);

  // Extract YouTube video ID from URL
  const getYouTubeId = (url: string): string | null => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const videoId = getYouTubeId(youtubeUrl);
  const embedUrl = videoId 
    ? `https://www.youtube.com/embed/${videoId}${autoplay ? '?autoplay=1' : ''}`
    : null;

  if (!embedUrl) {
    return (
      <Card className={`border-red-200 ${className}`}>
        <CardContent className="p-6 text-center">
          <p className="text-red-500">URL YouTube tidak valid</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      variants={fadeIn}
      initial="initial"
      animate="animate"
      className={className}
    >
      <Card className="overflow-hidden border-2 hover:shadow-xl transition-shadow">
        <CardHeader className="bg-gradient-to-r from-red-500/10 to-pink-500/10 border-b">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Youtube className="w-5 h-5 text-red-500" />
                {category && (
                  <Badge variant="outline" className="bg-red-50">
                    {category}
                  </Badge>
                )}
              </div>
              <CardTitle className="text-xl mb-1">{title}</CardTitle>
              {description && (
                <CardDescription className="text-sm">{description}</CardDescription>
              )}
            </div>
          </div>

          {(duration || views) && (
            <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
              {duration && (
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{duration}</span>
                </div>
              )}
              {views && (
                <div className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  <span>{views} views</span>
                </div>
              )}
            </div>
          )}
        </CardHeader>

        <CardContent className="p-0">
          {isEmbedded ? (
            <motion.div
              variants={scaleIn}
              initial="initial"
              animate="animate"
              className="relative w-full"
              style={{ paddingBottom: '56.25%' }} // 16:9 aspect ratio
            >
              <iframe
                className="absolute top-0 left-0 w-full h-full"
                src={embedUrl}
                title={title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </motion.div>
          ) : (
            <div 
              className="relative w-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center cursor-pointer group"
              style={{ paddingBottom: '56.25%' }}
              onClick={() => setIsEmbedded(true)}
            >
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative"
                >
                  <div className="absolute inset-0 bg-red-500/20 blur-xl rounded-full" />
                  <div className="relative bg-red-500 rounded-full p-6 shadow-2xl group-hover:bg-red-600 transition-colors">
                    <PlayCircle className="w-16 h-16 text-white" />
                  </div>
                </motion.div>
                <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                  Klik untuk Mulai Video
                </p>
              </div>
            </div>
          )}
        </CardContent>

        <div className="p-4 border-t bg-muted/30">
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() => setIsEmbedded(!isEmbedded)}
            >
              <PlayCircle className="w-4 h-4 mr-2" />
              {isEmbedded ? "Sembunyikan Video" : "Tampilkan Video"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() => window.open(youtubeUrl, '_blank')}
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Buka di YouTube
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};
