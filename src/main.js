import "./styles/app.css";

import SplashPage from "./pages/SplashPage.js";
import RegisterPage from "./pages/RegisterPage.js";
import LoginPage from "./pages/LoginPage.js";
import DashboardPage from "./pages/DashboardPage.js";
import AddBundlePage from "./pages/AddBundlePage.js";
import { addBundle, bundleCodeExists, deleteBundle } from "./services/bundleService.js";
import ItemsPage from "./pages/ItemsPage.js";
import { getBundles } from "./services/bundleService.js";
import AddItemPage from "./pages/AddItemPage.js";
import { getItems, updateItem, getTotalProfit, searchItems } from "./services/itemService.js";
import ReportsPage from "./pages/ReportsPage.js";
import DailyReportPage from "./pages/DailyReportPage.js";
import { calculateReportStats, calculateDailyReport } from "./services/reportService.js";
import { pickPhoto, takePhoto } from "./services/cameraService.js";
import { saveItemPhoto } from "./services/storageService.js";
import DeleteBundlePage from "./pages/DeleteBundlePage.js";
import SettingsMenuPage from "./pages/SettingsMenuPage.js";
import SettingsPage from "./pages/SettingsPage.js";
import { exportLocalData } from "./services/backupService.js";
import { uploadBackup } from "./firebase/backup.js";

import { loginUser, registerUser, logoutUser, currentUser } from "./services/authService.js";

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
  alert(JSON.stringify(err));
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
  showItemForm(bundle);
};

  document.querySelectorAll(".item-card").forEach((card, index) => {

  card.onclick = () => {
    showItemForm(bundle, items[index]);
  };

});

  const searchInput = document.getElementById("searchItem");
const statusFilter = document.getElementById("statusFilter");

function filterItems() {

  const keyword = searchInput.value.toLowerCase().trim();
  const filter = statusFilter.value;

  document.querySelectorAll(".item-card").forEach((card) => {

    const text = card.textContent.toLowerCase();

    const status = card.querySelector(".item-status-text")?.dataset.status || "";

    const matchKeyword = text.includes(keyword);

    const matchStatus =
      filter === "all" ||
      status === filter;

    card.style.display =
      matchKeyword && matchStatus ? "" : "none";

  });

}

searchInput.oninput = filterItems;
statusFilter.onchange = filterItems;

filterItems();

}

