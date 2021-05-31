import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form'
import moment from 'moment'
import CSSModules from 'react-css-modules'
import styles from './sendReport.css'
import ConditionItem from './ConditionItem'


export const conditions = [
  {
    id: 1,
    class: styles.yourConditionIco1,
    title: 'отлично',
    filter: 'good'
  },
  {
    id: 2,
    class: styles.yourConditionIco2,
    title: 'так себе',
    filter: 'middle'
  },
  {
    id: 3,
    class: styles.yourConditionIco3,
    title: 'не очень',
    filter: 'bad'
  }
]

const InputModal = ({ input, title, placeholder, type, meta: { touched, error } }) => (
    <div className={styles.inputBoxFillReportInfo}>
      <input {...input} type={type || 'text'} placeholder={placeholder} className={styles.inputField}/>
        {touched && error && <span className={styles.error}>{error}</span>}
    </div>
)
const text= ({ input, title, placeholder, type, meta: { touched, error } }) => (
    <div className={''}>
      <textarea {...input} type={type || 'text'} placeholder={placeholder} className={styles.reportTextareaField}/>
        {touched && error && <span >{error}</span>}
    </div>
)

/**
 *  Компонент SendReport.
 *  Используется для вывода блока отправки зачета
 *
 */
class SendReport extends Component {
  /**
   * @memberof  SendReport
   * @prop {object} propTypes - the props that are passed to this component
   * @prop {bool} propTypes.forceSendReportEnable Доступна ли кнопка отправки
   * @prop {isVideo} propTypes.bool Есть ли видео
   * @prop {string} propTypes.date Объект дата
   *
   * */

  static propTypes = {
    forceSendReportEnable: PropTypes.bool.isRequired,
    isVideo: PropTypes.bool.isRequired,
    date: PropTypes.string.isRequired
  }
  constructor(props) {
    super(props)
    this.state = {
      selected: ''
    }
  }

  onChangeCondition(filter) {
    this.setState({
      selected: filter
    })
  }

  render() {
    const { error, handleSubmit, onSubmit, isVideo, forceSendReportEnable, status, date, dateString } = this.props

    const disabled = !forceSendReportEnable
      ? (isVideo && ((status && status !== 'waitingadmin') ||
        moment(moment().format('YYYY-MM-DD')).isAfter(moment(date).format('YYYY-MM-DD'))))
      : false

    const condition = conditions.map((item) => {
      return (
        <label key={item.id}>
          <Field
            name="health"
            component={ConditionItem}
            item={item} type="radio"
            selected={this.state.selected}
            onChangeCondition={this.onChangeCondition.bind(this)}
            value={item.filter}
          />
        </label>
      )
    })

    const textarea = ({ input }) => <textarea
      {...input}
      className={styles.reportTextareaField}
      type="text"
      placeholder="Выполнено, сделал, справился..."
    />

    const youtubeInput = ({ input }) => <input
      {...input}
      type="text"
      className={styles.inputField}
      placeholder="https://www.youtube..."
    />

    return (
      <form
        id="send-report"
        onSubmit={handleSubmit(onSubmit)}
        className={styles.stageBoxBigPaddingBoxStyle2}
      >
        <div className={styles.stageBoxInner}>

          <h2 className={styles.h1Mb10TextCenter}>
            <a className={styles.anchor} href="#anchor-4" name="anchor-4">
							{`Отчет тренеру за ${dateString}`}
            </a>
          </h2>

          <p className={styles.subTitle}>Напишите сообщение тренеру о том, что задание выполнено!</p>

          <div className={styles.gridMb30}>
            <div className={styles.gridCellDesk50}>
              <div className={styles.textareaMb20}>
                <Field
                  name="report"
                  component={text}
                  placeholder="Выполнено, сделал, справился..."
                />
              </div>
              {isVideo && <div className={styles.inputBtn}>
                <div className={styles.inputAlert}>Вставьте ссылку на видео выполнения заданий</div>
                  <div className={styles.inputFieldWrap}>
                    <Field
                      name="video"
                      component={InputModal}
                    />
                  </div>
                {/*  <div className={styles.btnBase}>Выбрать файл</div>*/}
                </div>
              }
            </div>
            <div className={styles.gridCellDesk50}>
              <ul className={styles.yourCondition}>
                {condition}
              </ul>
              <p className={styles.textCenter}>Как вы себя чувствовали во время выполнения заданий?</p>
            </div>
          </div>

          <p className={styles.textCenter}>
            <button
              type='submit'
              className={!disabled ? styles.btnSecondaryMb10 : styles.btnSecondaryDisMb10}
              disabled={disabled}
            >
              Отправить отчет
            </button>
          </p>

        </div>
      </form>
    )
  }
}

const validate = data => {
  let errors = {};

  if (!data.video) {
    errors.video = 'Cсылка на видео с выполнением задания обязательна!'
  }

  return errors;
};

export default CSSModules(reduxForm({
  validate,
  form: 'sendReportValidation',

})(SendReport), styles)
