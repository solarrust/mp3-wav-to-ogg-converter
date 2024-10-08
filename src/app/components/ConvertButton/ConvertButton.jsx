import React from "react";
import Button from "@mui/material/Button";

export default function ConvertButton({ onClick }) {
  return (
    <Button onClick={onClick} variant="contained">
      Convert into OGG
    </Button>
  );
}
