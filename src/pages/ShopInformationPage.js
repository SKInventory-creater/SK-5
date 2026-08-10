export default function ShopInformationPage(info) {
  return `
    <main class="shop-information-page">

      <header class="shop-info-header">
        <button id="backBtn" class="shop-info-back-btn">←</button>

        <div class="shop-info-title">
          <h2>ဆိုင်အချက်အလက်</h2>
          <p>ဆိုင်၏ အခြေခံအချက်အလက်များ</p>
        </div>
      </header>

      <section class="shop-info-card">

        <div class="shop-info-profile">
          <div class="shop-info-avatar">🏪</div>

          <div>
            <h3>${info.shopName || "ဆိုင်အမည်မရှိ"}</h3>
            <p>ဆိုင်အချက်အလက်</p>
          </div>
        </div>

        <div class="shop-info-divider"></div>

        <div class="shop-info-row">
          <div class="shop-info-icon">👤</div>
          <div class="shop-info-content">
            <span>ပိုင်ရှင်</span>
            <strong>${info.ownerName || "-"}</strong>
          </div>
        </div>

        <div class="shop-info-row">
          <div class="shop-info-icon">📱</div>
          <div class="shop-info-content">
            <span>ဖုန်းနံပါတ်</span>
            <strong>${info.phone || "-"}</strong>
          </div>
        </div>

        <div class="shop-info-row">
          <div class="shop-info-icon">📧</div>
          <div class="shop-info-content">
            <span>အီးမေးလ်</span>
            <strong>${info.email || "-"}</strong>
          </div>
        </div>

        <div class="shop-info-row">
          <div class="shop-info-icon">🆔</div>
          <div class="shop-info-content">
            <span>ဆိုင် ID</span>
            <strong>${info.shopId || "-"}</strong>
          </div>
        </div>

        <div class="shop-info-row">
          <div class="shop-info-icon">👑</div>
          <div class="shop-info-content">
            <span>အခန်းကဏ္ဍ</span>
            <strong>${info.role || "-"}</strong>
          </div>
        </div>

      </section>

      <section class="shop-invite-card">

        <div class="shop-invite-title">
          <div class="shop-info-icon invite-icon">🔑</div>

          <div>
            <h3>ဖိတ်ခေါ်ကုဒ်</h3>
            <p>Staff ထည့်ရန် အသုံးပြုနိုင်ပါသည်</p>
          </div>
        </div>

        <div class="invite-row">

          <input
            id="inviteCode"
            value="${info.inviteCode || ""}"
            readonly
          />

          <button id="copyInviteBtn" type="button">
            📋 ကူးမည်
          </button>

        </div>

      </section>

    </main>
  `;
}
