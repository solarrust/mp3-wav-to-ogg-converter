import React, { useState } from "react";
import Button from "@mui/material/Button";
import createZIP from "../../lib/createzip";
import Wrapper from "../Wrapper/Wrapper";

export default function ZipDownloadButton({ files }) {
  const [error, setError] = useState(null);
  if (!files.length) return null;

  async function onClick() {
    try {
      await createZIP(files);
    } catch (error) {
      setError(error);
    }
  }

  return (
    <Wrapper>
      <Button variant="contained" onClick={onClick}>
        Download ZIP
      </Button>
      {error && <p className="error">{error.message}</p>}
    </Wrapper>
  );
}
