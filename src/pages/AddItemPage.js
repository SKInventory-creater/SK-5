export default function AddItemPage(bundle, item) {
  return `
  <main class="add-item-page">

    <header class="page-header">
      <button id="backBtn">←</button>

      <div>
  <h2>အထည်အသစ်ထည့်ရန်</h2>

  <div class="bundle-badge">
    ဘေ: ${bundle.bundleCode}
	  </div>

	  <div class="bundle-badge">
	    အထည်: ${item.itemId}
	  </div>
	</div>
    </header>

    <section class="form-card">

            <div class="photo-box">

        <div class="photo-preview">

          <img
            id="photoPreview"
            src="${item.photo || ""}"
            alt="အထည်ပုံ"
            style="
              width:100%;
              height:100%;
              object-fit:cover;
              display:${item.photo ? "block" : "none"};
            "
          >

          <span
            id="photoEmpty"
            style="
              display:${item.photo ? "none" : "flex"};
            "
          >
            ပုံမရှိသေး
          </span>

        </div>

        <div class="photo-buttons">

          <button
            id="pickPhotoBtn"
            type="button"
            class="photo-action-btn"
          >
            🖼️ ဓာတ်ပုံရွေး
          </button>

          <button
            id="cameraPhotoBtn"
            type="button"
            class="photo-action-btn"
          >
            📷 ဓာတ်ပုံရိုက်
          </button>

          <input
            id="photoInput"
            type="file"
            accept="image/*"
            hidden
          >

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

      <div class="form-group">

  <label>Status</label>

	  <select id="itemStatus">
	    <option value="unsold">မရောင်းရသေး</option>
	    <option value="reserved">ဖယ်ထား</option>
	    <option value="sold">ရောင်းပြီး</option>
	  </select>

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
