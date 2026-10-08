import { supabase, isSupabaseConfigured } from './supabase';

/**
 * Resizes image to max 1600px on a canvas, converts to WebP at quality 0.82,
 * uploads it to public Supabase Storage bucket 'site-media' at path cms/<timestamp>-<random>.webp,
 * and returns the public URL. If upload fails, falls back to the compressed data URL.
 */
export async function uploadSiteImage(file: Blob): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = async () => {
      URL.revokeObjectURL(objectUrl);

      let { width, height } = img;
      const maxDim = 1600;

      if (width > maxDim || height > maxDim) {
        if (width > height) {
          height = Math.round((height * maxDim) / width);
          width = maxDim;
        } else {
          width = Math.round((width * maxDim) / height);
          height = maxDim;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(objectUrl);
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);
      const compressedDataUrl = canvas.toDataURL('image/webp', 0.82);

      // Attempt upload to Supabase Storage bucket 'site-media'
      try {
        canvas.toBlob(
          async (blob) => {
            if (!blob) {
              resolve(compressedDataUrl);
              return;
            }

            if (!isSupabaseConfigured() || !supabase) {
              resolve(compressedDataUrl);
              return;
            }

            try {
              const timestamp = Date.now();
              const random = Math.random().toString(36).substring(2, 9);
              const filePath = `cms/${timestamp}-${random}.webp`;

              const { data, error } = await supabase.storage
                .from('site-media')
                .upload(filePath, blob, {
                  contentType: 'image/webp',
                  upsert: true,
                });

              if (error || !data) {
                console.warn('Supabase storage upload fallback to compressed data URL:', error?.message);
                resolve(compressedDataUrl);
                return;
              }

              const { data: publicUrlData } = supabase.storage
                .from('site-media')
                .getPublicUrl(filePath);

              if (publicUrlData?.publicUrl) {
                resolve(publicUrlData.publicUrl);
              } else {
                resolve(compressedDataUrl);
              }
            } catch (uploadErr) {
              console.warn('Storage upload error, fallback to compressed data URL:', uploadErr);
              resolve(compressedDataUrl);
            }
          },
          'image/webp',
          0.82
        );
      } catch {
        resolve(compressedDataUrl);
      }
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => resolve('');
      reader.readAsDataURL(file);
    };

    img.src = objectUrl;
  });
}
