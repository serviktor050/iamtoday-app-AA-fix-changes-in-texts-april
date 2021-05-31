import i18nEn from "../i18n/en";
import i18nRu from "../i18n/ru";
import {contractChats, contractChatsEn, contractData, contractDataEn, offer, offerEn} from "../utils/data";

export const dict = {
    ru : {
        ...i18nRu,
        // draft
        offer,
        contractData,
        contractChats
    },
    en : {
        ...i18nEn,
        //draft
        offer: offerEn,
        contractData: contractDataEn,
        contractChats: contractChatsEn
    },
    default: 'ru'
}

window.dict = dict