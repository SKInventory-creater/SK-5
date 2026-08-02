import { Filesystem, Directory } from "@capacitor/filesystem";

export async function saveItemPhoto(photo, itemId) {

  const response = await fetch(photo.webPath);
  const blob = await response.blob();

  const base64 = await new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      resolve(reader.result.split(",")[1]);
    };
    reader.readAsDataURL(blob);
  });

  const fileName = `${itemId}.jpg`;

  await Filesystem.writeFile({
    path: fileName,
    data: base64,
    directory: Directory.Data
  });

  const uri = await Filesystem.getUri({
    path: fileName,
    directory: Directory.Data
  });

  return uri.uri;
}
