export default function StaffRegisterPage() {
  return `
    <main class="login-page">

      <div class="login-card">

        <h1>Staff Register</h1>

        <input
          id="inviteCode"
          type="text"
          placeholder="Invitation Code"
        />

        <input
          id="staffName"
          type="text"
          placeholder="Name"
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

        <button id="staffRegisterBtn">
          Register
        </button>

        <button id="backLoginBtn">
          Back
        </button>

      </div>

    </main>
  `;
}
