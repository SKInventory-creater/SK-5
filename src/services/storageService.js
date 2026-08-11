import {
  ref,
  uploadBytesResumable,
  getDownloadURL
} from "firebase/storage";

import { storage } from "../firebase/config.js";

export async function saveItemPhoto(photo, itemId, onProgress = null) {
  if (!photo) {
    throw new Error("Photo မရှိပါ");
  }

  const response = await fetch(photo.webPath);

  if (!response.ok) {
    throw new Error("Photo ဖတ်မရပါ");
  }

  const blob = await response.blob();

  const fileName =
    `items/${itemId}_${Date.now()}.jpg`;

  const storageRef = ref(storage, fileName);

  const uploadTask = uploadBytesResumable(
    storageRef,
    blob,
    {
      contentType: "image/jpeg"
    }
  );

  await new Promise((resolve, reject) => {

    uploadTask.on(
      "state_changed",

      (snapshot) => {
        const progress =
          Math.round(
            (snapshot.bytesTransferred /
              snapshot.totalBytes) * 100
          );

        if (onProgress) {
          onProgress(progress);
        }
      },

      (error) => {
        reject(error);
      },

      () => {
        resolve();
      }
    );

  });

  return await getDownloadURL(storageRef);
}
