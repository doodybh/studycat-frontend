import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router";

function SignIn({ setUser, checkCat }) {
  const [formData, setFormData] = useState({
    login: "",
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
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/auth/sign-in`,
        formData,
      );

      const token = response.data.token;

      localStorage.setItem("token", token);

      const userInfo = JSON.parse(atob(token.split(".")[1])).payload;

      setUser(userInfo);

      await checkCat(token);

      navigate("/create-cat");
    } catch (err) {
      setErrorMessage(
        err.response?.data?.err || "An error occurred during sign in",
      );
    }
  }

  return (
    <main className="page-center">
      <section className="card">
        <h1 className="title">Login To Your Account</h1>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="login">Username or Email</label>

            <input
              id="login"
              name="login"
              type="text"
              value={formData.login}
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

          <button type="submit">Sign In</button>
        </form>

        {errorMessage && <p className="error">{errorMessage}</p>}

        <p className="selected-color">
          Don't have an account? <Link to="/sign-up">Sign Up</Link>
        </p>
      </section>
    </main>
  );
}

export default SignIn;
