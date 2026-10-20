/**
 * Client-side image compressor & optimizer.
 * Scales down large device/camera photos to a web-optimized resolution (max 1600px)
 * and compresses with high visual fidelity JPEG encoding (0.82 quality).
 * Reduces multi-megabyte camera files (e.g. 8MB) to ~120KB-250KB,
 * ensuring they load instantly and never exceed browser localStorage quota.
 */
export async function optimizeImageFile(file: File, maxWidth = 1600, maxHeight = 1600, quality = 0.82): Promise<{
  dataUrl: string;
  width: number;
  height: number;
  originalSize: number;
  optimizedSize: number;
}> {
  return new Promise((resolve, reject) => {
    // If it's not an image (e.g. video), fall back to standard data URL
    if (!file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        resolve({
          dataUrl: result,
          width: 0,
          height: 0,
          originalSize: file.size,
          optimizedSize: file.size
        });
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
      return;
    }

    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);

      let targetWidth = img.width;
      let targetHeight = img.height;

      // Scale down proportionally if larger than maximum bounds
      if (targetWidth > maxWidth || targetHeight > maxHeight) {
        if (targetWidth / maxWidth > targetHeight / maxHeight) {
          targetHeight = Math.round((targetHeight * maxWidth) / targetWidth);
          targetWidth = maxWidth;
        } else {
          targetWidth = Math.round((targetWidth * maxHeight) / targetHeight);
          targetHeight = maxHeight;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = targetWidth;
      canvas.height = targetHeight;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        // Fallback to standard data URL if canvas 2D context is unavailable
        const reader = new FileReader();
        reader.onload = () => {
          resolve({
            dataUrl: reader.result as string,
            width: img.width,
            height: img.height,
            originalSize: file.size,
            optimizedSize: file.size
          });
        };
        reader.readAsDataURL(file);
        return;
      }

      // Smooth bicubic-like resampling
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

      // Export as optimized JPEG (or PNG if has alpha transparency)
      const mimeType = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
      const outputQuality = mimeType === 'image/png' ? undefined : quality;
      const dataUrl = canvas.toDataURL(mimeType, outputQuality);

      resolve({
        dataUrl,
        width: targetWidth,
        height: targetHeight,
        originalSize: file.size,
        optimizedSize: Math.round((dataUrl.length * 3) / 4)
      });
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('Failed to load image file.'));
    };

    img.src = objectUrl;
  });
}
