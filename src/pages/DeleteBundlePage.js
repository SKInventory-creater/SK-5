export default function DeleteBundlePage(bundles) {
  return `
  <main class="delete-bundle-page">

    <header class="page-header">
      <button id="backBtn">←</button>
      <h2>ဘေထုတ်ဖျက်</h2>
    </header>

    <section class="bundle-list">

      ${
        bundles.length
          ? bundles.map(bundle => `
            <div class="bundle-card">
              <div>
                <strong>${bundle.bundleCode}</strong><br>
                <small>${bundle.bundleName}</small>
              </div>

              <button
                class="deleteBundleBtn"
                data-id="${bundle.id}">
                🗑 ဖျက်
              </button>
            </div>
          `).join("")
          : `
            <div class="empty-card">
              ဘေထုတ် မရှိသေးပါ
            </div>
          `
      }

    </section>

  </main>
  `;
}
