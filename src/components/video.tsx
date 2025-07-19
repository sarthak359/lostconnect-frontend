import { useRef, useEffect } from "react";

const VideoPlayer = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 2; // Set to desired speed
    }
  }, []);

  return (
    <video
      ref={videoRef}
      className="w-[300px] md:w-[500px] border-[5px] border-[#ffff] scale-[1.1]"
      src="/black&white.mp4"
      autoPlay
      loop
      muted
    ></video>
  );
};

export default VideoPlayer;
