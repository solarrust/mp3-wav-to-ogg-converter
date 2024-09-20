import React, { forwardRef } from "react";
import Link from "@mui/material/Link";

const DownloadLink = forwardRef(function (props, ref) {
  return (
    <Link component="button" variant="body2" ref={ref}>
      Скачать файл
    </Link>
  );
});

export default DownloadLink;
