import React from "react";
import Link from "@mui/material/Link";

export default function DownloadLinksList({ files }) {
  if (!files.length) return null;
  return (
    <ul className="links-list">
      {files.map((file, index) => (
        <li key={index + file.text} className="links-list__item">
          <Link
            href={file.href}
            download={file.download}
            className="download-link"
          >
            Download {file.text}
          </Link>
        </li>
      ))}
    </ul>
  );
}
