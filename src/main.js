import "./styles/app.css";

import SplashPage from "./pages/SplashPage.js";
import RegisterPage from "./pages/RegisterPage.js";
import LoginPage from "./pages/LoginPage.js";
import DashboardPage from "./pages/DashboardPage.js";
import AddBundlePage from "./pages/AddBundlePage.js";
import { addBundle } from "./services/bundleService.js";
import ItemsPage from "./pages/ItemsPage.js";
import { getBundles } from "./services/bundleService.js";
import AddItemPage from "./pages/AddItemPage.js";

import { loginUser, registerUser, logoutUser } from "./services/authService.js";

import { createShopAccount } from "./services/shopService.js";

import { authState } from "./firebase/auth.js";

function showLogin() {
  document.querySelector("#app").innerHTML = LoginPage();

  const loginBtn = document.getElementById("loginBtn");
  const goRegisterBtn = document.getElementById("goRegisterBtn");

  loginBtn.onclick = async () => {
    try {
      await loginUser(
        document.getElementById("email").value.trim(),
        document.getElementById("password").value
      );

      await  showDashboard();

    } catch (err) {
      alert(err.message);

      if (err.code) {
      alert(err.code);
    }

      console.error(err);
    }
  };

	  goRegisterBtn.onclick = () => {
    showRegister();
  };
}

function showRegister() {
  document.querySelector("#app").innerHTML = RegisterPage();

  const backLoginBtn = document.getElementById("backLoginBtn");
  const registerBtn = document.getElementById("registerBtn");

  backLoginBtn.onclick = () => {
    showLogin();
  };

  registerBtn.onclick = async () => {
    try {
      const shopName = document.getElementById("shopName").value.trim();
      const ownerName = document.getElementById("ownerName").value.trim();
      const phone = document.getElementById("phone").value.trim();
      const email = document.getElementById("email").value.trim();

      const password = document.getElementById("password").value;
      const confirmPassword =
        document.getElementById("confirmPassword").value;

      if (password !== confirmPassword) {
        alert("Password နှစ်ခု မတူပါ");
        return;
      }

      const credential = await registerUser(email, password);

      const uid = credential.user.uid;

      await createShopAccount({
        shopId: uid,
        adminUid: uid,
        shopName,
        ownerName,
        phone,
        email
      });

      alert("Shop Account Created");

      await  showDashboard();

    } catch (err) {
      alert(err.message);

      if (err.code) {
        alert(err.code);
      }
    }
  };
}

function showItems(bundle) {
  document.querySelector("#app").innerHTML =
    ItemsPage(bundle);

  document.getElementById("backBtn").onclick = () => {
    showDashboard();
  };

  document.getElementById("addItemBtn").onclick = () => {
    showAddItem(bundle);
  };
}

function showAddItem(bundle) {
  document.querySelector("#app").innerHTML =
    AddItemPage(bundle);

  document.getElementById("saveItemBtn").onclick = () => {
    alert("Save Item");
  };
}

function showAddBundle() {
  document.querySelector("#app").innerHTML = AddBundlePage();

  const cancelBundleBtn = document.getElementById("cancelBundleBtn");

  cancelBundleBtn.onclick = () => {
   showDashboard();
  };

  const saveBundleBtn = document.getElementById("saveBundleBtn");

  saveBundleBtn.onclick = async () => {
  try {
    await addBundle({
      bundleCode: document.getElementById("bundleCode").value.trim(),
      bundleName: document.getElementById("bundleName").value.trim(),
      qty: Number(document.getElementById("bundleQty").value),
      cost: Number(document.getElementById("bundleCost").value)
    });

    alert("ဘေထုတ် သိမ်းပြီးပါပြီ");

    await showDashboard();

  } catch (err) {
    alert(err.message);
  }
};

}

async function showDashboard() {
  document.querySelector("#app").innerHTML = await DashboardPage();

  const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {

  logoutBtn.onclick = async () => {
    await logoutUser();
    showLogin();
  };
}

  const addBundleBtn = document.getElementById("addBundleBtn");

    addBundleBtn.onclick = () => {
    showAddBundle();
  };

  const bundleButtons = document.querySelectorAll(".open-bundle-btn");

bundleButtons.forEach(button => {
  button.onclick = async () => {
    const bundles = await getBundles();

    const bundle = bundles.find(
      b => b.id == button.dataset.id
    );

    if (bundle) {
      alert(bundle.bundleName);
      showItems(bundle);
    }
  };
});

}

document.querySelector("#app").innerHTML = SplashPage();

setTimeout(() => {

  authState(async (user) => {

    if (user) {
      await  showDashboard();
    } else {
      showLogin();
    }

  });

}, 1000);
