import React, { Component } from 'react'
import moment from 'moment'
import { connect } from 'react-redux'
import CSSModules from 'react-css-modules'
import styles from './mobileDayPicker.css'
import DatePicker from 'react-mobile-datepicker';
import classNames from 'classnames';

const style = {
  color: '#f97b7c',
  fontSize: '12px',
  top: '49px',
  left:'0'
}

const monthMap = {
  ru: {
    '01': 'Январь',
    '02': 'Февраль',
    '03': 'Март',
    '04': 'Апрель',
    '05': 'Май',
    '06': 'Июнь',
    '07': 'Июль',
    '08': 'Август',
    '09': 'Сентябрь',
    '10': 'Октябрь',
    '11': 'Ноябрь',
    '12': 'Декабрь',
  },
  en: {
    '01': 'January',
    '02': 'February',
    '03': 'March',
    '04': 'April',
    '05': 'May',
    '06': 'June',
    '07': 'July',
    '08': 'August',
    '09': 'September',
    '10': 'October',
    '11': 'November',
    '12': 'December',
  }
};

function convertDate(date, formate) {
  const year = date.getFullYear()
  let month = date.getMonth() + 1
  let day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  if (month < 10) month = '0' + month
  if (day < 10) day = '0' + day

  return formate
    .replace(/Y+/, year)
    .replace(/M+/, month)
    .replace(/D+/, day)
    .replace(/h+/, hour)
    .replace(/m+/, minute)
    .replace(/s+/, second)
}

class MobileDayPicker extends Component {
  state = {
    time: '',
    isOpen: false
  }

  handleClick = () => {
    this.setState({ isOpen: true })

    let body = document.getElementsByTagName('body')
    for (let i = 0; i < body.length; i++) {
      body[i].classList.add('mobile-picker')
    }

    document.body.addEventListener('touchstart', function(e) {
      if (e.target.classList.contains('datepicker-modal')) {
        e.preventDefault()
      }
    })
  }

  handleCancel = () => {
    this.setState({ isOpen: false })
    let body = document.getElementsByTagName('body')
    for (let i = 0; i < body.length; i++) {
      body[i].classList.remove('mobile-picker')
    }
  }

  handleSelect = (time) => {
    this.setState({ time, isOpen: false })
    this.props.input.onChange(moment(time).format('YYYY-MM-DD'))

    switch (this.props.input.name) {
      case 'birthday':
        this.props.dispatch({ type: 'BIRTHDAY', birthday: moment(time).format('YYYY-MM-DD') })
        break
      case 'babyBirthday':
        this.props.dispatch({ type: 'BABY_BIRTHDAY', babyBirthday: moment(time).format('YYYY-MM-DD') })
        break
      case 'lastBabyFeedMonth':
        this.props.dispatch({ type: 'LAST_BABY_FEED', lastBabyFeedMonth: moment(time).format('YYYY-MM-DD') })
        break
      default:
        this.props.dispatch({ type: 'BIRTHDAY', birthday: moment(time).format('YYYY-MM-DD') })
    }

    let body = document.getElementsByTagName('body')

    for (let i = 0; i < body.length; i++) {
      body[i].classList.remove('mobile-picker')
    }
  }


  componentDidMount() {
    let value = this.day

    if(value){
      value = this.reverseData(value)
      value = this.toEuroFormat(value)

      this.setState({
        time: value
      })
    } else {
      this.setState({
        time: value
      })
    }


  }

  reverseData(data) {
    if (data.indexOf('-') === 4) {
      data.split('-')
    }
    const newData = data.split('-').reverse().join('-')
    return newData
  }

  toEuroFormat(value) {
    const arr = value.split('-')
    let data = new Date(parseInt(arr[2], 10), parseInt(arr[1], 10) - 1, parseInt(arr[0], 10))
    return data
  }

  get day() {
    const { profileFields} = this.props
    const { lastBabyFeedMonth, babyBirthday, birthday } = profileFields
    let value
    switch (this.props.input.name) {
      case 'birthday':
        value = birthday
        break
      case 'babyBirthday':
        value = babyBirthday
        break
      case 'lastBabyFeedMonth':
        value = lastBabyFeedMonth
        break
      default:
        value = birthday
    }
    return value
  }

  render() {
    const {name, lang, input, notReq, isBabyFeeding, disabled, placeholder, isError, meta: { touched, error }} = this.props;
    const format = lang === 'ru' ? 'DD-MM-YYYY' : 'MM-DD-YYYY';
    let value = this.state.time ? convertDate(this.state.time, format): '';
    return (
      <div className={styles.datepickerWrapper}>
        <div className={classNames(styles.inputName, {
          [styles.inputNameShow]: input.value
        })}>{placeholder}</div>
        <input className={touched && error ? styles.inputFieldError : styles.inputField}
             name={input.name}
             disabled={disabled}
             placeholder={placeholder}
             type="text"
             value={(input.value === 'Invalid date') || !input.value ? null : moment(input.value).format(format)}
             onClick={this.handleClick}
        />
        {!notReq && touched && !error && <span className={styles.inputIcoRequiredSucceess}></span>}
        {!notReq && touched && error && <span className={styles.inputIcoRequired}></span>}
        {!notReq && touched && error && <span style={style}>{error}</span>}

        <DatePicker
          min={new Date(1940, 0, 1)}
          max={new Date()}
          value={this.state.time ? this.state.time : new Date()}
          dateFormat={['YYYY', ['MM', (month) => monthMap[lang][month]], 'DD']}
          isOpen={this.state.isOpen}
          onSelect={this.handleSelect}
          onCancel={this.handleCancel}
          confirmText={'Выбрать'}
          cancelText={'Отмена'}
        />
      </div>
    )
  }
}

const mapStateToProps = state => {
  const { profileFields, isBabyFeeding } = state
  return {
    profileFields,
    isBabyFeeding
  }
}

MobileDayPicker = connect(
  mapStateToProps
)(MobileDayPicker)

export default CSSModules(MobileDayPicker, styles)
