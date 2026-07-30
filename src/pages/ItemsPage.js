export default function ItemsPage(bundle, items) {

const totalCost = items.reduce(
  (sum, item) => sum + Number(item.cost || 0),
  0
);

const totalSales = items
  .filter(item => item.unsold == 0 && item.removed == 0)
  .reduce(
    (sum, item) => sum + Number(item.price || 0),
    0
  );

const soldCost = items
  .filter(item => item.unsold == 0 && item.removed == 0)
  .reduce(
    (sum, item) => sum + Number(item.cost || 0),
    0
  );

const totalProfit = totalSales - soldCost;
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
        <strong>${totalSales.toLocaleString()} ကျပ်</strong>
      </div>

      <div class="summary-item">
        <small>အရင်း</small>
        <strong>${totalCost.toLocaleString()} ကျပ်</strong>
      </div>

      <div class="summary-item">
        <small>အမြတ်</small>
        <strong class="profit">${totalProfit.toLocaleString()} ကျပ်</strong>
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

  	<div class="item-photo">
   	 📦
	  </div>

	  <div class="item-info">

	    <h3>${item.itemId}</h3>

	    <p class="item-note">
	      ${item.note || "မှတ်ချက် မရှိ"}
	    </p>

	<div class="item-status">
	${
	  item.price == 0 && !item.note
	    ? '<span class="status-empty">──────</span>'
	    : item.removed
	      ? '<span class="status-removed">🟠 ဖယ်ထား</span>'
	      : item.unsold
	        ? '<span class="status-unsold">🟢 မရောင်းရသေး</span>'
	        : '<span class="status-sold">🔵 ရောင်းပြီး</span>'
	}

	</div>

	    <div class="item-price-row">

	      <span>
	        အရင်း
	        ${Number(item.cost).toLocaleString()} ကျပ်
	      </span>

	      <strong>
	        ${Number(item.price).toLocaleString()} ကျပ်
	      </strong>

	    </div>

	<div class="item-status">
	  <span class="status-badge">
	    ${item.unsold ? "မရောင်းရသေး" : "ရောင်းပြီး"}
	  </span>
	</div>

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
