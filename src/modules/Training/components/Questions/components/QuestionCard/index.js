import React, { Component } from 'react';
import classNames from 'classnames/bind';
import { connect } from 'react-redux';
import { compose } from 'redux';
import {dict} from 'dict';

import styles from './styles.css';
import { createUserName, pluralizeMonthes, monthes } from '../../../../../utils';
import { isDataNotFetched } from '../../../../../Admin/utils';
import { Answer } from '../Answer';
import CreateAnswer from '../CreateAnswer';
import ChangeAnswer from '../ChangeAnswer';
import * as ducks from '../../../../ducks';
import * as selectors from '../../../../selectors';

const cx = classNames.bind(styles);

function formatDate(date, lang) {
  const rawDate = new Date(Date.parse(date))
  const day = rawDate.getDate();
  const month = pluralizeMonthes(dict[lang][monthes[rawDate.getMonth()]]);
  const year = rawDate.getFullYear();
  const hours = rawDate.getHours();
  const minutes = rawDate.getMinutes();

  return `${day} ${month} ${year}. ${hours}:${minutes}`
}

class QuestionCard extends Component {
  constructor(props) {
    super(props)

    this.state = {
      isVisible: false, 
      localAnswers: [],
      editableAnswer: null
    }
  }

  componentDidMount() {
    const { chat } = this.props;
    const { comments: [_, ...comments] } = chat;
    this.setState({ localAnswers: comments })
  }

  componentDidUpdate() {
    const { comments, dispatch, chat } = this.props;
    if (!isDataNotFetched(comments) && comments.data[0].subTypeId === chat.subTypeId ) {
      const { data: [chats] } = comments;
      const { comments: [_, ...localAnswers] } = chats;
      dispatch(ducks.deleteComments());
      this.setState({ localAnswers });
    }
  }

  toggleAnswer = () => {
    this.setState(({isVisible}) => ({ isVisible: !isVisible }));
  }

  addAnswer = (comment) => {
    const { dispatch, chat } = this.props;
    dispatch(ducks.getComments({ type: chat.type, typeId: chat.typeId, subTypeId: chat.subTypeId }))
    this.setState(({ localAnswers }) => ({ localAnswers: [...localAnswers, comment], isVisible: false }))
  }

  changeAnswer = (answer) => {
    this.setState({ editableAnswer: answer })
  }

  clearAnswer = () => {
    this.setState({ editableAnswer: null })
  }

  saveAnswer = (answer) => {
    const { localAnswers, editableAnswer } = this.state;
    const index = localAnswers.findIndex(item => item === editableAnswer);
    const newAnswers = [...localAnswers];
    newAnswers[index] = answer;
    this.setState({ localAnswers: newAnswers, editableAnswer: null });
  }

  deleteAnswer = (id) => {
    this.setState(({ localAnswers }) => ({ localAnswers: localAnswers.filter(item => item.id !== id), editableAnswer: null }))
  }

  render() {
    const { lang, chat, userInfo } = this.props;
    const i18n = dict[lang]
    const { comments: [firstComment] } = chat;
    const isAdmin = userInfo.data.role === 2;
    const isAnswer = this.state.localAnswers.length > 0;

    if (!firstComment) {
      return null
    }

    return (
      <div className={cx('queston__card', { 'queston__card-user': !isAdmin })}>
        <div className={cx('firstComment', { 'firstComment-admin': isAdmin }, { 'firstComment-user': !isAdmin || this.state.isVisible || this.state.editableAnswer }, { 'firstComment-woBorder': isAnswer } )}>
          <div className={cx('firstComment__innerContent')}>
            <img src={firstComment && firstComment.userInfo.photo} alt='avatar' className={cx('firstComment__avatar')} />
            <div className={cx('firstComment__main')}>
              <p className={cx('firstComment__title')}>
                <span className={cx('firstComment__userName')}>
                  {createUserName({ firstName: firstComment.userInfo.firstName, lastName: firstComment.userInfo.lastName })}
                </span>
                <span className={cx('firstComment__date')}>{formatDate(firstComment.date, lang)}</span>
              </p>
              <p className={cx('firstComment__text')}>{firstComment.text}</p>
            </div>
            {isAdmin && !this.state.isVisible && !isAnswer && <button onClick={this.toggleAnswer} className={cx('firstComment__btn')}>
              <span className={cx('firstComment__btn-inner')}>{i18n['admin.questions.to-answer']}</span>
            </button>}
          </div>
          {isAdmin && this.state.isVisible && <CreateAnswer cancel={this.toggleAnswer} chat={chat} addAnswer={this.addAnswer} />}
          {this.state.editableAnswer && <ChangeAnswer 
                                          answer={this.state.editableAnswer} 
                                          remove={this.deleteAnswer} 
                                          clear={this.clearAnswer} 
                                          save={this.saveAnswer}
                                        />}
        </div>
        {!this.state.editableAnswer && this.state.localAnswers.map(item => 
        <Answer key={item.id} answer={item} isAdmin={isAdmin} change={this.changeAnswer} />)}
      </div>
    )
} 
}

const mapStateToProps = (state) => ({ lang: state.lang, userInfo: state.userInfo, comments: selectors.selectComments(state) })
const mapDispatchToProps = (dispatch) => ({ dispatch })

export default compose(connect(mapStateToProps, mapDispatchToProps))(QuestionCard);
