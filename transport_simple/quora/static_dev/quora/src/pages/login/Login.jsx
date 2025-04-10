import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Helmet from "react-helmet";
import apis from "@/apis";
import { HttpBadRequestError } from "@/apis/network";

const Login = () => {
  const location = useLocation();
  const urlParams = new URLSearchParams(location.search);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      setLoading(true);
      const user = await apis.loginUser({ username, password });
      localStorage.setItem('isLogged', user.uid !== null);
      navigate(urlParams.get("next") ?? "/");
    } catch (error) {
      let message = "Error logging in!!";
      if (error instanceof HttpBadRequestError) {
        message = error.data.detail;
      }
      alert(message);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Login | Quora</title>
      </Helmet>
      <div className="position-absolute top-50 start-50 translate-middle w-100">
        <div className="container">
          <div className="card mx-auto shadow max-w-400 p-5">
            <h1 className="text-center mb-5">Login</h1>
            <form method="POST" className="form" onSubmit={handleSubmit}>
              <div className="form-group mb-4">
                <label htmlFor="username" className="form-label">
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="form-control w-100"
                  placeholder="Username"
                  autoFocus
                  required
                />
              </div>
              <div className="form-group mb-4">
                <label htmlFor="password" className="form-label">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-control w-100"
                  placeholder="Password"
                  required
                />
              </div>
              <div>
                <button
                  className="btn btn-primary w-100"
                  type="submit"
                  id="login-btn"
                >
                  {loading ? <span
                    className="spinner-border spinner-border-sm"
                  ></span>:
                  <span id="loginBtnText" role="status">
                    Login
                  </span>}
                </button>
              </div>
            </form>
            <hr />
            <Link className="btn btn-outline-primary mt-3" to="/signup">
              Sign Up Instead
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
