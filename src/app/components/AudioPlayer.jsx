import React, { forwardRef } from "react";

const AudioPlayer = forwardRef(function (props, ref) {
  return <audio className="converter__audio" ref={ref} controls></audio>;
});

export default AudioPlayer;
