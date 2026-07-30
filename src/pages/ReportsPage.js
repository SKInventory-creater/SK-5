export default function ReportsPage(stats) {

  return `
  <main class="reports-page">

    <header class="page-header">

      <button id="backBtn">←</button>

      <h2>အစီရင်ခံစာ</h2>

    </header>

    <section class="report-card">
      <small>စုစုပေါင်းအရင်း</small>
      <h3>${Number(stats.totalCost).toLocaleString()} ကျပ်</h3>
    </section>

    <section class="report-card">
      <small>စုစုပေါင်းရောင်းရငွေ</small>
      <h3>${Number(stats.totalSales).toLocaleString()} ကျပ်</h3>
    </section>

    <section class="report-card">
      <small>စုစုပေါင်းအမြတ်</small>
      <h3>${Number(stats.totalProfit).toLocaleString()} ကျပ်</h3>
    </section>

    <section class="report-card">
      <small>ရောင်းပြီး</small>
      <h3>${stats.soldCount} ထည်</h3>
    </section>

    <section class="report-card">
      <small>မရောင်းရသေး</small>
      <h3>${stats.unsoldCount} ထည်</h3>
    </section>

    <section class="report-card">
      <small>ဖယ်ထား</small>
      <h3>${stats.reservedCount} ထည်</h3>
    </section>

  </main>
  `;
}
