export default function MonthlyReportPage(stats, month) {
  return `
    <main class="report-page">

      <header class="page-header">
        <button id="backBtn">←</button>
        <h2>လစဉ် Report</h2>
      </header>

      <section class="report-card">
        <h3>${month}</h3>

        <p>ရောင်းပြီးအထည် : ${stats.soldCount}</p>
        <p>စုစုပေါင်းရောင်းရငွေ : ${stats.totalSales.toLocaleString()} ကျပ်</p>
        <p>စုစုပေါင်းအမြတ် : ${stats.totalProfit.toLocaleString()} ကျပ်</p>

      </section>

    </main>
  `;
}
