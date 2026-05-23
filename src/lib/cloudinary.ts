import { v2 as cloudinary } from 'cloudinary';

// Configure the Cloudinary SDK using the .env variables
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export { cloudinary };

/**
 * Uploads a file buffer to Cloudinary in a specified folder.
 * Sanitizes names and handles secure HTTPS delivery.
 */
export async function uploadToCloudinary(
  fileBuffer: Buffer,
  folder: string,
  fileName?: string
): Promise<{ url: string; publicId: string }> {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: folder,
        public_id: fileName,
        resource_type: 'auto',
        overwrite: true,
      },
      (error, result) => {
        if (error) {
          console.error('Cloudinary stream upload error:', error);
          return reject(error);
        }
        if (!result) {
          return reject(new Error('Upload to Cloudinary failed with an empty result.'));
        }
        resolve({
          url: result.secure_url,
          publicId: result.public_id,
        });
      }
    );

    uploadStream.end(fileBuffer);
  });
}

/**
 * Deletes an asset from Cloudinary securely using its public ID.
 */
export async function deleteFromCloudinary(publicId: string): Promise<boolean> {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result.result === 'ok';
  } catch (error) {
    console.error('Failed to delete asset from Cloudinary:', error);
    return false;
  }
}

/**
 * Extracts a robust publicId from a Cloudinary URL (with folders).
 * Example: https://res.cloudinary.com/cloud/image/upload/v1234/folder/subfolder/file.png
 * Returns: folder/subfolder/file
 */
export function extractPublicIdFromUrl(url: string): string | null {
  if (!url || !url.includes('res.cloudinary.com')) return null;

  try {
    const uploadSegment = '/upload/';
    const index = url.indexOf(uploadSegment);
    if (index === -1) return null;

    // Extract the portion of the URL after "/upload/"
    const afterUpload = url.substring(index + uploadSegment.length);
    const parts = afterUpload.split('/');

    // Shift away the version segment (e.g., 'v1716422400') if it matches the format
    if (parts[0].startsWith('v') && /^\d+$/.test(parts[0].substring(1))) {
      parts.shift();
    }

    // Join back folders and filename, then remove the file extension
    const remaining = parts.join('/');
    const lastDotIndex = remaining.lastIndexOf('.');
    if (lastDotIndex !== -1) {
      return remaining.substring(0, lastDotIndex);
    }
    return remaining;
  } catch (err) {
    console.error('Error parsing Cloudinary URL:', err);
    return null;
  }
}
