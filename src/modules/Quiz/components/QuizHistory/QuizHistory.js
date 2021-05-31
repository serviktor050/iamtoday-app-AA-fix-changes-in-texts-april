import React, {Component} from "react";
import {compose} from "redux";
import {connect} from "react-redux";
import moment from "moment";
import classNames from 'classnames/bind';
import Layout from "components/componentKit2/Layout";
import Loader from "components/componentKit/Loader";
import {Breadcrumb} from "components/common/Breadcrumb";
import {dict} from "dict";
import {getQuiz} from "../../ducks";
import * as selectors from "../../selectors";
import {getDiffTimesAsString, isQuizHasHistory} from "../../common";
import styles from "./styles.css";

const cx = classNames.bind(styles);

const  page = "quiz";

class QuizHistory extends Component {

    state = {}

    componentDidMount() {
        const {dispatch, params : {itemId}} = this.props;
        dispatch(getQuiz({itemId: ~~itemId}, false))
    }

    isDataNotFetched() {
        const {quiz} = this.props;
        return !quiz || quiz.isFetching;
    }

    render() {
        const {location, lang, quiz} = this.props;
        const i18n = dict[lang];
        return (
            <Layout page={page} location={location}>
                <div className={cx(styles.quizHistory)}>
                    {this.renderHeader(lang)}
                    {
                        this.isDataNotFetched() ? <Loader/>
                            : !isQuizHasHistory(quiz)
                            ? <div className={cx('error')}>{this.renderNoHistory()}</div>
                            : <div>
                                {this.renderName()}
                                <div className={styles.table}>
                                    {this.renderResultHeader(i18n)}
                                    <div className={styles.body}>
                                        {quiz.data.pollComplexInfo.previousTryHistory.map(item => {
                                            return <div key={`previousTryHistory${item.id}`} className={styles.row}>
                                                <div className={styles.cell}>{moment(item.startDate).format('L')}</div>
                                                <div className={styles.cell}>{getDiffTimesAsString(item.startDate, item.endDate)}</div>
                                                <div className={cx(styles.cell, {[styles.failed]: !item.isPassed}, {[styles.passed]: item.isPassed})}>{this.renderResultAmount(item)}</div>
                                                <div className={cx(styles.cell, {[styles.failed]: !item.isPassed}, {[styles.passed]: item.isPassed})}>
                                                    {item.isPassed
                                                        ? i18n['quiz.history.status.passed']
                                                        : i18n['quiz.history.status.failed']}
                                                </div>
                                            </div>
                                        })}
                                    </div>
                                </div>
                            </div>
                    }
                </div>
            </Layout>
        )
    }

    renderResultAmount(history) {
        return <div>{history.percentCorrect}%</div>;
    }

    renderName() {
        const {quiz} = this.props;
        return <div className={cx(styles.name)}>{quiz.data.name}</div>;
    }

    renderResultHeader() {
        const {lang} = this.props;
        const i18n = dict[lang];
        return <div className={styles.heading}>
            <div className={styles.row}>
                <div className={styles.cell}>{i18n['quiz.history.field.date']}</div>
                <div className={styles.cell}>{i18n['quiz.history.field.spentTime']}</div>
                <div className={cx(styles.cell)}>{i18n['quiz.history.field.percentAmount']}</div>
                <div className={cx(styles.cell)}>{i18n['quiz.history.field.result']}</div>
            </div>
        </div>;
    }

    renderNoHistory() {
        const {lang} = this.props;
        const i18n = dict[lang];
        return <div className={cx('empty')}>{i18n['quiz.error.emptyData']}</div>;
    }

    renderHeader() {
        const {lang} = this.props;
        const i18n = dict[lang];
        return <div className={cx(styles.quizHistoryHeader)}>
            <h2 className={cx(styles.title)}>{i18n['quiz.breadcrumb.testing']}</h2>
            <Breadcrumb
                items={[i18n['breadcrumb.main'], i18n['quiz.breadcrumb.testing'], i18n['quiz.breadcrumb.history']]}
                links={['/', '/quiz']}
            />
            <hr/>
        </div>
    }
}

const mapStateToProps = (state) => {
    return {
        userInfo: selectors.userInfo(state),
        lang: state.lang,
        quiz: selectors.selectQuiz(state)
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        dispatch,
    };
};

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
)(QuizHistory);