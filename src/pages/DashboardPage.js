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

	<button class="menuBtn" id= "menuBtn">
	  ⋮
	</button>

	<div id="popupMenu" class="popup-menu" style="display:none;">

	  <button id="addBundleMenu">
	    ➕ Add Bundle
	  </button>

	  <button id="deleteBundleMenu">
	    🗑 Delete Bundle
	  </button>

	  <button id="settingsMenu">
	    ⚙ Settings
	  </button>

	</div>

      </header>

	<div class="search-box">
	  <input
	    id="dashboardSearch"
	    type="text"
	    placeholder=" အထည်ကုတ် / Note / Bundle Code ဖြင့်ရှာရန်"
	  />
	</div>

	<div id="searchResults"></div>

      <section class="profit-card">
        <span>စုစုပေါင်းအမြတ်</span>
        <h2>${totalProfit.toLocaleString()} ကျပ်</h2>
      </section>

	<section class="dashboard-stats">

	  <div class="stat-card">
	    <small>ဘေထုတ်</small>
	    <h3>${totalBundles}</h3>
	  </div>

	  <div class="stat-card">
	    <small>အထည်</small>
	    <h3>${totalItems.toLocaleString()}</h3>
	  </div>

	</section>

      <section id="bundleList">

  ${bundles.map(bundle => BundleCard(bundle)).join("")}

</section>

      <nav class="bottom-nav">
        <button class="active">
          ဘေထုတ်များ
        </button>

        <button id="reportsBtn">
          အစီရင်ခံစာ
        </button>
      </nav>

    </main>
  `;
}
