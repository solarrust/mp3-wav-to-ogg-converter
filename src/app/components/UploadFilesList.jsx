import React from "react";

export default function UploadFilesList({files}) {
  return (
    <ul className="converter__files-list">
      {files.map((file, index) => (
        <li key={file.name + index}>{file.name}</li>
      ))}
    </ul>
  );
}
