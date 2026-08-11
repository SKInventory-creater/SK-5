import {
  ref,
  uploadBytesResumable,
  getDownloadURL
} from "firebase/storage";

import { storage } from "../firebase/config.js";

export async function saveItemPhoto(photo, itemId) {
  if (!photo) {
    throw new Error("Photo မရှိပါ");
  }

  console.log("PHOTO: fetch start");

  const response = await fetch(photo.webPath);

  if (!response.ok) {
    throw new Error(
      "Photo ဖတ်မရပါ: HTTP " + response.status
    );
  }

  const blob = await response.blob();

  console.log(
    "PHOTO SIZE:",
    Math.round(blob.size / 1024),
    "KB",
    "TYPE:",
    blob.type
  );

  const fileName =
    `items/${itemId}_${Date.now()}.jpg`;

  const storageRef = ref(storage, fileName);

  console.log(
    "PHOTO UPLOAD START:",
    fileName
  );

  const uploadTask = uploadBytesResumable(
    storageRef,
    blob,
    {
      contentType: "image/jpeg"
    }
  );

  const downloadURL = await new Promise(
    (resolve, reject) => {

      uploadTask.on(
        "state_changed",

        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred /
              snapshot.totalBytes) * 100;

          console.log(
            "PHOTO UPLOAD:",
            Math.round(progress) + "%"
          );
        },

        (error) => {
          console.error(
            "PHOTO UPLOAD ERROR:",
            error
          );

          reject(error);
        },

        async () => {
          try {

            console.log(
              "PHOTO UPLOAD FINISHED:",
              fileName
            );

            const url =
              await getDownloadURL(storageRef);

            console.log(
              "PHOTO URL READY:",
              url
            );

            resolve(url);

          } catch (error) {
            reject(error);
          }
        }
      );

    }
  );

  return downloadURL;
}
