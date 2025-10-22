import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";

interface ImageEditorProps {
  userImage: string | null;
  frameImage: string | null;
  scale: number;
  position: { x: number; y: number };
  onPositionChange: (position: { x: number; y: number }) => void;
  canvasRef: React.RefObject<HTMLCanvasElement>;
}

export const ImageEditor = ({
  userImage,
  frameImage,
  scale,
  position,
  onPositionChange,
  canvasRef,
}: ImageEditorProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!canvasRef.current || !userImage || !frameImage) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = 1080;
    canvas.height = 1350;

    const userImg = new Image();
    const frameImg = new Image();
    let loadedImages = 0;

    const drawCanvas = () => {
      loadedImages++;
      if (loadedImages < 2) return;

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw user image with scale and position
      const imgWidth = userImg.width * scale;
      const imgHeight = userImg.height * scale;
      ctx.drawImage(
        userImg,
        position.x,
        position.y,
        imgWidth,
        imgHeight
      );

      // Draw frame on top
      ctx.drawImage(frameImg, 0, 0, canvas.width, canvas.height);
    };

    userImg.onload = drawCanvas;
    frameImg.onload = drawCanvas;
    userImg.src = userImage;
    frameImg.src = frameImage;
  }, [userImage, frameImage, scale, position, canvasRef]);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    
    onPositionChange({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    const touch = e.touches[0];
    setIsDragging(true);
    setDragStart({
      x: touch.clientX - position.x,
      y: touch.clientY - position.y,
    });
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    
    const touch = e.touches[0];
    onPositionChange({
      x: touch.clientX - dragStart.x,
      y: touch.clientY - dragStart.y,
    });
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  return (
    <Card className="p-4 shadow-card">
      <div
        ref={containerRef}
        className={`relative w-full aspect-[4/5] bg-muted rounded-lg overflow-hidden ${
          userImage && frameImage ? "cursor-move" : ""
        }`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {!userImage || !frameImage ? (
          <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
            <p className="text-center px-4">
              Upload your photo to start editing
            </p>
          </div>
        ) : (
          <canvas
            ref={canvasRef}
            className="w-full h-full object-contain"
          />
        )}
      </div>
      {userImage && frameImage && (
        <p className="text-xs text-muted-foreground text-center mt-2">
          Drag to reposition • Use slider to zoom
        </p>
      )}
    </Card>
  );
};
