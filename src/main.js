import "./styles/app.css";

import SplashPage from "./pages/SplashPage.js";
import LoginPage from "./pages/LoginPage.js";
import DashboardPage from "./pages/DashboardPage.js";

import {
  registerRoute,
  navigate
} from "./router/index.js";

import { loginUser } from "./services/authService.js";
import { authState } from "./firebase/auth.js";

registerRoute("splash", SplashPage);
registerRoute("login", LoginPage);
registerRoute("dashboard", DashboardPage);

navigate("login");

const loginBtn = document.getElementById("loginBtn");

if (loginBtn) {
  loginBtn.onclick = async () => {
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    try {
      await loginUser(email, password);
      navigate("dashboard");
    } catch (err) {
      alert(err.message);
    }
  };
}

authState((user) => {
  if (user) {
    console.log("Logged in:", user.email);
  } else {
    console.log("Not logged in");
  }
});
