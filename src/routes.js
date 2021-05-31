import React from "react";
import { Route, IndexRoute, browserHistory } from "react-router";
import { api, domen } from "./config";
import { dict } from "dict";
import App from "./components/App";
import Smm from "./containers/Smm";
import ProfileCreate from "./containers/ProfileCreate";
import ProfileSignup from "./containers/ProfileSignup";
import ProfileSignupParams from "./containers/ProfileSignupParams";
import SeasonSignupParams from "./containers/SeasonSignupParams";
import PartnerLogin from "./containers/PartnerLogin";
import PartnerDataShow from "./containers/PartnerDataShow";
import ProfilePasswordForget from "./containers/ProfilePasswordForget";
import ProfilePasswordRestore from "./containers/ProfilePasswordRestore";
import ProfilePay from "./containers/ProfilePay";
import TomorrowFriend from "./components/profile/TomorrowFriend";
import LoginSocial from "./components/profile/LoginSocial";
import LoginFB from "./components/profile/LoginFB";
import LoginOk from "./components/profile/LoginOk";
import NotFound from "./components/profile/NotFound";
import Offer from "./containers/Offer";
import SuccessProfile from "./components/profile/SuccessProfile";
import DayEditor from "./components/admin/DayEditor";
import FoodEditor from "./components/admin/FoodEditor";
import PhotosIntro from "./components/admin/PhotosIntro";
import PhotosIntroWoman from "./components/admin/PhotosIntroWoman";
import AdminLogin from "./containers/AdminLogin";
import Seasons from "./containers/Seasons";
import ErrorReport from "./containers/ErrorReport";
import Partners from "./components/partner/Partners";
import PartnerItem from "./components/partner/PartnerItem";
import ProfileConfirmeEmail from "./containers/ProfileConfirmeEmail";
import ChoseMentorProfile from "modules/Admin/components/Mentoring/MentorProfile/ChoseMentorProfile";
// Minion containers

import MinionLogin from "./containers/MinionLogin";

import PendingMinionChats from "./containers/PendingMinionChats";

import PendingPhoto from "./containers/PendingPhoto";
import PendingPhotos from "./containers/PendingPhotos";

import PendingMinionEvent from "./containers/PendingMinionEvent";
import PendingMinionEvents from "./containers/PendingMinionEvents";

import PendingProfile from "./containers/PendingProfile";
import PendingProfiles from "./containers/PendingProfiles";
import ProfileSignupDesc from "./components/profile/ProfileSignupDesc";
import PendingInsuranceProfile from "./containers/PendingInsuranceProfile";
import PendingInsuranceProfiles from "./containers/PendingInsuranceProfiles";

import TodayTask from "./containers/TodayTask";

import Faq from "./components/Faq";
import Food from "./containers/Food";
import Photos from "./containers/Photos";
import ChatPage from "./containers/ChatPage";
import SingleChatPage from "./containers/SingleChatPage";

import { Rating } from "modules/Rating";
import { Shop } from "modules/Shop";
import {
  Training,
  TrainingPlaylist,
  TrainingExercise,
  SingleVideo,
} from "modules/Training";
import { Buy } from "modules/Buy";
import { Purchases } from "modules/Purchases";
import { ChoseMentor } from "modules/ChoseMentor";

import cookie from "react-cookie";
import { promoWatch } from "./actions/promo/promoWatch";
import { setHost, getSiteSettings } from "./actions";
import QuizQuestionList from "./modules/Quiz/components/QuizModuleList/QuizModuleList";
import Quiz from "./modules/Quiz/components/Quiz/Quiz";
import QuizHistory from "./modules/Quiz/components/QuizHistory/QuizHistory";
import QuizResult from "./modules/Quiz/components/QuizResult/QuizResult";
import {
  MlmOrdersHistory,
  MlmRegistration,
  MlmSummary,
  MlmHistory,
  MlmStructure,
  PurchasePoints,
  WithdrawalPoints,
  MlmMentorRequestDeclining,
  ChangeTutorPage,
} from "./modules/Mlm";
import PartnerInfo from "./modules/PartnerInfo/PartnerInfo";
import { Calendar, Tasks } from "./modules/Calendar";
import FAQ from "./modules/FAQ/index";
import { Diploms } from "./modules/Profile";

