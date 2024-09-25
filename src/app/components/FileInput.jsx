import React, { useState } from "react";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import Typography from "@mui/material/Typography";

const validation = (fileName) => {
  return /\.(?:wav|mp3)$/i.exec(fileName);
};

export default function FileInput({ onChange }) {
  const [valid, setValid] = useState(true);

  const handleFileChange = (event) => {
    setValid(false);
    if (event.target.files && event.target.files.length > 0) {
      const isFilesValid = Array.from(event.target.files).every((file) =>
        validation(file.name),
      );

      if (isFilesValid) {
        setValid(true);
        onChange(Array.from(event.target.files));
      }
    }
  };

  const VisuallyHiddenInput = styled("input")({
    clip: "rect(0 0 0 0)",
    clipPath: "inset(50%)",
    height: 1,
    overflow: "hidden",
    position: "absolute",
    bottom: 0,
    left: 0,
    whiteSpace: "nowrap",
    width: 1,
  });
  return (
    <div className="converter__wrapper">
      <Button
        component="label"
        role={undefined}
        variant="contained"
        tabIndex={-1}
        startIcon={<CloudUploadIcon />}
      >
        Choose files
        <VisuallyHiddenInput
          type="file"
          onChange={handleFileChange}
          multiple
          accept="audio/mp3, audio/wav"
        />
      </Button>

      <Typography variant="caption">
        Only <strong>MP3</strong> and <strong>WAV</strong> files are allowed
      </Typography>
      {!valid && <span className="converter__error">Invalid file type</span>}
    </div>
  );
}
