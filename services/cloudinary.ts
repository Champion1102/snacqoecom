import { v2 as cloudinary } from "cloudinary";

function ensureConfigured() {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error("Cloudinary is not configured. Set CLOUDINARY_* env vars.");
  }

  cloudinary.config({ cloud_name: cloudName, api_key: apiKey, api_secret: apiSecret });
}

export interface UploadResult {
  url: string;
  publicId: string;
}

export async function uploadImage(
  buffer: Buffer,
  options?: { folder?: string; publicId?: string }
): Promise<UploadResult> {
  ensureConfigured();
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: options?.folder ?? "snacqo/products",
        resource_type: "image",
        ...(options?.publicId ? { public_id: options.publicId } : {}),
      },
      (err, result) => {
        if (err) { reject(err); return; }
        if (!result?.secure_url) { reject(new Error("Cloudinary upload did not return a URL")); return; }
        resolve({ url: result.secure_url, publicId: result.public_id ?? "" });
      }
    );
    uploadStream.end(buffer);
  });
}

export async function uploadVideo(
  buffer: Buffer,
  options?: { folder?: string; publicId?: string }
): Promise<UploadResult> {
  ensureConfigured();
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: options?.folder ?? "snacqo/reviews",
        resource_type: "video",
        ...(options?.publicId ? { public_id: options.publicId } : {}),
      },
      (err, result) => {
        if (err) { reject(err); return; }
        if (!result?.secure_url) { reject(new Error("Cloudinary upload did not return a URL")); return; }
        resolve({ url: result.secure_url, publicId: result.public_id ?? "" });
      }
    );
    uploadStream.end(buffer);
  });
}

export async function deleteImage(publicId: string): Promise<void> {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  if (!cloudName || !apiKey || !apiSecret) return;
  cloudinary.config({ cloud_name: cloudName, api_key: apiKey, api_secret: apiSecret });
  await cloudinary.uploader.destroy(publicId);
}
