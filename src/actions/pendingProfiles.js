import cookie from 'react-cookie'
import {api} from '../config.js'
import moment from 'moment'

moment.locale('ru')

export const REQUEST_PENDING_PROFILE = 'REQUEST_PENDING_PROFILE'
export const RECEIVE_PENDING_PROFILE = 'RECEIVE_PENDING_PROFILE'
export const REQUEST_PENDING_PROFILES = 'REQUEST_PENDING_PROFILES'
export const RECEIVE_PENDING_PROFILES = 'RECEIVE_PENDING_PROFILES'

const ITEMS_PER_PAGE = 50

export const requestPendingProfiles = () => ({
  type: REQUEST_PENDING_PROFILES
})

export const receivePendingProfiles = (payload, pageCount) => ({
  type: RECEIVE_PENDING_PROFILES,
  payload,
  pageCount
})

export const fetchPendingProfiles = (page = 1, user, userFilterText) => (dispatch, getState) => {
  dispatch(requestPendingProfiles())

  const {token} = getState().userToken

  return fetch(`${api}/user/user-get-notVerified`, {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    method: 'POST',
    body: JSON.stringify({
      authToken: token ? token : cookie.load('token'),
      data: {
        take: ITEMS_PER_PAGE,
        skip: ITEMS_PER_PAGE * (page - 1),
        user,
        userFilterText
      }
    })
  })
    .then(response => response.json())
    .then(json => {
      const list = (json.data || [])
        .map(item => {
          const date = moment(item.updateTs)
          const link = `/userReports/pendingProfiles/${item.id}`
          const fullName = item.fullName || `${item.firstName} ${item.lastName}`
          const waitingStatus = item.isVerified === false ? ' / Жду ответа' : null

          return {
            ...item,
            link,
            fullName,
            waitingStatus,
            updateTs: date.valueOf(),
            timePassed: date.fromNow()
          }
        })
        .sort((a, b) => a.updateTs > b.updateTs)

      const pageCount = json.data.length > 0 ? Math.ceil(json.itemsCounter / ITEMS_PER_PAGE) : 0

      dispatch(receivePendingProfiles(list, pageCount))
    })
    .catch(console.error)
}

export const requestPendingProfile = () => ({
  type: REQUEST_PENDING_PROFILE
})

export const receivePendingProfile = payload => ({
  type: RECEIVE_PENDING_PROFILE,
  payload
})

const formatProfileFields = (fields) => {
  if (!fields) {
    return null
  }

  // Чтобы отрезать всякий мусор, приходящий от бека
  // TODO: Проследить, чтобы он таки не приходил вообще
  const whiteList = [
    // Main
    'firstName', 'lastName', 'gender', 'birthday', 'photo',
    // Contact
    'phone', 'email',
    // Location
    'country', 'city', 'timezone',
    // Hero program
    'babyBirthday', 'lastBabyFeedMonth',
    // Body params
    'height', 'weight', 'injuries', 'diseases', 'squatsCount', 'squatsVideo'
  ]
  const datesKeysList = ['birthday', 'babyBirthday']

  return whiteList.reduce((filteredFields, key) => {
    const value = fields[key]
    const isDate = ~datesKeysList.indexOf(key)

    filteredFields[key] = isDate ? moment(value).format('YYYY-MM-DD') : value

    return filteredFields
  }, {})
}

export const fetchPendingProfile = (userId) => (dispatch, getState) => {
  dispatch(requestPendingProfile())

  const {token} = getState().userToken

  return fetch(`${api}/user/user-get-infologs`, {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    method: 'POST',
    body: JSON.stringify({
      authToken: token ? token : cookie.load('token'),
      data: {userId}
    })
  })
    .then(response => response.json())
    .then(json => {
      let [current, previous] = json.data

      dispatch(receivePendingProfile({
        current: formatProfileFields(current),
        previous: formatProfileFields(previous)
      }))
    })
    .catch(console.error)
}

const switchProfileVerification = isVerified => userId => (dispatch, getState) => {
  const {token} = getState().userToken

  return fetch(`${api}/user/user-set-verified`, {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    method: 'POST',
    body: JSON.stringify({
      authToken: token ? token : cookie.load('token'),
      data: {userId, isVerified}
    })
  })
    .then(response => response.json())
    .catch(console.error)
}

export const rejectProfile = switchProfileVerification(false)
export const approveProfile = switchProfileVerification(true)
