import axios from "axios";
import cookie from 'react-cookie'
import { api as url } from "config";

const token = cookie.load("token");

const instance = (options = {}) => {
  const axiosInstance = axios.create({
    ...options,
    baseURL: `${options.baseURL || url}`,
    headers: {
      Accept: "application/json, text/plain, */*",
      "Content-Type": "application/json",
    },
  });

  return axiosInstance;
};

const api = instance();




const injectItemsCounter = ({ data: { data: innerData, itemsCounter, ...innerRest }, ...rest }) => ({
  data: { ...innerRest, data: { data: innerData, itemsCounter } }, ...rest,
});

export default {
  getMineOrdersHistory(data) {
    return api.post("/mlm/order-get", data).then(injectItemsCounter)
  },
  getTutorFilter(data) {
    return api.post("/mlm/tutor-get-filters", data);
  },
  acceptTutorRequest(data) {
    return api.post("/mlm/userTutorRequest-update", data);
  },
  declineTutorRequest(data) {
    return api.post("/mlm/userTutorRequest-update", data);
  },
  getMentorshipRequests(data) {
    return api.post("/mlm/userTutorRequest-get", data);
  },
  getUserRankList(data, apiData) {
    if (apiData === "teamAdminRankList") {
      apiData = "cityRankList";
    }
    return api.post(`/point/${apiData}`, data);
  },
  getNotificationsList(data) {
    //return api.post("/point/notifications-get", data);
    return api.post("/user/notifications-get", data);
  },
  getPlayListGroups(data) {
    return api.post("/modules/moduleGroups-get", data);
  },
  getExercise(data) {
    return api.post("/video/exerciseDescriptions-get", data);
  },
  getPlaylist(data) {
    return api.post("/modules/modulePlaylist-get", data);
  },
  getSingleVideo(data) {
    return api.post("/modules/lectureDescriptions-get", data);
  },
  getWebinarPlaylist(data) {
    return api.post("/modules/webinarPlaylist-get", data);
  },
  getWebinarVideo(data) {
    return api.post("/modules/webinarDescriptions-get", data);
  },
  getRatingsList(data) {
    return api.post("/point/userRankListAA", data);
  },
  saveNote(data) {
    return api.post(`/modules/userNote-update`, data);
  },
  sendView(data) {
    return api.post("/video/exerciseDescription-view", data);
  },
  sendLike(data) {
    return api.post(`/video/exerciseDescription-like-auth`, data);
  },

  sendUnLike(data) {
    return api.post(`/video/exerciseDescription-unlike-auth`, data);
  },
  sendPayment(payload) {
    const flag = payload.data.flag;
    payload.data = payload.data.data;
    delete payload.data.flag;
    let url;
    switch (flag) {
      case "points":
        url = `/payment/paymentItem-points-start`;
        break;
      case "yandex":
        url = `/payment/paymentItem-yandex-start`;
        break;
      case "stripe":
        url = "/payment/paymentItem-stripe-start";
        break;
    }
    return api.post(url, payload);
  },
  setRemind(data) {
    const url =
      data.data.itemType == 2
        ? "/modules/module-remind"
        : "/modules/videoDescription-remind";
    const payload = {
      ...data,
      data: data.data.payload,
    };
    return api.post(url, payload);
  },
  getCost(payload) {
    // const { itemType, itemId } = payload.data;
    // 	const data = {
    // 		...payload,
    // 		data: {
    // 			itemType,
    // 			itemId
    // 		}
    // 	}
    //console.log(data)
    return api.post(`/payment/paymentItemCost-get`, payload);
  },
  getPurchasesList(data) {
    return api.post(`/payment/paymentItem-get-list`, data);
  },
  getQuizModuleList: (data) => api.post("/modules/moduleGroups-get", data),

  startUserPollComplex: function (data) {
    return api.post("/poll/pollComplex-user-start", data);
  },
  finishUserPollComplex: function (data) {
    return api.post("/poll/pollComplex-user-finish", data);
  },
  createUserPollComplexPollField: function (data) {
    return api.post("/poll/pollComplexPollFieldUser-create", data);
  },
  getPollComplexResults: function (data) {
    return api.post("/poll/pollComplex-results", data);
  },
  getQuizResults: function (data, quiz) {
    return api.post("/poll/pollComplex-results", data).then((result) => {
      return {
        ...result,
        data: {
          ...result.data,
          data: { data: { ...result.data.data, ...quiz } },
        },
      };
    });
  },
  getMlmChildUser: function (data) {
    return api.post("/mlm/child-user-get", data).then((result) => {
      return result;
    });
  },

  getMlmStructure: function (data) {
    return api.post("/mlm/child-structure-get", data).then((result) => {
      return result;
    });
  },

  getMlmUserPoints: function (data) {
    return api.post("/mlm/user-points-get", data).then((result) => {
      return result;
    });
  },

  getMlmStatistic: function (data) {
    return api
      .post("/mlm/child-structure-get-withstat", data)
      .then((result) => {
        return result;
      });
  },

  createPersonalItemCost: function (data) {
    return api
      .post("/payment/paymentItemCostPersonal-create", data)
      .then((result) => {
        return result;
      });
  },

  createWithdrawRequest: function (data) {
    return api
      .post("/mlm/userPointWithdrawRequest-create", data)
      .then((result) => {
        return result;
      });
  },

  getUserTutorRequest: function (data) {
    return api.post("/mlm/userTutorRequest-get", data).then((result) => {
      return result;
    });
  },

  getUserOutcommingRequest: function (data) {
    return api.post('/mlm/userTutorRequestOutcoming-get', data).then(result => result)
  },
  getTutorInfo: function (data) {
    return api.post("mlm/tutor-get", data).then((result) => {
      return result;
    });
  },
  getUserInfo: function (data) {
    return api.post('user/user-getByIdAdmin', data).then((result) => {
      return result
    })
  },
  chooseNewTutor: function (data) {
    return api.post('mlm/userTutorRequest-create', data).then((result) => {
      return result
    })
  },
  deleteRequest: function (data) {
    return api.post('mlm/userTutorRequest-delete', data).then((result) => {
      return result
    })
  },
  calendarGetTasks: function (data) {
    return api.post('calendar/calendarTask-get', data).then(result => result)
  },
  calendarGetTaskById: function (data) {
    return api.post('calendar/calendarTask-getById', data).then(result => result)
  },
  calendarCreateTask: function (data) {
    return api.post('calendar/calendarTask-create', data).then(result => result)
  },
  calendarUpdateTask: function (data) {
    return api.post('calendar/calendarTask-update', data).then(result => result)
  },
  calendarDeleteTask: function (data) {
    return api.post('calendar/calendarTask-delete', data).then(result => result)
  },
  getUserSuggestions: function (data) {
    return api.post('user/getUserSuggestions', data).then(result => result)
  },
  setVideoRating: function (data) {
    return api.post('video/exerciseDescription-setRating', data).then(result => result)
  },
  setPlaylistRating: function (data) {
    return api.post('video/exercisePlaylist-setRating', data).then(result => result)
  },
  sendNewQuestion: function (data) {
    return api.post('user/chatmessage-create', data).then(result => result)
  },
  getQuestionsAdmin: function (data) {
    return api.post('modules/modulePlaylistChats-get', data).then(result => result)
  },
  sendAnswer: function (data) {
    return api.post('user/chatmessage-create', data).then(result => result)
  },
  changeAnswer: function (data) {
    return api.post('user/comment-update', data).then(result => result)
  },
  deleteAnswer: function (data) {
    return api.post('user/comment-delete', data).then(result => result)
  },
  getComments: function (data) {
    return api.post('user/comment-get-info', data).then(result => result)
  },
  getProfiles: function (data) {
    return api.post('user/user-get-notVerified', data).then(result => result)
  },
  setUserVerified: function (data) {
    return api.post('user/user-set-verified', data).then(result => result)
  },
  /* TEMPORARY FOR EVENT IN FEBRUARY 2021 */
  userCreateWebinar: function (data) {
    return api.post('/mlm/user-create-webinar', data).then((result) => {
      return result;
    });
  },
  getTutorsList: function (data) {
    return (
      api
        .post("/mlm/tutor-get", data)
        .then(
          ({
            data: { data: innerData, itemsCounter, ...innerRest },
            ...rest
          }) => ({
            data: { ...innerRest, data: { users: innerData, itemsCounter } },
            ...rest,
          })
        )
    );
  },
  recommendTutorToStudent: function (data) {
    return api.post("/mlm/userTutorRequest-create", data).then((result) => {
      return result;
    });
  },
  userTutorRequestUpdate: function (data) {
    return api.post("/mlm/userTutorRequest-update", data).then((result) => {
      return result;
    });
  },
  sendEmail: function (data) {
    return api.post('mlm/send-email', data).then((result) => {
      return result
    })
  },
  /* END OF TEMPORARY */
  getUserDiploms: function (data) {
    return api.post('/mlm/diplomaUser-get', data).then(result => result)
  },
  activateModule: function (data) {
    return api.post('/modules/module-activate', data).then(result => result)
  },
};

