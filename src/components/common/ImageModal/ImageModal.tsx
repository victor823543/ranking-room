import { PhotoIcon } from "@heroicons/react/24/outline";
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { useUploadImage } from "../../../hooks/useUploadImage";
import { callAPI } from "../../../utils/apiService";
import CustomizableButton from "../Buttons/CustomizableButton";
import Divider from "../Dividers/Dividers";
import { ModalWrapperBlur, OpaqueModal } from "../Modals/Modals";
import styles from "./ImageModal.module.css";

type ImageModalProps = {
  onWrapperClick?: () => void;
  onUploadComplete?: (url: string) => void;
  onSelectImage?: (url: string) => void;
};

const ImageModal: React.FC<ImageModalProps> = ({
  onWrapperClick,
  onUploadComplete,
  onSelectImage,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [url, setUrl] = useState<string | null>(null);
  const { uploadAndStoreImage } = useUploadImage();

  const { data, error, isLoading } = useQuery({
    queryKey: ["allImages"],
    queryFn: () =>
      callAPI<Array<{ url: string; id: string }>>(`/images/list`, "GET"),
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleChangeClick = () => {
    setFile(null);
    document.getElementById("fileInput")?.click();
  };

  const uploadImage = async (file: File) => {
    const result = await uploadAndStoreImage(file);
    if (result.success) {
      setUrl(result.url);
      onUploadComplete && onUploadComplete(result.url);
    } else {
      console.error("Failed to upload image:", result.error);
    }
  };

  return (
    <ModalWrapperBlur
      onClick={onWrapperClick ? () => onWrapperClick() : undefined}
    >
      <OpaqueModal>
        <div className={styles.upload}>
          <input
            id="fileInput"
            className={styles.fileInput}
            type="file"
            onChange={handleFileChange}
            style={file ? { pointerEvents: "none" } : { pointerEvents: "auto" }}
          />
          {file ? (
            <>
              {file && (
                <img
                  className={styles.uploadedImg}
                  src={URL.createObjectURL(file)}
                  alt="Uploaded"
                />
              )}
              <CustomizableButton variant="opaque" onClick={handleChangeClick}>
                Change
              </CustomizableButton>
              <CustomizableButton onClick={() => uploadImage(file)}>
                Upload
              </CustomizableButton>
            </>
          ) : (
            <>
              <h3 className={styles.h3}>Choose a file</h3>
              <div className={styles.photoIconWrapper}>
                <PhotoIcon />
              </div>
            </>
          )}
        </div>
        <Divider thickness="1px" color="rgb(var(--base))">
          or
        </Divider>
        <div className={styles.select}>
          <h3 className={styles.h3}>Select from previous images</h3>

          {data && data.length > 0 ? (
            <div className={styles.imgList}>
              {data.map((img) => (
                <img
                  key={img.id}
                  className={styles.img}
                  src={img.url}
                  alt="Previously used image"
                  onClick={() => onSelectImage && onSelectImage(img.url)}
                />
              ))}
            </div>
          ) : isLoading ? (
            <p>Loading...</p>
          ) : (
            <p>You have no images stored</p>
          )}
        </div>
      </OpaqueModal>
    </ModalWrapperBlur>
  );
};

export default ImageModal;
