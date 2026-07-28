import "./styles/app.css";

import SplashPage from "./pages/SplashPage.js";
import LoginPage from "./pages/LoginPage.js";
import DashboardPage from "./pages/DashboardPage.js";

import { loginUser, logoutUser } from "./services/authService.js";

function showLogin() {
  document.querySelector("#app").innerHTML = LoginPage();

  const loginBtn = document.getElementById("loginBtn");

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
  showLogin();
}, 1000);
