import "./styles/app.css";

import SplashPage from "./pages/SplashPage.js";
import LoginPage from "./pages/LoginPage.js";

import {
  registerRoute,
  navigate
} from "./router/index.js";

registerRoute("splash", SplashPage);
registerRoute("login", LoginPage);

navigate("login");
