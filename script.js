const { useState, useEffect, useRef } = React;

function App() {
  const [breakLength, setBreakLength] = useState(5);
  const [sessionLength, setSessionLength] = useState(25);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isSession, setIsSession] = useState(true);
  const intervalRef = useRef(null);
  const audioRef = useRef(null);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return (minutes < 10 ? "0" : "") + minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
  };

  const reset = () => {
    clearInterval(intervalRef.current);
    setBreakLength(5);
    setSessionLength(25);
    setTimeLeft(25 * 60);
    setIsRunning(false);
    setIsSession(true);
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
  };

  const handleStartStop = () => {
    if (isRunning) {
      clearInterval(intervalRef.current);
      setIsRunning(false);
    } else {
      setIsRunning(true);
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    }
  };

  useEffect(() => {
    if (timeLeft < 0) {
      setTimeLeft(0);
    }

    if (timeLeft === 0 && isRunning) {
      audioRef.current.play();

      if (isSession) {
        setIsSession(false);
        setTimeLeft(breakLength * 60);
      } else {
        setIsSession(true);
        setTimeLeft(sessionLength * 60);
      }
    }
  }, [timeLeft, isRunning, isSession, breakLength, sessionLength]);

  const decrement = (type) => {
    if (isRunning) return;
    if (type === "break") {
      setBreakLength((prev) => (prev > 1 ? prev - 1 : prev));
    } else {
      setSessionLength((prev) => {
        if (prev > 1) {
          setTimeLeft((prev - 1) * 60);
          return prev - 1;
        }
        return prev;
      });
    }
  };

  const increment = (type) => {
    if (isRunning) return;
    if (type === "break") {
      setBreakLength((prev) => (prev < 60 ? prev + 1 : prev));
    } else {
      setSessionLength((prev) => {
        if (prev < 60) {
          setTimeLeft((prev + 1) * 60);
          return prev + 1;
        }
        return prev;
      });
    }
  };

  useEffect(() => {
    return () => clearInterval(intervalRef.current);
  }, []);

  return (
    <div className="app">
      <h1>25 + 5 Clock</h1>
      <div className="length-controls">
        <div id="break-label">
          Break Length
          <div>
            <button id="break-decrement" onClick={() => decrement("break")}>
              -
            </button>
            <span id="break-length">{breakLength}</span>
            <button id="break-increment" onClick={() => increment("break")}>
              +
            </button>
          </div>
        </div>

        <div id="session-label">
          Session Length
          <div>
            <button id="session-decrement" onClick={() => decrement("session")}>
              -
            </button>
            <span id="session-length">{sessionLength}</span>
            <button id="session-increment" onClick={() => increment("session")}>
              +
            </button>
          </div>
        </div>
      </div>

      <div className="timer">
        <h2 id="timer-label">{isSession ? "Session" : "Break"}</h2>
        <div id="time-left">{formatTime(timeLeft)}</div>
      </div>

      <div className="controls">
        <button id="start_stop" onClick={handleStartStop}>
          Start/Stop
        </button>
        <button id="reset" onClick={reset}>
          Reset
        </button>
      </div>

      <audio id="beep" ref={audioRef} src="https://actions.google.com/sounds/v1/alarms/alarm_clock.ogg" />
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));
