import React, {Component} from "react";
import * as R from "ramda";
import {compose} from "redux";
import {connect} from "react-redux";
import { browserHistory } from 'react-router'
import Layout from "components/componentKit2/Layout";
import styles from "./styles.css";
import Loader from "components/componentKit/Loader";
import {Button} from "components/common/Button";
import QuizTimer from "../QuizTimer/QuizTimer";
import QuizIntro from "../QuizIntro/QuizIntro";
import {Breadcrumb} from "components/common/Breadcrumb";
import {pluralize} from "utils/helpers";
import {applyAnswer, finishQuiz, getQuiz, setQuestion} from "../../ducks";
import {
    isQuizExpired,
    resolveQuizErrorMessage,
    isQuizReadyToStart, isSessionStarted, isQuizUnavailable
} from "../../common";

import {dict} from "dict";
import moment from "moment";

import * as selectors from "../../selectors";
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);


const page = 'quiz';
const ANSWER_TYPE_CHECK = 'check';

class Quiz extends Component {

    constructor(props, context) {
        super(props, context);
        this.prevQuestion = this.prevQuestion.bind(this)
        this.quizResults = this.quizResults.bind(this)
        this.nextQuestion = this.nextQuestion.bind(this)
    }

    state = {}

    componentDidMount() {
        const {dispatch, params : {itemId}} = this.props;
        dispatch(getQuiz({itemId: ~~itemId}))
    }

    markAnswer(e, answerId) {

        e.preventDefault();

        if (this.isCurrentAnswerProcessing()) {
            return;
        }

        const {currentQuestion, dispatch, quiz: {data: quiz}} = this.props;
        const {id: pollId, fields} = currentQuestion;
        const {itemId, itemType} = quiz;
        const answers = fields.map(x => ({answerId: x.id, select: x.select}));

        if(!this.isAllowMultipleAnswers()) {
            this.clearPreviousAnswers(answers.filter(x => x.answerId !== answerId));
        }

        const currentAnswerIndex = answers.findIndex(x => x.answerId === answerId);
        if (currentAnswerIndex >= 0) {
            answers[currentAnswerIndex].select = !answers[currentAnswerIndex].select;
        }

        const answerIds = answers.filter(a => !!a.select).map(a => a.answerId);
        dispatch(applyAnswer([{itemId, id: pollId, itemType,  answerIds: answerIds}]))
    }

    clearPreviousAnswers(answers) {
        const previousAnswers = answers.filter(a => !!a.select);
        if (previousAnswers && previousAnswers.length > 0) {
            previousAnswers
                .forEach((x) => {
                    x.select = false;
                })
        }
    }

    isFirstQuestion() {
        const {currentQuestion} = this.props;
        return currentQuestion
            && currentQuestion.index <= 0
    }

    isLastQuestion() {
        const {quiz: {data: {pollComplexInfo}}, currentQuestion} = this.props;
        return !pollComplexInfo.polls
            || !currentQuestion
            || currentQuestion.index + 1 >= pollComplexInfo.polls.length
    }

    isAllQuestionAnswered() {
        const {quiz: {data: {pollComplexInfo}}} = this.props;
        return pollComplexInfo.polls
            && pollComplexInfo.polls.every(p => p.fields && p.fields.some(f => !!f.select))
    }

    nextQuestion() {
        const {quiz: {data: {pollComplexInfo}}, currentQuestion, dispatch} = this.props;
        if(!this.isLastQuestion() && !this.isCurrentAnswerProcessing()){
            const nextQuestion = pollComplexInfo.polls[currentQuestion.index + 1];
            dispatch(setQuestion({...nextQuestion}));
        }
    }

    prevQuestion() {
        const {quiz: {data: {pollComplexInfo}}, currentQuestion, dispatch} = this.props;
        if(!this.isFirstQuestion() && !this.isCurrentAnswerProcessing()){
            const prevQuestion = pollComplexInfo.polls[currentQuestion.index - 1];
            dispatch(setQuestion({...prevQuestion}));
        }
    }

    quizResults() {
        const {dispatch, quiz: {data: quiz}} = this.props;
        const {itemId, itemType} = quiz;
        dispatch(finishQuiz({itemId, itemType}, (result)=>{
            browserHistory.push(`/quiz/${itemId}/result/${result.id}`);
        }))

    }

    isCurrentAnswerProcessing() {
        const {currentQuestion, currentAnswer} = this.props;
        return !currentQuestion
            || (currentAnswer && currentAnswer.isFetching)
    }

    isDataNotFetched() {
        const {quiz} = this.props;
        return !quiz || quiz.isFetching;
    }

    isTimeExpired() {
        const {quiz} = this.props;
        return isQuizExpired(quiz.data);
    }

    isAllowMultipleAnswers() {
        const {currentQuestion} = this.props;
        return currentQuestion.answerType  === ANSWER_TYPE_CHECK;
    }

    render() {

        const {quiz, location} = this.props;

        if (!this.isDataNotFetched()
            && isQuizReadyToStart(quiz)
            && !isSessionStarted(quiz.data)) {
            const {data: {pollComplexInfo: {id: pollComplexId}}} = quiz;
            return <Layout page={page} location={location}>
                <QuizIntro id={pollComplexId} quiz={quiz}/>
            </Layout>

        }

        return (
            <Layout page={page} location={location}>
                <div className={cx("quiz")}>
                    {this.renderHeader()}
                    {
                        this.isDataNotFetched()
                            ? <Loader/>
                            : isQuizUnavailable(quiz)
                            ? this.renderUnavailableReasons()
                            : <div className={cx(styles.elements)}>
                                {this.renderMeta()}
                                {this.renderQuestion()}
                                {this.renderActions()}
                            </div>
                    }
                </div>
            </Layout>
        )
    }

