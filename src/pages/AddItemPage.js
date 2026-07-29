export default function AddItemPage() {
  return `
    <main class="add-item-page">

      <header class="page-header">
        <h2>အထည်အသစ်ထည့်မည်</h2>
      </header>

      <section class="form-card">

        <div class="form-group">
          <label>ဓာတ်ပုံ</label>
          <input
            id="itemPhoto"
            type="file"
            accept="image/*"
          />
        </div>

        <div class="form-group">
          <label>ဝယ်ယူစျေး</label>
          <input
            id="itemCost"
            type="number"
            placeholder="0"
          />
        </div>

        <div class="form-group">
          <label>ရောင်းစျေး</label>
          <input
            id="itemPrice"
            type="number"
            placeholder="0"
          />
        </div>

        <div class="form-group">
          <label>မှတ်ချက်</label>
          <textarea
            id="itemNote"
            rows="3"
          ></textarea>
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
