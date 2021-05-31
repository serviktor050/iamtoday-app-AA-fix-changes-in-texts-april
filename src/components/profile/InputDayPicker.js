import PropTypes from 'prop-types';
import React, { Component } from 'react';
import moment from 'moment';
import DayPicker, { DateUtils } from 'react-day-picker';
import { connect } from 'react-redux';
import classNames from 'classnames';

import 'react-day-picker/lib/style.css'

import SelectField from 'material-ui/SelectField'
import MenuItem from 'material-ui/MenuItem'

import baseTheme from 'material-ui/styles/baseThemes/lightBaseTheme'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import CSSModules from 'react-css-modules'
import styles from './inputDayPicker.css'

const currentYear = (new Date()).getFullYear()
const fromMonth = new Date(currentYear - 67, 0, 1, 0, 0)
const toMonth = new Date(currentYear, 11, 31, 23, 59)

const MONTHS = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май',
  'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь',
  'Декабрь']

const MONTHS_EN = ['January','February', 'March', 'April', 'May',
  'June', 'July', 'August', 'September', 'October', 'November', 'December']

const WEEKDAYS_LONG = ['Понедельник', 'Вторник', 'Среда',
  'Четверг', 'Пятница', 'Суббота', 'Воскресенье']

const WEEKDAYS_SHORT = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб']

const style = {
  color: '#f97b7c',
  fontSize: '12px',
  top: '49px',
  position: 'absolute'
}

const overlayStyle = {
  position: 'absolute',
  background: 'white',
  boxShadow: '0 2px 5px rgba(0, 0, 0, .15)',
  zIndex: 100,
  width: '100%',
  minWidth:'240px',
  top: '-30px',
  display: 'block'

}
const stylesPicker = {
  month: {
    width: '54%'
  },
  year: {
    width: '46%',
    textOverflow: 'inherit'
  }
}

class YearMonthForm extends Component {
  state = {
    month: 0,
    year: 2017
  }

  componentDidMount() {
    const { onChange, initDate } = this.props

    const month = parseInt(initDate.split('-')[1])
    const year = parseInt(initDate.split('-')[0])

      this.setState({
        month: month - 1,
        year: year
      })

      onChange(new Date(year, month - 1, moment(initDate).get('date')))
      //onChange(moment(initDate).format('YYYY-MM-DD'))
  }

  getChildContext = () => {
    return { muiTheme: getMuiTheme(baseTheme) }
  }

  handleChangeMonth = (event, index, value) => {
    const { onChange } = this.props
    const year = this.state.year
    const newDate = moment(this.props.initDate).set('month', value).format('YYYY-MM-DD');
    this.setState({month: value})
    onChange(new Date(newDate))
  }

  handleChangeYear = (event, index, value) => {
    const { onChange } = this.props
    const month = this.state.month
    const newDate = moment(this.props.initDate).set('year', value).format('YYYY-MM-DD');

    this.setState({year: value})
    onChange(new Date(newDate))
  }

  render() {
    const months = this.props.lang === 'ru' ? MONTHS : MONTHS_EN;
    const optionsMonth = months.map((month, i) => {
      return (
        <MenuItem key ={i} value={i} primaryText={month} />
      )
    })

    let years = []
    let date = new Date()

    for (let i = this.props.fromYear; i <= date.getFullYear(); i++) {
      years.push(i)
    }

    years = years.map(item => {
      return <MenuItem key ={item} value={item} primaryText={item} />
    })

    return (
      <div className={styles.dayPickerCaption}>

        <SelectField
          value={this.state.month}
          onChange={this.handleChangeMonth}
          style={stylesPicker.month}
        >
          {optionsMonth}
        </SelectField>
        <SelectField
          value={this.state.year}
          onChange={this.handleChangeYear}
          style={stylesPicker.year}
        >
          {years}
        </SelectField>

      </div>
    )
  }
}

YearMonthForm.childContextTypes = {
  muiTheme: PropTypes.object.isRequired
}


class InputDayPicker extends Component {
  constructor(props) {
    super(props)
    //this.handleInputChange = this.handleInputChange.bind(this)
    this.handleInputFocus = this.handleInputFocus.bind(this)
    this.handleInputBlur = this.handleInputBlur.bind(this)
    this.handleContainerMouseDown = this.handleContainerMouseDown.bind(this)
  }

  state = {
    showOverlay: false,
    value: '',
    selectedDay: null,
    initialMonth: fromMonth
  }

  componentDidMount(){
    const { input, lang, val } = this.props;
    const format = lang === 'ru' ? 'DD-MM-YYYY' : 'MM-DD-YYYY';
    const value = val ? val.split('T')[0].split('-').reverse().join('-') : (input.value === 'Invalid date') || !input.value ? null : moment(input.value).format(format)
    this.setState({ value })
  }

  componentWillUnmount() {
    clearTimeout(this.clickTimeout)
  }

  input = null
  daypicker = null
  clickedInside = false
  clickTimeout = null

