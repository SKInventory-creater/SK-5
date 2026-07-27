import "./styles/app.css";

import SplashPage from "./pages/SplashPage.js";
import LoginPage from "./pages/LoginPage.js";

import {
  registerRoute,
  navigate
} from "./router/index.js";

import { loginUser } from "./services/authService.js";

registerRoute("splash", SplashPage);
registerRoute("login", LoginPage);

navigate("login");

const loginBtn = document.getElementById("loginBtn");

if (loginBtn) {
  loginBtn.onclick = async () => {
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    try {
      await loginUser(email, password);
      alert("Login Success");
    } catch (err) {
      alert(err.message);
    }
  };
}
