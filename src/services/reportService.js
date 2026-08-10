export function calculateReportStats(bundles, items) {

  const soldItems = items.filter(
    item => !item.unsold && !item.removed
  );

  return {

    totalCost: bundles.reduce(
      (sum, bundle) => sum + Number(bundle.cost || 0),
      0
    ),

    totalSales: soldItems.reduce(
      (sum, item) => sum + Number(item.price || 0),
      0
    ),

    totalProfit: soldItems.reduce(
      (sum, item) =>
        sum +
        (Number(item.price || 0) - Number(item.cost || 0)),
      0
    ),

    soldCount: soldItems.length,

    unsoldCount: items.filter(
      item => item.unsold && !item.removed
    ).length,

    reservedCount: items.filter(
      item => item.removed
    ).length

  };

}


export function calculateDailyReport(todayItems) {

  const soldItems = todayItems.filter(
    item => !item.unsold && !item.removed
  );

  return {

    totalSales: soldItems.reduce(
      (sum, item) => sum + Number(item.price || 0),
      0
    ),

    totalProfit: soldItems.reduce(
      (sum, item) =>
        sum +
        (Number(item.price || 0) - Number(item.cost || 0)),
      0
    ),

    soldCount: soldItems.length

  };

}


export function calculateMonthlyReport(monthItems) {

  const soldItems = monthItems.filter(
    item => !item.unsold && !item.removed
  );

  return {

    totalSales: soldItems.reduce(
      (sum, item) => sum + Number(item.price || 0),
      0
    ),

    totalProfit: soldItems.reduce(
      (sum, item) =>
        sum +
        (Number(item.price || 0) - Number(item.cost || 0)),
      0
    ),

    soldCount: soldItems.length

  };

}

