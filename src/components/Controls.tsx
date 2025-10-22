import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Download, RotateCcw, ZoomIn } from "lucide-react";
import { toast } from "sonner";

interface ControlsProps {
  scale: number;
  onScaleChange: (scale: number) => void;
  onReset: () => void;
  onDownload: () => void;
  canDownload: boolean;
}

export const Controls = ({
  scale,
  onScaleChange,
  onReset,
  onDownload,
  canDownload,
}: ControlsProps) => {
  const handleDownload = () => {
    if (!canDownload) {
      toast.error("Please select a frame and upload a photo first");
      return;
    }
    onDownload();
  };

  return (
    <Card className="p-6 space-y-6">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <ZoomIn className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-foreground">Perbesar / Perkecil</h3>
        </div>
        <div className="space-y-2">
          <Slider
            value={[scale]}
            onValueChange={(value) => onScaleChange(value[0])}
            min={0.5}
            max={3}
            step={0.1}
            className="w-full"
            disabled={!canDownload}
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>50%</span>
            <span>{Math.round(scale * 100)}%</span>
            <span>300%</span>
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        <Button
          onClick={onReset}
          variant="outline"
          className="flex-1"
          disabled={!canDownload}
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Ulangi
        </Button>
        <Button
          onClick={handleDownload}
          className="flex-1 bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity"
          disabled={!canDownload}
        >
          <Download className="w-4 h-4 mr-2" />
          Download
        </Button>
      </div>
    </Card>
  );
};