    renderMeta() {

        const {lang, currentQuestion, quiz: {data: quiz}} = this.props;
        const {pollComplexInfo} = quiz;
        const {polls} = pollComplexInfo;
        const pollsCount = polls.length
        const i18nKeyPrefix = 'quiz.question.meta.sentencePart';
        const i18n = dict[lang];
        const questionWord = pluralize(pollsCount, [i18n[`${i18nKeyPrefix}.question.text.1`],
            i18n[`${i18nKeyPrefix}.question.text.2`],
            i18n[`${i18nKeyPrefix}.question.text.2`]]);

        return <div className={cx(styles.meta)}>
            <div className={cx(styles.left)}>
                <div className={cx(styles.metaBlock)}>
                    {currentQuestion && <div className={cx(styles.metaPrimary)}>{i18n[`${i18nKeyPrefix}.question.text`]} {currentQuestion.index + 1}</div>}
                    <div className={cx(styles.metaSecondary)}>{i18n[`${i18nKeyPrefix}.from`]} {pollsCount} {questionWord} {i18n[`${i18nKeyPrefix}.tests`]}</div>
                </div>
            </div>
            <div className={cx(styles.right)}>
                <div className={cx(styles.metaBlock)}>
                    <div className={cx(styles.metaPrimary, styles.timer)}>
                        {pollComplexInfo.endDate && <QuizTimer key={pollComplexInfo.id}
                                                               startDate={moment()}
                                                               endDate={pollComplexInfo.endDate}/>}
                    </div>
                    <div className={cx(styles.metaSecondary)}>{i18n[`${i18nKeyPrefix}.remainingTimesTest`]}</div>
                </div>
            </div>
        </div>
    }

    renderQuestion() {
        const {currentAnswer, currentQuestion, lang} = this.props;
        const i18n = dict[lang];
        return <div className={cx(styles.question)}>
            {currentAnswer && currentAnswer.isError && this.renderError()}
            {currentQuestion && <div className={cx(styles.content)}>
                <div className={cx(styles.title)}>{currentQuestion.description}</div>
                {this.isAllowMultipleAnswers() && <div className={cx(styles.questionNote)}>{i18n['quiz.question.allowMultipleAnswersNote']}</div>}
                {this.renderAnswers()}
            </div>}
        </div>
    }

    renderAnswers() {
        const {currentQuestion} = this.props;
        const {fields} = currentQuestion;
        return  <div className={cx(styles.answers)}>
            {fields.map((answer) => {
                return <div className={cx(styles.answer)} key={`${answer.id}`}>
                    <div className={cx(styles.answerAlias, {'active': !!answer.select})} onClick={(e)=> this.markAnswer(e, answer.id)}><span className={cx(styles.value)}>{answer.alias}</span></div>
                    <div className={cx(styles.answerValue)} ><span className={cx(styles.value)}>{answer.name}</span></div>
                </div>}
            )}
        </div>
    }

    renderError() {
        const {lang} = this.props;
        const i18n = dict[lang];
        return <div className={styles.answerError}>
            <div>{`${i18n['quiz.error.answerError.message']}.
                ${this.isTimeExpired()
                ? i18n['quiz.error.timeIsExpired']
                : i18n['quiz.error.answerError.unexpectedError']}.`}
            </div>
        </div>;
    }

    renderActions() {
        const {lang} = this.props;
        const i18n = dict[lang];

        return <div className={cx('btns', styles.actions)}>
            <div className={cx('btns__item', styles.left)}>
                <Button kind={!this.isFirstQuestion() ? 'side' : 'disabled'}
                        className={cx(styles.btn)}
                        onClick={this.prevQuestion}><span>{i18n['quiz.action.previous']}</span></Button>
            </div>
            <div className={cx('btns__item', styles.right)}>
                {this.isLastQuestion()
                    ? this.renderResultsButton()
                    : <Button kind='side' className={cx(styles.btn)} onClick={this.nextQuestion}><span>{i18n['quiz.action.next']}</span></Button>}
            </div>
        </div>
    }

    renderResultsButton() {
        const {lang} = this.props;
        const i18n = dict[lang];
        const allQuestionAnswered = this.isAllQuestionAnswered();
        return <Button kind={allQuestionAnswered ? 'side' : 'disabled'}
                       title={!allQuestionAnswered ? i18n['quiz.question.answersRequired'] : ''}
                       className={cx(styles.btn)}
                       onClick={this.quizResults}><span>{i18n['quiz.action.results']}</span></Button>
    };

    renderHeader() {
        const {lang, quiz} = this.props;
        const i18n = dict[lang];
        const items = [i18n['breadcrumb.main'], i18n['quiz.breadcrumb.testing']];
        const name = R.path(["data", "name"], quiz)
        if (name) {
            items.push(name);
        }
        return <div className={cx(styles.quizHeader)}>
            <h2 className={cx(styles.title)}>{i18n['quiz.breadcrumb.testing']}</h2>
            <Breadcrumb items={items}
                        links={['/', '/quiz']}
            />
            <hr/>
        </div>
    }

    renderUnavailableReasons() {
        const {lang, quiz} = this.props;
        const message = resolveQuizErrorMessage(lang, quiz);
        return <div className={cx('error')}>{message}</div>
    }

}

const mapStateToProps = (state) => {
    return {
        userInfo: selectors.userInfo(state),
        quiz: selectors.selectQuiz(state),
        currentQuestion: selectors.selectCurrentQuestion(state),
        currentAnswer: selectors.selectCurrentAnswer(state),
        lang: state.lang
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        dispatch,
    };
};

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
)(Quiz);