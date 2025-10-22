import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";

interface ImageEditorProps {
  userImage: string | null;
  frameImage: string | null;
  scale: number;
  position: { x: number; y: number };
  onPositionChange: (position: { x: number; y: number }) => void;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  onScaleChange?: (scale: number) => void; // ✅ new optional prop for zoom updates
}

export const ImageEditor = ({
  userImage,
  frameImage,
  scale,
  position,
  onPositionChange,
  canvasRef,
  onScaleChange,
}: ImageEditorProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [initialDistance, setInitialDistance] = useState<number | null>(null);
  const [initialScale, setInitialScale] = useState(scale);
  const containerRef = useRef<HTMLDivElement>(null);

  // 🖼️ Draw image when props change
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

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const imgWidth = userImg.width * scale;
      const imgHeight = userImg.height * scale;
      ctx.drawImage(userImg, position.x, position.y, imgWidth, imgHeight);
      ctx.drawImage(frameImg, 0, 0, canvas.width, canvas.height);
    };

    userImg.onload = drawCanvas;
    frameImg.onload = drawCanvas;
    userImg.src = userImage;
    frameImg.src = frameImage;
  }, [userImage, frameImage, scale, position, canvasRef]);

  // 🖱️ Mouse drag
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

  const handleMouseUp = () => setIsDragging(false);

  // 📱 Touch drag + pinch zoom
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length === 1) {
      const touch = e.touches[0];
      setIsDragging(true);
      setDragStart({
        x: touch.clientX - position.x,
        y: touch.clientY - position.y,
      });
    } else if (e.touches.length === 2) {
      const dist = getDistance(e.touches[0], e.touches[1]);
      setInitialDistance(dist);
      setInitialScale(scale);
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length === 1 && isDragging) {
      const touch = e.touches[0];
      onPositionChange({
        x: touch.clientX - dragStart.x,
        y: touch.clientY - dragStart.y,
      });
    } else if (e.touches.length === 2 && initialDistance && onScaleChange) {
      e.preventDefault(); // 🧠 prevent page scroll while pinching
      const dist = getDistance(e.touches[0], e.touches[1]);
      const scaleFactor = dist / initialDistance;
      const newScale = Math.min(Math.max(initialScale * scaleFactor, 0.5), 5); // clamp zoom between 0.5x–5x
      onScaleChange(newScale);
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    setInitialDistance(null);
  };

  // 🧮 Helper to calculate distance between two fingers
  const getDistance = (t1: React.Touch, t2: React.Touch) => {
    const dx = t2.clientX - t1.clientX;
    const dy = t2.clientY - t1.clientY;
    return Math.hypot(dx, dy);
  };

  // 🚫 Prevent scroll during drag
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const handleTouchMove = (e: TouchEvent) => {
      if (isDragging) e.preventDefault();
    };
    container.addEventListener("touchmove", handleTouchMove, { passive: false });
    return () => container.removeEventListener("touchmove", handleTouchMove);
  }, [isDragging]);

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
            <p className="text-center px-4">Upload your photo to start editing</p>
          </div>
        ) : (
          <canvas ref={canvasRef} className="w-full h-full object-contain" />
        )}
      </div>
      {userImage && frameImage && (
        <p className="text-xs text-muted-foreground text-center mt-2">
          Drag to reposition • Pinch to zoom
        </p>
      )}
    </Card>
  );
};