/*export const getMlmStatistic = (data) => {
  return api.post("/mlm/child-structure-get-withstat", data).then((result) => {
    return result;
  });
}*/

export const getAdminSalesReport = (data) => {
  return api.post("/payment/paymentItemReport-get", { authToken: token, data: { ...data } }).then((result) => {
    return result;
  });
};

export const getAdminSalesReportExcel = (data) => {
return api.get("/payment/paymentItemReport-get-excel", { params:{ ...data} }).then((result) => {
    return result;
  })
}

export const getAdminSalesPartners = (data) => {
  return api.post("/payment/paymentItemPartnersList", data).then((result) => {
    return result;
  });
};

export const getAdminSalesPartnersAccess = (data) => {
  return api
    .post("/payment/paymentItemPartnerAccess-get", data)
    .then((result) => {
      return result;
    });
};

export const updateAdminSalesPartnersAccess = (data) => {
  return api
    .post("/payment/paymentItemPartnerAccess-update", data)
    .then((result) => {
      return result;
    });
};

export const addPartnerNote = (data) => {
  return api.post("/mlm/userNote-create", data).then((result) => {
    return result;
  });
};
export const getPartnerNotes = (data) => {};

export const getChatList = (data) => {
  return api.post("/user/userChatGroups-get", data).then((result) => {
    return result;
  });
};
//glossary

