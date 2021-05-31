export * from './taskDay'
export * from './signupPayment'
export * from './signup'
export * from './profile'
export * from './days'
export * from './food'
export * from './chats'
export * from './pendingPhotos'
export * from './pendingEvents'
export * from './pendingProfiles'
export * from './pendingInsuranceProfiles'
export * from './programs'
export * from './photos'
export * from './photosIntro'
export * from './reports'
export * from './promo'
export * from './faq'
export * from './partners'
export * from './smm'
export const CREATE_PROFILE = 'CREATE_PROFILE'
export const SET_TOKEN = 'SET_TOKEN'
export const SIGNUP = 'SIGNUP'
export const SET_ROLE = 'SET_ROLE'
export const SET_SITE_SETTINGS = 'SET_SITE_SETTINGS'

export const createProfile = text => ({
  type: CREATE_PROFILE,
  text
})

// export const togleMenuMobLeft = visible => ({
//   type: CREATE_PROFILE,
//   text
// })

export const signup = (program, amount, packageType, promo, emailFriend, share, phoneFriend, nameFriend) => {
  return ({
    type: SIGNUP,
    program,
    promo,
    amount,
    packageType,
    emailFriend,
    phoneFriend,
    nameFriend,
    share
  })
}

export const setToken = token => ({
  type: SET_TOKEN,
  token
})

export const setRole = role => ({
  type: SET_ROLE,
  role
})

export const getSiteSettings = data => ({
  type: SET_SITE_SETTINGS,
  data
})
