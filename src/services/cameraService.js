import { Camera, CameraResultType, CameraSource } from "@capacitor/camera";

export async function pickPhoto() {

  const photo = await Camera.getPhoto({
    quality: 80,
    allowEditing: false,
    resultType: CameraResultType.Uri,
    source: CameraSource.Photos
  });

  return photo;

}

export async function takePhoto() {

  const photo = await Camera.getPhoto({
    quality: 80,
    allowEditing: false,
    resultType: CameraResultType.Uri,
    source: CameraSource.Camera
  });

  return photo;

}
