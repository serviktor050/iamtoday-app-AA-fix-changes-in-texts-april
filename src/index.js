import "babel-polyfill";
import "whatwg-fetch";

import React from "react";
import { render } from "react-dom";
import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import { Provider } from "react-redux";
import { Router, browserHistory } from "react-router";
import { syncHistoryWithStore, routerReducer } from "react-router-redux";
import { reducer as reduxFormReducer } from "redux-form";
import thunk from "redux-thunk";
import promise from "redux-promise";
import { reducer as ratingReducer, moduleName as rating } from "modules/Rating";
import {
  reducer as notificationsReducer,
  moduleName as notifications,
} from "modules/Notifications";
import {
  reducer as trainingReducer,
  moduleName as training,
} from "modules/Training";
import { reducer as quizReducer, moduleName as quiz } from "modules/Quiz";
import { reducer as mlmReducer, moduleName as mlm } from "modules/Mlm";
import { reducer as profileReducer, moduleName as profile } from 'modules/Profile';
import { reducer as salesReducer, moduleName as sales } from "modules/Admin";
import { reducer as chooseMentorReducer, moduleName as chooseMentor } from 'modules/ChoseMentor';
import {
  reducer as partnerInfoReducer,
  moduleName as partnerInfo,
} from "modules/PartnerInfo";
import { reducer as buyReducer, moduleName as buy } from "modules/Buy";
import {
  reducer as purchasesReducer,
  moduleName as purchases,
} from "modules/Purchases";
import { reducer as calendarReducer, moduleName as calendar } from 'modules/Calendar'
import * as reducers from "./reducers";
import { getRoutes } from "./routes";

import createLogger from "redux-logger";

import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import { cancel } from "./i18n/ru";


function fbTrack({ getState }) {
  return (next) => (action) => {
    let returnValue = next(action);

    // window.fbq('track', 'PageView');
    return returnValue;
  };
}

const middleware = [thunk, promise, fbTrack];
if (process.env.NODE_ENV !== "production") {
  middleware.push(createLogger());
}

const appReducer = combineReducers({
  ...reducers,
  form: reduxFormReducer,
  routing: routerReducer,
  [rating]: ratingReducer,
  [notifications]: notificationsReducer,
  [training]: trainingReducer,
  [quiz]: quizReducer,
  [partnerInfo]: partnerInfoReducer,
  [mlm]: mlmReducer,
  [sales]: salesReducer,
  [profile]: profileReducer,
  [chooseMentor]: chooseMentorReducer,
  [training]: trainingReducer,
  [buy]: buyReducer,
  [purchases]: purchasesReducer,
  [calendar]: calendarReducer,
});

const rootReducer = (state, action) => {
  if (action.type === "LEAVE") {
    const { routing } = state;
    state = { routing };
  }
  return appReducer(state, action);
};

const store = createStore(
  rootReducer,
  compose(
    applyMiddleware(...middleware),
    window.devToolsExtension ? window.devToolsExtension() : (f) => f
  )
);

const history = syncHistoryWithStore(browserHistory, store);

render(
  <Provider store={store}>
    <MuiThemeProvider>
      <Router history={history}>{getRoutes(store)}</Router>
    </MuiThemeProvider>
  </Provider>,
  document.getElementById("root")
);
