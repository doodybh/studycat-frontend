import { useEffect, useState } from "react";
import axios from "axios";
import CatPreview from "../components/CatPreview";

import background1 from "../assets/backgrounds/background-1.png";
import background2 from "../assets/backgrounds/background-2.png";
import background3 from "../assets/backgrounds/background-3.jpg";
import background4 from "../assets/backgrounds/background-4.png";
import background5 from "../assets/backgrounds/background-5.png";
import background6 from "../assets/backgrounds/background-6.gif";

import hat1 from "../assets/hats/hat-1.png";
import hat2 from "../assets/hats/hat-2.png";
import hat3 from "../assets/hats/hat-3.png";
import hat4 from "../assets/hats/hat-4.png";
import hat5 from "../assets/hats/hat-5.png";
import hat6 from "../assets/hats/hat-6.png";
import hat7 from "../assets/hats/hat-7.png";
import hat8 from "../assets/hats/hat-8.png";

import glasses1 from "../assets/glasses/glasses-1.png";
import glasses2 from "../assets/glasses/glasses-2.png";
import glasses3 from "../assets/glasses/glasses-3.png";
import glasses4 from "../assets/glasses/glasses-4.png";
import glasses5 from "../assets/glasses/glasses-5.png";
import glasses6 from "../assets/glasses/glasses-6.png";
import glasses7 from "../assets/glasses/glasses-7.png";
import glasses8 from "../assets/glasses/glasses-8.png";

