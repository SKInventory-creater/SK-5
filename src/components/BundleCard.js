export default function BundleCard(bundle) {
  return `
    <div
      class="bundle-card"
      data-id="${bundle.id}"
    >

      <div class="bundle-icon">
        ${bundle.bundleCode}
      </div>

      <div class="bundle-info">

        <h3>${bundle.bundleName}</h3>

        <p>
          အထည် ${bundle.qty} ထည်
        </p>

        <div class="bundle-price">

          <div>
            <small>ရင်းနှီး</small>
            <strong>${bundle.cost} ကျပ်</strong>
          </div>

        </div>

      </div>

      <div class="bundle-actions">
        <button class="open-bundle-btn" data-id="${bundle.id}">
          ›
        </button>
      </div>

    </div>
  `;
}
