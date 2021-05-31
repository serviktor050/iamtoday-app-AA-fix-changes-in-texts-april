import React, { Component } from 'react'
import TaskItem from './TaskItem'
import moment from 'moment'
import CSSModules from 'react-css-modules';
import SpecialTask from './SpecialTask';
import styles from './exercises.css'

const disableStyle = {
  pointerEvents: 'none',
  opacity: 0.4
}

class Exercises extends Component {
  render() {
    const  { sendReport, tasks, token, isVideo, status, date, forceSendReportEnable, dateString, socTask, sendLink } = this.props;
    const disabled = !forceSendReportEnable ? (isVideo && ((status && status !== 'waitingadmin') || moment(moment().format('YYYY-MM-DD')).isAfter(moment(date).format('YYYY-MM-DD')))) : false

    let buttonText = 'Заполнить отчет!'
    if (isVideo) {
      switch (status) {
        case 'waiting':
          buttonText = 'Отчет проверяется'
          break
        case 'missed':
          buttonText = 'Экзамен не сдан'
          break
        case 'done':
          buttonText = 'Экзамен принят!'
          break
        default:
          buttonText = 'Заполнить отчет!'
      }
    }

    return (
      <div id='exercises' className={styles.stageBoxSmallPaddingBoxStyle1}>
        <div className={styles.stageBoxInner}>
          <h2 className={styles.h1TextCenterMb10}>
            {`Задание на ${dateString}`}
          </h2>

          <p className={styles.subTitle}>
            Выполните все шаги задания и отправьте отчёт тренеру
          </p>

            {
                socTask && socTask.id &&
                <SpecialTask
                    socTask={socTask}
                    sendLink={sendLink}
                />
            }

          {isVideo
            ? <h3 className={styles.h2}>Экзамен</h3>
            : <h3 className={styles.h2}>Тренировка</h3>
          }

          <ul className={styles.taskMb30}>
            {tasks.map((task, index) => {
              return (<li id={`task-${index}`} key={index} className={styles.taskItem}>
                <TaskItem task={task} index={index} token={token}/>
              </li>
              )
            })}
          </ul>

          {/* <div ref='taskResults' className={styles.tasksResults}>
            <h2 className={styles.h1TasksResultsTitle}>Подведем итоги?</h2>
            <p className={styles.tasksResultsDesc}>Молодец! На сегодня программа выполнена! Это конечно не максимум того, что мы могли бы сделать вместе, но у нас еще есть немного времени впереди</p>
            <div className={styles.textCenter}>
              <div id='reportButton' className={styles.btnPrimaryFillReport1} style={disabled ? disableStyle : {}} onClick={sendReport}>
                {buttonText}
              </div>
            </div>

          </div> */}
        </div>
      </div>
    )
  }
}

export default CSSModules(Exercises, styles)
