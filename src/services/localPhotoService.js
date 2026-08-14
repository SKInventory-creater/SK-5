export async function photoToBase64(photo) {
  if (!photo?.webPath) {
    throw new Error("Photo မတွေ့ပါ");
  }

  const response = await fetch(photo.webPath);

  if (!response.ok) {
    throw new Error("Photo ဖတ်မရပါ");
  }

  const blob = await response.blob();

  return await new Promise((resolve, reject) => {
    const img = new Image();

    img.onload = () => {
      try {
        const MAX_SIZE = 280;
        const QUALITY = 0.4;

        let width = img.naturalWidth;
        let height = img.naturalHeight;

        // အရှည်ဆုံးဘက်ကို 800px အထိချုံ့
        if (width > MAX_SIZE || height > MAX_SIZE) {
          const scale = Math.min(
            MAX_SIZE / width,
            MAX_SIZE / height
          );

          width = Math.round(width * scale);
          height = Math.round(height * scale);
        }

        const canvas = document.createElement("canvas");

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");

        if (!ctx) {
          reject(new Error("Photo canvas မရပါ"));
          return;
        }

        ctx.drawImage(
          img,
          0,
          0,
          width,
          height
        );

        // WebP အဖြစ် compress
        const compressed = canvas.toDataURL(
          "image/webp",
          QUALITY
        );

        const originalKB = (
          blob.size / 1024
        ).toFixed(1);

        const compressedKB = (
          (compressed.length * 3) / 4 / 1024
        ).toFixed(1);

        console.log(
          `PHOTO COMPRESS: ${originalKB} KB → ${compressedKB} KB`
        );

        resolve(compressed);

      } catch (err) {
        reject(
          new Error("Photo ချုံ့၍ မရပါ")
        );
      }
    };

    img.onerror = () => {
      reject(
        new Error("Photo ပုံဖတ်၍ မရပါ")
      );
    };

    img.src = URL.createObjectURL(blob);
  });
}
