export default function MonthlyReportPage(stats, month) {
  return `
    <main class="reports-page">

      <header class="reports-header">
        <button id="backBtn" class="back-btn">←</button>
        <h2>လစဉ် Report</h2>
      </header>

      <div class="report-filter">
        <input
          type="month"
          id="reportMonth"
          value="${month}"
        />
      </div>

      <section class="reports-summary">

        <div class="summary-box">
          <small>လစဉ်ရောင်းရငွေ</small>
          <h3>${Number(stats.totalSales || 0).toLocaleString()} ကျပ်</h3>
        </div>

        <div class="summary-box">
          <small>လစဉ်အမြတ်</small>
          <h3>${Number(stats.totalProfit || 0).toLocaleString()} ကျပ်</h3>
        </div>

        <div class="summary-box">
          <small>ရောင်းပြီး</small>
          <h3>${stats.soldCount || 0} ထည်</h3>
        </div>

      </section>

      <div id="monthlySoldList"></div>

    </main>
  `;
}
