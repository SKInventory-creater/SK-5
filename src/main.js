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
import ItemEditPage from "./pages/ItemEditPage.js";
import { getItems, updateItem, getTotalProfit, searchItems } from "./services/itemService.js";
import ReportsPage from "./pages/ReportsPage.js";
import DailyReportPage from "./pages/DailyReportPage.js";
import { calculateReportStats, calculateDailyReport, calculateMonthlyReport } from "./services/reportService.js";
import { pickPhoto, takePhoto } from "./services/cameraService.js";
import { saveItemPhoto } from "./services/storageService.js";
import DeleteBundlePage from "./pages/DeleteBundlePage.js";
import SettingsMenuPage from "./pages/SettingsMenuPage.js";
import SettingsPage from "./pages/SettingsPage.js";
import { exportLocalData, restoreLocalData } from "./services/backupService.js";
import { uploadBackup, downloadBackup } from "./firebase/backup.js";
import MonthlyReportPage from "./pages/MonthlyReportPage.js";
import ShopInformationPage from "./pages/ShopInformationPage.js";
import { getShopInformation } from "./services/shopService.js";
import StaffManagementPage from "./pages/StaffManagementPage.js";
import StaffRegisterPage from "./pages/StaffRegisterPage.js";

import { loginUser, registerUser, logoutUser, currentUser, currentUserProfile, createStaffAccount } from "./services/authService.js";

import { createShopAccount, loadStaffList, removeStaff } from "./services/shopService.js";

import { authState } from "./firebase/auth.js";
import { App } from "@capacitor/app";

async function autoBackup() {
  const user = currentUser();

  if (!user) return;

  try {
    const data = await exportLocalData();

    await uploadBackup(user.uid, data);

    console.log("Auto Backup OK");

  } catch (err) {

    console.error("Auto Backup failed:", err);

  }
}

let pullStartY = 0;
let pullDistance = 0;
let isPulling = false;

function setupPullToRefresh() {
  const app = document.querySelector("#app");

  if (!app) return;

  app.ontouchstart = (event) => {
    if (window.scrollY > 0) return;

    pullStartY = event.touches[0].clientY;
    pullDistance = 0;
    isPulling = false;
  };

  app.ontouchmove = (event) => {
    if (window.scrollY > 0) return;

    const currentY = event.touches[0].clientY;
    pullDistance = currentY - pullStartY;

    if (pullDistance <= 0) return;

    isPulling = true;

    if (pullDistance > 20) {
      app.style.transform =
        `translateY(${Math.min(pullDistance * 0.35, 55)}px)`;
      app.style.transition = "none";
    }
  };

  app.ontouchend = async () => {
    if (!isPulling) return;

    const shouldRefresh = pullDistance >= 90;

    app.style.transition = "transform .2s ease";

    if (shouldRefresh) {
      app.style.transform = "translateY(20px)";

      try {
        const currentPage =
          pageHistory[pageHistory.length - 1];

        if (currentPage) {
          await currentPage();
        }
      } catch (err) {
        console.error("Pull refresh failed:", err);
      }
    }

    app.style.transform = "translateY(0)";

    pullStartY = 0;
    pullDistance = 0;
    isPulling = false;
  };
}

const pageHistory = [];

function navigateTo(pageFunction) {
  pageHistory.push(pageFunction);
  console.log("NAVIGATE:", pageHistory.length);
  pageFunction();

  setTimeout(() => {
    setupPullToRefresh();
  }, 0);
}

function goBackPage() {
  console.log("BACK BEFORE:", pageHistory.length);

  if (pageHistory.length > 1) {
    pageHistory.pop();

    const previousPage =
      pageHistory[pageHistory.length - 1];

    console.log("BACK AFTER:", pageHistory.length);

    previousPage();
  } else {
    showDashboard();
  }
}

