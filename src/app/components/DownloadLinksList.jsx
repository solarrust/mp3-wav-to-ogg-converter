import React from "react";
import DownloadLink from "./DownloadLink";

export default function DownloadLinksList({ files }) {
  return (
    <ul className="converter__links-list">
      {files.map((file, index) => (
        <li key={index + file.text} className="converter__links-item">
          <DownloadLink
            href={URL.createObjectURL(
              new Blob([file.blob], { type: "audio/ogg" }),
            )}
            text={file.text}
            download={file.download}
          />
        </li>
      ))}
    </ul>
  );
}
