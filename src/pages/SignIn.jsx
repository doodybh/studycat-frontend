import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router";

function SignIn({ setUser, checkCat }) {
  const [formData, setFormData] = useState({
    login: "",
    password: "",
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Sign In | StudyCat";
  }, []);

  const loginValid = formData.login.trim().length >= 3;
  const passwordValid = formData.password.length >= 8;

  function handleChange(event) {
    setFormData({ ...formData, [event.target.name]: event.target.value });
    setErrorMessage("");
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (isSubmitting) return;

    if (!loginValid || !passwordValid) {
      setErrorMessage("Please fix the form errors first.");
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage("");

      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/auth/sign-in`,
        {
          login: formData.login.toLowerCase().trim(),
          password: formData.password,
        },
      );

      const token = response.data.token;
      localStorage.setItem("token", token);

      const userInfo = JSON.parse(atob(token.split(".")[1])).payload;
      setUser(userInfo);

      const foundCat = await checkCat(token);

      setFormData({
        login: "",
        password: "",
      });

      navigate(foundCat ? "/dashboard" : "/create-cat");
    } catch (err) {
      const message =
        err.response?.data?.err || "An error occurred during sign in";

      if (message.toLowerCase().includes("incorrect")) {
        setErrorMessage("Wrong username/email or password.");
      } else {
        setErrorMessage(message);
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="page-center">
      <section className="card">
        <h1 className="title">Login To Your Account</h1>

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="login">Username or Email</label>

            <input
              id="login"
              name="login"
              type="text"
              value={formData.login}
              onChange={handleChange}
              className={
                loginValid
                  ? "is-valid"
                  : formData.login.length > 0
                    ? "is-invalid"
                    : ""
              }
              required
            />

            {formData.login.length > 0 && !loginValid && (
              <div className="invalid-feedback">
                Username/email should be at least 3 characters.
              </div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>

            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              className={
                passwordValid
                  ? "is-valid"
                  : formData.password.length > 0
                    ? "is-invalid"
                    : ""
              }
              required
            />

            {formData.password.length > 0 && !passwordValid && (
              <div className="invalid-feedback">
                Password should be at least 8 characters.
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={!loginValid || !passwordValid || isSubmitting}
          >
            {isSubmitting ? "Signing In..." : "Sign In"}
          </button>
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
