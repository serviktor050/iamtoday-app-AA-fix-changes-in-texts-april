import {dict} from "dict";
import moment from "moment";
import {pluralize} from "../../utils/helpers";

export const getDifferenceTimes = difference => {
    const days = Math.floor(difference.as('days'))
    const hours = Math.floor(difference.as('hours') % 24)
    const minutes = Math.floor(difference.as('minutes') % 60)
    const seconds = Math.floor(difference.as('seconds') % 60)
    return {days, hours, minutes, seconds};
};

export const getRemainingTimes = (dateStart, dateEnd) => {
    const start = moment(dateStart);
    const end = moment(dateEnd);
    const difference = moment.duration(end.diff(start));
    const {days, hours, minutes, seconds} = getDifferenceTimes(difference);
    return {
        days: Math.max(0, days),
        minutes: Math.max(0, minutes),
        hours: Math.max(0, hours),
        seconds: Math.max(0, seconds),
    }
};

export const isFuture = date => {
    const now = moment();
    return moment(now).diff(date) < 0 ;
}

export const isNoRemainingTime = (dateStart, dateEnd) => {
    const {days, hours, minutes, seconds} = getRemainingTimes(dateStart, dateEnd);
    return days <= 0 && hours <= 0 && minutes <= 0 && seconds <= 0
}

export const getRemainingTimesAsString = (dateStart, dateEnd, lang, withDays = true) => {
    const {days, hours, minutes, seconds} = getRemainingTimes(dateStart, dateEnd)
    return `${withDays? `${days}${dict[lang]['day.short']} `:''}${hours < 10 ? `0${hours}` : hours}:${minutes < 10 ? `0${minutes}` : minutes}:${seconds < 10 ? `0${seconds}` : seconds}`
};

export const getDiffTimesAsString = (dateStart, dateEnd) => {
    const {hours, minutes, seconds} = getRemainingTimes(dateStart, dateEnd)
    return `${hours < 10 ? `0${hours}` : hours}:${minutes < 10 ? `0${minutes}` : minutes}:${seconds < 10 ? `0${seconds}` : seconds}`
};

export const getLastAttempt = (item, predicate) => {
    const {previousTryHistory} = item;
    if (previousTryHistory) {
        const index = previousTryHistory.findIndex(x => !predicate || predicate(x));
        if (index >= 0) {
            return previousTryHistory[index];
        }
    }
    return null;
}

export const testLastAttempt = (item, test) => test(getLastAttempt(item))

export const getLastAttemptPercentCount = item => {
    const {pollComplexInfo} = item;
    const lastAttempt = pollComplexInfo ? getLastAttempt(pollComplexInfo) : null;
    if (lastAttempt) {
        return lastAttempt['percentCorrect'];
    }
    return 0;
}

export const isPollsExists = item => {
    const {pollComplexInfo} = item;
    return pollComplexInfo
        && pollComplexInfo.polls
        && pollComplexInfo.polls.length > 0
}

export const isPollComplexScheduled = item => {
    const {pollComplexInfo} = item;
    return !!(pollComplexInfo
        && !pollComplexInfo.isAvailable
        && pollComplexInfo.availableDate
        && isFuture(pollComplexInfo.availableDate))
}

export const isPollComplexAvailable = item => {
    const {pollComplexInfo} = item;
    return (pollComplexInfo
        && pollComplexInfo.isAvailable
        && pollComplexInfo.previousTryCount < pollComplexInfo.maxPollCountPerTry)
}

export const getRemainingAttempts = item => {
    const {pollComplexInfo} = item;
    return pollComplexInfo
         ? pollComplexInfo.maxPollCountPerTry - pollComplexInfo.previousTryCount
         : 0;
}

export const isQuizReadyToStart = (quiz) => {
    const {data} = quiz;
    return !!(data
        && !data.isError
        && data.isPaid
        && isPollComplexAvailable(data))
}

export const isSessionStarted = (quiz) => {
    const {pollComplexInfo} = quiz;
    return !!(pollComplexInfo
        && (pollComplexInfo.startDate)
        && (pollComplexInfo.endDate))

}

