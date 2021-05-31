export function getStatisticChartOptions(
  //chartData,
  chartData1Level,
  chartData2Level,
  chartDataAll,
  grown = false,
  dateFormatter = null
) {
  const datesAll = chartDataAll.map((x) => x.date);
  const dates = datesAll; //dates1Level.concat(dates2Level, dataAll);

  const values1Level = chartData1Level.map((x) => x.count);
  const values2Level = chartData2Level.map((x) => x.count);
  const valuesAll = chartDataAll.map((x) => x.count);

  const titlesAll = chartDataAll.map((x) => x.title);
  const titles = titlesAll; //titles1Level.concat(titles2Level, titlesAll);

  const scoresMin = +(0.99 * Math.min(...valuesAll)).toFixed(0);

  return {
    grid: {
      top: "5%",
      bottom: "5%",
      left: "5%",
      right: "5%",
      containLabel: true,
    },
    tooltip: {
      trigger: "axis",
      backgroundColor: "rgba(255, 255, 255, 1)",
      borderColor: "white",
      borderWidth: 2,
      textStyle: { color: "#4DA2D6", fontSize: 10 },
      formatter: function (params) {
        return titles[params[0].dataIndex];
      },
    },
    xAxis: {
      boundaryGap: false,
      type: "category",
      data: dates,
    },
    yAxis: {
      axisLabel: {
        formatter: function (value, _) {
          return `${value}`;
        },
      },
      type: "value",
      min: scoresMin,
    },
    series: [
      {
        data: values1Level,
        type: "line",
        smooth: true,
        itemStyle: {
          color: "#79C330",
        },
        lineStyle: { color: "#79C330" },
      },
      {
        data: values2Level,
        type: "line",
        smooth: true,
        itemStyle: {
          color: "#FF9F43",
        },
        lineStyle: { color: "#FF9F43" },
      },
      {
        data: valuesAll,
        type: "line",
        smooth: true,
        itemStyle: {
          color: "#4DA2D6",
        },
        lineStyle: { color: "#4DA2D6" },
      },
    ],
  };
}

export function getSpendingChartOptions(
  //chartData,
  chartDataModules,
  chartDataOrders,
  chartDataAll,
  grown = false,
  dateFormatter = null
) {
  const datesAll = chartDataAll.map((x) => x.date);
  const dates = datesAll; //dates1Level.concat(dates2Level, dataAll);

  const valuesModules = chartDataModules.map((x) => x.count);
  const valuesOrders = chartDataOrders.map((x) => x.count);
  const valuesAll = chartDataAll.map((x) => x.count);

  const titlesAll = chartDataAll.map((x) => x.title);
  const titles = titlesAll; //titles1Level.concat(titles2Level, titlesAll);

  const scoresMin = +(0.99 * Math.min(...valuesAll)).toFixed(0);

  return {
    grid: {
      top: "5%",
      bottom: "5%",
      left: "5%",
      right: "5%",
      containLabel: true,
    },
    tooltip: {
      trigger: "axis",
      backgroundColor: "rgba(255, 255, 255, 1)",
      borderColor: "white",
      borderWidth: 2,
      textStyle: { color: "#4DA2D6", fontSize: 10 },
      formatter: function (params) {
        return titles[params[0].dataIndex];
      },
    },
    xAxis: {
      boundaryGap: false,
      type: "category",
      data: dates,
    },
    yAxis: {
      axisLabel: {
        formatter: function (value, _) {
          return `${value}`;
        },
      },
      type: "value",
      min: scoresMin,
    },
    series: [
      {
        data: valuesModules,
        type: "line",
        smooth: true,
        itemStyle: {
          color: "#FFEAEA",
        },
        lineStyle: { color: "#FFEAEA" },
      },
      {
        data: valuesOrders,
        type: "line",
        smooth: true,
        itemStyle: {
          color: "#DAEFF2",
        },
        lineStyle: { color: "#DAEFF2" },
      },
      {
        data: valuesAll,
        type: "line",
        smooth: true,
        itemStyle: {
          color: "#F3D6FF",
        },
        lineStyle: { color: "#F3D6FF" },
      },
    ],
  };
}

export function getFIO(lastName, firstName, middleName) {
  let fio = lastName ? `${lastName} ` : "";
  if (firstName) {
    fio += firstName.slice(0, 1) + ".";
  }
  if (middleName) {
    fio += middleName.slice(0, 1) + ".";
  }
  return fio;
}

export function getCountryFlag(country) {
  const validatedCountry = country
    ? country.replace(/\s+/g, "").toLowerCase()
    : null;
  switch (validatedCountry) {
    case "россия":
      return "#russia";

      break;

    case "абхазия":
      return "#abkhazia";

      break;
    default:
      return null;
  }
}
