import React, { useState, useRef, useEffect } from 'react';

const App = () => {
  const [breakLength, setBreakLength] = useState(5);
  const [sessionLength, setSessionLength] = useState(25);
  const [timeLeft, setTimeLeft] = useState(sessionLength * 60);
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerType, setTimerType] = useState('Session');
  const audioRef = useRef(null);

  useEffect(() => {
    let timer;

    if (timerRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      audioRef.current.play();
      if (timerType === 'Session') {
        setTimerType('Break');
        setTimeLeft(breakLength * 60);
      } else {
        setTimerType('Session');
        setTimeLeft(sessionLength * 60);
      }
    }

    return () => clearInterval(timer);
  }, [timerRunning, timeLeft, breakLength, sessionLength, timerType]);

  const handleStartStop = () => {
    setTimerRunning(!timerRunning);
  };

  const handleReset = () => {
    setTimerRunning(false);
    setTimerType('Session');
    setSessionLength(25);
    setBreakLength(5);
    setTimeLeft(25 * 60);
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const decrementBreakLength = () => {
    if (breakLength > 1) {
      setBreakLength(breakLength - 1);
    }
  };

  const incrementBreakLength = () => {
    if (breakLength < 60) {
      setBreakLength(breakLength + 1);
    }
  };

  const decrementSessionLength = () => {
    if (sessionLength > 1) {
      setSessionLength(sessionLength - 1);
      if (!timerRunning && timerType === 'Session') {
        setTimeLeft((sessionLength - 1) * 60);
      }
    }
  };

  const incrementSessionLength = () => {
    if (sessionLength < 60) {
      setSessionLength(sessionLength + 1);
      if (!timerRunning && timerType === 'Session') {
        setTimeLeft((sessionLength + 1) * 60);
      }
    }
  };

  return (
    <div className="container">
      <h1>25 + 5 Clock</h1>
      <div className="break-session-container">
        <div id="break-label">
          <p className="label-title">Break Length</p>
          <div className="break-length">
            <button id="break-decrement" onClick={decrementBreakLength}>-</button>
            <p id="break-length">{breakLength}</p>
            <button id="break-increment" onClick={incrementBreakLength}>+</button>
          </div>
        </div>
        <div id="session-label">
          <p className="label-title">Session Length</p>
          <div className="session-length">
            <button id="session-decrement" onClick={decrementSessionLength}>-</button>
            <p id="session-length">{sessionLength}</p>
            <button id="session-increment" onClick={incrementSessionLength}>+</button>
          </div>
        </div>
      </div>
      <div id="timer-label">
        <p className="label-title">{timerType}</p>
        <p id="time-left">{formatTime(timeLeft)}</p>
        <div className="start-reset">
          <button id="start_stop" onClick={handleStartStop}>{timerRunning ? 'Pause' : 'Start'}</button>
          <button id="reset" onClick={handleReset}>Reset</button>
        </div>
      </div>
      <audio id="beep" ref={audioRef} src="https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav" />
    </div>
  );
};

export default App;
