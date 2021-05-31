import {makeActionCreator, makeAsyncActionCreator} from 'utils';
import fetchDucks from 'modules/FetchDucks';
import api from 'utils/api';
import * as R from "ramda";
import {isQuizReady} from "./common";

export const moduleName = 'quiz';
const itemsDataExtractor = (x, itemType) => ({
    itemId: x.id,
    itemType,
    name: x.name,
    isPaid: x.isPaid,
    pollComplexInfo: x.pollComplexInfo,
    thumbnail: x.thumbnail
});

const {
  REQUEST,
  SUCCESS,
  ERROR,
  loading,
} = fetchDucks(moduleName);

export const GET_QUIZ_MODULE_LIST= `${moduleName}/GET_QUIZ_MODULE_LIST`;
export const GET_QUIZ_RESULTS= `${moduleName}/GET_QUIZ_RESULTS`;
export const GET_QUIZ = `${moduleName}/GET_QUIZ`;
export const START_QUIZ = `${moduleName}/START_QUIZ`;
export const FINISH_QUIZ = `${moduleName}/FINISH_QUIZ`;
export const SET_QUIZ  = `${moduleName}/SET_QUIZ`;
export const SET_QUESTION  = `${moduleName}/SET_QUESTION`;
export const APPLY_ANSWER = `${moduleName}/APPLY_ANSWER`;
export const SET_ANSWER  = `${moduleName}/SET_ANSWER`;

export const setQuestion = makeActionCreator(SET_QUESTION, 'data');
export const setAnswer = makeActionCreator(SET_ANSWER, 'data');
export const setQuiz = makeActionCreator(SET_QUIZ, 'data');

const QUIZ_MODULE_LIST_STATE_FIELD_NAME = "quizModuleList";
const QUIZ_RESULTS_STATE_FIELD_NAME = "quizResults";
const QUIZ_ACTION_STATE_NAME = "quiz";

const quizModuleListApiCall = data => api.getPlayListGroups({authToken: data.authToken, data: {onlyWithPolls: true}});

const extractModuleList = (data) => {
    return []
        .concat((R.path(['modules'], data) || []).map(item => itemsDataExtractor(item, 2))
            .concat((R.path(['thematic'], data) || []).map(item => itemsDataExtractor(item, 2)))
            .concat((R.path(['congress'], data) || []).map(item => itemsDataExtractor(item, 2))));
}

const isActualAction = (quiz, action) => quiz
    && action.data
    && quiz.data
    && quiz.data.pollComplexInfo
    && quiz.data.itemId === action.data.itemId;


const richQuizPolls = (quiz) => {
    if (quiz && quiz.polls) {
        quiz.polls = quiz.polls.map((poll, pollIndex) => {
            poll.index = pollIndex;
            poll.fields = poll.fields.map((field, fieldIndex) => {
                field.alias = String.fromCharCode(65 + fieldIndex)
                return field;
            })
            return poll;
        })
    }
    return quiz;
}

const quizMapData = (response, itemId) => {
    const items = extractModuleList(response);
    const quizIndex = items.findIndex(x => x.itemId === itemId)
    let quiz = quizIndex >= 0 ? items[quizIndex] : null;
    if (quiz && quiz.polls) {
        quiz = richQuizPolls(quiz)
    }
    return quiz;
}

export const getQuizResults = (request) => makeAsyncActionCreator({
    apiCall: async (data) => {
        const result = await quizModuleListApiCall(data);
        if (result.data && result.data.data) {
            const quiz = quizMapData(result.data.data, request.itemId);
            if (quiz) {
                const quizResults = await api.getPollComplexResults(data);
                if (quizResults && quizResults.data && quizResults.data.data) {
                    quizResults.data.data = {...quizResults.data.data, ...quiz};
                }
                return quizResults;
            }
        }
        return {...result, data: {...result.data, data: null}};
    },
    actionName: GET_QUIZ_RESULTS,
    data: request,
    moduleName,
    field: QUIZ_RESULTS_STATE_FIELD_NAME,
});

export const finishQuiz = (request, cb) => makeAsyncActionCreator({
    apiCall: api.finishUserPollComplex,
    actionName: FINISH_QUIZ,
    data : request,
    moduleName,
    field: 'currentAnswer',
    mapData: () => {},
    onSuccess: async (data, dispatch, getState) => {
        cb && cb(data.data)
    }
});

export const startQuiz = (data , quiz) => makeAsyncActionCreator({
    apiCall: api.startUserPollComplex,
    actionName: START_QUIZ,
    data,
    moduleName,
    field: 'quiz',
    mapData: (response) => ({...quiz, pollComplexInfo: richQuizPolls(response)}),
    onSuccess: async ({data}, dispatch, getState) => {
        const {quiz} = getState();
        const polls = R.path(['quiz', 'data', 'pollComplexInfo', 'polls'], quiz);
        if (polls && polls.length > 0) {
            await dispatch(setQuestion(polls[0]));
        }
    }
});

export const applyAnswer = (data) => makeAsyncActionCreator({
    apiCall: api.createUserPollComplexPollField,
    actionName: APPLY_ANSWER,
    field: 'currentAnswer',
    data,
    moduleName,
    onSuccess: async (response, dispatch, getState) => {
        await dispatch(setAnswer(data[0]));
    }
});


export const getQuiz = (data, autoStart = true) => makeAsyncActionCreator({
    apiCall: quizModuleListApiCall,
    actionName: GET_QUIZ,
    data,
    moduleName,
    field: QUIZ_ACTION_STATE_NAME,
    mapData: (response) => quizMapData(response, data.itemId),
    onSuccess: async ({data}, dispatch, getState) => {
        const {quiz: {quiz}} = getState();
        if (autoStart && isQuizReady(quiz)) {
            const {data} = quiz;
            const {itemId, itemType} = data;
            await dispatch(startQuiz({itemId, itemType}, data))
        }
    }
});

export const getQuizModuleList = () => makeAsyncActionCreator({
    apiCall: quizModuleListApiCall,
    actionName: GET_QUIZ_MODULE_LIST,
    moduleName,
    field: QUIZ_MODULE_LIST_STATE_FIELD_NAME,
    mapData: extractModuleList
});


// Reducer
export const empty = {quizResults: {}, currentAnswer: {}}
export const initialState = {
    quizModuleList: {data: []}
};

export const reducer = (state = initialState, action) => {

    if (~action.type.indexOf(REQUEST) || ~action.type.indexOf(SUCCESS) || ~action.type.indexOf(ERROR)) {
        return {
            ...(action.field === QUIZ_MODULE_LIST_STATE_FIELD_NAME && ~action.type.indexOf(REQUEST)
                ? initialState
                : state),
            ...empty,
            [action.field]: loading(state[action.field], action),
        }
    }

    switch (action.type) {
        case SET_QUESTION:
            return {
                ...state,
                ...empty,
                currentQuestion: {...action.data}
            };
        case SET_ANSWER:
            const quiz = {...state.quiz}
            let currentQuestion = state.currentQuestion
            if (isActualAction(quiz, action)) {
                const {polls} = quiz.data.pollComplexInfo;
                const questionIndex = polls.findIndex(x => x.id === action.data.id);
                if (questionIndex >= 0) {
                    const answerIds = action.data.answerIds || [];
                    currentQuestion = polls[questionIndex]
                    currentQuestion.fields = (currentQuestion.fields || []).map(x => ({...x, select: answerIds.includes(x.id)}));
                }
            }
            return {
                ...state,
                ...empty,
                currentQuestion: {...currentQuestion},
                quiz
            };
        default:
            return state;
    }
};
