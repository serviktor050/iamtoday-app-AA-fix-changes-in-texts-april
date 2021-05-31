import React, {PureComponent} from "react";
import {compose} from "redux";
import {browserHistory} from "react-router";
import {connect} from "react-redux";

import {Breadcrumb} from "components/common/Breadcrumb";
import {Button} from "components/common/Button";
import Loader from "components/componentKit/Loader";
import {dict} from "dict";
import {pluralize} from "utils/helpers";
import {startQuiz} from "../../ducks";
import {isQuizReadyToStart, resolveQuizErrorMessage} from "../../common";
import classNames from 'classnames/bind';
import styles from "./styles.css";

const cx = classNames.bind(styles);

export const page = 'quiz';
const DURING_DAYS_NUMBER = 5;

class QuizIntro extends PureComponent {

    state = {}

    constructor(props, context) {
        super(props, context);
        this.handleOnClickStartButton = this.handleOnClickStartButton.bind(this);
        this.handleOnClickBackButton = this.handleOnClickBackButton.bind(this);
    }

    isDataNotFetched() {
        const {quiz} = this.props;
        return !quiz
            || quiz.isFetching
    }

    handleOnClickBackButton() {
        browserHistory.push(`/quiz`);
    }

    handleOnClickStartButton() {
        const {dispatch, quiz } = this.props;
        const {data: { itemId, itemType }} = quiz;
        dispatch(startQuiz({itemId, itemType}, quiz.data));
    }

    render() {
        const {quiz} = this.props;
        return (
                    <div className={cx(styles.quizIntro)}>
                        {this.renderHeader()}
                        {
                            this.isDataNotFetched()
                                ? <Loader/>
                                : !isQuizReadyToStart(quiz)
                                ? this.renderUnavailableReasons()
                                : this.renderBody()
                        }
                    </div>
        )
    }

    renderUnavailableReasons() {
        const {lang, quiz} = this.props;
        const message = resolveQuizErrorMessage(lang, quiz);
        return <div className={cx('error')}>{message}</div>
    }

    renderHeader() {
        const {lang, quiz} = this.props;
        const i18n = dict[lang];
        const items = [i18n['breadcrumb.main'], i18n['quiz.breadcrumb.testing']];
        if (quiz && quiz.data) {
            items.push(quiz.data.name);
        }
        return <div className={cx(styles.quizIntroHeader)}>
            <h2 className={cx(styles.title)}>{i18n['quiz.breadcrumb.testing']}</h2>
            <Breadcrumb items={items}/>
            <hr/>
        </div>
    }

    renderBody() {
        return <div>
            {this.renderInfo()}
            <div className={cx(styles.note)}>
                <div className={cx(styles.leftPart)}>
                    <svg fill={"#fdd34c"} className={cx(styles.icon)}>
                        <use fill={"#fdd34c"} xlinkHref={`#alert-triangle`}/>
                    </svg>
                </div>
                <div className={cx(styles.rightPart)}>
                    {this.renderPollComplexInfo()}
                    {this.renderActions()}
                </div>
            </div>
        </div>;
    }

    renderInfo() {
        const {lang, quiz} = this.props;
        const i18n = dict[lang];
        return <div className={cx(styles.info)}>
            <p>{i18n['quiz.quizIntro.infoAboutCompletedModule']} «{quiz.data.name}»</p>
            <p>{i18n['quiz.quizIntro.infoAboutStartTestingAction']} <span
                className={styles.greenLink}
                onClick={(e) => this.handleOnClickBackButton(e)}>«{i18n['quiz.action.testing']}»</span>
            </p>
        </div>;
    }

    renderPollComplexInfo() {
        const {lang, quiz: {data}} = this.props;
        const {pollComplexInfo: {complexTimeLimit}} = data;
        const i18n = dict[lang];
        const duringMinutesWord = pluralize(complexTimeLimit, [i18n['minute.text.1'], i18n['minute.text.2'], i18n['minute.text.3']]);
        return <div>
            <h3>{i18n['quiz.quizIntro.payAttention']}</h3>
            <p>{i18n['quiz.quizIntro.infoAboutRequiredAnswers']}</p>
            <p>{i18n['quiz.quizIntro.infoAboutTestTime']} <span
                className={styles.estimatedTime}>{complexTimeLimit
                ? `${complexTimeLimit} ${duringMinutesWord} `
                : "--"}</span>
            </p>
        </div>;
    }

    renderActions() {
        const {lang} = this.props;
        const i18n = dict[lang];
        return <div className={cx(styles.actions)}>
            <Button kind="side"
                    type="button"
                    className={cx(styles.action)}
                    onClick={this.handleOnClickBackButton}>{i18n['quiz.action.refuse']}</Button>
            <Button kind="side"
                    type="button"
                    className={cx(styles.action)}
                    onClick={this.handleOnClickStartButton}>{i18n['quiz.action.start']}</Button>
        </div>;
    }
}

const mapStateToProps = (state) => {
    return {
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
)(QuizIntro);