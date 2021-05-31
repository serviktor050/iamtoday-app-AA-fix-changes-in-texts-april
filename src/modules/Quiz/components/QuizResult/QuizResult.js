import React, {Component} from "react";
import {compose} from "redux";
import {connect} from "react-redux";
import {browserHistory} from "react-router";
import * as R from "ramda";
import Layout from "components/componentKit2/Layout";
import Loader from "components/componentKit/Loader";
import {Button} from "components/common/Button";
import {Breadcrumb} from "components/common/Breadcrumb";
import {dict} from "dict";
import * as selectors from "../../selectors";
import {pluralize} from "utils/helpers";
import {getQuizResults} from "../../ducks";
import classNames from 'classnames/bind';
import styles from "./styles.css";
import {
    getRemainingAttempts,
    isPollComplexAvailable,
    isQuizPending,
    resolveRemainingTimeTextAndValue
} from "../../common";

const cx = classNames.bind(styles);

export const page = 'quiz';

class QuizResult extends Component {

    state = {}

    constructor(props, context) {
        super(props, context);
        this.handleBackOnClick = this.handleBackOnClick.bind(this);
    }

    componentDidMount() {
        const {dispatch, params: {resultId, itemId}} = this.props;
        dispatch(getQuizResults({itemId: ~~itemId, id: ~~resultId}))
    }

    isDataNotFetched() {
        const {quizResults} = this.props;
        return !quizResults || quizResults.isFetching;
    }

    isQuizHasResults() {
        const {quizResults} = this.props;
        return !!(quizResults && quizResults.data);
    }

    handleBackOnClick() {
        if (!this.isQuizHasResults()) {
            browserHistory.push(`/trainings`);
        } else {
            const {quizResults: {data: {itemId}}} = this.props;
            browserHistory.push(`/trainings/module/${itemId}`);
        }
    }

    render() {

        const {location, quizResults, lang} = this.props;
        const i18n = dict[lang];
        return (
            <Layout scroller={true} page={page} location={location}>
                <div className={styles.quizResult}>
                    {this.renderHeader()}
                    {
                        this.isDataNotFetched() ? <Loader/>
                            : !this.isQuizHasResults()
                            ? <div className={cx('error')}>{this.renderNoResults()}</div>
                            : <div className={cx(styles.content)}>
                                {this.renderSummary()}
                                {this.renderWrongAnswers(quizResults.data.wrongAnswers)}
                                {this.renderMeta()}
                            </div>
                    }
                    <div className={cx(styles.actions)}>
                        <div className={cx(styles.action)}><Button kind={"side"}
                                type="button"
                                onClick={this.handleBackOnClick}>{i18n['quiz.action.lectures']}</Button></div>
                     </div>
                </div>
            </Layout>
        )
    }

    renderWrongAnswers(allAnswers) {

        const {lang} = this.props;
        const i18n = dict[lang];

        const wrongAnswers = (allAnswers || []).filter(wa => wa.fields.some(f => f.select !== f.isCorrect));
        const wrongAnswerCount = wrongAnswers
            ? wrongAnswers.length
            : 0;

        if (wrongAnswerCount <= 0) {
            return;
        }

        return <div className={cx(styles.wrongAnswers)}>
            <hr/>
            <h2>{i18n['quiz.result.answersWithErrors']}</h2>
            {wrongAnswers.map((wa) => this.renderWrongAnswer(wa))}
        </div>;
    }

    renderSummary() {
        const {lang, quizResults: {data}} = this.props;
        const i18n = dict[lang];

        const questionWord = pluralize(~~styles.requiredPercent, [i18n[`quiz.result.info.question.text.1`],
            i18n[`quiz.result.info.question.text.2`],
            i18n[`quiz.result.info.question.text.3`]]);

        return <div className={styles.summary}>
            {data.isPassed ?
                <div>
                    <h2>{i18n['quiz.result.info.passed']}</h2>
                    <div className={styles.resultInfo}>{i18n['quiz.result.info.youAnswerOn']}
                        <span className={cx(styles.passedPercent, styles.percent)}>{data.percentCorrect}%</span>
                        {questionWord}.
                    </div>
                </div>
                : <div>
                    <h2>{i18n['quiz.result.info.failed']}</h2>
                    <div className={styles.resultInfo}>{i18n['quiz.result.info.youAnswerOn']}
                        <span className={cx(styles.failedPercent, styles.percent)}>{data.percentCorrect}%</span> {questionWord}
                        . {i18n['quiz.result.info.required']} - <span className={cx(styles.requiredPercent, styles.percent)}>50%.</span>
                    </div>
                </div>
            }
        </div>;
    }
    renderNoResults() {
        const {lang} = this.props;
        const i18n = dict[lang];
        return <div className={cx('empty')}>{i18n['quiz.error.emptyData']}</div>;
    }

