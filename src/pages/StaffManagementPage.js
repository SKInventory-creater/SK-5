export default function StaffManagementPage() {
  return `
    <main class="settings-page">

      <header class="page-header">
        <button id="backBtn">←</button>
        <h2>Staff Management</h2>
      </header>

      <section class="settings-list">

        <input
          id="staffName"
          class="input"
          placeholder="Staff Name"
        />

        <input
          id="staffPhone"
          class="input"
          placeholder="Phone"
        />

        <input
          id="staffEmail"
          class="input"
          placeholder="Email"
          type="email"
        />

        <input
          id="staffPassword"
          class="input"
          placeholder="Password"
          type="password"
        />

        <button id="createStaffBtn" class="primary-btn">
          ➕ Create Staff Account
        </button>

      </section>

    </main>
  `;
}