async function showItemForm(bundle, editItem = null) {

  const items = await getItems(bundle.id);

  const item =
    editItem ||
    items.find(i => Number(i.price) === 0);

  if (!item) {
    alert("ဒီဘေထုတ်မှာ အထည်အားလုံး ထည့်ပြီးပါပြီ");
    return showItems(bundle);
  }

  const isEdit = editItem !== null;

  document.querySelector("#app").innerHTML =
    AddItemPage(bundle, item, isEdit);

  let selectedPhoto = null;

  const preview =
    document.getElementById("photoPreview");

     document.getElementById("pickPhotoBtn").onclick = async () => {

    try {

      const photo = await pickPhoto();

      selectedPhoto = photo;

      preview.src = photo.webPath;

      preview.style.display = "block";

      document.getElementById("photoEmpty").style.display = "none";

    } catch (err) {

      console.error(err);

      alert(err.message || JSON.stringify(err));

    }

  };

      document.getElementById("cameraPhotoBtn").onclick = async () => {

    try {

      const photo = await takePhoto();

      selectedPhoto = photo;

      preview.src = photo.webPath;

      preview.style.display = "block";

      document.getElementById("photoEmpty").style.display = "none";

    } catch (err) {

      console.error(err);

      alert(err.message || JSON.stringify(err));

    }

  };

      document.getElementById("backBtn").onclick = () => {

    showItems(bundle);

  };
    const saveBtn = document.getElementById("saveItemBtn");

saveBtn.onclick = async () => {

  try {

    let photoUrl = item.photo || "";

    if (selectedPhoto) {

      saveBtn.disabled = true;
      saveBtn.textContent = "ပုံတင်နေသည်...";

      photoUrl =
  await saveItemPhoto(selectedPhoto, item.itemId);
}

    const status =
  document.getElementById("itemStatus").value;

await updateItem({

  id: item.id,
  photo: photoUrl,

  cost: Number(document.getElementById("itemCost").value || item.cost),

  price: Number(document.getElementById("itemPrice").value || 0),

  note:
    document.getElementById("itemName").value.trim() +
    " " +
    (document.getElementById("itemNote")?.value.trim() || ""),

  unsold: status === "unsold",
  removed: status === "reserved",

  soldAt:
    status === "sold"
      ? (item.soldAt || new Date().toISOString())
      : null,

  createdAt: item.createdAt

});

    alert(
      isEdit
        ? "ပြင်ဆင်ပြီးပါပြီ"
        : item.itemId + " သိမ်းပြီးပါပြီ"
    );

    await showItems(bundle);

  } catch (err) {

    console.error(err);

    alert(err.message || JSON.stringify(err));

  } finally {

    saveBtn.disabled = false;
    saveBtn.textContent = "သိမ်းမည်";

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

	saveBundleBtn.disabled = true;
	saveBundleBtn.textContent = "သိမ်းနေသည်...";

  try {

	const bundleCode =
  document.getElementById("bundleCode").value.trim().toUpperCase();

if (await bundleCodeExists(bundleCode)) {

  saveBundleBtn.disabled = false;
  saveBundleBtn.textContent = "သိမ်းမည်";

  alert("ဒီ Code ကို အသုံးပြုပြီးသား ဖြစ်ပါတယ်");
  return;
}

    await addBundle({
      bundleCode: bundleCode,
      bundleName: document.getElementById("bundleName").value.trim(),
      qty: Number(document.getElementById("bundleQty").value),
      cost: Number(document.getElementById("bundleCost").value)
    });

	saveBundleBtn.disabled = false;
	saveBundleBtn.textContent = "သိမ်းမည်";

    alert("ဘေထုတ် သိမ်းပြီးပါပြီ");

    await showDashboard();

  } catch (err) {
    alert(err.message);
	} finally {

   saveBundleBtn.disabled = false;
   saveBundleBtn.textContent = "သိမ်းမည်";

  }
};

}

async function showDashboard() {
  document.querySelector("#app").innerHTML = await DashboardPage();

  const searchInput = document.getElementById("dashboardSearch");
const searchResults = document.getElementById("searchResults");

searchInput.oninput = async () => {
  const keyword = searchInput.value.trim();

  if (!keyword) {
    searchResults.innerHTML = "";
    return;
  }

  const items = await searchItems(keyword);

  searchResults.innerHTML = items.map(item => `
    <div class="item-card search-item" data-id="${item.id}">
      <strong>${item.itemId}</strong><br>
      <small>${item.note || ""}</small>
    </div>
  `).join("");

  document.querySelectorAll(".search-item").forEach(card => {

  card.onclick = async () => {

    const items = await searchItems(searchInput.value.trim());

    const item = items.find(i => i.id == card.dataset.id);

    if (!item) return;

    const bundles = await getBundles();

    const bundle = bundles.find(b => b.id == item.bundleId);

    if (!bundle) return;

    showItemForm(bundle, item);

  };

});

};

  const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {

  logoutBtn.onclick = async () => {
    await logoutUser();
    showLogin();
  };
}

  const menuBtn = document.getElementById("menuBtn");

menuBtn.onclick = () => {
  showSettingsMenu();
};

  const popupMenu = document.getElementById("popupMenu");

menuBtn.onclick = (e) => {

  e.stopPropagation();

  popupMenu.style.display =
    popupMenu.style.display === "block"
      ? "none"
      : "block";

};

document.onclick = () => {
  popupMenu.style.display = "none";
};

popupMenu.onclick = (e) => {
  e.stopPropagation();
};

document.getElementById("addBundleMenu").onclick = () => {
  showAddBundle();
};

document.getElementById("deleteBundleMenu").onclick = () => {
  showDeleteBundles();
};

document.getElementById("settingsMenu").onclick = () => {
  showSettings();
};

  document.getElementById("reportsBtn").onclick = () => {
    showReports();
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

async function showSettingsMenu() {
  document.querySelector("#app").innerHTML = SettingsMenuPage();

  document.getElementById("backBtn").onclick = () => {
    showDashboard();
  };

  document.getElementById("addBundleBtn").onclick = () => {
    showAddBundle();
  };

  document.getElementById("deleteBundlesBtn").onclick = () => {
    showDeleteBundles();
  };

  document.getElementById("logoutBtn").onclick = async () => {
    await logoutUser();
    showLogin();
  };
}

async function showSettings() {

  document.querySelector("#app").innerHTML =
    SettingsPage();

  document.getElementById("backBtn").onclick = () => {
    showDashboard();
  };

  document.getElementById("shopInfoBtn").onclick = () => {
    alert("Shop Information");
  };

  document.getElementById("backupBtn").onclick = async () => {

  try {

    const user = currentUser();

    if (!user) {
      alert("Login လိုအပ်ပါသည်");
      return;
    }

    const data = await exportLocalData();

    await uploadBackup(user.uid, data);

    alert("☁ Backup အောင်မြင်ပါသည်");

  } catch (err) {

    console.error(err);

    alert(err.message || JSON.stringify(err));

  }

};

  document.getElementById("restoreBtn").onclick = () => {
    alert("Restore");
  };

  document.getElementById("aboutBtn").onclick = () => {
    alert("SK Inventory 5\nVersion 1.0.0");
  };

  document.getElementById("logoutBtn").onclick = async () => {

    if (!confirm("Logout လုပ်မှာ သေချာပါသလား?")) return;

    await logoutUser();

    showLogin();

  };

}

async function showDeleteBundles() {

  const bundles = await getBundles();

  document.querySelector("#app").innerHTML =
    DeleteBundlePage(bundles);

  document.getElementById("backBtn").onclick = () => {
    showDashboard();
  };

  document.querySelectorAll(".deleteBundleBtn").forEach(btn => {

    btn.onclick = async () => {

      if (!confirm("ဒီဘေထုတ်ကို ဖျက်မှာ သေချာပါသလား?")) {
        return;
      }

      try {

        await deleteBundle(Number(btn.dataset.id));

        alert("ဘေထုတ်ဖျက်ပြီးပါပြီ");

        await showDeleteBundles();

      } catch (err) {

        console.error(err);

        alert(err.message || JSON.stringify(err));

      }

    };

  });

}

async function showReports() {

  const bundles = await getBundles();

  const items = [];

  for (const bundle of bundles) {
    items.push(...await getItems(bundle.id));
  }

  const stats = calculateReportStats(bundles, items);

  document.querySelector("#app").innerHTML =
    ReportsPage(stats);

  document.getElementById("backBtn").onclick = () => {
    showDashboard();
  };

  document.getElementById("dailyReportBtn").onclick = showDailyReport;

}

async function showDailyReport() {

  const bundles = await getBundles();

  const items = [];

  for (const bundle of bundles) {
    items.push(...await getItems(bundle.id));
  }

  const today = new Date().toISOString().slice(0, 10);

  const todayItems = items.filter(item =>
    item.soldAt &&
    item.soldAt.slice(0, 10) === today
  );

  const stats = calculateDailyReport(todayItems);

  document.querySelector("#app").innerHTML =
    DailyReportPage(stats);

  document.getElementById("backBtn").onclick = () => {
    showReports();
  };

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
