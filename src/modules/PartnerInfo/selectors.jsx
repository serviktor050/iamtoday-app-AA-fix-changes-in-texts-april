import * as R from "ramda";

export const userInfo = (state) => {
  return R.path(["userInfo"], state);
};

export const selectPartnerInfo = (state) => {
  return R.path(["partnerInfo", "partnerInfo"], state);
};

export const selectMlmStatistic = (state) => {
  return R.path(["partnerInfo", "mlmStatistic"], state);
};
export const selectMlmHistoryFilter = (state) => {
  return R.path(["mlm", "mlmHistoryFilter"], state);
};

export const selectMlmPartnerFilter = (state) => {
  return R.path(["mlm", "mlmPartnerFilter"], state);
};
