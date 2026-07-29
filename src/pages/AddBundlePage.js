export default function AddBundlePage() {
  return `
    <div class="sheet">

      <div class="sheet-header">

        <h2>ဘေထုတ်အသစ်</h2>

        <button
          id="cancelBundleBtn"
          class="close-btn">
          ✕
        </button>

      </div>

      <div class="sheet-body">

        <div class="form-group">
          <label>ဘေထုတ်ကုဒ်</label>
          <input
            id="bundleCode"
            class="input"
            placeholder="ဥပမာ B001"
          >
        </div>

        <div class="form-group">
          <label>ဘေထုတ်အမည်</label>
          <input
            id="bundleName"
            class="input"
          >
        </div>

        <div class="form-group">
          <label>အထည်အရေအတွက်</label>
          <input
            id="bundleQty"
            class="input"
            type="number"
          >
        </div>

        <div class="form-group">
          <label>အရင်း</label>
          <input
            id="bundleCost"
            class="input"
            type="number"
          >
        </div>

      </div>

      <div class="sheet-footer">

        <button
          id="saveBundleBtn"
          class="btn-primary">
          သိမ်းမည်
        </button>

      </div>

    </div>
  `;
}
