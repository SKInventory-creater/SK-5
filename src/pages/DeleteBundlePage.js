export default function DeleteBundlePage(bundles) {
  return `
    <main class="delete-bundle-page">

      <header class="delete-bundle-header">
        <button id="backBtn" class="delete-back-btn">←</button>

        <div class="delete-header-title">
          <h2>ဘေထုတ်ဖျက်</h2>
          <span>မလိုအပ်တော့သော ဘေထုတ်များကို ဖျက်နိုင်ပါသည်</span>
        </div>
      </header>

      <section class="delete-bundle-list">

        ${
          bundles.length
            ? bundles
                .map(
                  bundle => `
                    <article class="delete-bundle-card">

                      <div class="delete-bundle-icon">
                        📦
                      </div>

                      <div class="delete-bundle-info">
                        <strong>${bundle.bundleCode}</strong>
                        <span>${bundle.bundleName}</span>
                      </div>

                      <button
                        class="deleteBundleBtn"
                        data-id="${bundle.id}"
                        type="button"
                        aria-label="ဘေထုတ်ဖျက်ရန်">
                        🗑
                      </button>

                    </article>
                  `
                )
                .join("")
            : `
              <div class="delete-empty-card">
                <div class="delete-empty-icon">📦</div>
                <strong>ဘေထုတ် မရှိသေးပါ</strong>
                <span>ဖျက်ရန် ဘေထုတ်မရှိသေးပါ</span>
              </div>
            `
        }

      </section>

    </main>
  `;
}

