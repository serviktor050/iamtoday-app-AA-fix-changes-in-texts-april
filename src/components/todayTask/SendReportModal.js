import React, { Component } from 'react'
import { Field, reduxForm } from 'redux-form'
import InputModal from '../componentKit/InputModal'
import ConditionItem from './ConditionItem'
import CSSModules from 'react-css-modules'
import styles from './sendReportModal.css'

export const conditions = [
  {
    id: 1,
    class: 'ico-your-condition-1',
    title: 'отлично',
    filter: 'good'
  },
  {
    id: 2,
    class: 'ico-your-condition-2',
    title: 'так себе',
    filter: 'middle'
  },
  {
    id: 3,
    class: 'ico-your-condition-3',
    title: 'не очень',
    filter: 'bad'
  }
]

class SendReportModal extends Component {
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
    const { error, handleSubmit, onSubmit, isVideo } = this.props
    const condition = conditions.map((item) => {
      return (
      <label key={item.id}>
        <Field name="health"
               component={ConditionItem}
               item={item} type="radio"
               selected={this.state.selected}
               onChangeCondition={this.onChangeCondition.bind(this)}
               value={item.filter}/>
      </label>

      )
    })
    return (
      <form onSubmit={handleSubmit(onSubmit)}>
        <h3 className={styles.h1}>Отчет тренеру</h3>
        <hr/>
        <p className={styles.subTitle}>Напиши сообщение тренеру о том, что тренировка отработана! Если ты и правда все
          сделал :)</p>
        <Field name="report" placeholder="Выполнено, сделал, справился..." component={InputModal}/>
        <p className={styles.textCenter}>Как ты себя чувствовал во время выполнения заданий?</p>
        <ul className={styles.yourCondition}>
          {condition}
        </ul>

        {
          isVideo ? (
            <div>
              <p className={styles.textCenterMb30}>
                Прикрепите файл или вставьте ссылку с видео выполнения заданий
              </p>

              <Field name="video" placeholder="http://youtube.com" component={InputModal} />
              {error && <div className={styles.textCenter}><strong>{error}</strong></div>}
            </div>
            ) : null
        }

        <hr/>

        <div className={styles.textCenter}>
          <button type='submit' className={styles.btnPrimaryFillReport2}>
            Отправить отчет
          </button>
        </div>
      </form>
    )
  }
}
const validate = data => {
  const errors = {}

  // if (!data.report)
  //   errors.report = 'Поле текста не должно быть пустым'
  //
  // if (!data.video)
  //   errors.video = 'Ссылка на видео должна быть заполнена'

  return errors
}

export default CSSModules(reduxForm({
  form: 'sendReportValidation',
  validate
})(SendReportModal), styles)
