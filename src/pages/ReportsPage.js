export default function ReportsPage(stats) {

  return `
  <main class="reports-page">

    <header class="reports-header">

  <button id="backBtn" class="back-btn">
    ←
  </button>

  <h2>အစီရင်ခံစာ</h2>

</header>

<section class="reports-summary">

  <div class="summary-box">
    <small>စုစုပေါင်းရောင်းရငွေ</small>
    <h3>${Number(stats.totalSales).toLocaleString()} ကျပ်</h3>
  </div>

  <div class="summary-box">
    <small>စုစုပေါင်းအမြတ်</small>
    <h3>${Number(stats.totalProfit).toLocaleString()} ကျပ်</h3>
  </div>

  <div class="summary-box">
  <small>ရောင်းပြီး</small>
  <h3>${stats.soldCount} ထည်</h3>
</div>

<div class="summary-box">
  <small>မရောင်းရသေး</small>
  <h3>${stats.unsoldCount} ထည်</h3>
</div>

<div class="summary-box">
  <small>ဖယ်ထား</small>
  <h3>${stats.reservedCount} ထည်</h3>
</div>

</section>

<section class="reports-menu">

  <button id="dailyReportBtn" class="report-card">
    <div>📅</div>
    <strong>နေ့စဉ် Report</strong>
  </button>

  <button id="monthlyReportBtn" class="report-card">
    <div>📆</div>
    <strong>လစဉ် Report</strong>
  </button>

</section>

  </main>
  `;
}
