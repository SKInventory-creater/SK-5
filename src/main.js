import "./styles/app.css";

import SplashPage from "./pages/SplashPage.js";
import LoginPage from "./pages/LoginPage.js";
import DashboardPage from "./pages/DashboardPage.js";

import { loginUser, registerUser, logoutUser } from "./services/authService.js";
import { authState } from "./firebase/auth.js";

function showLogin() {
  document.querySelector("#app").innerHTML = LoginPage();

  const loginBtn = document.getElementById("loginBtn");
  const registerBtn = document.getElementById("registerBtn");

  loginBtn.onclick = async () => {
    try {
      await loginUser(
        document.getElementById("email").value.trim(),
        document.getElementById("password").value
      );

      showDashboard();

    } catch (err) {
      alert(err.message);
    }
  };

  registerBtn.onclick = async () => {
    try {
      await registerUser(
        document.getElementById("email").value.trim(),
        document.getElementById("password").value
      );

      alert("Shop Account Created");
      showDashboard();

    } catch (err) {
      alert(err.message);
    }
  };
}

function showDashboard() {
  document.querySelector("#app").innerHTML = DashboardPage();

  const logoutBtn = document.getElementById("logoutBtn");

  logoutBtn.onclick = async () => {
    await logoutUser();
    showLogin();
  };
}

document.querySelector("#app").innerHTML = SplashPage();

setTimeout(() => {

  authState((user) => {

    if (user) {
      showDashboard();
    } else {
      showLogin();
    }

  });

}, 1000);
