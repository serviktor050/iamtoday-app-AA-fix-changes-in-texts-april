import cookie from 'react-cookie'

const PROMO_COOKIE_NAME = 'promo'

let promoTokenStorage = new (function() {
  this.setPromoToken = (promoToken) => {
    var promoTokenArray = promoToken ? promoToken.split(';') : []
    this.promoToken = promoToken
    this.promoSessionId = promoTokenArray.length === 2 ? promoTokenArray[0] : null
    this.promoTokenSignature = promoTokenArray.length === 2 ? promoTokenArray[0] : null
  }

  this.getPromoToken = () => {
    return this.promoToken
  }
  this.getPromoSessionId = () => {
    return this.promoSessionId
  }
  this.getPromoTokenSignature = () => {
    return this.promoTokenSignature
  }
})()

export const promoWatch = props => {
  var promoToken = cookie.load(PROMO_COOKIE_NAME)
  // TODO удалить лог перед продакшеном
  //console.info('[PromoWatch] watch()=> ' +
    //' watch promo code of url: ' + document.URL +
    //', referrer ' + document.referrer +
    //', promoToken ' + promoToken)

  if (promoToken) {
    promoTokenStorage.setPromoToken(promoToken)
  }
}

export const promoVisit = ((storage) => {
  return {
    getPromoToken: () => {
      return storage.getPromoToken()
    },
    getPromoSessionId: () => {
      return storage.getPromoSessionId()
    },
    getPromoTokenSignature: () => {
      return storage.getPromoTokenSignature()
    }
  }
})(promoTokenStorage)
