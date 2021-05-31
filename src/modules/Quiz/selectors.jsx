import * as R from 'ramda';
import {moduleName} from "../Quiz";

const local = (state) => state[moduleName];

export const userInfo = (state) => {
    return R.path(['userInfo'], state);
};

export const selectQuizResults = (state) => {
    return R.path(['quizResults'], local(state));
};

export const selectQuizModuleList = (state) => {
    return R.path(['quizModuleList'], local(state));
};

export const selectQuiz = (state) => {
    return R.path(['quiz'], local(state));
};

export const selectCurrentQuestion = (state) => {
    return R.path(['currentQuestion'], local(state));
};

export const selectCurrentAnswer = (state) => {
    return R.path(['currentAnswer'], local(state));
};