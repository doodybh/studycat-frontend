import { useEffect, useState } from "react";
import axios from "axios";
import CatPreview from "../components/CatPreview";

import starterRoom from "../assets/backgrounds/background-1.png";

function Dashboard({ user, cat }) {
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

  const backgrounds = {
    "starter-room": starterRoom,
  };

  const currentBackground = backgrounds[cat.equippedBackground] || starterRoom;

  useEffect(() => {
    getSubjects();
  }, []);

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
          <div className="panel fixed-panel">
            <h2>Study Timer</h2>
            <p className="timer-text">10:00</p>
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

            <p>Level: 1</p>
            <p>XP: 0 / 100</p>
            <p>Happiness: {cat.happiness || 50}%</p>
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
