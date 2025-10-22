import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Upload, Image as ImageIcon } from "lucide-react";
import { useRef } from "react";

interface ImageUploaderProps {
  onImageUpload: (image: string) => void;
  hasImage: boolean;
}

export const ImageUploader = ({ onImageUpload, hasImage }: ImageUploaderProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        onImageUpload(result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-foreground">Pilih Foto</h2>
      <Card className="p-8 border-dashed border-2 hover:border-primary transition-colors">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
        <div className="flex flex-col items-center gap-4 text-center">
          {hasImage ? (
            <ImageIcon className="w-12 h-12 text-primary" />
          ) : (
            <Upload className="w-12 h-12 text-muted-foreground" />
          )}
          <div>
            <p className="text-sm text-foreground font-medium mb-1">
              {hasImage ? "Foto sudah dipilih" : "Pilih foto"}
            </p>
            <p className="text-xs text-muted-foreground">
              JPG, PNG or WEBP (Maksimal 10MB)
            </p>
          </div>
          <Button
            onClick={() => fileInputRef.current?.click()}
            variant="default"
            className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity"
          >
            {hasImage ? "Ganti Foto" : "Pilih Foto"}
          </Button>
        </div>
      </Card>
    </div>
  );
};
