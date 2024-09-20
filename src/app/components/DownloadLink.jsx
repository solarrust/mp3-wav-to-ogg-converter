import React, { forwardRef } from "react";
import Link from "@mui/material/Link";

const DownloadLink = forwardRef(function (props, ref) {
  return (
    <Link href="#" ref={ref} className="converter__download-link">
      Скачать файл
    </Link>
  );
});

DownloadLink.displayName = "DownloadLink";
export default DownloadLink;
