export default function ItemsPage(bundle, items) {
  const totalCost = Number(bundle.cost || 0);

  const soldItems = items.filter(
    item => item.unsold == 0 && item.removed == 0
  );

  const totalSales = soldItems.reduce(
    (sum, item) => sum + Number(item.price || 0),
    0
  );

  const soldCost = soldItems.reduce(
    (sum, item) => sum + Number(item.cost || 0),
    0
  );

  const totalProfit = totalSales - soldCost;

  return `
    <main class="items-page">

      <!-- ================= HEADER ================= -->

      <header class="items-header">

        <button
          id="backBtn"
          class="back-btn"
          type="button"
        >
          ←
        </button>

        <div class="bundle-avatar">
          ${bundle.bundleCode || ""}
        </div>

        <div class="bundle-header-info">
          <h2>${bundle.bundleName || "Bundle"}</h2>
          <p>${bundle.qty || 0} ထည်</p>
        </div>

        <button
          id="addItemBtn"
          class="header-add-btn"
          type="button"
        >
          + အထည်ထည့်
        </button>

      </header>


      <!-- ================= SUMMARY ================= -->

      <section class="items-summary">

        <div class="summary-item">
          <small>ရောင်းစျေး</small>
          <strong>
            ${totalSales.toLocaleString()} ကျပ်
          </strong>
        </div>

        <div class="summary-item">
          <small>အရင်း</small>
          <strong>
            ${totalCost.toLocaleString()} ကျပ်
          </strong>
        </div>

        <div class="summary-item">
          <small>အမြတ်</small>
          <strong class="profit">
            ${totalProfit.toLocaleString()} ကျပ်
          </strong>
        </div>

      </section>


      <!-- ================= SEARCH ================= -->

      <div class="search-box">

        <input
          id="searchItem"
          type="text"
          placeholder="ကုတ်၊ အမည်ဖြင့် ရှာရန်"
        >

      </div>


      <!-- ================= FILTER ================= -->

      <div class="filter-box">

        <select id="statusFilter">

          <option value="all">
            အားလုံး
          </option>

          <option value="empty">
            မထည့်ရသေး
          </option>

          <option value="unsold">
            မရောင်းရသေး
          </option>

          <option value="reserved">
            ဖယ်ထား
          </option>

          <option value="sold">
            ရောင်းပြီး
          </option>

        </select>

      </div>


      <!-- ================= ITEM LIST ================= -->

      <section
        id="itemList"
        class="item-list"
      >

        ${
          items.length
            ? items
                .map(item => {

                  const isEmpty =
                    item.price == 0 &&
                    !item.note;

                  const status =
                    isEmpty
                      ? "empty"
                      : item.removed
                        ? "reserved"
                        : item.unsold
                          ? "unsold"
                          : "sold";

                  const statusText =
                    isEmpty
                      ? "──────"
                      : item.removed
                        ? "🟠 ဖယ်ထား"
                        : item.unsold
                          ? "🟢 မရောင်းရသေး"
                          : "🔵 ရောင်းပြီး";

                  return `
                    <div class="item-card">

                      <!-- PHOTO -->

                      <div class="item-photo">

                        ${
                          item.photo
                            ? `
                              <img
                                src="${item.photo}"
                                class="item-photo-img"
                                alt="${item.itemId || "Item"}"
                              >
                            `
                            : "📦"
                        }

                      </div>


                      <!-- ITEM INFORMATION -->

                      <div class="item-info">

                        <!-- TOP -->

                        <div class="item-top-row">

                          <h3>
                            ${item.itemId || ""}
                          </h3>

                          <div class="item-price-row">

                            <span>
                              အရင်း
                              ${Number(item.cost || 0).toLocaleString()}
                              ကျပ်
                            </span>

                            <strong>
                              ${Number(item.price || 0).toLocaleString()}
                              ကျပ်
                            </strong>

                          </div>

                        </div>


                        <!-- BOTTOM -->

                        <div class="item-bottom-row">

                          <p class="item-note">
                            ${item.note || "မှတ်ချက် မရှိ"}
                          </p>

                          <div class="item-status">

                            <span
                              class="item-status-text"
                              data-status="${status}"
                            >
                              ${statusText}
                            </span>

                          </div>

                        </div>

                      </div>

                    </div>
                  `;
                })
                .join("")
            : `
              <div class="empty-card">

                <div class="empty-icon">
                  📦
                </div>

                <h3>
                  အထည်မရှိသေးပါ
                </h3>

                <p>
                  အပေါ်ညာဘက်ရှိ
                  “+ အထည်ထည့်” ခလုတ်ကိုနှိပ်ပြီး
                  အထည်များ စတင်ထည့်နိုင်ပါသည်။
                </p>

              </div>
            `
        }

      </section>

    </main>
  `;
}
