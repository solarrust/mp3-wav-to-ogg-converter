import React from "react";
import Link from "@mui/material/Link";

function DownloadLink({ href, download, text }) {
  return (
    <Link href={href} download={download} className="converter__download-link">
      Download {text}
    </Link>
  );
}

export default DownloadLink;
