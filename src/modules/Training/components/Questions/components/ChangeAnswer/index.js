import React, { Component } from 'react';
import classNames from 'classnames/bind';
import { connect } from 'react-redux';
import { compose } from 'redux';
import {dict} from 'dict';
import Modal from 'boron-react-modal/FadeModal';

import styles from './styles.css';
import * as ducks from '../../../../ducks';
import { Modal as SquareModal } from '../../../../../Mlm/MlmStructure/components/MentorRequestCard/components/Modal';

const cx = classNames.bind(styles);

let contentStyle = {
  borderRadius: '18px',
  padding: '30px'
}

class ChangeAnswer extends Component {
  constructor(props) {
    super(props)
  
    this.state = {
       text: '',
       isVisibleModal: false,
    }
  }

  componentDidMount() {
    const { answer: { text } } = this.props;
    text.length < 1001 ? this.setState({ text }) : this.setState({ text: text.slice(0, 1000) })
  }

  handleText = (e) => {
    if (e.target.value.length > 1000) {
      return
    }
    this.setState({ text: e.target.value })
  }

  handleSubmit = () => {
    const { answer, dispatch } = this.props;
    const data = {
      id: answer.id,
      text: this.state.text
    }
    dispatch(ducks.changeAnswer(data, this.onSuccessChange, this.onError))
  }

  toggleDelete = () => {
    this.setState( ({ isVisibleModal }) => ({ isVisibleModal: !isVisibleModal }) )
  }

  handleDelete = () => {
    const { answer, dispatch } = this.props;
    const data = {
      id: answer.id
    }
    dispatch(ducks.deleteAnswer(data, this.onSuccessDelete, this.onError))
  }

  onSuccessChange = () => {
    const { answer, save } = this.props;
    const newAnswer = {
      ...answer,
      text: this.state.text
    }
    save(newAnswer);
  }

  onSuccessDelete = () => {
    const { remove, answer } = this.props;
    remove(answer.id);
  }

  onError = () => {
    this.refs.errorModal.show()
  }
  
  render() {
    const { userInfo: { data: userInfo }, clear } = this.props;
    const i18n = dict[this.props.lang]
    return (
      <div className={cx('answer')}>
        <div className={cx('answer__header')}>
          <span className={cx('answer__author')}>{userInfo.lastName}</span>
          <button onClick={this.toggleDelete} className={cx('answer__deleteBtn')}>
            <span className={cx('answer__deleteBtn-span')}>{i18n['admin.questions.delete-comment']}</span>
          </button>
          <span className={cx('answer__symbolsCounter', { 'answer__symbolsCounter-limit': this.state.text.length > 950 })}>
            {`${this.state.text.length}/1000`}
          </span>
        </div>
        <textarea value={this.state.text} onChange={this.handleText} className={cx('answer__textarea')} rows='10' />
        <div className={cx('answer__actions')}>
          <button onClick={this.handleSubmit} className={cx('answer__btn', 'answer__btn-blue')}>
            {i18n['admin.questions.save']}
          </button>
          <button onClick={_ => clear()} className={cx('answer__btn', 'answer__btn-transparent')}>
            {i18n['admin.questions.cancel']}
          </button>
        </div>
        {this.state.isVisibleModal &&
          <SquareModal onOk={this.handleDelete} onCancel={this.toggleDelete} acceptButtonText={i18n['admin.questions.delete']} >
            <span className={cx('modal__text')}>{i18n['admin.questions.delete-question']}</span>
          </SquareModal>
        }
        <Modal ref='errorModal' contentStyle={contentStyle}>
          {i18n['server.error.unexpectedError']}
        </Modal>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({ lang: state.lang, userInfo: state.userInfo })
const mapDispatchToProps = (dispatch) => ({ dispatch })

export default compose(connect(mapStateToProps, mapDispatchToProps))(ChangeAnswer);