
export function getChartOptions(chartData, grown = false, dateFormatter = null) {

    const historyData = chartData;

    const dates = historyData.map(x => dateFormatter ? dateFormatter(x.date) : x.date);
    const values = [];
    let accumulator = 0;
        historyData.forEach((x, index) => {
            values[index] = x.count + accumulator
            if(grown){
                accumulator = values[index];
            }
    });
    const titles = historyData.map(x => x.title);

    const scoresMin = +(0.99 * Math.min(...values)).toFixed(0);
    return {
        grid: {
            top: "5%",
            bottom: "5%",
            left: "5%",
            right: "5%",
            containLabel: true
        },
        tooltip: {
            trigger: 'axis',
            backgroundColor: 'rgba(255, 255, 255, 1)',
            borderColor: 'white',
            borderWidth: 2,
            textStyle: {color: '#4DA2D6', fontSize: 10},
            formatter: function (params) {
                return titles[params[0].dataIndex];
            },
        },
        xAxis: {
            boundaryGap: false,
            type: 'category',
            data: dates
        },
        yAxis: {
            axisLabel: {
                formatter: function(value, _) {
                    return `${value}`;
                }
            },
            type: 'value',
            min: scoresMin,
        },
        series: [{
            data: values,
            type: 'line',
            smooth: true,
            itemStyle: {
            color: '#4DA2D6'
    },
            lineStyle: {color: '#4DA2D6'},
        }]
    }
}