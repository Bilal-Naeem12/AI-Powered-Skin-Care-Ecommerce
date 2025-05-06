// src/utils/cloudinaryUpload.ts
import axios from "axios";

const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME as string;

export async function uploadSigned(
  file: File,
  folder = "myShop/products"
): Promise<string> {
  // 1) ask backend for signature
  const { data } = await axios.get<{
    timestamp: number;
    signature: string;
  }>("/api/cloudinary/signature");             // adjust your base URL
  
  // 2) build multipart form
  const form = new FormData();
  form.append("file", file);
  form.append("api_key",   import.meta.env.VITE_CLOUDINARY_API_KEY);
  form.append("timestamp", String(data.timestamp));
  form.append("signature", data.signature);
  form.append("folder",    folder);

  // 3) POST to Cloudinary
  const res = await axios.post(
    `https://api.cloudinary.com/v1_1/${cloudName}/upload`,
    form
  );

  return res.data.secure_url as string;
}
