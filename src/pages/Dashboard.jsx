import { useEffect, useState } from "react";
import axios from "axios";
import CatPreview from "../components/CatPreview";

import starterRoom from "../assets/backgrounds/background-1.png";

function Dashboard({ user, setUser, cat }) {
  const [catPosition, setCatPosition] = useState({
    x: 50,
    y: 55,
  });

  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);

  const [newSubject, setNewSubject] = useState({
    name: "",
    color: "#ff82bd",
  });

  const [timerMode, setTimerMode] = useState("countdown");
  const [sessionMinutes, setSessionMinutes] = useState(25);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isStudying, setIsStudying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [breakSeconds, setBreakSeconds] = useState(0);

  const backgrounds = {
    "starter-room": starterRoom,
  };

  const currentBackground = backgrounds[cat.equippedBackground] || starterRoom;

  useEffect(() => {
    getSubjects();
  }, []);

  useEffect(() => {
    if (!isStudying || isPaused) return;

    const timer = setInterval(() => {
      if (timerMode === "countdown") {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            endSession();
            return 0;
          }

          return prev - 1;
        });

        setTimeElapsed((prev) => prev + 1);
      } else {
        setTimeElapsed((prev) => prev + 1);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [isStudying, isPaused, timerMode]);

  useEffect(() => {
    if (!isStudying || !isPaused) return;

    const breakTimer = setInterval(() => {
      setBreakSeconds((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(breakTimer);
  }, [isStudying, isPaused]);

  useEffect(() => {
    window.studyDebug = {
      addTime(seconds) {
        setTimeElapsed((prev) => prev + seconds);

        if (timerMode === "countdown") {
          setTimeLeft((prev) => Math.max(0, prev - seconds));
        }
      },

      addBreak(seconds) {
        setBreakSeconds((prev) => prev + seconds);
      },

      giveXP(xpAmount) {
        setUser((prev) => ({
          ...prev,
          xp: prev.xp + xpAmount,
        }));
      },

      setLevel(level) {
        setUser((prev) => ({
          ...prev,
          level,
        }));
      },

      setCoins(coins) {
        setUser((prev) => ({
          ...prev,
          coins,
        }));
      },
    };
  }, [timerMode, setUser]);

  function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;

    return `${minutes}:${secs.toString().padStart(2, "0")}`;
  }

  async function getSubjects() {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/subjects`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setSubjects(response.data);

      if (response.data.length > 0) {
        setSelectedSubject(response.data[0]);
      }
    } catch (err) {
      console.log(err.response?.data?.err || "Could not get subjects");
    }
  }

  async function addSubject() {
    if (!newSubject.name.trim()) return;

    try {
      const token = localStorage.getItem("token");

      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/subjects`,
        newSubject,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setSubjects([response.data, ...subjects]);
      setSelectedSubject(response.data);

      setNewSubject({
        name: "",
        color: "#ff82bd",
      });
    } catch (err) {
      console.log(err.response?.data?.err || "Could not add subject");
    }
  }

  async function updateNotes(event) {
    if (!selectedSubject) return;

    const updatedNotes = event.target.value;

    const updatedSubject = {
      ...selectedSubject,
      notes: updatedNotes,
    };

    setSelectedSubject(updatedSubject);

    setSubjects(
      subjects.map((subject) =>
        subject._id === selectedSubject._id ? updatedSubject : subject,
      ),
    );

    try {
      const token = localStorage.getItem("token");

      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/subjects/${selectedSubject._id}`,
        updatedSubject,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
    } catch (err) {
      console.log(err.response?.data?.err || "Could not update notes");
    }
  }

  function startSession() {
    const safeMinutes = Math.min(Math.max(sessionMinutes, 5), 180);

    setSessionMinutes(safeMinutes);

    setTimeElapsed(0);

    setBreakSeconds(0);

    setIsPaused(false);

    if (timerMode === "countdown") {
      setTimeLeft(safeMinutes * 60);
    }

    setIsStudying(true);
  }

  function toggleBreak() {
    setIsPaused(!isPaused);
  }

  async function endSession() {
    setIsStudying(false);

    setIsPaused(false);

    const studiedMinutes = Math.floor(timeElapsed / 60);

    const breakMinutes = Math.ceil(breakSeconds / 60);

    try {
      const token = localStorage.getItem("token");

      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/session/complete`,
        {
          studiedMinutes,
          breakMinutes,
          subjectId: selectedSubject?._id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setUser(response.data.user);

      if (response.data.rewardAllowed) {
        alert(
          `Session complete!

+${response.data.xpEarned} XP
+${response.data.coinsEarned} Coins
+${response.data.happinessEarned}% Happiness`,
        );
      } else {
        alert("Break exceeded 7 minutes.\nNo XP or coins earned.");
      }
    } catch (err) {
      console.log(err.response?.data?.err || "Could not complete session");
    }
  }

  function moveCat(event) {
    const room = event.currentTarget.getBoundingClientRect();

    const x = ((event.clientX - room.left) / room.width) * 100;
    const y = ((event.clientY - room.top) / room.height) * 100;

    setCatPosition({ x, y });
  }

  return (
    <main className="dashboard-page">
      <div className="app-container">
        <h1 className="dashboard-title">Welcome, {user.username}</h1>

        <section className="room-container">
          <div
            className="room-background"
            onClick={moveCat}
            style={{
              backgroundImage: `url(${currentBackground})`,
            }}
          >
            <div
              className="draggable-cat"
              style={{
                left: `${catPosition.x}%`,
                top: `${catPosition.y}%`,
              }}
            >
              <CatPreview color={cat.color} />
            </div>
          </div>
        </section>

        <section className="dashboard-actions">
          <div className="panel fixed-panel timer-panel">
            <h2>Study Timer</h2>

            <div className="timer-mode-switch">
              <button
                disabled={isStudying}
                className={timerMode === "countdown" ? "active-mode" : ""}
                onClick={() => setTimerMode("countdown")}
              >
                Countdown
              </button>

              <button
                disabled={isStudying}
                className={timerMode === "stopwatch" ? "active-mode" : ""}
                onClick={() => setTimerMode("stopwatch")}
              >
                Stopwatch
              </button>
            </div>
            <p className="timer-text">
              {timerMode === "countdown"
                ? formatTime(timeLeft)
                : formatTime(timeElapsed)}
            </p>

            {isPaused && (
              <p className="break-text">
                Break: {formatTime(breakSeconds)} / 7:00
                <br />
                Over 7 minutes = no XP or coins.
              </p>
            )}

            {!isStudying && timerMode === "countdown" && (
              <div className="slider-section">
                <label>Session Length: {sessionMinutes} min</label>

                <input
                  type="range"
                  min="5"
                  max="180"
                  step="5"
                  value={sessionMinutes}
                  onChange={(event) =>
                    setSessionMinutes(Number(event.target.value))
                  }
                />
              </div>
            )}

            {!isStudying ? (
              <button onClick={startSession}>Start Session</button>
            ) : (
              <>
                <button onClick={toggleBreak}>
                  {isPaused ? "Resume Study" : "Pause for Break"}
                </button>

                <button className="end-session-button" onClick={endSession}>
                  End Session
                </button>
              </>
            )}
          </div>

          <div className="panel fixed-panel subjects-panel">
            <div className="subjects-header">
              <h2>Subjects</h2>

              <button className="add-subject-button" onClick={addSubject}>
                +
              </button>
            </div>

            <div className="subject-form">
              <input
                type="text"
                placeholder="New subject..."
                value={newSubject.name}
                onChange={(event) =>
                  setNewSubject({
                    ...newSubject,
                    name: event.target.value,
                  })
                }
              />

              <input
                className="subject-color-picker"
                type="color"
                value={newSubject.color}
                onChange={(event) =>
                  setNewSubject({
                    ...newSubject,
                    color: event.target.value,
                  })
                }
              />
            </div>

            <div className="subjects-list">
              {subjects.map((subject) => (
                <button
                  key={subject._id}
                  className={`subject-button ${
                    selectedSubject?._id === subject._id
                      ? "selected-subject"
                      : ""
                  }`}
                  style={{
                    borderColor: subject.color,
                  }}
                  onClick={() => setSelectedSubject(subject)}
                >
                  {subject.name}
                </button>
              ))}
            </div>
          </div>

          <div className="panel fixed-panel cat-info-panel">
            <h2>{cat.name}</h2>

            <p>Level: {user.level}</p>
            <p>
              XP: {user.xp} / {user.level * 100}
            </p>
            <p>Coins: {user.coins}</p>
            <p>Happiness: {user.happiness}%</p>
          </div>
        </section>

        <section className="notes-card">
          <div className="notes-header">
            <h2>
              Notes
              {selectedSubject ? `: ${selectedSubject.name}` : ""}
            </h2>
          </div>

          <textarea
            placeholder={
              selectedSubject
                ? "Write your notes here..."
                : "Select or create a subject first..."
            }
            value={selectedSubject?.notes || ""}
            onChange={updateNotes}
            disabled={!selectedSubject}
          />
        </section>
      </div>
    </main>
  );
}

export default Dashboard;
