import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import CatPreview from "../components/CatPreview";

function CreateCat() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    color: "#a9a9a9",
  });

  const [errorMessage, setErrorMessage] = useState("");

  function handleChange(event) {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  }

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      const token = localStorage.getItem("token");

      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/cat`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      navigate("/dashboard");
    } catch (err) {
      setErrorMessage(err.response?.data?.err || "Could not create cat");
    }
  }

  return (
    <div>
      <h1>Create Your Study Cat</h1>

      <CatPreview color={formData.color} />

      <form onSubmit={handleSubmit}>
        <div>
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

        <div>
          <label htmlFor="color">Cat Color:</label>
          <input
            id="color"
            name="color"
            type="color"
            value={formData.color}
            onChange={handleChange}
          />
        </div>

        <p>Selected color: {formData.color}</p>

        <button type="submit">Create Cat</button>
      </form>

      {errorMessage && (
        <p style={{ color: "red" }} role="alert">
          {errorMessage}
        </p>
      )}
    </div>
  );
}

export default CreateCat;
