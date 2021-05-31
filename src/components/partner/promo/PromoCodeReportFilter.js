import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Pickaday from './pickaday'
import ReactTags from 'react-tag-autocomplete'
import moment from 'moment'
import CSSModules from 'react-css-modules'
import styles from './promoCodeReportFilter.css'

const supportedPeriodFormats = ['DD.MM.YYYY HH:mm', 'DD.MM.YYYY', 'DD.MM.YYYY HH', 'DD.MM.YYYY HH:mm:ss', 'HH:mm']
const displayPeriodFormat = 'DD.MM.YYYY HH:mm'
const serverPeriodFormat = 'YYYY-MM-DDTHH:mm:ss.SSS'

const periodSelectors = [{
  id: 1,
  label: 'Произвольный',
  value: 'custom'
},
{
  id: 2,
  label: 'Сегодня',
  value: 'day'
},
{
  id: 3,
  label: 'Вчера',
  value: 'yesterday'
},
{
  id: 4,
  label: 'Неделя',
  value: 'week'
},
{
  id: 5,
  label: 'Месяц',
  value: 'month'
},
{
  id: 6,
  label: 'Квартал',
  value: 'quarter'
},
{
  id: 7,
  label: 'Год',
  value: 'year'
}]

class PromoCodeReportFilter extends Component {
  static propTypes = {
    onChangeChartOption: PropTypes.func
  }

  static getMoment() {
    return moment().locale('ru')
  }

  constructor(params) {
    super(params)
    // initial gender state set from props
    this.state = {
      period: periodSelectors[1].value,
      promoCodes: [],
      promoCodesSuggestions: []
    }
    this.setPeriod = this.setPeriod.bind(this)
  }

  handleDeletePromoTag(index, state) {
    state.promoCodes.splice(index, 1)
    this.onRefreshData()
  }

  handleAddPromoTag(tag, state) {
    tag.name.split(',')
      .forEach((name) => {
        state.promoCodes.push({
          name: name
        })
      })
    this.onRefreshData()
  }

  setPeriod(e) {
    var value = e.target.value
    if (value !== periodSelectors[0].value) {
      var item = periodSelectors.find(x => x.value === value)
      if (item) {
        this.setPeriodDate(value)
        this.periodEndsAt.disabled = true
        this.periodStartsAt.disabled = true
        this.onRefreshData()
      }
    } else {
      this.periodEndsAt.disabled = false
      this.periodStartsAt.disabled = false
    }

    this.setState({
      period: value
    })
  }

  setPeriodDate(value) {
    var start
    var end
    if (value === 'yesterday') {
      start = PromoCodeReportFilter.getMoment().subtract(1, 'days').startOf('day')
      end = PromoCodeReportFilter.getMoment().subtract(1, 'days').endOf('day')
    } else if (value !== 'custom') {
      start = PromoCodeReportFilter.getMoment().startOf(value)
      end = PromoCodeReportFilter.getMoment().endOf(value)
    }
    this.periodStartsAtPicker.setDate(start.toDate(), true)
    this.periodEndsAtPicker.setDate(end.toDate(), true)
  }

  /**
   * Переключение опции.
   */
  onChangeOption = (item, callback) => {
    const {
      onChangeOption
    } = this.props
    if (typeof onChangeOption === 'function') {
      onChangeOption(item, callback)
    }
  }

  onRefreshData() {
    this.onChangeOption({
      periodStartsAt: this.periodStartsAtPicker.getMoment().startOf('minute').startOf('seconds').format(serverPeriodFormat),
      periodEndsAt: this.periodEndsAtPicker.getMoment().endOf('minute').endOf('seconds').format(serverPeriodFormat),
      promoCodes: this.state.promoCodes.length > 0 ? this.state.promoCodes.map((item) => {
        return item.name
      }) : null

    }, (result) => {
      const {
        promoCodesSuggestions: suggestions
      } = this.state
      this.setState({
        promoCodesSuggestions: this.enrichPromoSuggestions(result, suggestions)
      })
    })
  }

  enrichPromoSuggestions(result, suggestions) {
    result.forEach((item) => {
      if (suggestions.indexOf(item.promoCode) === -1) {
        suggestions.push(item.promoCode)
      }
    })
    return suggestions
  }

  componentDidMount() {
    var self = this

    this.periodStartsAtPicker = new Pickaday({
      field: this.periodStartsAt,
      firstDay: 1,
      incrementMinuteBy: 1,
      format: displayPeriodFormat,
      inputFormats: supportedPeriodFormats,
      onSelect: function() {
        self.setState({
          period: periodSelectors[0].value
        })
        self.onRefreshData()
      }
    })

    this.periodEndsAtPicker = new Pickaday({
      field: this.periodEndsAt,
      firstDay: 1,
      incrementMinuteBy: 1,
      format: displayPeriodFormat,
      inputFormats: supportedPeriodFormats,
      onSelect: function() {
        self.setState({
          period: periodSelectors[0].value
        })
        self.onRefreshData()
      }
    })

    this.setPeriodDate(this.state.period)
    this.onRefreshData()
  }

  createPeriodRadios() {
    const {
      period
    } = this.state
    const setPeriod = this.setPeriod
    return periodSelectors.map(function(item) {
      return (
        <label key = {item.id} className={styles.radioButtonLabel} >
          <div>
            <input className={styles.radioButtonControl}
              value = {item.value}
              name = "period"
              type = "radio"
              checked = {period === item.value}
              onChange = {setPeriod}
            />
            <span className={styles.radioButtonText}>{item.label}</span>
          </div>
        </label>
      )
    })
  }

  render() {
    return (
        <div className={styles.grid}>
            <div className="1/2--pocket 1/2--lap 1/2--desk grid__cell">
                <h3> Интервал просмотра </h3>
                <div className={styles.promoReportFilterGroup}>
                    {this.createPeriodRadios()}
                </div>
                <div className={styles.grid}>
                    <div className="1/2--pocket 1/2--lap 1/2--desk grid__cell">
                        <div className={styles.inputBox}>
                            <input disabled id="periodStartsAt" name="periodStartsAt"
                                   ref={(input) => { this.periodStartsAt = input }} type="text"
                                   className={styles.inputFieldDate}/>
                        </div>
                    </div>
                    <div className="1/2--pocket 1/2--lap 1/2--desk grid__cell">
                        <div className={styles.inputBox}>
                            <input disabled id="periodEndsAt" name="periodEndsAt"
                                   ref={(input) => { this.periodEndsAt = input }}
                                   type="text" className={styles.inputFieldDate}/>
                        </div>
                    </div>
                </div>
            </div>
            <div className="1/2--pocket 1/2--lap 1/2--desk grid__cell">
                <h3>Промокоды</h3>
                <div className={styles.grid}>
                    <div className="1/1--pocket 1/1--lap 1/1--desk grid__cell">
                        <div className={styles.promoTags}>
                            <ReactTags
                                placeholder="Введите промокод"
                                tags={this.state.promoCodes}
                                suggestions={this.state.promoCodesSuggestions.map((item) => { return { name: item } })}
                                handleDelete={(index) => { this.handleDeletePromoTag(index, this.state) }}
                                handleAddition={(item) => this.handleAddPromoTag(item, this.state)}
                                allowNew={true} />
                        </div>
                    </div>
                </div>
        </div>
        </div>
    )
  }
}

export default CSSModules(PromoCodeReportFilter, styles)