// Admin
import {
  SalesReports,
  DeclinedRequests,
  BlockedProfiles,
  SalesPartners,
  NewProfiles,
  AppliedProfiles,
  DeclinedProfiles,
  RecommenedMentorProfile,
  ChangeRequests,
  MentorsList,
  NewMentorsPage,
  MentorRequests,
  TutorProfile,
  QuestionsPage,
} from "./modules/Admin";

export const RESPONSE_CODE_TOKEN_EXPIRED = 5;
export const RESPONSE_CODE_ACCESS_BLOCKED = 134;
export const RESPONSE_CODE_ACCESS_DENIED = [
  RESPONSE_CODE_ACCESS_BLOCKED,
  RESPONSE_CODE_TOKEN_EXPIRED,
];

const isAccessDenied = (json) =>
  json && RESPONSE_CODE_ACCESS_DENIED.includes(json.errorCode);

export const applyLeave = (dispatch) => {
  cookie.remove("token", { path: "/" });
  cookie.remove("txId", { path: "/" });
  cookie.remove("role", { path: "/" });
  cookie.remove("program", { path: "/" });
  cookie.remove("packageType", { path: "/" });
  cookie.remove("promoName", { path: "/" });
  cookie.remove("share", { path: "/" });
  cookie.remove("general", { path: "/" });
  cookie.remove("userProgram", { path: "/" });
  cookie.remove("tester", { path: "/" });
  cookie.remove("abtest", { path: "/" });

  dispatch({ type: "LEAVE" });
  browserHistory.push("/");
};
export const getRoutes = (store) => {
  const leave = () => applyLeave(store.dispatch);

  const getRole = (role) => {
    const token = cookie.load("token");
    const pathname =
        store.getState().routing.locationBeforeTransitions.pathname,
      pathnameArr = pathname.split("/");

    if (pathnameArr[2] === "photosWoman") {
      store.dispatch({
        type: "SELECT_PHOTO_FAQ",
        value: "UserPhotoCaptionWoman",
      });
    }

    if (token) {
      return fetch(`${api}/user/user-get`, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          authToken: token,
          data: {
            season: cookie.load("currentSeason")
              ? cookie.load("currentSeason")
              : 0,
          },
        }),
      })
        .then((response) => response.json())
        .then((json) => {
          const isRegistered = !(
            !json ||
            json.errorCode !== 1 ||
            !json.data ||
            !json.data[0] ||
            json.data[0].role !== role
          );

          if (isRegistered) {
            cookie.save("user_id", json.data[0].id, {
              path: "/",
              maxAge: 60 * 60 * 24 * 365 * 10,
            }); // id текущего пользователя необходим для чатов
            if (role === 3 && json.data[0].paidState === 0) {
              browserHistory.push("/signup/pay");
            }
          } else {
            browserHistory.push(role === 2 ? "/superadmin/profiles" : "/");
          }
        });
    } else {
      leave();
    }
  };

  const defineHost = (storeLocal) => {
    const hostname = window.location.hostname.split(".")[0];
    store.dispatch(setHost(hostname));
  };

  const isReg = (storeLocal) => {
    const { card, key, code, service } = storeLocal.location.query;
    const payload = {
      card,
      key,
      code,
      service,
    };
    return fetch(`${api}/user/user-check`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(payload),
    })
      .then((response) => response.json())
      .then((json) => {
        if (json.data) {
          browserHistory.push("/signup/pay/success");
        }
      });
  };

  const enterSignup = async (storeLocal) => {
    await defineHost(storeLocal);
    await userGet();
    isReg(storeLocal);
  };
  const siteSettings = () => {
    return fetch(`${api}/data/siteSettings-get`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({}),
    })
      .then((response) => response.json())
      .then((json) => {
        if (json.errorCode === 1) {
          store.dispatch(getSiteSettings(json.data));
        }
      });
  };

  const userGet = () => {
    const token = cookie.load("token");
    if (!token) {
      return;
    }
    return fetch(`${api}/user/user-get`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({
        authToken: token,
        data: {
          season: cookie.load("currentSeason")
            ? cookie.load("currentSeason")
            : 0,
        },
      }),
    })
      .then((response) => response.json())
      .then((json) => {
        let data = json.data[0];
        store.dispatch({
          type: "USER_INFO",
          data,
        });
      });
  };

  //paidState = 0 ничего не куплено
  //paidState = -1 куплен предыдущий сезон
  //paidState = 1 куплен текущий сезон
  //paidState = 4 истек понедельный тариф

  const requirePayAuth = (fromPay) => {
    const token = cookie.load("token");
    const random = Math.random();
    if (token) {
      return fetch(`${api}/user/user-get`, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          authToken: token,
          data: {
            season: cookie.load("currentSeason")
              ? cookie.load("currentSeason")
              : 0,
          },
        }),
      })
        .then((response) => response.json())
        .then((json) => {
          if (json && json.errorCode === 1 && json.data && json.data[0]) {
            store.dispatch({
              type: "USER_INFO",
              data: json.data[0],
            });
            store.dispatch({
              type: "SET_AUTH",
              data: true,
            });
            if (json.data[0].role === 4) {
              store.dispatch({
                type: "SET_SIMPLE_REGS",
                data: true,
              });
              return;
            }
            if (
              json.data[0].emailConfirmed &&
              json.data[0].paidState !== 0 &&
              json.data[0].paidState !== 4
            ) {
              cookie.save("userProgram", json.data[0].program, {
                path: "/",
                maxAge: 60 * 60 * 24 * 365 * 10,
              });
              cookie.save(
                "fullName",
                json.data[0].firstName + " " + json.data[0].lastName,
                { path: "/", maxAge: 60 * 60 * 24 * 365 * 10 }
              );
              cookie.save("email", json.data[0].email, {
                path: "/",
                maxAge: 60 * 60 * 24 * 365 * 10,
              });
              if (json.data[0].paidState === 2) {
                //browserHistory.push('/signup/pay/success')
                browserHistory.push("/");
              } else if (json.data[0].isFirstEdit) {
                //browserHistory.push('/profile')
              } else {
                browserHistory.push("/trainings");

                // browserHistory.push('/task')
              }
            } else {
              //browserHistory.push('/signup/pay')
            }
          } else {
            leave();
          }
        });
    } else if (fromPay) {
      browserHistory.push("/");
    }
  };

  const requirePayNewSeasonAuth = (fromPay) => {
    const token = cookie.load("token");
    if (token) {
      return fetch(`${api}/user/user-get`, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          authToken: token,
          data: {
            season: cookie.load("currentSeason")
              ? cookie.load("currentSeason")
              : 0,
          },
        }),
      })
        .then((response) => response.json())
        .then((json) => {
          if (json && json.errorCode === 1 && json.data && json.data[0]) {
            if (
              json.data[0].paidState !== 0 &&
              json.data[0].program + "" !== "4" &&
              json.data[0].program + "" !== "8" &&
              json.data[0].program + "" !== "12"
            ) {
              cookie.save("userProgram", json.data[0].program, {
                path: "/",
                maxAge: 60 * 60 * 24 * 365 * 10,
              });
              cookie.save(
                "fullName",
                json.data[0].firstName + " " + json.data[0].lastName,
                { path: "/", maxAge: 60 * 60 * 24 * 365 * 10 }
              );

              if (
                json.data[0].paidState === 1 ||
                json.data[0].paidState === -1
              ) {
                browserHistory.push("/season/pay");
              } else if (json.data[0].paidState === 2) {
                browserHistory.push("/signup/pay/success");
              } else if (json.data[0].isFirstEdit) {
                browserHistory.push("/profile");
              } else {
                browserHistory.push("/task"); // browserHistory.push('/signup/pay/success')
              }
            } else if (
              json.data[0].paidState !== 0 &&
              (json.data[0].program === 16 ||
                json.data[0].program === 8 ||
                json.data[0].program === 12)
            ) {
              browserHistory.push("/signup/pay/friend?simple=true");
            } else {
              browserHistory.push("/signup/pay");
            }
          } else {
            leave();
          }
        });
    } else if (fromPay) {
      leave();
    }
  };

  const pushSubscriberSend = () => {
    const token = cookie.load("token"),
      pushId = cookie.load("wingify_push_subscriber_id");

    if (token && pushId) {
      return fetch(`${api}/user/push4site-adduser`, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          authToken: token,
          data: pushId,
        }),
      })
        .then((response) => response.json())
        .then((json) => {});
    }
  };

  const isRegistered = () => {
    const token = cookie.load("token");

    if (token) {
      return fetch(`${api}/user/user-get`, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          authToken: token,
          data: {
            season: cookie.load("currentSeason")
              ? cookie.load("currentSeason")
              : 0,
          },
        }),
      })
        .then((response) => response.json())
        .then((json) => {
          if (json && json.errorCode === 1 && json.data && json.data[0]) {
            store.dispatch({
              type: "SET_AUTH",
              data: true,
            });
            store.dispatch({
              type: "USER_INFO",
              data: json.data[0],
            });
          }
        });
    }
  };

  const requireForTest = (additionalUserChecks) => {
    const token = cookie.load("token");

    pushSubscriberSend();
    defineHost();
    if (token) {
      return fetch(`${api}/user/user-get`, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          authToken: token,
          data: {
            season: cookie.load("currentSeason")
              ? cookie.load("currentSeason")
              : 0,
          },
        }),
      })
        .then((response) => response.json())
        .then(async (json) => {
          if (isAccessDenied(json)) {
            leave();
            return;
          }

          const data = await json.data[0];
          const isRegistered =
            json &&
            json.errorCode === 1 &&
            json.data &&
            data &&
            data.role !== 4;
          if (!isRegistered) {
            browserHistory.push("/");
          } else {
            if (additionalUserChecks) {
              for (let i = 0; i < additionalUserChecks.length; i++) {
                if (!additionalUserChecks[i](data)) {
                  browserHistory.push("/");
                  return;
                }
              }
            }

            if (json.data[0].paidState === 2) {
              browserHistory.push("/signup/pay/success");
            }
            const lang = data.lang || dict.default;
            store.dispatch({
              type: "SET_LANG",
              data: lang,
            });
            store.dispatch({
              type: "SET_AUTH",
              data: true,
            });
            store.dispatch({
              type: "USER_INFO",
              data,
            });
            cookie.save("AA.lang", lang, {
              path: "/",
              maxAge: 60 * 60 * 24 * 365 * 10,
            });
            cookie.save("userPaidState", json.data[0].paidState, {
              path: "/",
              maxAge: 60 * 60 * 24 * 365 * 10,
            });
            cookie.save("userProgram", json.data[0].program, {
              path: "/",
              maxAge: 60 * 60 * 24 * 365 * 10,
            });
            cookie.save(
              "fullName",
              json.data[0].firstName + " " + json.data[0].lastName,
              { path: "/", maxAge: 60 * 60 * 24 * 365 * 10 }
            );
          }
        });
    } else {
      leave();
    }
  };

  const requireForMlm = () => {
    return requireForTest([(user) => user && user.isMlmEnabled]);
  };

  const requireForAdmin = () => {
    return requireForTest([(user) => user && user.role === 2]);
  };

  const requireForPartnerAccess = () => {
    return requireForTest([(user) => user && user.role === 5]);
  };

  const requireProgram = () => {
    defineHost();
    const token = cookie.load("token");
    if (token) {
      return fetch(`${api}/user/user-get`, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          authToken: token,
          data: {
            season: cookie.load("currentSeason")
              ? cookie.load("currentSeason")
              : 0,
          },
        }),
      })
        .then((response) => response.json())
        .then((json) => {
          store.dispatch({
            type: "USER_INFO",
            data: json.data[0],
          });
          const isRegistered =
            json && json.errorCode === 1 && json.data && json.data[0];
          if (
            !isRegistered &&
            json.data[0].program === 16 &&
            (json.data[0].program === 8 || json.data[0].program === 12)
          ) {
            browserHistory.push("/signup/pay/friend?simple=true");
          } else if (isRegistered && json.data[0].paidState === 3) {
            browserHistory.push("/task");
          }
        });
    } else {
      leave();
    }
  };

  const requireEverytime = () => {
    promoWatch();
    defineHost();
    siteSettings();
  };

  const requireMinionAuth = () => getRole(2);
  const requireAdminAuth = () => getRole(1);
  const requireFromPayAuth = () => requirePayAuth(true);
  const requireFromPayNewSeasonAuth = () => requirePayNewSeasonAuth(true);
  const requireFromLoginAuth = () => requirePayAuth(false);

  const isABTest = (storeLocal) => {
    const random = Math.random();
    let host = window.location.hostname.split(".")[0];
    const pathname = storeLocal.location.pathname,
      pathnameArr = pathname.split("/");
    if (storeLocal.location.query.type) {
      store.dispatch({
        type: "CHOOSEN_PACKAGE_TYPE",
        choosenPackageType: storeLocal.location.query.type,
      });
    }
    if (host === "alfa" || host === "tele2fit" || domen.isUnipro) {
      // отмена аб тестов для альфы и других

      return;
    }
    if (pathname.slice(-2) === "/a") return;
    if (
      random < 0.5 &&
      storeLocal.location.query.type !== "4" &&
      pathnameArr[2] !== "tele2"
    ) {
      cookie.save("abtest", "test", { path: "/" });
      browserHistory.push(pathname + "/a");
    } else {
      cookie.remove("abtest", { path: "/" });
    }
    requireFromLoginAuth();
  };

  return (
    <Route path="/" onEnter={requireEverytime}>
      <IndexRoute component={App} onEnter={requireFromLoginAuth} />
      <Route path="task" component={TodayTask} onEnter={requireForTest} />
      <Route path="task/:id" component={TodayTask} onEnter={requireForTest} />
      <Route path="faq" component={FAQ} onEnter={requireForTest} />
      <Route path="food" component={Food} onEnter={requireForTest} />
      <Route path="quiz" onEnter={requireForTest}>
        <IndexRoute component={QuizQuestionList} />
        <Route path=":itemId">
          <IndexRoute component={Quiz} />
          <Route path="history" component={QuizHistory} />
          <Route path="result/:resultId" component={QuizResult} />
        </Route>
      </Route>
      <Route path="mlm" onEnter={requireForMlm}>
        <IndexRoute component={MlmSummary} />
        <Route
          path="decline-mentorship-request/:id"
          component={MlmMentorRequestDeclining}
        />
        <Route path="registration" component={MlmRegistration} />
        <Route path="history" component={MlmHistory} />
        <Route path="structure">
          <IndexRoute component={MlmStructure} />
          <Route path="partner/:id" component={PartnerInfo} />
        </Route>

        <Route path="points-purchase" component={PurchasePoints} />
        <Route path="points-withdrawal" component={WithdrawalPoints} />
      </Route>
      <Route path="shop" component={Shop} onEnter={requireForMlm} />
      <Route
        path="orders-history"
        component={MlmOrdersHistory}
        onEnter={requireForMlm}
      />
      <Route path="photos" component={Photos} onEnter={requireForTest} />
      {/*<Route path="chats" component={ChatPage} onEnter={requireForTest} />*/}
      <Route path="chats" onEnter={requireForTest}>
        <IndexRoute component={ChatPage} />
        <Route path=":id" component={SingleChatPage} />
      </Route>
      <Route path="ratings" component={Rating} onEnter={requireForTest} />
      <Route path="ratings-hide" component={Rating} onEnter={requireForTest} />
      <Route path="trainings" onEnter={requireForTest}>
        <IndexRoute component={Training} />
        <Route path="module/:playlist">
          <IndexRoute component={TrainingPlaylist} />
          <Route path=":exercise" component={TrainingExercise} />
        </Route>
        <Route component={SingleVideo} path="video/:video" />
      </Route>

      <Route path="buy" component={Buy} onEnter={requireForTest} />
      <Route path="purchases" component={Purchases} onEnter={requireForTest} />
      <Route path="seasons" component={Seasons} onEnter={requireForTest} />
      <Route
        path="error-report"
        component={ErrorReport}
        onEnter={requireForTest}
      />
      <Route path="partners" component={Partners} onEnter={requireForTest} />

      <Route path="profile" onEnter={requireForTest}>
        <IndexRoute component={ProfileCreate} />
        {/* <Route path="bank-details" component={BankDetails} /> */}
        <Route path="diploms" component={Diploms} />
      </Route>
      <Route path="social/vk" component={LoginSocial} />
      <Route path="social/fb" component={LoginFB} />
      <Route path="social/ok" component={LoginOk} />
      <Route path="season" component={SeasonSignupParams} />
      <Route path="offer" component={Offer} />
      <Route path="rules" component={Offer} />
      <Route path="description" component={ProfileSignupDesc} />
      <Route
        path="season/pay"
        component={ProfilePay}
        onEnter={requireFromPayNewSeasonAuth}
      />
      <Route path="signup" onEnter={enterSignup}>
        <IndexRoute component={ProfileSignup} onEnter={requireFromLoginAuth} />
        <Route path="params" component={ProfileSignupParams} />
        <Route path="pay" component={SuccessProfile} />
        {/*onEnter={requireProgram}*/}
        <Route path="pay/friend" component={TomorrowFriend} />
        <Route path="pay/success" component={SuccessProfile} />
      </Route>
      {/*<Route path='signup2' onEnter={enterSignup}>
          <IndexRoute component={ProfileSignupHide} onEnter={isABTest} />
          <Route path='params' component={ProfileSignupParams} />
          <Route path='pay' component={SuccessProfile} onEnter={requireProgram} />
          <Route path='pay/friend' component={TomorrowFriend} />
          <Route path='pay/success' component={SuccessProfile} onEnter={requireProgram} />
      </Route>*/}
      <Route
        path="signup/:program"
        component={ProfileSignup}
        onEnter={isABTest}
      />
      <Route
        path="signup/:program/a"
        component={ProfileSignup}
        onEnter={requireFromLoginAuth}
      />
      <Route path="confirme">
        <IndexRoute
          component={ProfileConfirmeEmail}
          onEnter={requireFromLoginAuth}
        />
      </Route>
      <Route path="restore">
        <IndexRoute
          component={ProfilePasswordForget}
          onEnter={requireFromLoginAuth}
        />
        <Route
          path="create"
          component={ProfilePasswordRestore}
          onEnter={requireFromLoginAuth}
        />
      </Route>
      <Route path="partner">
        <IndexRoute component={PartnerLogin} />
        <Route
          path="show"
          component={PartnerDataShow}
          onEnter={requireAdminAuth}
        />
      </Route>
      <Route path="userReports">
        <IndexRoute component={MinionLogin} />
        <Route
          path="chats"
          component={PendingMinionChats}
          onEnter={requireMinionAuth}
        />

        <Route
          path="exams"
          component={PendingMinionEvents}
          onEnter={requireMinionAuth}
        />
        <Route
          path="exams/:userId/:dayId"
          component={PendingMinionEvent}
          onEnter={requireMinionAuth}
        />

        <Route
          path="pendingProfiles"
          component={PendingProfiles}
          onEnter={requireMinionAuth}
        />
        <Route
          path="pendingProfiles/:userId"
          component={PendingProfile}
          onEnter={requireMinionAuth}
        />

        <Route
          path="photos"
          component={PendingPhotos}
          onEnter={requireMinionAuth}
        />
        <Route
          path="photos/:userId/:season"
          component={PendingPhoto}
          onEnter={requireMinionAuth}
        />

        <Route
          path="pendingInsurance"
          component={PendingInsuranceProfiles}
          onEnter={requireMinionAuth}
        />
        <Route
          path="pendingInsurance/:userId/:insuranceId"
          component={PendingInsuranceProfile}
          onEnter={requireMinionAuth}
        />
      </Route>

      <Route
        path="reports"
        component={SalesReports}
        onEnter={requireForPartnerAccess}
      />

      <Route path="calendar" onEnter={requireForTest}>
        <IndexRoute component={Calendar} />
        <Route path="tasks" component={Tasks} />
      </Route>

      <Route path="admin" onEnter={requireForAdmin}>
        <IndexRoute component={AdminLogin} />
        <Route path="profiles">
          <IndexRoute component={NewProfiles} />
          <Route path="applied" component={AppliedProfiles} />
          <Route path="declined" component={DeclinedProfiles} />
          <Route path="blocked" component={BlockedProfiles} />
        </Route>
        <Route path="declinedRequests">
          <IndexRoute component={DeclinedRequests} />
          <Route path=":id" component={RecommenedMentorProfile} />
        </Route>
        <Route path="changeRequests">
          <IndexRoute component={ChangeRequests} />
          <Route path=":id/:userId">
            <IndexRoute component={MentorsList} />
            <Route path=":tutorId" component={NewMentorsPage} />
          </Route>
          {/* <Route path=":id" component={ChangingMentor} /> */}
        </Route>
        <Route path="mentorRequests" component={MentorRequests} />
        <Route path="questions" component={QuestionsPage} />

        <Route path="calendar" onEnter={requireForTest}>
          <IndexRoute component={Calendar} />
          <Route path="tasks" component={Tasks} />
        </Route>

        <Route path="FAQ" component={FAQ} />
        <Route path="reports" component={SalesReports} />
        <Route path="partners" component={SalesPartners} />
      </Route>
      <Route path="smm" onEnter={requireForTest}>
        <IndexRoute component={Smm} />
      </Route>
      <Route path="chose-mentor" onEnter={requireForTest}>
        <IndexRoute component={ChoseMentor} />
        <Route path=":tutorId" component={ChoseMentorProfile} />
      </Route>
      <Route
        path="tutor/:tutorId"
        onEnter={requireForTest}
        component={TutorProfile}
      />
      <Route
        path="change-tutor/:tutorId"
        onEnter={requireForTest}
        component={ChangeTutorPage}
      />

      <Route path="*" component={NotFound} />
    </Route>
  );
};