    renderHeader() {
        const {lang, quizResults} = this.props;
        const i18n = dict[lang];
        const items = [i18n['breadcrumb.main'], i18n['quiz.breadcrumb.testing'], i18n['quiz.breadcrumb.results']];
        const name = R.path(["data", "name"], quizResults)
        if (name) {
            items.push(name);
        }
        const itemId = R.path(['data', 'itemId'], quizResults);
        return <div className={cx(styles.quizResultHeader)}>
            <h2 className={cx(styles.title)}>{i18n['quiz.breadcrumb.testing']}</h2>
            <Breadcrumb items={items} links={['/', '/quiz', itemId ? `/quiz/${itemId}/history` : '']}/>
            <hr/>
        </div>
    }

    renderWrongAnswer(wrongQuestion) {
        return <div key={`wrongQuestion${wrongQuestion.id}`} className={cx(styles.wrongQuestion)}>
            <div className={cx(styles.content)}>
                <div className={cx(styles.title)}>{wrongQuestion.name}. {wrongQuestion.description}</div>
                {this.renderAnswers(wrongQuestion)}
                {this.renderPrompts(wrongQuestion)}
            </div>
        </div>
    }

    renderPrompts(wrongQuestion) {
        const {lang} = this.props;
        const i18n = dict[lang];
        return <div className={styles.prompt}>
           <div className={styles.promptHeader}>{i18n['quiz.result.prompts.correctAnswer']}</div>
           <div className={styles.promptAnswers}>
               {wrongQuestion.fields.filter(x=>x.isCorrect)
                   .map(x=> <div key={x.id}><span>&#183;</span> {x.name}</div>)}
           </div>
        </div>
    }

    renderAnswers(wrongQuestion) {
        const {fields} = wrongQuestion;
        return  <div className={cx(styles.answers)}>
            {fields.map((answer, fieldIndex) => {
                return <div className={cx(styles.answer)} key={`${answer.id}`}>
                    {this.renderAlias(answer, fieldIndex)}
                    {this.renderAnswerValue(answer)}
                </div>}
            )}
        </div>
    }

    renderAnswerValue(answer) {
        const {lang} = this.props;
        const i18n = dict[lang];

        let answerValue;
        if (!answer.isCorrect && !answer.select) {
            answerValue = <span className={cx(styles.value, styles.unselect)}>{answer.name}</span>
        } else {
            answerValue = <span className={cx(styles.value)}>{answer.select && !answer.isCorrect
                ? <span className={cx(styles.select)}>{i18n['quiz.result.prompts.youAnswer']} - </span>
                : !answer.select && !!answer.isCorrect
                    ? <span className={cx(styles.correct)}>{i18n['quiz.result.prompts.correct']} - </span>
                    : answer.select && answer.isCorrect
                        ? <span>
                            <span className={cx(styles.correct)}>{i18n['quiz.result.prompts.correct']} / </span><span
                            className={cx(styles.select)}>{i18n['quiz.result.prompts.youAnswer']} - </span>
                    </span> : ''} {answer.name}</span>
        }

        return <div className={cx(styles.answerValue)}>{answerValue}</div>
    }

    renderAlias(answer, fieldIndex) {

        return <div className={cx(styles.aliasBlock)}>
            <div className={cx(styles.answerAlias,
                {[styles.correct]: answer.isCorrect},
                {[styles.select]: answer.select},
            )}>
                <span className={cx(styles.value)}>{String.fromCharCode(65 + fieldIndex)}</span>
            </div>
        </div>;
    }

    renderMeta() {

        const {lang, quizResults: {data}} = this.props;
        if (data.isPassed) {
            return
        }

        const quizAvailable = isPollComplexAvailable(data);
        if (quizAvailable) {
            return;
        }

        const quizPending = isQuizPending(data)
        const attemptsCount = quizPending ? getRemainingAttempts(data) : 0;
        if (attemptsCount <= 0) {
            return;
        }

        const i18n = dict[lang];
        const {value} = resolveRemainingTimeTextAndValue(data, i18n, lang);
        return <div className={styles.meta}>
            <span>{i18n['quiz.result.meta.part1.tryAgain']}.</span>
            <span> {i18n['quiz.result.meta.part2.remainingAttempts']} {attemptsCount} {pluralize(attemptsCount, [i18n['attempt.text.1'], i18n['attempt.text.2'], i18n['attempt.text.3']])} {i18n['quiz.result.meta.part3.forTesting']}.</span>
            <span> {i18n['quiz.result.meta.part4.nextAttemptAvailable']} {value}</span>
        </div>
    }
}

const mapStateToProps = (state) => {
    return {
        userInfo: selectors.userInfo(state),
        quizResults: selectors.selectQuizResults(state),
        lang: state.lang,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        dispatch,
    };
};

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
)(QuizResult);