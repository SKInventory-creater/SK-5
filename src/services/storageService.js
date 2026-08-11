import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../firebase/config.js";

export async function saveItemPhoto(photo, itemId) {
  if (!photo) {
    throw new Error("Photo မရှိပါ");
  }

  const response = await fetch(photo.webPath);
  const blob = await response.blob();

  const fileName = `items/${itemId}_${Date.now()}.jpg`;

  const storageRef = ref(storage, fileName);

  await uploadBytes(storageRef, blob, {
    contentType: "image/jpeg"
  });

  const downloadURL = await getDownloadURL(storageRef);

  console.log("PHOTO UPLOAD OK:", downloadURL);

  return downloadURL;
}
