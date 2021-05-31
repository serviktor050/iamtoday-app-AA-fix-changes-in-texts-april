import React, { Component } from 'react'
import moment from 'moment'
import CSSModules from 'react-css-modules'
import styles from './specialTask.css'
import classNames from 'classnames';

class SpecialTask extends Component {

  state = {
    link: '',
    status: null,
    showInput: false
  }

  componentDidMount() {

    if (this.props.socTask.status) {
      this.setState({status: this.props.socTask.status.status})
    }
  }

  componentWillReceiveProps(nextProps){
    if (nextProps.socTask !== this.props.socTask) {
      if (this.props.socTask && this.props.socTask.status) {
        this.setState({status: this.props.socTask.status.status})
      }
    }
  }

  onChange = (e) => {
    this.setState({
      link: e.target.value
    })
  }

  renderContent = () => {
    let content = this.defaultContent();
    switch (this.state.status) {
      case 'waiting':
        return content = this.waitingContent();
      case 'done':
        return content = this.doneContent();
      case 'missed':
        return content = this.missedContent();
      default:
        return content;
    }
  }

  defaultContent = () => {
    const { points } = this.props.socTask;
    return (
      <div className={styles.content}>
          <div className={styles.contentTitle}>Баллы:</div>
          <div className={styles.info}>
            {
              points && points.map((item) => {
                return (
                  <div key={item.id} className={styles.infoItem}>
                    <div className={styles.shadow}/>
                    <div className={styles.amount}>{`+${item.points}`}</div>
                    <div className={styles.text}>{item.text}</div>
                  </div>
                )
              })
            }
          </div>
        {this.renderAction()}
        {this.notice()}
      </div>
    )
  }

  waitingContent = () => {
    return (
      <div className={styles.content}>
        {this.status('waiting')}
        {this.notice()}
        {this.renderAction()}
      </div>
    )
  }

  doneContent = () => {
    return (
      <div className={styles.content}>
        {this.status('done')}
        {this.notice()}
        {this.renderAction()}
      </div>
    )
  }

  missedContent = () => {
    return (
      <div className={styles.content}>
        {this.status('missed')}
        {this.notice()}
        {this.renderAction()}
      </div>
    )
  }

  status = (value) => {
      let { status } = this.props.socTask;
      let text = '??';
      let valueText = '--';
      switch(value){
        case 'done':
          text = 'выполнено';
          valueText =  <svg>
            <use xlinkHref="#ico-tick"></use>
          </svg>
          break;
        case 'missed':
          text = 'отклонено';
          valueText = '!';
          break;
        case 'waiting':
          text = 'Видео принято, ожидайте подведения итогов';
          valueText = '?';
          break;
        default:
            text = '??';
      }

      return(
        <div className={styles.status}>
            <div className={classNames(styles.statusImg, {
              [styles.done]: value === 'done',
              [styles.missed]: value === 'missed',
              [styles.waiting]: value === 'waiting'
            })}>
              {valueText}
            </div>
            <div className={styles.statusInfo}>
                <div className={styles.statusText}>
                  <span className={styles.statusDesc}>Статус:</span>
                  <span className={styles.statusValue}>{text}</span>
                </div>
              {status && status.adminAnswer && <div className={styles.statusComment}>
                <span>Комментарий тренера:</span>
                <span>{status.adminAnswer}</span>
              </div>}
            </div>
        </div>
      )
  }

  showInput = () => {
    this.setState({
      showInput: true
    })
  }

  sendLink = () => {
    const { sendLink } = this.props;
    if (!this.state.link) {
      return;
    }
    sendLink(this.state.link, (data) => {
      this.setState({
        status: data
      })
    });
  }

  renderAction = () => {
    let { teamСompletedUsers, status } = this.props.socTask;
    teamСompletedUsers = teamСompletedUsers.slice(0, 2);

        return(
        <div>
          {
            ((this.state.showInput || !status) && (this.state.status !== 'waiting' &&  this.state.status !== 'done')) &&

            <div className={styles.action}>
              <input
                className={styles.input}
                value={this.state.value}
                onChange={this.onChange}
                placeholder="Разместить ссылку на пост здесь"
              />
              <button
                type="button"
                className={styles.btn}
                onClick={() => this.sendLink()}
              >Участвовать</button>
            </div>
          }
          {
            !!teamСompletedUsers.length &&
            <div className={styles.avas}>
              <div className={styles.avasText}>Кто из твоих партнеров уже выполнил задание:</div>
              <div className={styles.avasList}>
                {
                  teamСompletedUsers.map((item) => {
                    return (
                      <div key={item.id} className={styles.avasItem}>
                        <img src={item.photo} alt=""/>
                      </div>
                    )
                  })
                }
              </div>

            </div>
          }
          {!this.state.showInput || !status ? null :

            <div>
              <button
                type="button"
                onClick={this.showInput}
                className={styles.btnLarge}>
                  Стань первым из своей команды кто выполнит задание
              </button>
          </div>
          }
        </div>
      )
  }

  notice = () => {
    return (
      <div className={styles.bottom}>
          <div className={styles.notice}>Не забудьте убедиться, что у вас открыт профиль в социальной сети</div>
      </div>
    )
  }

  render() {
    const {socTask} = this.props;
    const {name, description, points, status, teamСompletedUsers} = socTask;

    return (
      <div className={styles.task}>
          <div className={styles.header}>
              <div className={styles.title}>{name}</div>
              <div className={styles.desc}>{description}</div>
          </div>

        {this.renderContent()}

      </div>
    )
  }
}

export default CSSModules(SpecialTask, styles);