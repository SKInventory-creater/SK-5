import { Camera, CameraResultType, CameraSource } from "@capacitor/camera";

export async function pickPhoto() {
  try {
    return await Camera.getPhoto({
      quality: 80,
      allowEditing: false,
      resultType: CameraResultType.Uri,
      source: CameraSource.Photos
    });
  } catch (err) {
    alert(JSON.stringify(err));
    throw err;
  }
}

export async function takePhoto() {
  try {
    return await Camera.getPhoto({
      quality: 80,
      allowEditing: false,
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera
    });
  } catch (err) {
    alert(JSON.stringify(err));
    throw err;
  }
}
