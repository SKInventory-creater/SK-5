export default function ItemsPage(bundle) {
  return `
    <main class="items-page">

      <header class="page-header">
        <button id="backBtn">←</button>

        <div>
          <h2>${bundle.bundleCode}</h2>
          <p>${bundle.bundleName}</p>
        </div>
      </header>

      <section id="itemList">

        <p>အထည်မရှိသေးပါ</p>

      </section>

      <button
        class="add-item-btn"
        id="addItemBtn">
        + အထည်ထည့်မည်
      </button>

    </main>
  `;
}
