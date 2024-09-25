import React from "react";
import Link from "@mui/material/Link";

export default function DownloadLinksList({ files }) {
  const handleClick = (event, blob) => {
    event.target.href = URL.createObjectURL(
      new Blob([blob], { type: "audio/ogg" }),
    );
  };
  return (
    <ul className="converter__links-list">
      {files.map((file, index) => (
        <li key={index + file.text} className="converter__links-item">
          <Link
            onClick={() => handleClick(event, file.blob)}
            href="#"
            download={file.download}
            className="converter__download-link"
          >
            Download {file.text}
          </Link>
        </li>
      ))}
    </ul>
  );
}
