export default function AddBundlePage() {
  return `
    <main class="add-bundle-page">

      <header class="page-header">
        <h1>ဘေထုတ်အသစ်</h1>
      </header>

      <section class="form-card">

        <div class="form-group">
          <label>ဘေထုတ်ကုဒ်</label>
          <input
            id="bundleCode"
            type="text"
            placeholder="ဥပမာ A"
          />
        </div>

        <div class="form-group">
          <label>ဘေထုတ်အမည်</label>
          <input
            id="bundleName"
            type="text"
            placeholder="ဥပမာ ဘေထုတ် A"
          />
        </div>

        <div class="form-group">
          <label>အထည်အရေအတွက်</label>
          <input
            id="bundleQty"
            type="number"
            placeholder="150"
          />
        </div>

        <div class="form-group">
          <label>အရင်း  (ကျပ်)</label>
          <input
            id="bundleCost"
            type="number"
            placeholder="1456000"
          />
        </div>

	<div class="bundle-summary">

	  <h3>⚡ အလိုအလျောက်တွက်ချက်မှု</h3>

	  <div class="summary-row">
	    <span>စုစုပေါင်းအထည်</span>
	    <strong id="summaryQty">0</strong>
	  </div>

	  <div class="summary-row">
	    <span>စုစုပေါင်းအရင်း</span>
	    <strong id="summaryCost">0 ကျပ်</strong>
	  </div>

	  <div class="summary-row total">
	    <span>တစ်ထည်အရင်း</span>
	    <strong id="summaryUnitCost">0 ကျပ်</strong>
	  </div>

	  <small>
	    * အထည်တစ်ထည်၏ အရင်းကို အလိုအလျောက်တွက်ပေးသည်
	  </small>

	</div>

        <div class="form-buttons">

          <button
            id="cancelBundleBtn"
            class="btn-secondary">
            ပယ်ဖျက်
          </button>

          <button
            id="saveBundleBtn"
            class="btn-primary">
            သိမ်းမည်
          </button>

        </div>

      </section>

    </main>
  `;
}
