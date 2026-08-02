export async function uploadItemPhoto(file, itemId) {

  alert("UPLOAD START");

  const fileRef = ref(storage, `items/${itemId}.jpg`);

  alert("REF OK");

  await uploadBytes(fileRef, file);

  alert("UPLOAD DONE");

  const url = await getDownloadURL(fileRef);

  alert("URL DONE");

  return url;
}
