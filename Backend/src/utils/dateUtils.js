 function floorDate(date, period) {
  const d = new Date(date);
  switch (period) {
    case "Day":
      d.setUTCHours(0, 0, 0, 0);
      break;
    case "Week":
      d.setUTCDate(d.getUTCDate() - d.getUTCDay());
      d.setUTCHours(0, 0, 0, 0);
      break;
    case "Month":
      d.setUTCDate(1);
      d.setUTCHours(0, 0, 0, 0);
      break;
    case "Quarter":
      d.setUTCMonth(Math.floor(d.getUTCMonth() / 3) * 3, 1);
      d.setUTCHours(0, 0, 0, 0);
      break;
    case "Year":
      d.setUTCMonth(0, 1);
      d.setUTCHours(0, 0, 0, 0);
      break;
  }
  return d;
}

 function ceilDate(date, period) {
  const d = floorDate(date, period);
  switch (period) {
    case "Day":
      d.setUTCDate(d.getUTCDate() + 1);
      break;
    case "Week":
      d.setUTCDate(d.getUTCDate() + 7);
      break;
    case "Month":
      d.setUTCMonth(d.getUTCMonth() + 1);
      break;
    case "Quarter":
      d.setUTCMonth(d.getUTCMonth() + 3);
      break;
    case "Year":
      d.setUTCFullYear(d.getUTCFullYear() + 1);
      break;
  }
  return d;
}

 function shiftDate(date, period, offset) {
  const d = new Date(date);
  switch (period) {
    case "Day":
      d.setUTCDate(d.getUTCDate() + offset);
      break;
    case "Week":
      d.setUTCDate(d.getUTCDate() + 7 * offset);
      break;
    case "Month":
      d.setUTCMonth(d.getUTCMonth() + offset);
      break;
    case "Quarter":
      d.setUTCMonth(d.getUTCMonth() + 3 * offset);
      break;
    case "Year":
      d.setUTCFullYear(d.getUTCFullYear() + offset);
      break;
  }
  return d;
}


module.exports = { floorDate, ceilDate, shiftDate };