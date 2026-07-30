export default function ItemDetailPage(item) {
  return `
  <main class="item-detail-page">

    <header class="page-header">

      <button id="backBtn">
        ←
      </button>

      <h2>အထည်အသေးစိတ်</h2>

    </header>

    <section class="detail-card">

      <div class="detail-photo">
        📦
      </div>

      <div class="detail-row">
        <label>ကုတ်</label>
        <strong>${item.itemId}</strong>
      </div>

      <div class="detail-row">
        <label>အမည် / မှတ်ချက်</label>
        <strong>${item.note || "-"}</strong>
      </div>

      <div class="detail-row">
        <label>အရင်း</label>
        <strong>${Number(item.cost).toLocaleString()} ကျပ်</strong>
      </div>

      <div class="detail-row">
        <label>ရောင်းစျေး</label>
        <strong>${Number(item.price).toLocaleString()} ကျပ်</strong>
      </div>

      <div class="detail-row">
        <label>Status</label>
        <strong>
          ${
            item.removed
              ? "ဖယ်ထား"
              : item.unsold
              ? "မရောင်းရသေး"
              : item.price > 0
              ? "ရောင်းပြီး"
              : "---------"
          }
        </strong>
      </div>

    </section>

    <div class="detail-actions">

      <button id="editItemBtn" class="btn-primary">
        ✏️ ပြင်မည်
      </button>

      <button id="deleteItemBtn" class="btn-danger">
        🗑 ဖယ်ထားမည်
      </button>

    </div>

  </main>
  `;
}
