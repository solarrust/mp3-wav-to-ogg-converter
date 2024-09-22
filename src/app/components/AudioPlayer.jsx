import React, { forwardRef } from "react";

function AudioPlayer(props) {
  return <audio className="converter__audio" src={props.src} controls></audio>;
}
export default AudioPlayer;
