export default function ShopInformationPage(info) {
  return `
    <main class="settings-page">

      <header class="page-header">
        <button id="backBtn">←</button>
        <h2>Shop Information</h2>
      </header>

      <section class="settings-list">

        <div class="settings-item">
          <strong>🏪 Shop Name</strong><br>
          ${info.shopName}
        </div>

        <div class="settings-item">
          <strong>👤 Owner</strong><br>
          ${info.ownerName}
        </div>

        <div class="settings-item">
          <strong>📱 Phone</strong><br>
          ${info.phone}
        </div>

        <div class="settings-item">
          <strong>📧 Email</strong><br>
          ${info.email}
        </div>

        <div class="settings-item">
          <strong>🆔 Shop ID</strong><br>
          ${info.shopId}
        </div>

        <div class="settings-item">
          <strong>👑 Role</strong><br>
          ${info.role}
        </div>

	<div class="setting-card">
	  <label>Invitation Code</label>

	  <div class="invite-row">

	    <input
	      id="inviteCode"
	      value="${info.inviteCode}"
	      readonly
	    />

	    <button id="copyInviteBtn">
	      Copy
	    </button>

	</div>

	</div>

      </section>

    </main>
  `;
}
