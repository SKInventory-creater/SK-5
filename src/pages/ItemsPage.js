export default function ItemsPage(bundle) {
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

        <p>
          ${bundle.qty} ခု · ရင်းနှီး ${Number(bundle.cost).toLocaleString()} ကျပ်
        </p>
      </div>

      <button
        id="addItemBtn"
        class="add-item-btn">

        ＋ အထည်ထည့်

      </button>

    </header>

    <section class="items-summary">

      <div>
        <small>ရောင်းစျေး</small>
        <strong>0 ကျပ်</strong>
      </div>

      <div>
        <small>အရင်း</small>
        <strong>${Number(bundle.cost).toLocaleString()} ကျပ်</strong>
      </div>

      <div>
        <small>အမြတ်</small>
        <strong class="profit">0 ကျပ်</strong>
      </div>

    </section>

    <div class="search-box">

      <input
        type="text"
        placeholder="ကုတ်၊ အမည်ဖြင့် ရှာရန်">

    </div>

    <section id="itemList" class="item-list">

      <div class="empty-card">

        <h3>အထည်မရှိသေးပါ</h3>

        <p>
          အထည်အသစ်ထည့်ပြီး စတင်အသုံးပြုနိုင်ပါသည်။
        </p>

      </div>

    </section>

  </main>
  `;
}
