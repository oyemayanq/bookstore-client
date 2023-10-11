import { useState, useRef, useEffect } from "react";

import styles from "./ImageUpload.module.css";
import Button from "./Button";

function ImageUpload({ id, name, value, onInput, errorText }) {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isValid, setIsValid] = useState(false);

  const filePickerRef = useRef();

  useEffect(() => {
    if (!file) {
      return;
    }
    const fileReader = new FileReader();
    fileReader.onload = () => {
      setPreviewUrl(fileReader.result);
    };
    fileReader.readAsDataURL(file);
  }, [file]);

  function pickedHandler(e) {
    e.preventDefault();
    let pickedFile;
    //let fileIsValid = isValid;

    if (e.target.files && e.target.files.length === 1) {
      pickedFile = e.target.files[0];
      setFile(pickedFile);
      setIsValid(true);
    } else {
      setIsValid(false);
    }

    onInput(pickedFile);
  }

  function pickImageHandler(e) {
    e.preventDefault();
    filePickerRef.current.click();
  }

  return (
    <div className={styles["upload-container"]}>
      <input
        id={id}
        name={name}
        ref={filePickerRef}
        style={{ display: "none" }}
        type="file"
        accept=".jpg,.png,.jpeg"
        onChange={pickedHandler}
      />
      <div className={styles["image-upload"]}>
        <div className={styles["image-upload__preview"]}>
          {previewUrl || value ? (
            <img src={previewUrl || value} alt="Preview" />
          ) : (
            <p>Pick an image</p>
          )}
        </div>
        <Button onClick={pickImageHandler}>PICK IMAGE</Button>
      </div>
      {!isValid && <p>{errorText}</p>}
    </div>
  );
}

export default ImageUpload;
