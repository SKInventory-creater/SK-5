import { storage } from "../firebase/config.js";
import {
  ref,
  uploadBytes,
  getDownloadURL
} from "firebase/storage";

export async function uploadItemPhoto(file, itemId) {

  const fileRef = ref(
    storage,
    `items/${itemId}.jpg`
  );

  await uploadBytes(fileRef, file);

  return await getDownloadURL(fileRef);

}
