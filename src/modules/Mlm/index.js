import MlmSummary from "./MlmSummary/MlmSummary";
import MlmHistory from "./MlmHistory/MlmHistory";
import MlmStructure from "./MlmStructure/MlmStructure";
import MlmRegistration from "./MlmRegistration/MlmRegistration";
import PurchasePoints from "./MlmPoints/PurchasePoints";
import { reducer, moduleName } from "./ducks";
import WithdrawalPoints from "./MlmPoints/WithdrawalPoints";
// import MlmPartnerInfo from "./MlmPartnerInfo/MlmPartnerInfo";
import { MlmOrdersHistory } from "./MlmOrdersHistory/MlmOrdersHistory"
import MlmMentorRequestDeclining from "./MlmMentorRequestDeclining/MlmMentorRequestDeclining";
import ChangeTutorPage from './MlmSummary/ChangeTutorPage'

export {
  MlmOrdersHistory,
  MlmMentorRequestDeclining,
  MlmStructure,
  MlmSummary,
  MlmHistory,
  MlmRegistration,
  PurchasePoints,
  WithdrawalPoints,
  ChangeTutorPage,
  moduleName,
  reducer,
};
