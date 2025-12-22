import React, { useRef, useState } from 'react';
import { Camera, X } from 'lucide-react';
import { Button } from './button';
import { AvatarPlaceholder } from './avatar-placeholder';

interface ImageUploadProps {
  value?: string;
  onChange: (value: string | undefined) => void;
  name?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export function ImageUpload({ value, onChange, name = 'صورة', size = 'xl' }: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | undefined>(value);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPreview(result);
        onChange(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemove = () => {
    setPreview(undefined);
    onChange(undefined);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-20 h-20',
    lg: 'w-24 h-24',
    xl: 'w-32 h-32',
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <div className={`relative ${sizeClasses[size]}`}>
        {preview ? (
          <>
            <img
              src={preview}
              alt="معاينة"
              className="w-full h-full rounded-full object-cover border-4 border-primary/20"
            />
            <button
              type="button"
              onClick={handleRemove}
              className="absolute -top-1 -left-1 bg-destructive text-destructive-foreground rounded-full p-1 hover:bg-destructive/80 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </>
        ) : (
          <AvatarPlaceholder name={name} size={size} />
        )}
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="absolute -bottom-1 -left-1 bg-primary text-primary-foreground rounded-full p-2 hover:bg-primary/80 transition-colors shadow-lg"
        >
          <Camera className="w-4 h-4" />
        </button>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => inputRef.current?.click()}
      >
        {preview ? 'تغيير الصورة' : 'رفع صورة'}
      </Button>
    </div>
  );
}
