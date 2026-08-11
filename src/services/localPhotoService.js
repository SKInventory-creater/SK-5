export async function photoToBase64(photo) {
  if (!photo?.webPath) {
    throw new Error("Photo မတွေ့ပါ");
  }

  const response = await fetch(photo.webPath);

  if (!response.ok) {
    throw new Error("Photo ဖတ်မရပါ");
  }

  const blob = await response.blob();

  return await new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      resolve(reader.result);
    };

    reader.onerror = () => {
      reject(new Error("Photo ပြောင်း၍ မရပါ"));
    };

    reader.readAsDataURL(blob);
  });
}
