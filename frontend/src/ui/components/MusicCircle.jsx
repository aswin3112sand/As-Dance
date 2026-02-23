import React, { memo, useEffect, useRef, useState } from "react";
import { Pause, Play } from "../icons.jsx";
import "./MusicCircle.css";

function MusicCircle({
  audioSrc,
  coverSrc,
  title = "Background music control",
  className = "",
}) {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return undefined;

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.pause();
      audio.currentTime = 0;
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("ended", handleEnded);
    };
  }, []);

  const onToggle = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      try {
        await audio.play();
      } catch {
        setIsPlaying(false);
      }
      return;
    }

    audio.pause();
  };

  return (
    <div className={`music-circle-shell ${className}`}>
      <audio ref={audioRef} preload="metadata" src={audioSrc} />

      <button
        type="button"
        className={`music-circle-btn${isPlaying ? " is-playing" : ""}`}
        aria-label={title}
        aria-pressed={isPlaying}
        onClick={onToggle}
      >
        {isPlaying ? <span className="music-circle-ring" aria-hidden="true" /> : null}
        <img
          src={coverSrc}
          alt="Music cover"
          loading="lazy"
          decoding="async"
          className="music-circle-cover"
          width="160"
          height="160"
        />
        <span className="music-circle-overlay" aria-hidden="true" />

        <span className="music-circle-control" aria-hidden="true">
          {isPlaying ? <Pause size={16} /> : <Play size={16} />}
        </span>

        <span className={`music-circle-bars${isPlaying ? " is-playing" : ""}`} aria-hidden="true">
          <span className="bar" />
          <span className="bar" />
          <span className="bar" />
        </span>
      </button>
    </div>
  );
}

export default memo(MusicCircle);
