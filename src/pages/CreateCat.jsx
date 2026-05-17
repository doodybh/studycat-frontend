import { useState, useMemo, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import CatPreview from "../components/CatPreview";

import { colornames } from "color-name-list";
import nearestColor from "nearest-color";

function CreateCat({ setCat }) {
  useEffect(() => {
    document.title = "Create Your Cat | StudyCat";
  }, []);

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    color: "#a9a9a9",
  });

  const [errorMessage, setErrorMessage] = useState("");

  const nearest = useMemo(() => {
    const colors = {};

    colornames.forEach((color) => {
      colors[color.name] = color.hex;
    });

    return nearestColor.from(colors);
  }, []);

  const colorName = useMemo(() => {
    return nearest(formData.color).name;
  }, [formData.color, nearest]);

  function handleChange(event) {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  }

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      const token = localStorage.getItem("token");

      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/cat`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setCat(response.data);
      navigate("/dashboard");
    } catch (err) {
      setErrorMessage(err.response?.data?.err || "Could not create cat");
    }
  }

  return (
    <main className="page-center">
      <section className="card">
        <h1 className="title">Create Your Study Cat</h1>

        <CatPreview color={formData.color} />

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Cat Name:</label>

            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="color">Cat Color:</label>

            <input
              id="color"
              name="color"
              type="color"
              value={formData.color}
              onChange={handleChange}
            />
          </div>

          <p className="selected-color">
            Selected color: {colorName} ({formData.color})
          </p>

          <button type="submit">Create Cat</button>
        </form>

        {errorMessage && <p className="error">{errorMessage}</p>}
      </section>
    </main>
  );
}

export default CreateCat;
