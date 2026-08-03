import { Filesystem, Directory } from "@capacitor/filesystem";
import { Capacitor } from "@capacitor/core";

export async function saveItemPhoto(photo, itemId) {
  const response = await fetch(photo.webPath);
  const blob = await response.blob();

  const reader = new FileReader();

  return await new Promise((resolve, reject) => {
    reader.onloadend = async () => {
      try {
        const base64 = reader.result.split(",")[1];

        const fileName = `item_${itemId}.jpg`;

        await Filesystem.writeFile({
          path: fileName,
          data: base64,
          directory: Directory.Data
        });

        const uri = await Filesystem.getUri({
          path: fileName,
          directory: Directory.Data
        });

        resolve(Capacitor.convertFileSrc(uri.uri));

      } catch (err) {
        reject(err);
      }
    };

    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}
