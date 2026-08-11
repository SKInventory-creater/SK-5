import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../firebase/config.js";

export async function saveItemPhoto(photo, itemId) {
  if (!photo) {
    throw new Error("Photo မရှိပါ");
  }

  const response = await fetch(photo.webPath);
  const blob = await response.blob();

  console.log(
    "PHOTO SIZE:",
    Math.round(blob.size / 1024),
    "KB",
    "TYPE:",
    blob.type
  );

  const fileName = `items/${itemId}_${Date.now()}.jpg`;

  const storageRef = ref(storage, fileName);

  console.log("PHOTO UPLOAD START:", fileName);

  await uploadBytes(storageRef, blob, {
    contentType: "image/jpeg"
  });

  console.log("PHOTO UPLOAD FINISHED:", fileName);

  const downloadURL = await getDownloadURL(storageRef);

  console.log("PHOTO URL READY:", downloadURL);

  return downloadURL;
}