function showLogin() {
  document.querySelector("#app").innerHTML = LoginPage();

	setupPullToRefresh();

  const loginBtn = document.getElementById("loginBtn");
  const goRegisterBtn = document.getElementById("goRegisterBtn");
  const goStaffRegisterBtn =
  document.getElementById("goStaffRegisterBtn");

  loginBtn.onclick = async () => {
  try {

    await loginUser(
      document.getElementById("email").value.trim(),
      document.getElementById("password").value
    );

    const user = currentUser();

    const profile = await currentUserProfile();

    if (!profile) {
      throw new Error("User Profile မတွေ့ပါ");
    }

    // ===== Auto Restore =====
    try {

      const backup =
        await downloadBackup(user.uid);

      await restoreLocalData(backup);

      console.log("Restore OK");

    } catch (e) {

      console.log("No Backup");

    }
    // ========================

    if (profile.role === "admin") {

      await showDashboard(profile);

    } else if (profile.role === "staff") {

      alert("Staff Login");

      await showDashboard(profile);

    } else {

      throw new Error("Role မမှန်ပါ");

    }

  } catch (err) {

    alert(JSON.stringify(err));
    console.error(err);

  }
};

	  goRegisterBtn.onclick = () => {
    showRegister();
  };

	goStaffRegisterBtn.onclick = () => {
  showStaffRegister();
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
    goBackPage();
  };

  document.getElementById("addItemBtn").onclick = () => {
  navigateTo(() => showItemForm(bundle));
};

  document.querySelectorAll(".item-card").forEach((card, index) => {

  card.onclick = () => {
  navigateTo(() => showItemEdit(bundle, items[index], index));
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

async function showItemEdit(bundle, item, itemIndex = -1) {

  document.querySelector("#app").innerHTML =
    ItemEditPage(item);

  document.getElementById("backBtn").onclick = () => {
    goBackPage();
  };

  let selectedPhoto = null;

  const pickPhotoBtn =
    document.getElementById("pickPhotoBtn");

  pickPhotoBtn.onclick = async () => {

    try {

      const photo = await pickPhoto();

      selectedPhoto = photo;

      let preview = document.getElementById("photoPreview");

if (!preview) {
  const photoBox = document.querySelector(".edit-photo");

  if (photoBox) {
    photoBox.innerHTML = `
      <img
        id="photoPreview"
        src="${photo.webPath}"
        class="item-photo-img"
      >
    `;
  }
} else {
  preview.src = photo.webPath;
  preview.style.display = "block";
}

    } catch (err) {

      console.error(err);

      alert(
        err.message ||
        JSON.stringify(err)
      );

    }

  };

  document.getElementById("saveItemEditBtn").onclick =
    async () => {

      try {

        let photoUrl = item.photo || "";

        if (selectedPhoto) {

          photoUrl =
            await saveItemPhoto(
              selectedPhoto,
              item.itemId
            );

        }

        const status =
          document.getElementById("itemStatus").value;

        let unsold = 1;
        let removed = 0;
        let soldAt = item.soldAt || null;

        if (status === "sold") {

          unsold = 0;
          removed = 0;

          if (!soldAt) {
            soldAt = new Date().toISOString();
          }

        } else if (status === "removed") {

          unsold = 1;
          removed = 1;
          soldAt = null;

        } else {

          unsold = 1;
          removed = 0;
          soldAt = null;

        }

        await updateItem({

          id: item.id,

          photo: photoUrl,

          cost:
            Number(
              document.getElementById("itemCost").value || 0
            ),

          price:
            Number(
              document.getElementById("itemPrice").value || 0
            ),

          unsold,

          removed,

          note:
            document.getElementById("itemNote").value.trim(),

          soldAt,

          createdAt: item.createdAt

        });

        await autoBackup();

        alert("အထည်အချက်အလက် ပြင်ဆင်ပြီးပါပြီ");

        await showItems(bundle);

      } catch (err) {

        console.error(err);

        alert(
          err.message ||
          JSON.stringify(err)
        );

      }

    };

  const nextItemBtn = document.getElementById("nextItemBtn");

if (nextItemBtn) {
  nextItemBtn.onclick = async () => {
    try {
      const items = await getItems(bundle.id);

      const nextIndex = itemIndex + 1;

      if (nextIndex >= items.length) {
        alert("နောက်ဆုံးအထည် ဖြစ်ပါတယ်");
        return;
      }

      await showItemEdit(
        bundle,
        items[nextIndex],
        nextIndex
      );

    } catch (err) {
      console.error(err);

      alert(
        err.message ||
        JSON.stringify(err)
      );
    }
  };
}

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

   await autoBackup();

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
   goBackPage();
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

    await autoBackup();

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

async function showDashboard(profile = null) {

  document.querySelector("#app").innerHTML = await DashboardPage();

   if (!profile) {
  profile = await currentUserProfile();

  if (!profile) {
    alert("User Profile မတွေ့ပါ");
    await logoutUser();
    return showLogin();
  }
}

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

    navigateTo(() => showItemForm(bundle, item));

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

if (profile.role === "staff") {

  document.getElementById("deleteBundleMenu").style.display = "none";

}

document.getElementById("addBundleMenu").onclick = () => {
  navigateTo(showAddBundle);
};

document.getElementById("deleteBundleMenu").onclick = () => {
  navigateTo(showDeleteBundles);
};

document.getElementById("settingsMenu").onclick = () => {
  navigateTo(showSettings);
};

  document.getElementById("reportsBtn").onclick = () => {
    navigateTo(showReports);
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
      navigateTo(() => showItems(bundle));
    }
  };
});

}

async function showSettingsMenu() {
  document.querySelector("#app").innerHTML = SettingsMenuPage();

  document.getElementById("backBtn").onclick = () => {
    goBackPage();
  };

  document.getElementById("addBundleBtn").onclick = () => {
    navigateTo(showAddBundle);
  };

  document.getElementById("deleteBundlesBtn").onclick = () => {
    navigateTo(showDeleteBundles);
  };

  document.getElementById("logoutBtn").onclick = async () => {
    await logoutUser();
    showLogin();
  };

  document.getElementById("staffManagementBtn").onclick = () => {
    navigateTo(showStaffManagement);
  };
}

async function showStaffManagement() {

  document.querySelector("#app").innerHTML =
    StaffManagementPage();


  let staff = [];

try {

  const admin = await currentUserProfile();

  staff = await loadStaffList(admin.shopId);


} catch (err) {

  console.error(err);

  alert(err.message || JSON.stringify(err));

}

console.log(staff);

const list = document.getElementById("staffList");

list.innerHTML = "";

staff.forEach(user => {

  list.innerHTML += `
    <article class="staff-card">

      <div class="staff-avatar">
        ${(user.name || "S").charAt(0).toUpperCase()}
      </div>

      <div class="staff-info">

        <div class="staff-name-row">
          <div class="staff-name-block">
            <h4>${user.name || "Staff"}</h4>
            <span class="staff-role">
              ${user.role || "Staff"}
            </span>
          </div>

          <span class="staff-active">
            အသုံးပြုနေသည်
          </span>
        </div>

        <div class="staff-contact">
          <div>
            <span class="staff-contact-icon">📧</span>
            <span>${user.email || "-"}</span>
          </div>

          <div>
            <span class="staff-contact-icon">📱</span>
            <span>${user.phone || "-"}</span>
          </div>
        </div>

        <button
          class="deleteStaffBtn staff-delete-btn"
          data-id="${user.uid}">
          🗑️ Staff ဖျက်ရန်
        </button>

      </div>

    </article>
  `;

});

  document.querySelectorAll(".deleteStaffBtn").forEach(btn => {

  btn.onclick = async () => {

    if (!confirm("ဒီ Staff ကိုဖျက်မှာသေချာပါသလား?")) {
      return;
    }

   await removeStaff(btn.dataset.id);

alert("Staff ဖျက်ပြီးပါပြီ");

showStaffManagement();

  };

});

  document.getElementById("backBtn").onclick = () => {
    goBackPage();
  };

}

async function showStaffRegister() {

  document.querySelector("#app").innerHTML =
    StaffRegisterPage();

  document.getElementById("backLoginBtn").onclick = () => {
    navigateTo(showLogin);
  };

  document.getElementById("staffRegisterBtn").onclick = async () => {
  try {

    const inviteCode =
      document.getElementById("inviteCode").value.trim();

    const name =
      document.getElementById("staffName").value.trim();

    const phone =
      document.getElementById("staffPhone").value.trim();

    const email =
      document.getElementById("staffEmail").value.trim();

    const password =
      document.getElementById("staffPassword").value;

    await createStaffAccount({
  inviteCode,
  name,
  phone,
  email,
  password
});

alert("Staff Account ဖန်တီးပြီးပါပြီ");

showLogin();

} catch (err) {
  console.error(err);

  alert(
    "CODE : " + err.code +
    "\n\nMESSAGE : " + err.message
  );
}

};

}

async function showShopInformation() {

  const user = currentUser();

  if (!user) {
    alert("Login လိုအပ်ပါသည်");
    return;
  }

  const info = await getShopInformation(user.uid);

  document.querySelector("#app").innerHTML =
    ShopInformationPage(info);

  document.getElementById("backBtn").onclick = () => {
    navigateTo(showSettings);
  };

  const copyBtn =
    document.getElementById("copyInviteBtn");

  if (copyBtn) {

    copyBtn.onclick = async () => {

      const code =
        document.getElementById("inviteCode").value;

      await navigator.clipboard.writeText(code);

      alert("Invitation Code ကူးပြီးပါပြီ");

    };

  }

}

async function showSettings() {

  document.querySelector("#app").innerHTML =
    SettingsPage();

   const profile = await currentUserProfile();

  if (profile.role === "admin") {

  document.getElementById("staffManagementBtn").onclick = () => {
    navigateTo(showStaffManagement);
  };

} else {

  document.getElementById("staffManagementBtn").style.display = "none";

}

  document.getElementById("backBtn").onclick = () => {
    goBackPage();
  };

  document.getElementById("shopInfoBtn").onclick = () => {
    navigateTo(showShopInformation);
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

  document.getElementById("restoreBtn").onclick = async () => {
  try {
    const user = currentUser();

    if (!user) {
      alert("Login လိုအပ်ပါသည်");
      return;
    }

    if (!confirm("Backup မှ Data ပြန်ယူမလား?")) {
      return;
    }

    const backup = await downloadBackup(user.uid);

    await restoreLocalData(backup);

    alert("♻ Restore အောင်မြင်ပါသည်");

    await showDashboard();

  } catch (err) {
    console.error(err);
    alert(err.message || JSON.stringify(err));
  }
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
    goBackPage();
  };

  document.querySelectorAll(".deleteBundleBtn").forEach(btn => {

    btn.onclick = async () => {

      if (!confirm("ဒီဘေထုတ်ကို ဖျက်မှာ သေချာပါသလား?")) {
        return;
      }

      try {

        await deleteBundle(Number(btn.dataset.id));

	await autoBackup();

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
    goBackPage();
  };

  document.getElementById("dailyReportBtn").onclick = () => {
  navigateTo(showDailyReport);
};

document.getElementById("monthlyReportBtn").onclick = () => {
  navigateTo(showMonthlyReport);
};

}

async function showDailyReport(selectedDate = new Date().toISOString().slice(0, 10)) {
  try {

  const bundles = await getBundles();

  const items = [];

  for (const bundle of bundles) {
    items.push(...await getItems(bundle.id));
  }

  const today = new Date().toISOString().slice(0, 10);

  const todayItems = items.filter(item =>
  item.soldAt &&
  item.soldAt.slice(0, 10) === selectedDate
);

  const stats = calculateDailyReport(todayItems);

  const soldItems = todayItems;

document.querySelector("#app").innerHTML =
  DailyReportPage(stats, selectedDate);

const summary =
  document.querySelector(".reports-summary");

summary.insertAdjacentHTML(
  "beforeend",
  `
    <div id="dailySoldList"></div>
  `
);

const list =
  document.getElementById("dailySoldList");

    list.innerHTML = soldItems.map(item => `
    <div class="item-card">

      <div class="item-photo">
        ${
          item.photo
            ? `<img src="${item.photo}" class="item-photo-img">`
            : `📦`
        }
      </div>

      <div class="item-info">

        <div class="item-top-row">
          <h3>${item.itemId}</h3>

          <div class="item-price-row">
            <span>
              အရင်း ${Number(item.cost || 0).toLocaleString()} ကျပ်
            </span>

            <strong>
              ${Number(item.price || 0).toLocaleString()} ကျပ်
            </strong>
          </div>
        </div>

        <div class="item-bottom-row">

          <p class="item-note">
            ${item.note || "မှတ်ချက် မရှိ"}
          </p>

          <div class="item-status">
            <span
              class="item-status-text"
              data-status="sold"
            >
              🔵 ရောင်းပြီး
            </span>
          </div>

        </div>

      </div>

    </div>
  `).join("");

  document.getElementById("backBtn").onclick = () => {
    goBackPage();
  };

  const reportDate = document.getElementById("reportDate");

reportDate.value = selectedDate;

reportDate.onchange = () => {
  showDailyReport(reportDate.value);
};

} catch (err) {
  alert(err.message + "\n\n" + err.stack);
  console.error(err);
}

}

async function showMonthlyReport(
  selectedMonth = new Date().toISOString().slice(0, 7)
) {

  const bundles = await getBundles();

  const items = [];

  for (const bundle of bundles) {
    items.push(...await getItems(bundle.id));
  }

  const monthItems = items.filter(item =>
    item.soldAt &&
    item.soldAt.slice(0, 7) === selectedMonth
  );

  const stats = calculateMonthlyReport(monthItems);

  document.querySelector("#app").innerHTML =
    MonthlyReportPage(stats, selectedMonth);

  const list =
    document.getElementById("monthlySoldList");

      list.innerHTML = monthItems.map(item => `
      <div class="item-card">

        <div class="item-photo">
          ${
            item.photo
              ? `<img src="${item.photo}" class="item-photo-img">`
              : `📦`
          }
        </div>

        <div class="item-info">

          <div class="item-top-row">
            <h3>${item.itemId}</h3>

            <div class="item-price-row">
              <span>
                အရင်း ${Number(item.cost || 0).toLocaleString()} ကျပ်
              </span>

              <strong>
                ${Number(item.price || 0).toLocaleString()} ကျပ်
              </strong>
            </div>
          </div>

          <div class="item-bottom-row">

            <p class="item-note">
              ${item.note || "မှတ်ချက် မရှိ"}
            </p>

            <div class="item-status">
              <span
                class="item-status-text"
                data-status="sold"
              >
                🔵 ရောင်းပြီး
              </span>
            </div>

          </div>

        </div>

      </div>
    `).join("");

  document.getElementById("backBtn").onclick = () => {
    goBackPage()
  };

  const reportMonth =
    document.getElementById("reportMonth");

  reportMonth.value = selectedMonth;

  reportMonth.onchange = () => {
    showMonthlyReport(reportMonth.value);
  };

}

document.querySelector("#app").innerHTML = SplashPage();

App.addListener("backButton", () => {
  goBackPage();
});

setTimeout(() => {

  authState(async (user) => {

    if (user) {

  pageHistory.length = 0;

  pageHistory.push(() => showDashboard());

  await showDashboard();

} else {

  pageHistory.length = 0;

  showLogin();

}

  });

}, 1000);
