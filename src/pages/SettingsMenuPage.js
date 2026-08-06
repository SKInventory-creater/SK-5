export default function SettingsMenuPage() {
  return `
    <main class="settings-page">

      <header class="page-header">
        <button id="backBtn">←</button>
        <h2>Menu</h2>
      </header>

      <section class="menu-list">

        <button id="addBundleBtn" class="menu-btn">
          ➕ ဘေထုတ်အသစ်ထည့်
        </button>

        <button id="deleteBundlesBtn" class="menu-btn danger">
          🗑 ဘေထုတ်ဖျက်
        </button>

	<button id="staffManagementBtn" class="menu-btn">
	  👥 Staff Management
	</button>

        <button id="logoutBtn" class="menu-btn">
          🚪 Logout
        </button>

      </section>

    </main>
  `;
}
