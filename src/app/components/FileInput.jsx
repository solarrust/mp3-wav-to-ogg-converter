import React from "react";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import Typography from "@mui/material/Typography";

export default function FileInput({ onChange }) {
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
          onChange={onChange}
          multiple
          accept="audio/mp3, audio/wav"
        />
      </Button>

      <Typography variant="caption">
        Only <strong>MP3</strong> and <strong>WAV</strong> files are allowed
      </Typography>
    </div>
  );
}
