import type { CloudinaryUploadResult } from "@/lib/types";

// Helper function executing validate cloudinary config.
export function validateCloudinaryConfig() {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
  if (!cloudName || !uploadPreset) {
    throw new Error("Missing Cloudinary config.");
  }
}

// Helper function executing extract public id from cloudinary url.
// Processes input parameters and returns the calculated result.
export function extractPublicIdFromCloudinaryUrl(url: string): string | null {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  if (!url || !cloudName) return null;

  try {
    const parsedUrl = new URL(url);
    if (!parsedUrl.hostname.includes("res.cloudinary.com")) return null;

    const segments = parsedUrl.pathname.split("/").filter(Boolean);
    // Helper function executing upload index.
    // Processes input parameters and returns the calculated result.
    const uploadIndex = segments.findIndex((segment) => segment === "upload");
    if (uploadIndex === -1) return null;

    const assetSegments = segments.slice(uploadIndex + 1);
    // Helper function executing version index.
    // Processes input parameters and returns the calculated result.
    const versionIndex = assetSegments.findIndex((segment) => /^v\d+$/.test(segment));
    const publicIdSegments = versionIndex >= 0 ? assetSegments.slice(versionIndex + 1) : assetSegments;
    if (publicIdSegments.length === 0) return null;

    const lastSegment = publicIdSegments[publicIdSegments.length - 1];
    publicIdSegments[publicIdSegments.length - 1] = lastSegment.replace(/\.[^.]+$/, "");

    return publicIdSegments.join("/");
  } catch {
    return null;
  }
}

// Helper function executing upload image to cloudinary.
export async function uploadImageToCloudinary(file: File): Promise<CloudinaryUploadResult> {
  validateCloudinaryConfig();

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!;

  const formData = new FormData();
  formData.append("file", file);  // Append field to multipart form payload
  formData.append("upload_preset", uploadPreset);  // Append field to multipart form payload

  // Helper function executing response.
  const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: "POST",
    body: formData,
  });

  // Helper function executing data.
  const data = (await response.json()) as {
    secure_url?: string;
    public_id?: string;
    error?: { message?: string };
  };

  if (!response.ok || !data.secure_url || !data.public_id) {
    throw new Error(data.error?.message || "Failed to upload image to Cloudinary.");
  }

  return {
    secureUrl: data.secure_url,
    publicId: data.public_id,
  };
}

// Helper function executing delete image from cloudinary.
export async function deleteImageFromCloudinary(publicId: string): Promise<void> {
  // Helper function executing response.
  const response = await fetch("/api/cloudinary/delete", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ publicId }),
  });

  // Helper function executing data.
  const data = (await response.json()) as { error?: string };

  if (!response.ok) {
    throw new Error(data.error || "Failed to delete image from Cloudinary.");
  }
}

// Process upload image with cleanup using file and old image url; it removes image from cloudinary and guards invalid or unavailable states and translates operation failures.
export async function uploadImageWithCleanup(
  file: File,
  oldImageUrl?: string | null
): Promise<CloudinaryUploadResult> {
  if (oldImageUrl) {
    const oldPublicId = extractPublicIdFromCloudinaryUrl(oldImageUrl);
    if (oldPublicId) {
      try {
        await deleteImageFromCloudinary(oldPublicId);
      } catch (error) {
        console.error("[Cloudinary] Failed to delete old image:", oldPublicId, error);
      }
    }
  }

  return uploadImageToCloudinary(file);
}
