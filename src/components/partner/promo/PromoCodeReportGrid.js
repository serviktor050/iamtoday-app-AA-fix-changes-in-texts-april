import React, {Component} from 'react'
import TableView from './TableView'
import moment from 'moment'
import PromoCodeReportGraph from './PromoCodeReportGraph'
import PromoCodeReportFilter from './PromoCodeReportFilter'
import PromoCodeSummary from './PromoCodeSummary'
import {
  api
} from '../../../config.js'
import cookie from 'react-cookie'
import CSSModules from 'react-css-modules'
import styles from './promoCodeReportGrid.css'

const PROMO_PAID_CURRENCY = 'руб.'
const PROMO_METRICS_GRAPH_OPTIONS = {
  'Traffic': {
    'axis': ['Дата', 'Трафик'],
    'chartType': 'LineChart',
    'columns': [{
      'label': 'time',
      'type': 'date'
    }, {
      'label': 'Количество посещений',
      'type': 'number'
    }],
    'rows': [],
    'options': {
      'legend': 'none',
      'hAxis': {
        format: 'dd MMM yyyy',
        'title': 'Дата'
      },
      'vAxis': {
        'title': 'Количество посещений'
      }
    },
    'width': '100%'
  },
  'Registration': {
    'axis': ['Дата', 'Регистраций'],
    'chartType': 'LineChart',
    'columns': [{
      'label': 'time',
      'type': 'date'
    }, {
      'label': 'Количество регистраций',
      'type': 'number'
    }],
    'rows': [],
    'options': {
      'legend': 'none',
      'hAxis': {
        format: 'dd MMM yyyy',
        'title': 'Дата'
      },
      'vAxis': {
        'title': 'Количество регистраций'
      }
    },
    'width': '100%'
  },
  'PaidRegistration': {
    'axis': ['Дата', 'Регистраций c оплатами'],
    'chartType': 'LineChart',
    'columns': [{
      'label': 'time',
      'type': 'date'
    }, {
      'label': 'Количество посещений',
      'type': 'number'
    }],
    'rows': [],
    'options': {
      'legend': 'none',
      'hAxis': {
        format: 'dd MMM yyyy',
        'title': 'Дата'
      },
      'vAxis': {
        'title': 'Количество рег. с оплатами'
      }
    },
    'width': '100%'
  },
  'PaidAmount': {
    'axis': ['Дата', 'Сумма оплат'],
    'chartType': 'LineChart',
    'columns': [{
      'label': 'time',
      'type': 'date'
    }, {
      'label': 'Сумма оплат',
      'type': 'number'
    }],
    'rows': [],
    'options': {
      'legend': 'none',
      'hAxis': {
        format: 'dd MMM yyyy',
        'title': 'Дата'
      },
      'vAxis': {
        'title': 'Сумма оплат'
      }
    },
    'width': '100%'
  }
}

class PromoCodeReportGrid extends Component {
  constructor(params) {
    super(params)
    this.handleMetricChange = this.handleMetricChange.bind(this)
    this.changeOption = this.changeOption.bind(this)
    this.state = {
      metricValue: 'Traffic',
      tableData: [],
      summary: {},
      graphData: [],
      graphOptions: PROMO_METRICS_GRAPH_OPTIONS['Traffic']
    }
  }

