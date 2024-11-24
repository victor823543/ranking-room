import axios from "axios";
import { API_ADDRESS } from "../../config";

export type UploadImageResult =
  | {
      success: true;
      url: string;
    }
  | {
      success: false;
      error: string;
    };

export const uploadImageToS3 = async (
  file: File,
  token: string,
): Promise<UploadImageResult> => {
  console.log("Uploading image:", file.name);
  try {
    // Step 1: Get a pre-signed URL from the backend
    const { data } = await axios.get(`${API_ADDRESS}/s3/presigned-url`, {
      params: {
        fileName: file.name,
        fileType: file.type,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("Received pre-signed URL:", data);

    if (!data || !data.signedUrl || !data.fileUrl) {
      throw new Error("Invalid response from server");
    }

    const { signedUrl, fileUrl }: { signedUrl: string; fileUrl: string } = data;

    // Step 2: Upload the file to S3 using the pre-signed URL
    await axios.put(signedUrl, file, {
      headers: {
        "Content-Type": file.type,
      },
    });

    // Step 3: Return the file's public URL
    return {
      success: true,
      url: fileUrl,
    };
  } catch (error: any) {
    console.error("Error uploading image:", error);
    return {
      success: false,
      error: error.message || "Failed to upload image",
    };
  }
};
