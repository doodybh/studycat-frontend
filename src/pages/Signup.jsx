import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router";

function Signup({ showPopup }) {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Sign Up | StudyCat";
  }, []);

  const usernameValid = formData.username.trim().length >= 3;
  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);

  const passwordChecks = {
    length: formData.password.length >= 8,
    letter: /[A-Za-z]/.test(formData.password),
    number: /[0-9]/.test(formData.password),
    special: /[^A-Za-z0-9]/.test(formData.password),
    match:
      formData.confirmPassword.length > 0 &&
      formData.password === formData.confirmPassword,
  };

  const passwordValid =
    passwordChecks.length &&
    passwordChecks.letter &&
    passwordChecks.number &&
    passwordChecks.special;

  const formValid =
    usernameValid && emailValid && passwordValid && passwordChecks.match;

  function handleChange(event) {
    setFormData({ ...formData, [event.target.name]: event.target.value });
    setErrorMessage("");
  }

  function cleanError(message) {
    const lower = message.toLowerCase();

    if (lower.includes("email")) return "Email is already in use.";
    if (lower.includes("username")) return "Username is already taken.";
    if (lower.includes("duplicate key") && lower.includes("email")) {
      return "Email is already in use.";
    }
    if (lower.includes("duplicate key") && lower.includes("username")) {
      return "Username is already taken.";
    }

    return message;
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (isSubmitting) return;

    if (!formValid) {
      setErrorMessage("Please fix the form errors first.");
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage("");

      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/auth/sign-up`, {
        username: formData.username.toLowerCase().trim(),
        email: formData.email.toLowerCase().trim(),
        password: formData.password,
      });

      setFormData({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
      });

      showPopup(
        "Account Created!",
        "Your account was created successfully. Please sign in.",
      );

      navigate("/sign-in");
    } catch (err) {
      const message =
        err.response?.data?.err || "An error occurred during sign up";

      setErrorMessage(cleanError(message));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="page-center">
      <section className="card">
        <h1 className="title">Create Account</h1>

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="username">Username</label>

            <input
              id="username"
              name="username"
              type="text"
              value={formData.username}
              onChange={handleChange}
              className={
                usernameValid
                  ? "is-valid"
                  : formData.username.length > 0
                    ? "is-invalid"
                    : ""
              }
              required
            />

            {formData.username.length > 0 && !usernameValid && (
              <div className="invalid-feedback">
                Username should be at least 3 characters.
              </div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>

            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className={
                emailValid
                  ? "is-valid"
                  : formData.email.length > 0
                    ? "is-invalid"
                    : ""
              }
              required
            />

            {formData.email.length > 0 && !emailValid && (
              <div className="invalid-feedback">
                Email should be valid, like example@mail.com.
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

            {formData.password.length > 0 && (
              <div className="auth-rules">
                <p
                  className={
                    passwordChecks.length ? "rule-valid" : "rule-invalid"
                  }
                >
                  {passwordChecks.length ? "✓" : "✕"} At least 8 characters
                </p>

                <p
                  className={
                    passwordChecks.letter ? "rule-valid" : "rule-invalid"
                  }
                >
                  {passwordChecks.letter ? "✓" : "✕"} At least one letter
                </p>

                <p
                  className={
                    passwordChecks.number ? "rule-valid" : "rule-invalid"
                  }
                >
                  {passwordChecks.number ? "✓" : "✕"} At least one number
                </p>

                <p
                  className={
                    passwordChecks.special ? "rule-valid" : "rule-invalid"
                  }
                >
                  {passwordChecks.special ? "✓" : "✕"} At least one special
                  character
                </p>
              </div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>

            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={
                passwordChecks.match
                  ? "is-valid"
                  : formData.confirmPassword.length > 0
                    ? "is-invalid"
                    : ""
              }
              required
            />

            {formData.confirmPassword.length > 0 && !passwordChecks.match && (
              <div className="invalid-feedback">Passwords do not match.</div>
            )}

            {passwordChecks.match && (
              <div className="valid-feedback">Passwords match.</div>
            )}
          </div>

          <button type="submit" disabled={!formValid || isSubmitting}>
            {isSubmitting ? "Creating Account..." : "Sign Up"}
          </button>
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
