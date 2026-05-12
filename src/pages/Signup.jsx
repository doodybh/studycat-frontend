import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";

function Signup({ setUser }) {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/auth/sign-up`,
        formData,
      );

      const token = response.data.token;
      const userInfo = JSON.parse(atob(token.split(".")[1])).payload;

      localStorage.setItem("token", token);
      setUser(userInfo);

      navigate("/create-cat");
    } catch (err) {
      setErrorMessage(
        err.response?.data?.err || "An error occurred during sign up",
      );
    }
  }

  return (
    <div>
      <h1>Sign Up</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Username:</label>
          <input
            id="username"
            name="username"
            type="text"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="email">Email:</label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="password">Password:</label>
          <input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit">Sign Up</button>
      </form>

      {errorMessage && (
        <p style={{ color: "red" }} role="alert">
          {errorMessage}
        </p>
      )}
    </div>
  );
}

export default Signup;
