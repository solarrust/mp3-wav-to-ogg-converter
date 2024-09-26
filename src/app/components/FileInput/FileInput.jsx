import React, { useState } from "react";
import Button from "@mui/material/Button";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import Typography from "@mui/material/Typography";
import Wrapper from "../Wrapper/Wrapper";

function validation(fileName) {
  return /\.(?:wav|mp3)$/i.exec(fileName);
}

function validAllFiles(files) {
  if (!files || !files.length) return null;

  return Array.from(files).every((file) => validation(file.name));
}

export default function FileInput({ onChange }) {
  const [valid, setValid] = useState(true);

  function handleFileChange(event) {
    setValid(false);
    const isFilesValid = validAllFiles(event.target.files);

    if (isFilesValid) {
      onChange(Array.from(event.target.files));
    }

    setValid(isFilesValid);
  }

  return (
    <Wrapper>
      <Button
        component="label"
        role={undefined}
        variant="contained"
        tabIndex={-1}
        startIcon={<CloudUploadIcon />}
      >
        Choose files
        <input
          className="sr-only"
          type="file"
          onChange={handleFileChange}
          multiple
          accept="audio/mp3, audio/wav"
        />
      </Button>

      <Typography variant="caption">
        Only <strong>MP3</strong> and <strong>WAV</strong> files are allowed
      </Typography>
      {!valid && <p className="error">Invalid file type</p>}
    </Wrapper>
  );
}