function Dashboard({ user, setUser, cat, setCat, showPopup }) {
  const [catPosition, setCatPosition] = useState({ x: 50, y: 55 });
  const [shopTab, setShopTab] = useState("hats");

  const [isEditingCat, setIsEditingCat] = useState(false);
  const [editCat, setEditCat] = useState({
    name: cat.name,
    color: cat.color,
  });

  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);

  const [newSubject, setNewSubject] = useState({
    name: "",
    color: "#ff82bd",
  });

  const [editingSubjectId, setEditingSubjectId] = useState(null);
  const [editSubject, setEditSubject] = useState({
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

  const hats = [
    { id: "", name: "None", image: null, level: 1, cost: 0 },
    { id: "hat-1", name: "Hat 1", image: hat1, level: 2, cost: 20 },
    { id: "hat-2", name: "Hat 2", image: hat2, level: 3, cost: 40 },
    { id: "hat-3", name: "Hat 3", image: hat3, level: 5, cost: 75 },
    { id: "hat-4", name: "Hat 4", image: hat4, level: 7, cost: 110 },
    { id: "hat-5", name: "Hat 5", image: hat5, level: 9, cost: 150 },
    { id: "hat-6", name: "Hat 6", image: hat6, level: 11, cost: 200 },
    { id: "hat-7", name: "Hat 7", image: hat7, level: 13, cost: 250 },
    { id: "hat-8", name: "Hat 8", image: hat8, level: 15, cost: 320 },
  ];

  const glasses = [
    { id: "", name: "None", image: null, level: 1, cost: 0 },
    { id: "glasses-1", name: "Glasses 1", image: glasses1, level: 2, cost: 25 },
    { id: "glasses-2", name: "Glasses 2", image: glasses2, level: 4, cost: 55 },
    { id: "glasses-3", name: "Glasses 3", image: glasses3, level: 6, cost: 90 },
    {
      id: "glasses-4",
      name: "Glasses 4",
      image: glasses4,
      level: 8,
      cost: 130,
    },
    {
      id: "glasses-5",
      name: "Glasses 5",
      image: glasses5,
      level: 10,
      cost: 175,
    },
    {
      id: "glasses-6",
      name: "Glasses 6",
      image: glasses6,
      level: 12,
      cost: 220,
    },
    {
      id: "glasses-7",
      name: "Glasses 7",
      image: glasses7,
      level: 14,
      cost: 280,
    },
    {
      id: "glasses-8",
      name: "Glasses 8",
      image: glasses8,
      level: 16,
      cost: 350,
    },
  ];

  const backgroundsList = [
    {
      id: "background-1",
      name: "Room 1",
      image: background1,
      level: 1,
      cost: 0,
    },
    {
      id: "background-2",
      name: "Room 2",
      image: background2,
      level: 5,
      cost: 120,
    },
    {
      id: "background-3",
      name: "Room 3",
      image: background3,
      level: 10,
      cost: 250,
    },
    {
      id: "background-4",
      name: "Room 4",
      image: background4,
      level: 15,
      cost: 400,
    },
    {
      id: "background-5",
      name: "Room 5",
      image: background5,
      level: 20,
      cost: 600,
    },
    {
      id: "background-6",
      name: "Room 6",
      image: background6,
      level: 25,
      cost: 850,
    },
  ];

  const backgrounds = {
    "background-1": background1,
    "background-2": background2,
    "background-3": background3,
    "background-4": background4,
    "background-5": background5,
    "background-6": background6,
  };

  const currentBackground = backgrounds[cat.equippedBackground] || background1;

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

      async giveXP(xpAmount) {
        try {
          const currentXP = user?.xp || 0;

          const response = await axios.put(
            `${import.meta.env.VITE_BACKEND_URL}/auth/debug`,
            { xp: currentXP + xpAmount },
            { headers: getAuthHeaders() },
          );

          setUser(response.data);
        } catch (err) {
          console.log(err.response?.data?.err || "Could not give XP");
        }
      },

      async setLevel(level) {
        try {
          const response = await axios.put(
            `${import.meta.env.VITE_BACKEND_URL}/auth/debug`,
            { level },
            { headers: getAuthHeaders() },
          );

          setUser(response.data);
        } catch (err) {
          console.log(err.response?.data?.err || "Could not set level");
        }
      },

      async setCoins(coins) {
        try {
          const response = await axios.put(
            `${import.meta.env.VITE_BACKEND_URL}/auth/debug`,
            { coins },
            { headers: getAuthHeaders() },
          );

          setUser(response.data);
        } catch (err) {
          console.log(err.response?.data?.err || "Could not set coins");
        }
      },
    };
  }, [timerMode, setUser, user]);

  function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;

    return `${minutes}:${secs.toString().padStart(2, "0")}`;
  }

  function getAuthHeaders() {
    const token = localStorage.getItem("token");

    return {
      Authorization: `Bearer ${token}`,
    };
  }

  function startEditCat() {
    setIsEditingCat(true);
    setEditCat({
      name: cat.name,
      color: cat.color,
    });
  }

  function cancelEditCat() {
    setIsEditingCat(false);
  }

  async function saveEditCat() {
    if (!editCat.name.trim()) return;

    try {
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/cat/edit`,
        editCat,
        {
          headers: getAuthHeaders(),
        },
      );

      setCat(response.data);
      setIsEditingCat(false);
    } catch (err) {
      showPopup("Error", err.response?.data?.err || "Could not edit cat");
    }
  }

  async function equipItem(type, item) {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/cat`,
        {
          type,
          id: item.id,
          cost: item.cost,
        },
        {
          headers: getAuthHeaders(),
        },
      );

      setCat(response.data.cat);
      setUser(response.data.user);
    } catch (err) {
      showPopup("Error", err.response?.data?.err || "Could not buy/equip item");
    }
  }

  function renderInventoryItem(
    item,
    equippedValue,
    type,
    ownedItems = [],
    isBackground = false,
  ) {
    const isLocked = user.level < item.level;
    const isOwned =
      item.id === "" || item.cost === 0 || ownedItems.includes(item.id);

    return (
      <button
        key={item.id || `none-${type}`}
        disabled={isLocked}
        className={`inventory-item ${
          equippedValue === item.id ? "equipped-item" : ""
        } ${isLocked ? "locked-item" : ""}`}
        onClick={() => {
          if (!isLocked) {
            equipItem(type, item);
          }
        }}
      >
        {item.image ? (
          <img
            className={isBackground ? "inventory-background-img" : ""}
            src={item.image}
            alt={item.name}
          />
        ) : (
          <span>None</span>
        )}

        {item.id !== "" && (
          <div className="inventory-item-info">
            <p>{isOwned ? "Owned" : `🪙 ${item.cost}`}</p>
          </div>
        )}

        {isLocked && (
          <div className="lock-overlay">
            <span>🔒</span>
            <p>Unlocks at Level {item.level}</p>
          </div>
        )}
      </button>
    );
  }

  async function getSubjects() {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/subjects`,
        {
          headers: getAuthHeaders(),
        },
      );

      setSubjects(response.data);
      setSelectedSubject(response.data[0] || null);
    } catch (err) {
      console.log(err.response?.data?.err || "Could not get subjects");
    }
  }

  async function addSubject() {
    if (!newSubject.name.trim()) return;

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/subjects`,
        newSubject,
        {
          headers: getAuthHeaders(),
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

  function startEditSubject(subject) {
    setEditingSubjectId(subject._id);
    setEditSubject({
      name: subject.name,
      color: subject.color,
    });
  }

  function cancelEditSubject() {
    setEditingSubjectId(null);
    setEditSubject({
      name: "",
      color: "#ff82bd",
    });
  }

  async function saveEditSubject(subject) {
    if (!editSubject.name.trim()) return;

    const updatedSubject = {
      ...subject,
      name: editSubject.name,
      color: editSubject.color,
    };

    try {
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/subjects/${subject._id}`,
        updatedSubject,
        {
          headers: getAuthHeaders(),
        },
      );

      setSubjects(
        subjects.map((item) =>
          item._id === subject._id ? response.data : item,
        ),
      );

      if (selectedSubject?._id === subject._id) {
        setSelectedSubject(response.data);
      }

      cancelEditSubject();
    } catch (err) {
      console.log(err.response?.data?.err || "Could not edit subject");
    }
  }

  async function deleteSubject(subjectId) {
    showPopup(
      "Delete Subject?",
      "Delete this subject? Its notes will be deleted too.",
      async function () {
        try {
          await axios.delete(
            `${import.meta.env.VITE_BACKEND_URL}/subjects/${subjectId}`,
            {
              headers: getAuthHeaders(),
            },
          );

          const remainingSubjects = subjects.filter(
            (subject) => subject._id !== subjectId,
          );

          setSubjects(remainingSubjects);

          if (selectedSubject?._id === subjectId) {
            setSelectedSubject(remainingSubjects[0] || null);
          }

          if (editingSubjectId === subjectId) {
            cancelEditSubject();
          }
        } catch (err) {
          showPopup(
            "Error",
            err.response?.data?.err || "Could not delete subject",
          );
        }
      },
    );

    return;
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
      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/subjects/${selectedSubject._id}`,
        updatedSubject,
        {
          headers: getAuthHeaders(),
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
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/session/complete`,
        {
          studiedMinutes,
          breakMinutes,
          subjectId: selectedSubject?._id,
        },
        {
          headers: getAuthHeaders(),
        },
      );

      setUser(response.data.user);

      if (response.data.rewardAllowed) {
        showPopup(
          "Session Complete!",
          `+${response.data.xpEarned} XP
+${response.data.coinsEarned} Coins
+${response.data.happinessEarned}% Happiness`,
        );
      } else {
        showPopup(
          "No Reward",
          "Break exceeded 7 minutes.\nNo XP or coins earned.",
        );
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
        <div className="inventory-layout">
          <aside className="panel inventory-panel">
            <h2>Inventory</h2>

            <div className="inventory-tabs">
              <button
                className={shopTab === "hats" ? "active-mode" : ""}
                onClick={() => setShopTab("hats")}
              >
                Hats
              </button>

              <button
                className={shopTab === "glasses" ? "active-mode" : ""}
                onClick={() => setShopTab("glasses")}
              >
                Glasses
              </button>

              <button
                className={shopTab === "backgrounds" ? "active-mode" : ""}
                onClick={() => setShopTab("backgrounds")}
              >
                Rooms
              </button>
            </div>

            <div className="inventory-grid">
              {shopTab === "hats" &&
                hats.map((hat) =>
                  renderInventoryItem(
                    hat,
                    cat.equippedHat,
                    "hat",
                    cat.ownedHats,
                  ),
                )}

              {shopTab === "glasses" &&
                glasses.map((glass) =>
                  renderInventoryItem(
                    glass,
                    cat.equippedGlasses,
                    "glasses",
                    cat.ownedGlasses,
                  ),
                )}

              {shopTab === "backgrounds" &&
                backgroundsList.map((background) =>
                  renderInventoryItem(
                    background,
                    cat.equippedBackground,
                    "background",
                    cat.ownedBackgrounds,
                    true,
                  ),
                )}
            </div>
          </aside>

          <div className="inventory-main">
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
                  <CatPreview
                    color={cat.color}
                    equippedHat={cat.equippedHat}
                    equippedGlasses={cat.equippedGlasses}
                  />
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
                    <div
                      key={subject._id}
                      className="subject-row"
                      style={{
                        borderLeftColor: subject.color,
                      }}
                    >
                      {editingSubjectId === subject._id ? (
                        <>
                          <input
                            className="edit-subject-input"
                            type="text"
                            value={editSubject.name}
                            onChange={(event) =>
                              setEditSubject({
                                ...editSubject,
                                name: event.target.value,
                              })
                            }
                          />

                          <input
                            className="edit-subject-color"
                            type="color"
                            value={editSubject.color}
                            onChange={(event) =>
                              setEditSubject({
                                ...editSubject,
                                color: event.target.value,
                              })
                            }
                          />

                          <button
                            className="subject-icon-button"
                            onClick={() => saveEditSubject(subject)}
                          >
                            ✓
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            className={`subject-button ${
                              selectedSubject?._id === subject._id
                                ? "selected-subject"
                                : ""
                            }`}
                            onClick={() => setSelectedSubject(subject)}
                          >
                            {subject.name}
                          </button>

                          <button
                            className="subject-icon-button"
                            onClick={() => startEditSubject(subject)}
                          >
                            ✎
                          </button>

                          <button
                            className="subject-icon-button delete-subject-button"
                            onClick={() => deleteSubject(subject._id)}
                          >
                            🗑
                          </button>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="panel fixed-panel cat-info-panel">
                {isEditingCat ? (
                  <>
                    <h2>Edit Cat</h2>

                    <div
                      style={{
                        transform: "scale(0.55)",
                        transformOrigin: "center",
                        height: "150px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        margin: "-40px 0 -20px",
                      }}
                    >
                      <CatPreview
                        color={editCat.color}
                        equippedHat={cat.equippedHat}
                        equippedGlasses={cat.equippedGlasses}
                      />
                    </div>

                    <input
                      type="text"
                      value={editCat.name}
                      onChange={(event) =>
                        setEditCat({ ...editCat, name: event.target.value })
                      }
                    />

                    <input
                      type="color"
                      value={editCat.color}
                      onChange={(event) =>
                        setEditCat({ ...editCat, color: event.target.value })
                      }
                    />

                    <button onClick={saveEditCat}>Save</button>
                    <button onClick={cancelEditCat} className="cancel-button">Cancel</button>
                  </>
                ) : (
                  <>
                    <h2>{cat.name}</h2>

                    <p>Level: {user.level}</p>
                    <p>
                      XP: {user.xp} / {user.level * 100}
                    </p>
                    <p>Coins: {user.coins}</p>
                    <p>Happiness: {user.happiness}%</p>

                    <button onClick={startEditCat}>Edit Cat</button>
                  </>
                )}
              </div>
            </section>

            <section className="notes-card">
              <div className="notes-header">
                <h2>
                  {selectedSubject ? `${selectedSubject.name} Notes:` : ""}
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
        </div>
      </div>
    </main>
  );
}

export default Dashboard;
