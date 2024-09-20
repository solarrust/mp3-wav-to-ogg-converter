import React, { forwardRef } from "react";

const AudioPlayer = forwardRef(function (props, ref) {
  return <audio className="converter__audio" ref={ref} controls></audio>;
});

AudioPlayer.displayName = "AudioPlayer";
export default AudioPlayer;
