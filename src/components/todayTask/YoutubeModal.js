import React, { Component } from 'react'
import Modal from 'react-modal'
import CSSModules from 'react-css-modules'
import styles from './youtubeModal.css'
import { browserHistory, Link } from 'react-router'


const contentStyle = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    cursor: 'pointer',
    zIndex: '9999',
    height: '100%',
    overflow: 'hidden',
    backgroundColor: 'rgb(55, 58, 71)',
    animationFillMode: 'forwards',
    animationDuration: '0.3s',
    animationName: 'anim_31483991342307',
    animationTimingFunction: 'ease-out'
  },
  content: {
    position: 'absolute',
    WebkitOverflowScrolling: 'touch',
    outline: 'none',
    transform: 'translate3d(-50%, -50%, 0px)',
    top: '45%',
    left: '50%',
    border: 'none',
    background: 'transparent',
    padding: '0',
    bottom: '0',
    rigth: '0',
    width: '100%',
    maxWidth: '794px',
    minWidth: '320px',
    height: 'auto',
    overflow: 'hidden'
  }
}

class YoutubeModal extends Component {
  constructor() {
    super()

    this.state = {
      modalIsOpen: false
    }
  }

  openModal(e) {
    e.preventDefault()
    this.setState({modalIsOpen: true})
    const mobile = window.mobileAndTabletcheck()
    if(mobile){
      this.pathname = window.location.pathname
      history.pushState(null, null, '/modal')
      window.addEventListener('popstate', (event) => {
        this.setState({modalIsOpen: false})
      })
    }
  }

  closeModal() {
    this.setState({modalIsOpen: false})
    const mobile = window.mobileAndTabletcheck()
    if(mobile){
      history.pushState(null, null, this.pathname)
    }
  }

  componentDidMount(){
    this.openModal.bind(this)
  }

  render() {
    const { exercise, ind, activeItem, isActive, singlePage } = this.props
    let exerciseType = styles.svgIcoTaskPlay
    let exerciseTypeString = '#ico-task-play'
    let onClickAction = this.openModal.bind(this)
    switch (exercise.exerciseType) {
      case 0:
        break
      case 1:
        exerciseType = styles.svgIcoTaskDescription
        exerciseTypeString = '#ico-task-description'
        onClickAction = activeItem
        break
      case 2:
        exerciseType = styles.svgIcoTaskPhoto
        exerciseTypeString = '#ico-task-photo'
        onClickAction = activeItem
        break
      default:
        break
    }
    return (
      <div>
        { !singlePage ? <span
          className={styles.taskHeader}
          onClick={onClickAction}
        >
          <span className={styles.taskHeaderInner}>
            <span className={styles.taskNum}>{ind + 1}</span>
            <span className={styles.taskName}>{`${exercise.count} ${exercise.description}`}</span>
            <span className={styles.taskBtnGo}>
              <svg className={exerciseType}>
                <use xlinkHref={exerciseTypeString}></use>
              </svg>
            </span>
          </span>
        </span> : null}

        {isActive && exercise.exerciseType === 1 &&
          <div className={styles.taskContent}>
            <p className={styles.baseParag}>{exercise.video}</p>
          </div>
        }

        {isActive && exercise.exerciseType === 2 &&
          <div className={styles.taskContent}>
            <img className={styles.taskPhoto} src={exercise.video} alt="" />
          </div>
        }

        {singlePage && <iframe width="100%" height="300px" src={exercise.video} frameBorder="0" allowFullScreen></iframe>}

        { !singlePage ? <Modal isOpen={this.state.modalIsOpen}
               style={contentStyle}
               onRequestClose={this.closeModal.bind(this)}
               contentLabel={exercise.description}>
          <iframe width="100%" height="100%" src={exercise.video} frameBorder="0" allowFullScreen></iframe>
        </Modal> : null }
      </div>
    )
  }
}

export default CSSModules(YoutubeModal, styles)
