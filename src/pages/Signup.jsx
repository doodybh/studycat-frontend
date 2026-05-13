import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router";

function Signup({ showPopup }) {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  function handleChange(event) {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  }

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/auth/sign-up`,
        formData,
      );

      showPopup(
        "Account Created!",
        "Your account was created successfully. Please sign in.",
      );
      navigate("/sign-in");
    } catch (err) {
      setErrorMessage(
        err.response?.data?.err || "An error occurred during sign up",
      );
    }
  }

  return (
    <main className="page-center">
      <section className="card">
        <h1 className="title">Create Account</h1>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username</label>

            <input
              id="username"
              name="username"
              type="text"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>

            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>

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

        {errorMessage && <p className="error">{errorMessage}</p>}

        <p className="selected-color">
          Already have an account? <Link to="/sign-in">Sign In</Link>
        </p>
      </section>
    </main>
  );
}

export default Signup;
