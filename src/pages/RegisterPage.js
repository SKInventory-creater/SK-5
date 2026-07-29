export default function RegisterPage() {
  return `
    <main class="login-page">
      <div class="login-card">

        <h1>Create Shop</h1>

        <input
          id="shopName"
          type="text"
          placeholder="Shop Name"
        />

        <input
          id="ownerName"
          type="text"
          placeholder="Owner Name"
        />

        <input
          id="phone"
          type="tel"
          placeholder="Phone"
        />

        <input
          id="email"
          type="email"
          placeholder="Email"
        />

        <input
          id="password"
          type="password"
          placeholder="Create Password"
        />

        <input
          id="confirmPassword"
          type="password"
          placeholder="Re-enter Password"
        />

        <button id="registerBtn">
          Create Shop
        </button>

        <button id="backLoginBtn">
          Back to Login
        </button>

      </div>
    </main>
  `;
}
