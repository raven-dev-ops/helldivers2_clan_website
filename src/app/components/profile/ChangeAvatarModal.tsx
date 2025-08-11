// src/app/components/profile/ChangeAvatarModal.tsx
'use client';

import { useCallback, useMemo, useRef, useState } from 'react';
import Cropper, { Area } from 'react-easy-crop';
import styles from './ChangeAvatarModal.module.css';

interface ChangeAvatarModalProps {
  initialImageUrl?: string;
  onCancel: () => void;
  onSaved: (dataUrl: string) => void;
}

const MIN_BYTES = 10 * 1024; // 10KB
const MAX_BYTES = 5 * 1024 * 1024; // 5MB
const MIN_DIMENSION = 128; // px
const OUTPUT_SIZE = 512; // px square canvas

export default function ChangeAvatarModal({ initialImageUrl, onCancel, onSaved }: ChangeAvatarModalProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(initialImageUrl || null);
  const [error, setError] = useState<string | null>(null);
  const [zoom, setZoom] = useState<number>(1);
  const [crop, setCrop] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const onChooseFileClick = () => fileInputRef.current?.click();

  const readFile = (file: File) => new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

  const validateImageDimensions = (src: string) => new Promise<void>((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      if (img.width < MIN_DIMENSION || img.height < MIN_DIMENSION) {
        reject(new Error(`Image too small. Minimum ${MIN_DIMENSION}x${MIN_DIMENSION}px.`));
        return;
      }
      resolve();
    };
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = src;
  });

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    if (file.size < MIN_BYTES) {
      setError('File is too small. Please choose a larger image.');
      return;
    }
    if (file.size > MAX_BYTES) {
      setError('File is too large. Maximum size is 5MB.');
      return;
    }
    try {
      const dataUrl = await readFile(file);
      await validateImageDimensions(dataUrl);
      setImageSrc(dataUrl);
      setZoom(1);
      setCrop({ x: 0, y: 0 });
    } catch (err: any) {
      setError(err?.message || 'Invalid image.');
    }
  };

  const onCropComplete = useCallback((_area: Area, areaPixels: Area) => {
    setCroppedAreaPixels(areaPixels);
  }, []);

  const getCroppedImageDataUrl = useCallback(async (): Promise<string> => {
    if (!imageSrc || !croppedAreaPixels) throw new Error('Nothing to crop');
    const image = await new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = imageSrc;
    });

    const canvas = document.createElement('canvas');
    canvas.width = OUTPUT_SIZE;
    canvas.height = OUTPUT_SIZE;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas not supported');

    // Fill with transparent background
    ctx.clearRect(0, 0, OUTPUT_SIZE, OUTPUT_SIZE);

    // Draw circular clip
    ctx.save();
    ctx.beginPath();
    ctx.arc(OUTPUT_SIZE / 2, OUTPUT_SIZE / 2, OUTPUT_SIZE / 2, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();

    // Compute scale and position from croppedAreaPixels to OUTPUT_SIZE
    const scaleX = image.naturalWidth / (croppedAreaPixels.width || 1);
    const scaleY = image.naturalHeight / (croppedAreaPixels.height || 1);
    const sx = croppedAreaPixels.x * scaleX;
    const sy = croppedAreaPixels.y * scaleY;
    const sWidth = (croppedAreaPixels.width || 1) * scaleX;
    const sHeight = (croppedAreaPixels.height || 1) * scaleY;

    ctx.drawImage(
      image,
      sx,
      sy,
      sWidth,
      sHeight,
      0,
      0,
      OUTPUT_SIZE,
      OUTPUT_SIZE
    );

    ctx.restore();

    return canvas.toDataURL('image/png');
  }, [imageSrc, croppedAreaPixels]);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const dataUrl = await getCroppedImageDataUrl();
      // Confirm save
      if (!confirm('Save this image as your profile picture?')) {
        setIsSaving(false);
        return;
      }
      const res = await fetch('/api/users/me', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customAvatarDataUrl: dataUrl })
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error || 'Failed to save image');
      }
      onSaved(dataUrl);
    } catch (err: any) {
      setError(err?.message || 'Failed to save image');
    } finally {
      setIsSaving(false);
    }
  };

  const hasImage = useMemo(() => !!imageSrc, [imageSrc]);

  return (
    <div className={styles.overlay}>
      <div className={styles.modal} role="dialog" aria-modal="true" aria-label="Change profile image">
        <div className={styles.header}>Change Profile Image</div>
        <div className={styles.body}>
          {error && <div className={styles.error}>{error}</div>}
          {!hasImage ? (
            <div className={styles.emptyState}>
              <p>Select an image to get started.</p>
              <button type="button" className={styles.button} onClick={onChooseFileClick}>Choose Image</button>
              <input ref={fileInputRef} type="file" accept="image/*" hidden onChange={onFileChange} />
            </div>
          ) : (
            <>
              <div className={styles.cropContainer}>
                <Cropper
                  image={imageSrc!}
                  crop={crop}
                  zoom={zoom}
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  onCropComplete={onCropComplete}
                  aspect={1}
                  cropShape="round"
                  showGrid={false}
                />
              </div>
              <div className={styles.controls}>
                <label>
                  Zoom
                  <input type="range" min={1} max={3} step={0.01} value={zoom} onChange={(e) => setZoom(Number(e.target.value))} />
                </label>
                <div className={styles.controlButtons}>
                  <button type="button" className={styles.link} onClick={onChooseFileClick}>Change file</button>
                  <input ref={fileInputRef} type="file" accept="image/*" hidden onChange={onFileChange} />
                </div>
              </div>
            </>
          )}
        </div>
        <div className={styles.footer}>
          <button type="button" className={`${styles.button} ${styles.ghost}`} onClick={onCancel} disabled={isSaving}>Cancel</button>
          <button type="button" className={styles.button} onClick={handleSave} disabled={!hasImage || isSaving}>{isSaving ? 'Saving…' : 'Save'}</button>
        </div>
      </div>
    </div>
  );
}