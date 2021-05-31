import React, { Component } from 'react';
import classNames from 'classnames/bind';
import { connect } from 'react-redux';
import { compose } from 'redux';
import {dict} from 'dict';
import Modal from 'boron-react-modal/FadeModal';

import styles from './styles.css';
import * as ducks from '../../ducks.jsx';
import QuestionCard from './components/QuestionCard';

const cx = classNames.bind(styles);

const initialState = {
    isNewQuestion: false,
    text: '',
}

let contentStyle = {
    borderRadius: '18px',
    padding: '30px'
}

function NewQuestion ({ handleText, text, toggleWindow, handleSubmit, i18n }) {
    return (
        <div className={cx('newQuestion__container')}>
            <textarea 
            rows={8} 
            value={text} 
            onChange={handleText} 
            className={cx('newQuestion__textarea')} 
            placeholder={i18n['lectures.questions.new-question-placeholder']} />
            <button 
            className={cx('newQuestion__button', 'newQuestion__button-blue')}
            onClick={handleSubmit}
            >
                {i18n['lectures.questions.publish']}
            </button>
            <button 
            className={cx('newQuestion__button', 'newQuestion__button-white')}
            onClick={_ => toggleWindow()}
            >
                {i18n['lectures.questions.cancel']}
            </button>
        </div>
    )
}

class Questions extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
            ...initialState,
            usersComments: [],
        }
    }

    toggleNewQuestion = () => {
        this.setState({ isNewQuestion: !this.state.isNewQuestion })
    }

    handleText = (e) => {
        this.setState({ text: e.target.value })
    }

    onSuccess = () => {
        const { userInfo: { data: userInfo} } = this.props;
        const chat = {
            userStarter: userInfo,
            comments: [{ text: this.state.text, userInfo, date: new Date() }]
        }
        this.setState(({ usersComments }) => ({ ...initialState, usersComments: [...usersComments, chat], }))
    }

    onError = () => {
        this.refs.errorModal.show()
    }

    handleSubmit = () => {
        const { dispatch, exercise } = this.props;
        const data = {
            text: this.state.text,
            typeId: exercise.id
        }
        dispatch(ducks.sendNewQuestion(data, this.onSuccess, this.onError))
    }
    
    render() {
        const { exercise, lang } = this.props;
        const i18n = dict[lang];

        const questions = exercise.chats ? [...exercise.chats, ...this.state.usersComments] : [...this.state.usersComments]

        return (
            <div className={cx('questions')}>
                {this.props.userInfo.data.role !== 2 && (!this.state.isNewQuestion ? 
                <div className={cx('addNewQuestion')} onClick={this.toggleNewQuestion} >
                    <div className={cx('addNewQuestion__plus')}>+</div>
                    <span>{i18n['lectures.questions.ask-new-question']}</span>
                </div> : <NewQuestion text={this.state.text} handleText={this.handleText} i18n={i18n} toggleWindow={this.toggleNewQuestion} handleSubmit={this.handleSubmit} />)}
                {questions.map(item => <QuestionCard key={item.id} chat={item} />)}
                <Modal ref='errorModal' contentStyle={contentStyle}>
                    {i18n['server.error.unexpectedError']}
                </Modal>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({ lang: state.lang, userInfo: state.userInfo })
const mapDispatchToProps = (dispatch) => ({ dispatch })

export default compose(connect(mapStateToProps, mapDispatchToProps))(Questions);
