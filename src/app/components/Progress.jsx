import React, { forwardRef } from "react";
import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";

export default function Progress({ value }) {
  return (
    <Box sx={{ width: "100%" }}>
      <LinearProgress variant="determinate" value={value} />
    </Box>
  );
}
