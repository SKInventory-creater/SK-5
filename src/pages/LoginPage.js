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

        <button id="registerBtn">
          Create Shop
        </button>

        <button id="loginBtn">
          Login
        </button>

      </div>
    </main>
  `;
}
