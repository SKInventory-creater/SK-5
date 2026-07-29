export default function BundleCard(bundle) {
  return `
    <div class="bundle-card">

      <div class="bundle-icon">
        ${bundle.icon || "B"}
      </div>

      <div class="bundle-info">

        <h3>${bundle.name}</h3>

        <p>
          ရောင်းပြီး ${bundle.sold}
          ·
          မရောင်းရသေး ${bundle.unsold}
        </p>

        <div class="bundle-price">

          <div>
            <small>ရင်းနှီး</small>
            <strong>${bundle.cost} ကျပ်</strong>
          </div>

          <div>
            <small>အမြတ်</small>
            <strong class="profit">${bundle.profit}</strong>
          </div>

        </div>

      </div>

      <div class="bundle-actions">
        <button>›</button>
        <button>🗑</button>
      </div>

    </div>
  `;
}
