export default function SettingsPage() {
  return `
    <main class="settings-page">

      <header class="page-header">
        <button id="backBtn">←</button>
        <h2>Settings</h2>
      </header>

      <section class="settings-list">

        <button id="shopInfoBtn" class="settings-item">
          👤 Shop Information
        </button>

        <button id="backupBtn" class="settings-item">
          ☁ Backup
        </button>

        <button id="restoreBtn" class="settings-item">
          ♻ Restore
        </button>

        <button id="aboutBtn" class="settings-item">
          ℹ App Version
        </button>

        <button id="logoutBtn" class="settings-item danger">
          🚪 Logout
        </button>

      </section>

    </main>
  `;
}
