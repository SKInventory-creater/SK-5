export default function AddItemPage(bundle, item) {
  return `
  <main class="add-item-page">

    <header class="page-header">
      <button id="backBtn">←</button>

      <div>
        <h2>အထည်အသစ်ထည့်ရန်</h2>
        <span class="bundle-badge">
          ကုတ်: ${bundle.bundleCode}
        </span>
      </div>
    </header>

    <section class="form-card">

      <div class="photo-box">

        <div class="photo-preview">
          ပုံမရှိသေး
        </div>

        <div class="photo-buttons">
          <button>🖼 ဓာတ်ပုံရွေး</button>
          <button>📷 ဓာတ်ပုံရိုက်</button>
        </div>

      </div>

      <div class="form-group">
        <label>အမည်</label>

        <input
          id="itemName"
          placeholder="ဥပမာ - T Shirt"
        >
      </div>

      <div class="form-group">
        <label>ရောင်းစျေး</label>

        <input
          id="itemPrice"
          type="number"
        >
      </div>

      <div class="form-group">
        <label>အရင်း</label>

        <input
	  id="itemCost"
	  type="number"
	  value="${item.cost}"
	>
      </div>

	<div class="form-group">
	  <label>မှတ်ချက်</label>

	  <textarea
	    id="itemNote"
	    rows="3">${item.note || ""}</textarea>
	</div>

      <div class="summary-card">

        <div class="summary-row">
          <span>ဘေထုတ်ကုန်ကျ</span>

          <strong>
            ${bundle.cost.toLocaleString()} ကျပ်
          </strong>
        </div>

	<div class="summary-row">
	  <span>Status</span>

	  <strong>
	    ${item.unsold ? "မရောင်းရသေး" : "ရောင်းပြီး"}
	  </strong>
	</div>

      </div>

      <button
        id="saveItemBtn"
        class="btn-primary">

        သိမ်းမည်

      </button>

    </section>

  </main>
  `;
}
