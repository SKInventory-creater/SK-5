export default function StaffRegisterPage() {
  return `
    <main class="login-page">
      <div class="login-card">

        <h1>Create Staff</h1>

        <input
          id="staffName"
          type="text"
          placeholder="Staff Name"
        />

        <input
          id="staffPhone"
          type="tel"
          placeholder="Phone"
        />

        <input
          id="staffEmail"
          type="email"
          placeholder="Email"
        />

        <input
          id="staffPassword"
          type="password"
          placeholder="Password"
        />

        <button id="createStaffBtn">
          Create Staff Account
        </button>

        <button id="backBtn">
          Back
        </button>

      </div>
    </main>
  `;
}
