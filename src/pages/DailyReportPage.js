export default function DailyReportPage(stats) {
  return `
  <main class="reports-page">

    <header class="reports-header">
      <button id="backBtn" class="back-btn">←</button>
      <h2>နေ့စဉ် Report</h2>
    </header>

    <section class="reports-summary">

      <div class="summary-box">
        <small>ယနေ့ရောင်းရငွေ</small>
        <h3>${Number(stats.totalSales || 0).toLocaleString()} ကျပ်</h3>
      </div>

      <div class="summary-box">
        <small>ယနေ့အမြတ်</small>
        <h3>${Number(stats.totalProfit || 0).toLocaleString()} ကျပ်</h3>
      </div>

      <div class="summary-box">
        <small>ရောင်းပြီး</small>
        <h3>${stats.soldCount || 0} ထည်</h3>
      </div>

      <div class="summary-box">
	<small>ယနေ့ Report Date</small>
	<h3>${new Date().toLocaleDateString()}</h3>
      </div>

    </section>

  </main>
  `;
}
