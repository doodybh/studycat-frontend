import { useState } from "react";
import CatPreview from "../components/CatPreview";

import starterRoom from "../assets/backgrounds/background-1.png";

function Dashboard({ user, cat }) {
  const [catPosition, setCatPosition] = useState({
    x: 50,
    y: 55,
  });

  const backgrounds = {
    "starter-room": starterRoom,
  };

  const currentBackground = backgrounds[cat.equippedBackground] || starterRoom;

  function moveCat(event) {
    const room = event.currentTarget.getBoundingClientRect();

    const x = ((event.clientX - room.left) / room.width) * 100;
    const y = ((event.clientY - room.top) / room.height) * 100;

    setCatPosition({
      x,
      y,
    });
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
          <div className="panel">
            <h2>Study Timer</h2>
            <p>10:00</p>
          </div>

          <div className="panel">
            <h2>Subjects</h2>
            <p>meowology</p>
          </div>


            <div className="panel">
              <h2>{cat.name}</h2>

              <p>Level: 1</p>

              <p>XP: 0 / 100</p>

              <p>Happiness: 100%</p>
          </div>
        </section>
      </div>
    </main>
  );
}

export default Dashboard;
