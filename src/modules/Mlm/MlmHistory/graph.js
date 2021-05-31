export function getChartOptions(
  chartData,
  grown = false,
  dateFormatter = null
) {
  const historyData = chartData;

  const dates = historyData.map((x) =>
    dateFormatter ? dateFormatter(x.date) : x.date
  );
  const values = [];
  let accumulator = 0;
  historyData.forEach((x, index) => {
    values[index] = x.count + accumulator;
    if (grown) {
      accumulator = values[index];
    }
  });
  const titles = historyData.map((x) => x.title);

  const scoresMin = +(0.99 * Math.min(...values)).toFixed(0);
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
        data: values,
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

export function getRewardsChartOptions(
  //chartData,
  chartData1Level,
  chartData2Level,
  chartDataAll,
  grown = false,
  dateFormatter = null
) {
  const dataAll = chartDataAll.map((x) => x.date);
  const dates = dataAll; //dates1Level.concat(dates2Level, dataAll);

  const values1Level = chartData1Level.map((x) => x.count);
  const values2Level = chartData2Level.map((x) => x.count);
  const valuesAll = chartDataAll.map((x) => x.count);

  const titlesAll = chartDataAll.map((x) => x.title);

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
        return titlesAll[params[0].dataIndex];
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

export function getPartnersChartOptions(
  //chartData,
  chartData1Level,
  chartData2Level,
  chartDataAll,
  grown = false,
  dateFormatter = null
) {
  const dataAll = chartDataAll.map((x) => x.date);
  const dates = dataAll; //dates1Level.concat(dates2Level, dataAll);

  const values1Level = chartData1Level.map((x) => x.count);
  const values2Level = chartData2Level.map((x) => x.count);
  const valuesAll = chartDataAll.map((x) => x.count);

  const titlesAll = chartDataAll.map((x) => x.title);

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
        return titlesAll[params[0].dataIndex];
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
          color: "#FF6B6B",
        },
        lineStyle: { color: "#FF6B6B" },
      },
      {
        data: values2Level,
        type: "line",
        smooth: true,
        itemStyle: {
          color: "#4DA2D6",
        },
        lineStyle: { color: "#4DA2D6" },
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