export const isSessionExpired = (quiz) => {
    const {pollComplexInfo} = quiz;
    return isNoRemainingTime(moment(), pollComplexInfo.endDate)
}

export const isQuizReady = (quiz) => {
    return isQuizReadyToStart(quiz)
            && isSessionStarted(quiz.data)
            && !isSessionExpired(quiz.data)
}

export const isQuizUnavailable = (quiz) => {
    return !isQuizReady(quiz)
             || !isPollsExists(quiz.data);
}

export const isLastAttemptPassed = item => {
    const {pollComplexInfo} = item;
    return !!(pollComplexInfo
        && testLastAttempt(
            pollComplexInfo,
            (attempt) => !!(attempt && attempt['isPassed'] === true)))
}

export const isQuizHasHistory = quiz => {
    const {data} = quiz;
    return !!(data
        && !data.isError
        && data.pollComplexInfo
        && !!getLastAttempt(data.pollComplexInfo))
}

export const isPollComplexIsNotEmpty = item => {
    return !!(item && item.pollComplexInfo)
}

export const isPollComplexHasHistory = item => {
    return !!(isPollComplexIsNotEmpty(item)
        && !!getLastAttempt(item.pollComplexInfo))
}

export const isQuizPending = item => {
    const {pollComplexInfo} = item;
    return pollComplexInfo
        && !pollComplexInfo.isAvailable
        && pollComplexInfo.availableDate
        && isFuture(pollComplexInfo.availableDate)
}

export const isLessThanDay = date => {
    const now = moment();
    const availableDate = moment(date);
    return availableDate.diff(now) > 0
        && availableDate.diff(now, 'days') >= 0
        && availableDate.diff(now, 'days') < 1
}

export const isQuizPendingDuringDay = item => {
    const {pollComplexInfo} = item;
    return isQuizPending(item)
        && isLessThanDay(pollComplexInfo.availableDate)
}


export const isQuizExpired = item => {
    return isPollComplexAvailable(item)
        &&  item.pollComplexInfo.endDate
        &&  isSessionExpired(item)
}


export const resolveQuizErrorMessage = (lang, quiz) => {
    const i18n = dict[lang];
    let message = i18n['isError']
    if (quiz.isError) {
        message = quiz.errMsg
    } else if (!quiz.data) {
        message = i18n['quiz.error.emptyData']
    } else if (!quiz.data.isPaid) {
        message = i18n['quiz.error.isNotPaid']
    } else if (!quiz.data.pollComplexInfo) {
        message = i18n['quiz.error.emptyData']
    } else if (!quiz.data.pollComplexInfo.isAvailable) {
        message = i18n['quiz.error.isNotAvailable']
    } else {
        const {maxPollCountPerTry, previousTryCount, polls, startDate} = quiz.data.pollComplexInfo;
        if (previousTryCount >= maxPollCountPerTry) {
            message = i18n['quiz.error.noAttemptsAvailable']
        } else if (!polls || !(polls.length > 0) || !startDate) {
            message = i18n['quiz.error.sessionIsNotStarted']
        } else if (isQuizExpired(quiz.data)) {
            message = i18n['quiz.error.timeIsExpired']
        }
    }
    return message;
}


export const resolveRemainingTimeTextAndValue = (item, i18n, lang) => {
    const { pollComplexInfo } = item;
    const lastAttempt = isPollComplexIsNotEmpty(item) && isPollComplexScheduled(item)
        ? getLastAttempt(pollComplexInfo)
        : null;
    const retry =  !!lastAttempt

    const startDate = moment();
    const endDate = pollComplexInfo.availableDate;
    const {days} = getRemainingTimes(startDate, endDate, lang)
    if (days <= 0) {
        const times = getDiffTimesAsString(startDate, endDate);
        return { retry, value: times}
    }
    return {
        retry,
        value: `${days} ${pluralize(days, [i18n['day.text.1'], i18n['day.text.2'], i18n['day.text.3']])}`
    }
}




