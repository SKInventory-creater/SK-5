export default function ItemEditPage(item) {
  return `
  <main class="items-page">

    <header class="items-header">
      <button id="backBtn" class="back-btn">←</button>

      <div class="bundle-header-info">
        <h2>အထည်ပြင်ဆင်ရန်</h2>
        <p>${item.itemId}</p>
      </div>
    </header>

    <section class="item-edit-form">

      <div class="edit-photo">
        ${
          item.photo
            ? `<img
                id="photoPreview"
                src="${item.photo}"
                class="item-photo-img"
              >`
            : `<div id="photoEmpty">📦</div>`
        }
      </div>

      <button id="pickPhotoBtn">
        📷 ပုံရွေးမည်
      </button>

      <label>
        အထည်ကုတ်
      </label>

      <input
        id="itemId"
        type="text"
        value="${item.itemId || ""}"
        disabled
      >

      <label>
        အရင်း
      </label>

      <input
        id="itemCost"
        type="number"
        value="${Number(item.cost || 0)}"
      >

      <label>
        ရောင်းဈေး
      </label>

      <input
        id="itemPrice"
        type="number"
        value="${Number(item.price || 0)}"
      >

      <label>
        အခြေအနေ
      </label>

      <select id="itemStatus">

        <option
          value="unsold"
          ${item.unsold && !item.removed ? "selected" : ""}
        >
          မရောင်းရသေး
        </option>

        <option
          value="sold"
          ${!item.unsold && !item.removed ? "selected" : ""}
        >
          ရောင်းပြီး
        </option>

        <option
          value="removed"
          ${item.removed ? "selected" : ""}
        >
          ဖယ်ထား
        </option>

      </select>

      <label>
        မှတ်ချက်
      </label>

      <textarea id="itemNote">${item.note || ""}</textarea>

      <button
        id="saveItemEditBtn"
        class="save-btn"
      >
        သိမ်းမည်
      </button>

    </section>

  </main>
  `;
}
