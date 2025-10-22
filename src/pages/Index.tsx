import { useState, useRef } from "react";
import { ImageUploader } from "@/components/ImageUploader";
import { ImageEditor } from "@/components/ImageEditor";
import { Controls } from "@/components/Controls";
import { Sparkles } from "lucide-react";
import { toast } from "sonner";
import frame from "@/assets/frame.png";

const Index = () => {
  const [userImage, setUserImage] = useState<string | null>(null);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleReset = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
    toast.success("Position and zoom reset!");
  };

  const handleDownload = () => {
    if (!canvasRef.current) return;

    canvasRef.current.toBlob((blob) => {
      if (!blob) return;
      
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.download = "twibbon-result.png";
      link.href = url;
      link.click();
      URL.revokeObjectURL(url);
      
      toast.success("Image downloaded successfully!");
    }, "image/png");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Twibbon with BYI
              </h1>
              <p className="text-sm text-muted-foreground">
                Mari rayakan bersama Berkah Sahabat Yatim
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Controls */}
          <div className="space-y-8">
            <ImageUploader
              onImageUpload={setUserImage}
              hasImage={!!userImage}
            />

            <Controls
              scale={scale}
              onScaleChange={setScale}
              onReset={handleReset}
              onDownload={handleDownload}
              canDownload={!!userImage}
            />
          </div>

          {/* Right Column - Editor */}
          <div className="lg:sticky lg:top-24 h-fit">
            <ImageEditor
              userImage={userImage}
              frameImage={frame}
              scale={scale}
              position={position}
              onPositionChange={setPosition}
              canvasRef={canvasRef}
            />
          </div>
        </div>
      </main>

      {/* Hidden canvas for export */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default Index;
