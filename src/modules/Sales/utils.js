import {dict} from "../../dict";
import moment from "moment";
import {pluralize} from "../../utils/helpers";

export const pluralizeScores = (scores, lang) => {
    const i18n = dict[lang];
    scores = scores || 0;
    return `${scores} ${pluralize(scores, [i18n['scores.text.1'], i18n['scores.text.2'], i18n['scores.text.3']])}`
}

export const dateFormatter = (date, lang)=>{
    const i18n = dict[lang];
    return moment(date).format(i18n['date.format.dayWithMonth'])
}

export const hiddenOverflow = () => {
    if (document
        && document.body && document.body.style
        && document.body.style.overflow !== 'hidden') {
        document.body.style.overflow = 'hidden';
    }
}

export const  unsetOverflow = (isOpen) => {
    if (isOpen && document
        && document.body
        && document.body.style
        && document.body.style.overflow === 'hidden') {
        document.body.style.overflow = 'unset';
    }
}

export const GETEXCELURL = "https://dev.todayme.ru/api/payment/paymentItemReport-get-excel?"

export const createLinkWithFilters = (filter1, filter2) => {
        
    const modifyFilterObject = (object) => Object.keys(object).map(key=> `${key}=${object[key]}`);
    const filters = modifyFilterObject(filter1).concat(modifyFilterObject(filter2)).join('&')    
    return `${GETEXCELURL}${filters}`
  }