export default function ItemsPage(bundle, items) {
  return `
  <main class="items-page">

    <header class="items-header">

      <button id="backBtn" class="back-btn">
        ←
      </button>

      <div class="bundle-avatar">
        ${bundle.bundleCode}
      </div>

      <div class="bundle-header-info">
        <h2>${bundle.bundleName}</h2>
        <p>${bundle.qty} ထည်</p>
      </div>

    </header>

    <section class="items-summary">

      <div class="summary-item">
        <small>ရောင်းစျေး</small>
        <strong>0 ကျပ်</strong>
      </div>

      <div class="summary-item">
        <small>အရင်း</small>
        <strong>${Number(bundle.cost).toLocaleString()} ကျပ်</strong>
      </div>

      <div class="summary-item">
        <small>အမြတ်</small>
        <strong class="profit">0 ကျပ်</strong>
      </div>

    </section>

    <div class="search-box">
      <input
        id="searchItem"
        type="text"
        placeholder="ကုတ်၊ အမည်ဖြင့် ရှာရန်">
    </div>

    <section
  id="itemList"
  class="item-list">

  ${
    items.length
      ? items.map(item => `
        <div class="item-card">

          <div class="bundle-avatar">
            ${item.itemId}
          </div>

          <div class="bundle-info">
            <h3>${item.itemId}</h3>
            <p>ရောင်းစျေး ${Number(item.price).toLocaleString()} ကျပ်</p>
          </div>

        </div>
      `).join("")
      : `
        <div class="empty-card">

          <div class="empty-icon">📦</div>

          <h3>အထည်မရှိသေးပါ</h3>

          <p>
            အောက်က ခလုတ်ကိုနှိပ်ပြီး
            အထည်များ စတင်ထည့်နိုင်ပါသည်။
          </p>

        </div>
      `
  }

</section>

    <button
      id="addItemBtn"
      class="floating-add-item">

      + အထည်ထည့်

    </button>

  </main>
  `;
}
