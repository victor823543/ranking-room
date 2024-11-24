import { useMutation } from "@tanstack/react-query";
import { useAuth } from "../provider/authProvider";
import { callAPI } from "../utils/apiService";
import {
  UploadImageResult,
  uploadImageToS3,
} from "../utils/functions/uploadImageToS3";

type UseUploadImageReturn = {
  uploadAndStoreImage: (file: File) => Promise<UploadImageResult>;
};

export const useUploadImage = (): UseUploadImageReturn => {
  const { token } = useAuth();
  const storeImageMutation = useMutation({
    mutationFn: (url: string) => callAPI(`/images/store`, "POST", { url }),
    onSuccess: () => {
      console.log("Image stored successfully");
    },
    onError: (err) => {
      console.error("Error storing image:", err);
    },
  });

  const uploadAndStoreImage = async (file: File) => {
    if (!token) {
      throw new Error("No token found");
    }
    try {
      const result: UploadImageResult = await uploadImageToS3(file, token);
      if (result.success) {
        console.log("Image uploaded successfully:", result.url);
        storeImageMutation.mutate(result.url);
      } else {
        console.error("Failed to upload image:", result.error);
      }
      return result;
    } catch (error) {
      console.error("Unexpected error during image upload:", error);
      throw error;
    }
  };

  return { uploadAndStoreImage };
};
