import React from "react";

export default function UploadFilesList({ files }) {
  if (!files.length) return null;
  return (
    <ul className="files-list">
      {files.map((file, index) => (
        <li key={file.name + index} className="files-list__item">
          {file.name}
        </li>
      ))}
    </ul>
  );
}