  static getPromoCodeReport(filter) {
    const {
      token
    } = this.props || []
    return fetch(`${api}/partner/accessLogPartner-promoCodeReport`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify({
        authToken: token ? token : cookie.load('token'),
        data: { ...filter
        }
      })
    })
  }

  static getPromoDateTimeReport(filter, metricValue) {
    const {
      token
    } = this.props || []
    return fetch(`${api}/partner/accessLogPartner-promoMetricReport`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify({
        authToken: token ? token : cookie.load('token'),
        data: { ...filter,
          metric: metricValue,
          timeUnit: moment(filter.periodEndsAt, 'YYYY-MM-DDTHH:mm:ss').diff(moment(filter.periodStartsAt, 'YYYY-MM-DDTHH:mm:ss'), 'Days') <= 2
            ? 'Hours' : moment(filter.periodEndsAt, 'YYYY-MM-DDTHH:mm:ss').diff(moment(filter.periodStartsAt, 'YYYY-MM-DDTHH:mm:ss'), 'Days') <= 180 ? 'Days' : 'Weeks'
        }
      })
    })
  }

  static calculateSummary(data) {
    var summary = {
      promoCodeCount: data.length,
      trafficCount: 0,
      regCount: 0,
      regPaidCount: 0,
      paidAmount: 0,
      currency: PROMO_PAID_CURRENCY
    }

    for (let i = 0; i < data.length; i++) {
      let item = data[i]
      summary.trafficCount += parseInt(item.trafficCount)
      summary.regCount += parseInt(item.regCount)
      summary.regPaidCount += parseInt(item.regPaidCount)
      summary.paidAmount += parseFloat(item.paidAmount)
    }

    return summary
  }

  changeOption(filter, callback, metricValue) {
    metricValue = metricValue || this.state.metricValue
    Promise.all([PromoCodeReportGrid.getPromoCodeReport(filter), PromoCodeReportGrid.getPromoDateTimeReport(filter, metricValue)])
      .then((data) => {
        Promise.all([data[0].json(), data[1].json()])
          .then((json) => {
            this.setState({
              filter: filter,
              callback: callback,
              metricValue: metricValue,
              tableData: json[0] ? json[0] : [],
              graphData: this.toGraphData(json[1], metricValue),
              summary: PromoCodeReportGrid.calculateSummary(json[0] ? json[0] : [])
            })
            callback(json[0] ? json[0] : [])
          })
      })
  }

  toGraphData(json, metricValue) {
    let graphData = (json ? json.map((item) => [moment(item.Key, 'YYYY-MM-DDTHH:mm:ss').toDate(), item.Value]) : [])
    if (graphData.length > 0) {
      graphData.unshift(PROMO_METRICS_GRAPH_OPTIONS[metricValue].axis)
    } else {
      graphData.push((PROMO_METRICS_GRAPH_OPTIONS[metricValue].axis))
      graphData.push([moment().startOf('day').toDate(), 0])
    }
    return graphData
  }

  static renderMoney(value, currency) {
    return ((value).toFixed(2) + ' ' + PROMO_PAID_CURRENCY)
  }

  /**
   * Рендер строк таблицы.
   */
  renderTableBody = () => {
    const {
      tableData
    } = this.state
    return (tableData.map(function(item, index) {
      return (
      <tr key = {index}>
        <td width = "10%" className = "text" > {item.promoCode} </td>
        <td width = "20%" className = "number" > {item.trafficCount} </td>
        <td width = "20%" className = "number" > {item.regCount} </td>
        <td width = "20%" className = "number" > {item.regPaidCount} </td>
        <td width = "30%" className = "money" > {PromoCodeReportGrid.renderMoney(item.paidAmount)} </td>
      </tr>)
    }))
  }

  static renderTableHead() {
    return (
      <tr>
        <th> КОД </th> <th className = "number" > ТРАФИК </th>
        <th className = "number" > РЕГИСТРАЦИЙ </th>
        <th className = "number" > РЕГИСТРАЦИЙ С ОПЛАТАМИ </th>
        <th className = "money" > СУММА ОПЛАТ </th>
      </tr>
    )
  }

  handleMetricChange(metric) {
    this.changeOption(
      this.state.filter,
      this.state.callback,
      metric.target.value
    )
  }

  render() {
    return (
        <div className={styles.gridPromoReport}>
            <div className="1/1--pocket 1/1--lap 1/1--desk grid__cell">
                <div className="1/1--pocket 1/1--lap 1/1--desk grid__cell">
                    <PromoCodeReportFilter onChangeOption={(item, callback) => this.changeOption(item, callback)}/>
                </div>
                <div className="1/1--pocket 1/1--lap 1/2--desk grid__cell">
                    <div className={styles.promoChart}>
                        <div className={styles.promoChartMetric}>
                            <select className={styles.selectField} value={this.state.metricValue} onChange={this.handleMetricChange}>
                                <option value="Traffic">Трафик</option>
                                <option value="Registration">Регистраций</option>
                                <option value="PaidRegistration">Рег.оплатами</option>
                                <option value="PaidAmount">Сумма оплат</option>
                            </select>
                        </div>
                       <PromoCodeReportGraph data={this.state.graphData} options={this.state.graphOptions}/>
                    </div>
                </div>
                <div className="1/1--pocket 1/1--lap 1/2--desk grid__cell">
                    <div>
                        <PromoCodeSummary summary={this.state.summary}/>
                    </div>
                </div>
                <div className="1/1--pocket 1/1--lap 1/1--desk grid__cell">
                    <div className={styles.baseTablePromoReportTable}>
                        <TableView
                            body={this.renderTableBody()}
                            head={PromoCodeReportGrid.renderTableHead()}
                            className={styles.baseTable}/>
                </div>
                </div>
            </div>
        </div>
    )
  }
}

export default CSSModules(PromoCodeReportGrid, styles)
