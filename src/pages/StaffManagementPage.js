export default function StaffManagementPage() {
  return `
    <main class="staff-management-page">

      <header class="staff-management-header">
        <button id="backBtn" class="staff-back-btn">
          ←
        </button>

        <div class="staff-header-info">
          <h2>Staff Management</h2>
          <p>ဆိုင်ဝန်ထမ်းများကို စီမံခန့်ခွဲရန်</p>
        </div>
      </header>

      <section class="staff-management-card">

        <div class="staff-section-header">
          <div>
            <h3>ဝန်ထမ်းစာရင်း</h3>
            <p>ဆိုင်တွင်အသုံးပြုနေသော Staff အကောင့်များ</p>
          </div>

          <div class="staff-section-icon">
            👥
          </div>
        </div>

        <div id="staffList" class="staff-list"></div>

      </section>

    </main>
  `;
}
