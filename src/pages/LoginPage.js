export default function LoginPage() {
  return `
    <main class="login-page">
      <div class="login-card">

        <h1>SK Inventory 5</h1>

        <p>Production Edition</p>

        <input
          id="email"
          type="email"
          placeholder="Email"
        />

        <input
          id="password"
          type="password"
          placeholder="Password"
        />

        <button id="loginBtn">
          Login
        </button>

        <button id="goRegisterBtn">
          Create Shop
        </button>

      </div>
    </main>
  `;
}
