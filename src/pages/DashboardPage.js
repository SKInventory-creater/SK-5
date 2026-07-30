import { getBundles } from "../services/bundleService.js";
import { getTotalProfit } from "../services/itemService.js";
import BundleCard from "../components/BundleCard.js";

export default async function DashboardPage() {

 const bundles = await getBundles();
const totalProfit = await getTotalProfit();
 const totalBundles = bundles.length;

  const totalItems = bundles.reduce(
    (sum, bundle) => sum + Number(bundle.qty || 0),
    0
  );
  return `
    <main class="dashboard-page">

      <header class="dashboard-header">
        <div>
          <h1>ဘေထုတ် Inventory</h1>
          <p>ဘေထုတ် ${totalBundles} ခု ·
  အထည် ${totalItems.toLocaleString()} ခု</p>
        </div>

        <button class="add-bundle-btn" id="addBundleBtn">
          +
        </button>
      </header>

      <section class="profit-card">
        <span>စုစုပေါင်းအမြတ်</span>
        <h2>${totalProfit.toLocaleString()} ကျပ်</h2>
      </section>

      <section id="bundleList">

  ${bundles.map(bundle => BundleCard(bundle)).join("")}

</section>

      <button class="fab">
        ⚙
      </button>

      <nav class="bottom-nav">
        <button class="active">
          ဘေထုတ်များ
        </button>

        <button>
          အမြတ်ပေါင်းချုပ်
        </button>
      </nav>

    </main>
  `;
}
