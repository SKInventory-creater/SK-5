export function calculateReportStats(bundles, items) {

  return {

    totalCost: bundles.reduce(
      (sum, b) => sum + Number(b.cost || 0),
      0
    ),

    totalSales: items
      .filter(i => !i.unsold && !i.removed)
      .reduce(
        (sum, i) => sum + Number(i.price || 0),
        0
      ),

    totalProfit: items
      .filter(i => !i.unsold && !i.removed)
      .reduce(
        (sum, i) =>
          sum + (Number(i.price || 0) - Number(i.cost || 0)),
        0
      ),

    soldCount: items.filter(i => !i.unsold && !i.removed).length,

    unsoldCount: items.filter(i => i.unsold && !i.removed).length,

    reservedCount: items.filter(i => i.removed).length

  };

}

export function calculateDailyReport(todayItems) {

  return {

    totalSales: todayItems.reduce(
      (sum, item) => sum + Number(item.price || 0),
      0
    ),

    totalProfit: todayItems.reduce(
      (sum, item) =>
        sum + (Number(item.price || 0) - Number(item.cost || 0)),
      0
    ),

    soldCount: todayItems.length

  };

}
