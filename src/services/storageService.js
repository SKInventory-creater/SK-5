import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../firebase/config.js";

export async function saveItemPhoto(photo, itemId) {
  if (!photo) {
    throw new Error("Photo မရှိပါ");
  }

  const response = await fetch(photo.webPath);
  const blob = await response.blob();

  alert(
    "Photo ရပြီ\n" +
    "Size: " +
    Math.round(blob.size / 1024) +
    " KB\n" +
    "Type: " +
    blob.type
  );

  const fileName = `items/${itemId}_${Date.now()}.jpg`;

  const storageRef = ref(storage, fileName);

  alert("Upload စမယ်");

  await uploadBytes(storageRef, blob, {
    contentType: "image/jpeg"
  });

  alert("Upload ပြီးပြီ");

  const downloadURL = await getDownloadURL(storageRef);

  alert("URL ရပြီ");

  return downloadURL;
}
