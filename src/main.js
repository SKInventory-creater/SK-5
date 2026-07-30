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
import { getItems, updateItem, getTotalProfit } from "./services/itemService.js";

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

async function showItems(bundle) {

  const items = await getItems(bundle.id);

  document.querySelector("#app").innerHTML =
    ItemsPage(bundle, items);

  document.getElementById("backBtn").onclick = () => {
    showDashboard();
  };

  document.getElementById("addItemBtn").onclick = () => {
    showAddItem(bundle);
  };

  document.querySelectorAll(".item-card").forEach((card, index) => {

  card.onclick = () => {
    showEditItem(bundle, items[index]);
  };

});

}

async function showEditItem(bundle, item) {

  document.querySelector("#app").innerHTML =
    AddItemPage(bundle, item);

  document.getElementById("backBtn").onclick = () => {
    showItems(bundle);
  };

  document.getElementById("itemName").value =
    item.note || "";

  document.getElementById("itemPrice").value =
    item.price || "";

  document.getElementById("itemCost").value =
    item.cost || "";

  if (item.removed) {
    document.getElementById("itemStatus").value = "reserved";
  } else if (item.unsold) {
    document.getElementById("itemStatus").value = "unsold";
  } else {
    document.getElementById("itemStatus").value = "sold";
  }

  document.getElementById("saveItemBtn").onclick = async () => {

  try {
    await updateItem({

      id: item.id,
      photo: item.photo,

      cost: Number(
        document.getElementById("itemCost").value
      ),

      price: Number(
        document.getElementById("itemPrice").value
      ),

      note:
        document.getElementById("itemName").value.trim(),

      unsold:
	  document.getElementById("itemStatus").value !== "sold",

      removed:
	  document.getElementById("itemStatus").value === "reserved",

    });

    alert("ပြင်ဆင်ပြီးပါပြီ");

    await showItems(bundle);

  } catch (err) {

    alert(err.message);

  }

};

}

async function showAddItem(bundle) {

  const items = await getItems(bundle.id);

  const item = items.find(i => Number(i.price) === 0);

  if (!item) {
    alert("ဒီဘေထုတ်မှာ အထည်အားလုံး ထည့်ပြီးပါပြီ");
    showItems(bundle);
    return;
  }

  document.querySelector("#app").innerHTML =
    AddItemPage(bundle,item);

  document.getElementById("backBtn").onclick = () => {
    showItems(bundle);
  };

  document.getElementById("saveItemBtn").onclick = async () => {

    try {

      await updateItem({
	  id: item.id,
	  photo: "",
	  cost: Number(
	    document.getElementById("itemCost").value || item.cost
	  ),
	  price: Number(
	    document.getElementById("itemPrice").value || 0
	  ),
	  note:
	    document.getElementById("itemName").value.trim() +
	    " " +
	    (document.getElementById("itemNote")?.value.trim() || ""),

	  unsold:
	    document.getElementById("itemStatus").value === "sold"
	      ? 1
	      : 0,

	  removed:
	    document.getElementById("itemStatus").value === "reserved"
	      ? 1
	      : 0
	});

      alert(item.itemId + " သိမ်းပြီးပါပြီ");

      await showItems(bundle);

    } catch (err) {
      alert(err.message);
    }

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