  handleContainerMouseDown(e) {
    this.clickedInside = true
    // The input's onBlur method is called from a queue right after onMouseDown event.
    // setTimeout adds another callback in the queue, but is called later than onBlur event
    this.clickTimeout = setTimeout(() => {
      this.clickedInside = false
    }, 0)
  }


  handleInputFocus() {
    this.setState({
      showOverlay: true
    })
  }

  handleInputBlur() {
    const showOverlay = this.clickedInside
    this.setState({
      showOverlay
    })

    // Force input's focus if blur event was caused by clicking on the calendar
    if (showOverlay) {
      this.input.focus()
    }
  }

  // handleInputChange(e) {
  //   const { value } = e.target
  //   const momentDay = moment(value, 'L', true)
  //   if (momentDay.isValid()) {
  //     this.setState({
  //       selectedDay: momentDay.toDate(),
  //       value
  //     }, () => {
  //       this.daypicker.showMonth(this.state.selectedDay)
  //     })
  //   } else {
  //     this.setState({ value, selectedDay: null })
  //   }
  // }

  reverseData(data) {
    if (data.indexOf('-') === 4) {
      data.split('-')
    }
    const newData = data.split('-').reverse().join('-')
    return newData
  }

  onClickHandler() {
    this.setState({
      showOverlay: false
    })
  }

  componentwillreceiveprops(nextProps){
    if(nextProps.input.value === this.props.input.value){
    }
  }

  render() {
    const { initValue, input, notReq, lang, disabled, name, isError, placeholder, meta: { touched, error }, profileFields } = this.props
    return (
      <div onMouseDown={ this.handleContainerMouseDown } className={styles.datepickerWrapper}>
        {this.state.showOverlay ? <div onClick={ this.onClickHandler.bind(this) } className={styles.datepickerWrapperOverlay}></div> : null}
        <div className={styles.inputBoxDatepicker}>
          <div className={classNames(styles.inputName, {
            [styles.inputNameShow]: this.state.value //|| this.state.isFocus
          })}>{placeholder}</div>
          <input
            {...input}
            disabled={disabled}
            className={touched && error ? styles.inputFieldError : styles.inputField}
            name={input.name}
            type="text"
            ref={ (el) => { this.input = el } }
            placeholder={placeholder}
            value={this.state.value}
            onFocus={ this.handleInputFocus }
            onBlur={(e) =>{
            }}
          />
          <svg className={styles.svgIconCalendar} onClick={() => {console.log('clll');this.setState({ showOverlay: true })}}>
            <use xlinkHref="#calendar" />
          </svg>
        </div>
        {!notReq && touched && !error && <span className={styles.inputIcoRequiredSucceess}></span>}
        {!notReq && touched && error && <span className={styles.inputIcoRequired}></span>}
        {!notReq && touched && error && <span style={style}>{error}</span>}
        { this.state.showOverlay &&
          <div style={ { position: 'relative' } }>
            <div style={ overlayStyle }>

              <div className={styles.YearNavigation}>
                <DayPicker
                  // classNames={styles.dayPicker}
                  ref={ (el) => { this.daypicker = el } }
                  locale={lang}
                  months={ lang === 'ru' ? MONTHS : MONTHS_EN }
                  weekdaysLong={ lang === 'ru' ? WEEKDAYS_LONG : null }
                  weekdaysShort={ lang === 'ru' ? WEEKDAYS_SHORT: null }
                  firstDayOfWeek={1}
                  canChangeMonth={false}
                  onDayClick={(day) => {
                    const format = lang === 'ru' ? 'DD-MM-YYYY' : 'MM-DD-YYYY';
                    this.setState({
                      value: moment(day).format(format),
                      // selectedDay: day ? day : new Date('11-11-2011'),
                      selectedDay: day,
                      showOverlay: false
                    });

                    input.onChange(moment(day).format('YYYY-MM-DD'));
                    this.input.blur();
                  }}
                  selectedDays={ day => {
                    DateUtils.isSameDay(this.state.selectedDay, day)
                  } }
                  month={ this.state.initialMonth }
                  fromMonth={ fromMonth }
                  toMonth={ toMonth }
                  captionElement={
                    <YearMonthForm
                      fromYear={1940}
                      lang={lang}
                      initDate={(input.value === 'Invalid date') || !input.value ? moment().format('YYYY-MM-DD') : input.value}
                      // initDate={input.value}
                      // initDate={this.state.value}
                      onChange={ initialMonth => {
                        const format = lang === 'ru' ? 'DD-MM-YYYY' : 'MM-DD-YYYY';
                        console.log(initialMonth);
                        this.setState({
                          initialMonth,
                          value: moment(initialMonth).format(format),
                          selectedDay: initialMonth,
                          //showOverlay: false
                        });
                        input.onChange(moment(initialMonth).format('YYYY-MM-DD'));
                        this.input.blur();
                      }}
                    />
                  }
                />
              </div>
            </div>
          </div>
        }
      </div>
    )
  }
}


export default CSSModules(InputDayPicker, styles)
