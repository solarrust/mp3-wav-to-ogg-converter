import React, { forwardRef } from "react";
import Link from "@mui/material/Link";

function DownloadLink(props) {
  return (
    <>
      <Link
        href={props.href}
        download={props.download}
        className="converter__download-link"
      >
        Скачать {props.text}
      </Link>
    </>
  );
}

export default DownloadLink;
