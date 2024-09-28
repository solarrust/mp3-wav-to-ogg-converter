import React, { useState } from "react";
import Button from "@mui/material/Button";
import createZIP from "../../lib/createzip";
import Wrapper from "../Wrapper/Wrapper";

export default function ZipDownloadButton({ files }) {
  if (!files.length) return null;

  const [error, setError] = useState(null);

  async function onClick() {
    setError(null);
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
