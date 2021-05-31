import React, { Component } from 'react';
import classNames from 'classnames/bind';
import { connect } from 'react-redux';
import { compose } from 'redux';
import {dict} from 'dict';
import Modal from 'boron-react-modal/FadeModal';

import styles from './styles.css';
import * as ducks from '../../../../ducks';
import { cancel } from '../../../../../../i18n/ru';

const cx = classNames.bind(styles);

let contentStyle = {
  borderRadius: '18px',
  padding: '30px'
}

class CreateAnswer extends Component {
  constructor(props) {
    super(props)
  
    this.state = {
       text: '',
    }
  }

  handleText = (e) => {
    if (e.target.value.length > 1000) {
      return
    }
    this.setState({ text: e.target.value })
  }

  handleSubmit = () => {
    const { chat, dispatch } = this.props;
    const data = {
      text: this.state.text, type: chat.type, typeId: chat.typeId,
      reply: null, subTypeId: chat.subTypeId,
    }
    dispatch(ducks.sendNewAnswer(data, this.onSuccess, this.onError))
  }

  onSuccess = () => {
    const { userInfo: { data: userInfo }, addAnswer } = this.props;
    const comment = {
      text: this.state.text, userInfo, date: new Date()
    };
    addAnswer(comment);
  }

  onError = () => {
    this.refs.errorModal.show()
  }
  
  render() {
    const { userInfo: { data: userInfo }, cancel } = this.props;
    const i18n = dict[this.props.lang]
    return (
      <div className={cx('answer')}>
        <div className={cx('answer__header')}>
          <span className={cx('answer__author')}>{userInfo.lastName}</span>
          <span className={cx('answer__symbolsCounter', { 'answer__symbolsCounter-limit': this.state.text.length > 950 })}>
            {`${this.state.text.length}/1000`}
          </span>
        </div>
        <textarea value={this.state.text} onChange={this.handleText} className={cx('answer__textarea')} rows='10' />
        <div className={cx('answer__actions')}>
          <button onClick={this.handleSubmit} className={cx('answer__btn', 'answer__btn-blue')}>
            {i18n['admin.questions.send']}
          </button>
          <button onClick={_ => cancel()} className={cx('answer__btn', 'answer__btn-transparent')}>
            {i18n['admin.questions.cancel']}
          </button>
        </div>
        <Modal ref='errorModal' contentStyle={contentStyle}>
          {i18n['server.error.unexpectedError']}
        </Modal>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({ lang: state.lang, userInfo: state.userInfo })
const mapDispatchToProps = (dispatch) => ({ dispatch })

export default compose(connect(mapStateToProps, mapDispatchToProps))(CreateAnswer);