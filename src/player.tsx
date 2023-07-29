import './player.css';
import React, { useEffect, useRef, useState } from 'react';
import WaveSurfer from 'wavesurfer.js';
import { Play } from './play';
import { Pause } from './pause';

type Props = {
  audioFile: string;
  dark?: boolean;
}


export const WhatsappAudioPlayer: React.FC<Props> = (
  { audioFile, dark = false }
) => {
  const ref = useRef<HTMLDivElement>(null);
  const waveSurferRef = useRef<WaveSurfer | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [duration, setDuration] = useState('00:00');

  useEffect(() => {
    const wavesurfer = WaveSurfer.create({
      container: ref.current!,
      waveColor: '#cfd0d1',
      progressColor: dark ? '#ffffff' : '#858a8d',
      url: audioFile,

      cursorWidth: 0,
      height: 30,

      barWidth: 2.5,
      barGap: 1.2,
      barRadius: 3,
      barHeight: 1.5,
    });

    wavesurfer.once('ready', () => {
      const shadowRoot = ref.current!.children[0].shadowRoot!;
      shadowRoot.querySelector('.cursor')!.innerHTML += '<span style="display: block; margin-top: 10px; width: 10px; height: 10px; border-radius: 50%; background-color: #4fc4f7; margin-left: -5px"></span>';
      const style = document.createElement('style');
      style.innerHTML = ':host .scroll { padding-left: 5px; padding-right: 5px }';
      shadowRoot.appendChild(style);
      if (wavesurfer.getDuration() >= 3600) {
        setDuration(new Date(wavesurfer.getDuration() * 1000).toISOString().slice(11, 19));
      } else {
        setDuration(new Date(wavesurfer.getDuration() * 1000).toISOString().slice(14, 19));
      }
    });

    wavesurfer.on('finish', () => {
      setIsPlaying(false);
      wavesurfer.setTime(0);
    });

    wavesurfer.on('timeupdate', (time) => {
      if (wavesurfer.getDuration() >= 3600) {
        setDuration(new Date(time * 1000).toISOString().slice(11, 19));
      } else {
        setDuration(new Date(time * 1000).toISOString().slice(14, 19));
      }
    });

    waveSurferRef.current = wavesurfer;

  }, []);

  useEffect(() => {
    waveSurferRef.current!.setPlaybackRate(speed, true);
  }, [speed])

  const handleControlClick = () => {
    if (waveSurferRef.current!.isPlaying()) {
      waveSurferRef.current!.pause();
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      waveSurferRef.current!.play();
    }
  }

  const handlePlaybackClick = () => {
    if (speed === 1) {
      setSpeed(1.5);
    } else if (speed === 1.5) {
      setSpeed(2)
    } else {
      setSpeed(1);
    }
  }

  return (
    <div className={`whatsapp-player${dark ? ' whatsapp-player__dark' : ''}`}>
      <div className="whatsapp-player__main">
        <div className="whatsapp-player__control" onClick={handleControlClick}>
          {isPlaying ? <Pause /> : <Play />}
        </div>
        <div ref={ref} className="whatsapp-player__waves-container"/>
        <div className="whatsapp-player__playback-rate" onClick={handlePlaybackClick}>
          {speed}x
        </div>
      </div>
      <span className="whatsapp-player__duration">{duration}</span>
    </div>
  )
}
