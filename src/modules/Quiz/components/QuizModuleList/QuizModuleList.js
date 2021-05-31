import React, {Component} from "react";
import {compose} from "redux";
import {connect} from "react-redux";

import classNames from 'classnames/bind';
import Layout from "components/componentKit2/Layout";

import Loader from "components/componentKit/Loader";
import {browserHistory} from "react-router";
import {Breadcrumb} from "components/common/Breadcrumb";
import {Button} from "components/common/Button";
import {dict} from "dict";
import {
    getLastAttemptPercentCount,
    isPollComplexAvailable,
    isLastAttemptPassed,
    isQuizPending,
    isQuizReadyToStart,
    resolveRemainingTimeTextAndValue
} from "../../common";

import * as selectors from "../../selectors";
import {getQuizModuleList} from "../../ducks";
import styles from "./styles.css";

const cx = classNames.bind(styles);

const page = 'quiz';

class QuizModuleList extends Component {

    state = {}

    componentDidMount() {
        const {dispatch} = this.props;
        dispatch(getQuizModuleList())
    }

    handleQuizOnClick(itemId) {
        browserHistory.push(`/quiz/${itemId}`);
    }

    handleQuizHistoryOnClick(itemId) {
        browserHistory.push(`/quiz/${itemId}/history`);
    }

    render() {
        const {location, lang, quizModuleList} = this.props;
        return (
            <Layout page={page} location={location}>
                <div className={cx(styles.quizModuleList)}>
                    {this.renderHeader(lang)}
                    {
                        !quizModuleList || quizModuleList.isFetching ? <Loader/>
                            : quizModuleList.isError
                            ? <div className={cx('error')}>{quizModuleList.errMsg}</div>
                            : <div className={cx('list')}>   {
                                quizModuleList.data && quizModuleList.data.length > 0
                                    ? quizModuleList.data.map((item) => this.renderCard(item, lang))
                                    : this.renderNoModuleList(lang)
                            }
                            </div>
                    }
                </div>
            </Layout>
        )
    }


    renderNoModuleList(lang) {
        const i18n = dict[lang];
        return <div className={cx('empty')}>{i18n['quizModuleList.noModuleList']}</div>;
    }

    renderRequirements(item, lang) {
        const i18n = dict[lang];
        const quizPassed = isLastAttemptPassed(item);
        return quizPassed
            ? <div className={cx(styles.requirement)}>{i18n['quiz.requirement.completed']} <span
                className={cx(styles.requirementData)}>{getLastAttemptPercentCount(item)}%</span></div>
            : <div className={cx(styles.requirement)}>{i18n['quiz.requirement.required']}</div>
    }

    renderAttemptCounter(item, lang) {
        const i18n = dict[lang];
        const {pollComplexInfo} = item;
        if (pollComplexInfo && pollComplexInfo.isAvailable) {
            const {maxPollCountPerTry, previousTryCount} = pollComplexInfo;
            return <div className={cx(styles.counter)}>{i18n['quiz.attemptsCount']}: <span
                className={cx(styles.counterData)}>{Math.max((maxPollCountPerTry || 0) - (previousTryCount || 0), 0)}</span>
            </div>
        }
        return <div className={cx(styles.emptyCounter)}/>
    }

    renderStatus(item, lang) {

        const i18n = dict[lang];

        const quizAvailable = isPollComplexAvailable(item);
        if (quizAvailable) {
            return this.renderAvailablePhrase(i18n);
        }

        const quizPending = isQuizPending(item)
        if (quizPending) {
            return this.renderPendingPhrase(item, i18n, lang);
        }

        return <div/>
    }

    renderAvailablePhrase(i18n) {
        return <div className={cx(styles.status, 'available')}>{i18n['quiz.status.phrase.available']}</div>;
    }


    renderPendingPhrase(item, i18n, lang) {
        const {retry, value} = resolveRemainingTimeTextAndValue(item, i18n, lang);
        const phrase = retry ? i18n['quiz.status.phrase.retry'] : i18n['quiz.status.phrase.pending'];
        return <div
            className={cx(styles.status, 'retry')}>{phrase} <span className={cx(styles.statusData)}>{value}</span>
        </div>;
    }

    renderHeader(lang) {
        const i18n = dict[lang];
        return <div className={cx(styles.quizModuleListHeader)}>
            <h2 className={cx(styles.title)}>{i18n['quiz.breadcrumb.testing']}</h2>
            <Breadcrumb items={[i18n['breadcrumb.main'], i18n['quiz.breadcrumb.testing']]}
                        links={['/']}/>
            <hr/>
        </div>
    }

    renderCard(item, lang) {
        const i18n = dict[lang];
        const quizReadyToStart = isQuizReadyToStart({data: item});
        return <div key={item.itemId} className={cx('card', 'chart')}>
            <div className={cx('thumbnailArea')}>
                <img
                    className={cx('thumbnail')}
                    src={item.thumbnail}
                    alt=""
                />
            </div>
            <div className={cx(styles.descriptionArea)}>
                <div className={cx(styles.name)}>{item.name}</div>
                <div className={cx(styles.info)}>
                    {this.renderRequirements(item, lang)}
                    {this.renderStatus(item, lang)}
                    {this.renderAttemptCounter(item, lang)}
                    <Button kind={quizReadyToStart ? "side" : "disabled"}
                            type="button"
                            className={cx(styles.action, {[styles.available]: quizReadyToStart})}
                            onClick={() => this.handleQuizOnClick(item.itemId)}>{i18n['quiz.action.testing']}</Button>
                    <Button onClick={() => this.handleQuizHistoryOnClick(item.itemId)}
                            className={cx(styles.action, styles.linkButton)}>{i18n['quiz.action.testingHistory']}</Button>
                </div>
            </div>
            <hr/>
        </div>
    }

}

const mapStateToProps = (state) => {
    return {
        userInfo: selectors.userInfo(state),
        lang: state.lang,
        quizModuleList: selectors.selectQuizModuleList(state)
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        dispatch,
    };
};

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
)(QuizModuleList);