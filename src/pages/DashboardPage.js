import { getBundles } from "../services/bundleService.js";
import BundleCard from "../components/BundleCard.js";

export default async function DashboardPage() {

 const bundles = await getBundles();

  return `
    <main class="dashboard-page">

      <header class="dashboard-header">
        <div>
          <h1>ဘေထုတ် Inventory</h1>
          <p>ဘေထုတ် 0 ခု · အထည် 0 ခု</p>
        </div>

        <button class="add-bundle-btn" id="addBundleBtn">
          +
        </button>
      </header>

      <section class="profit-card">
        <span>စုစုပေါင်းအမြတ်</span>
        <h2>0 ကျပ်</h2>
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