export const getGlossaryByLetter = (data) => {
  return api.post("/data/glossary-getByLetter", { authToken: token, data: { ...data } }).then((result) => {
    return result;
  });
}

export const getGlossaryById = (data) => {
  return api.post("/data/glossary-getById", { authToken: token, data: { ...data } }).then((result) => {
    return result;
  })
}

export const glossarySearch = (data) => {
  return api.post("/data/glossary-search", { authToken: token, data: { ...data } }).then((result) => {
    return result;
  });
}

//new FAG

export const createFaqCategory = (data) => {
  return api.post("/richFaq/richFaqCategory-create", { authToken: token, data: { ...data } }).then((result) => {
    return result;
  })
}

export const getFaqCategory = (data) => {
  return api.post("/richFaq/richFaqCategory-get", { authToken: token, data: { ...data } }).then((result) => {
    return result;
  })
}

export const deleteFaqCategory = (data) => {
  return api.post("/richFaq/richFaqCategory-delete", { authToken: token, data: { ...data } }).then((result) => {
    return result;
  })
}

export const updateFaqCategory = (data) => {
  return api.post("/richFaq/richFaqCategory-update", { authToken: token, data: { ...data } }).then((result) => {
    return result;
  })
}

export const getFaqQuestions = (data) => {
  return api.post("/richFaq/richFaqQuestion-get", { authToken: token, data: { ...data } }).then((result) => {
    return result;
  })
}

export const createFaqQuestion = (data) => {
  return api.post("/richFaq/richFaqQuestion-create", { authToken: token, data: { ...data } }).then((result) => {
    return result;
  })
}

export const getFaqPopularTags = () => {
  return api.post("/richFaq/richFaqTag-getPopular", { authToken: token }).then((result) => {
    return result;
  })
}

export const getChatComments = (data) => {
  return api.post("/user/comment-get-info", data).then((result) => {
    return result;
  });
};

export const getChatMembersSuggestions = (data) => {
  return api.post("/user/getUserSuggestions", data).then((result) => {
    return result;
  });
};

export const createNewChat = (data) => {
  return api.post("/user/chatmessage-create", data).then((result) => {
    return result;
  });
};
export const updateChat = (data) => {
  return api.post("/user/chatGroup-update", data).then((result) => {
    return result;
  });
};
export const getChatInfo = (data) => {
  return api.post("/user/chatGroup-get-info", data).then((result) => {
    return result;
  });
};

export const postPinChat = (data) => {
  return api.post("/user/chatGroup-pin", data).then((result) => {
    return result;
  });
};

export const postUnpinChat = (data) => {
  return api.post("/user/chatGroup-unpin", data).then((result) => {
    return result;
  });
};
export const deleteUser = (data) => {
  return api.post("/user/chat-deluser", data).then((result) => {
    return result;
  });
};
export const addUser = (data) => {
  return api.post("/user/chat-adduser", data).then((result) => {
    return result;
  });
};

//метод для загрузки левых картинок
export const photoFileUpload = (file) => {
  return api.post("/data/file-upload", {authtoken: token, data: {...file}})
            .then(result =>  result.data)
            .catch(error=> console.log(error))
}