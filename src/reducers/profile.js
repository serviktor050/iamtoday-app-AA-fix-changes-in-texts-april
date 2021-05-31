import {
  SELECT_PROFILE, INVALIDATE_PROFILE,
  REQUEST_PROFILE, RECEIVE_PROFILE
} from '../actions'
import { programsData } from '../utils/data'
import moment from 'moment'
import emoji from 'react-easy-emoji'

const testerInfoList = [
  'Ты выбрал тариф “Тестер”',
  emoji('ТЫ УЧАСТВУЕШЬ В НАШЕМ МАРАФОНЕ БЕСПЛАТНО!😱'),
  emoji('Ты не претендуешь на финальные призы! Ты УЖЕ герой!😄'),
  emoji('Ты должен быть максимально активен в социальных сетях. Вступить в наши группы. Регулярно лайкать наши новости и делать репосты!😊'),
  'Выкладывать посты с фото и видео в свои аккаунты в соц.сетях о ходе тренировок с небольшими комментариями!',
  emoji('Как видишь, все предельно просто 😉'),
]

export const choosenTomorrowType = (state = 1, action) => {
  switch (action.type) {
    case 'CHOOSEN_TOMORROW_TYPE':
      return action.choosenTomorrowType
    default:
      return state
  }
}

export const choosenProgram = (state = programsData.hero, action) => {
  switch (action.type) {
    case 'CHOOSEN_PROGRAM':
      return action.choosenProgram
    default:
      return state
  }
}
export const choosenPackageType = (state = 1, action) => {
  switch (action.type) {
    case 'CHOOSEN_PACKAGE_TYPE':
      return action.choosenPackageType
    default:
      return state
  }
}

export const choosenPromo = (state = '', action) => {
  switch (action.type) {
    case 'CHOOSEN_PROMO':
      return action.choosenPromo
    default:
      return state
  }
}

export const choosenAmount = (state = {price:2000, oldPrice:''}, action) => {
  switch (action.type) {
    case 'CHOOSEN_AMOUNT':
      return {
        price: action.price,
        oldPrice: action.oldPrice
      }
    default:
      return state
  }
}

const bodyParam = (state, action) => {
  switch (action.type) {
    case 'ADD_BODY_PARAM':
      return {
        date: action.date,
        height: action.height,
        weight: action.weight,
        chest: action.chest,
        waist: action.waist,
        hips: action.hips,
        thigh: action.thigh
      }
    case 'REMOVE_BODY_PARAM':
      return action.id
    default:
      return state
  }
}

export const bodyParams = (state = [], action) => {
  switch (action.type) {
    case 'ADD_BODY_PARAM':
      return [
        ...state,
        bodyParam(undefined, action)
      ]
    case 'REMOVE_BODY_PARAM':
      return state.filter(param => param.id !== bodyParam(undefined, action))
    case 'SAVE_BODY_PARAMS':
      return action.bodyMeasures;

    default:
      return state
  }
}

export const testerInfoBlocks = (state = testerInfoList, action) => {
  switch (action.type) {
    case 'SET_TESTER_INFO_LIST':
      return action.testerInfoList
    case 'REMOVE_TESTER_INFO_ITEM':
      return state.filter(function(item, i) {
      	return i !== action.index
      })
    default:
      return state
  }
}

const stateABTest = {
  isTest:false,
  isTele2: false,
  showInfoBlock:true,
  tele2InfoList: [
  { id: 1,
    value: 'Промокод от Tele2 можно получить:'
  },
  { id: 2,
    value:'Салоны Tele2'
  },
  { id: 3,
    value:'Приложение «СВОИ»',
    link:'https://svoi.tele2.ru'
  },
  { id: 4,
    value:'По телефону 611'
  }
]
}


export const abtest = (state = stateABTest, action) => {
  switch (action.type) {
    case 'SETABTEST':
      return {
        ...state,
        isTest: true
      }

    case 'REMOVE_TELE2_INFO_ITEM':
      const items = state.tele2InfoList.filter((item, i) => {
          return item.id !== action.index
        })
      return {
        ...state,
        tele2InfoList: items
      }

    case 'SIGN_UP_TELE2':
        return {
          ...state,
          isTele2: true
        }

    case 'SHOW_INFO_BLOCK':
      return {
        ...state,
        showInfoBlock: action.showInfoBlock
      }

    case 'REMOVEABTEST':
      return {
        ...state,
        isTest: false
      }
    default:
      return state
  }

}

export function profile(state = {}, action) {
  switch (action.type) {
    case 'SIGNUP':
      return {
        program: action.program,
        promo: action.promo,
        amount: action.amount,
        packageType: action.packageType,
        emailFriend: action.emailFriend,
        phoneFriend: action.phoneFriend,
        nameFriend: action.nameFriend,
        share: action.share
      }
    default:
      return state
  }
}

export const birthday = (state = '', action) => {
  switch (action.type) {
    case 'BIRTHDAY':
      return action.birthday
    default:
      return state
  }
}

/*export const babyBirthday = (state = moment().format('YYYY-MM-DD'), action) => {
  switch (action.type) {
    case 'BABY_BIRTHDAY':
      return action.babyBirthday
    default:
      return state
  }
}*/

export const babyFeed = (state = moment().format('YYYY-MM-DD'), action) => {
  switch (action.type) {
    case 'BABY_FEED':
      return action.babyFeed
    default:
      return state
  }
}

export const isReadyToTasks = (state = false, action) => {
  switch (action.type) {
    case 'IS_READY_TO_TASKS':
      return action.isReadyToTasks
    default:
      return state
  }
}

export const isBabyFeeding = (state = false, action) => {
  switch (action.type) {
    case 'IS_BABY_FEEDING':
      return action.isBabyFeeding
    default:
      return state
  }
}

export const injuriesHidden = (state = false, action) => {
  switch (action.type) {
    case 'INJURIES_HIDDEN':
      return action.injuriesHidden
    default:
      return state
  }
}

export const sportsPast = (state = false, action) => {
  switch (action.type) {
    case 'SPORTS_PAST':
      return action.sportsPast
    default:
      return state
  }
}
const stateInjuries = {
  injuryItems: {
    neck: false,
    back: false,
    knees: false,
    hands: false
  },
  babyCount: 'two',
  lastBabyFeedMonth:'',
  babyBirthday:'',
  birthday:'',
  diseases:'',
  didSports:false,
  injuriesExist:false,


}
export const profileFields = (state = stateInjuries, action) => {
  switch (action.type) {

    case 'IS_INJURIES':
      return {
        ...state,
        injuriesExist:action.injuriesExist
      }
    case 'IS_SPORTS':
      return {
        ...state,
        didSports:action.didSports
      }
    case 'DISEASES_SET':
      return {
        ...state,
        diseases:action.diseases
      }
    case 'INJURIES_GET':
      return {
        ...state,
        injuryItems:action.items
      }
    case 'BABY_BIRTHDAY':
      return {
        ...state,
        babyBirthday:action.babyBirthday
      }
    case 'BIRTHDAY':
      return {
        ...state,
        birthday:action.birthday
      }
    case 'LAST_BABY_FEED':
      return {
        ...state,
        lastBabyFeedMonth:action.lastBabyFeedMonth
      }
    case 'CHILDS_SET':
      return{
        ...state,
        babyCount:action.value
      }
    default:
      return state
  }
}

export const selectedProfile = (state = 'reactjs', action) => {
  switch (action.type) {
    case SELECT_PROFILE:
      return action.profileData
    default:
      return state
  }
}

const profileData = (state = {
  isFetching: false,
  didInvalidate: false,
  profileData: {}
}, action) => {
  switch (action.type) {
    case INVALIDATE_PROFILE:
      return {
        ...state,
        didInvalidate: true
      }
    case REQUEST_PROFILE:
      return {
        ...state,
        isFetching: true,
        didInvalidate: false
      }
    case RECEIVE_PROFILE:
      return {
        ...state,
        isFetching: false,
        didInvalidate: false,
        profileData: action.json.data[0],
        insurance: action.json.data[0].insurance,
        bodyParams: action.json.data[0].bodyMeasures,
        lastUpdated: action.receivedAt
      }
    case 'DELETE_PROFILE_DATA':
      return {
        isFetching: false,
        didInvalidate: false,
        profileData: undefined,
        insurance: undefined,
        bodyParams: undefined
      }
    default:
      return state
  }
}

export const recivedProfile = (state = {}, action) => {
  switch (action.type) {
    case INVALIDATE_PROFILE:
    case RECEIVE_PROFILE:
    case REQUEST_PROFILE:
      return {
        ...state,
        [action.profileData]: profileData(state[action.profileData], action)
      }
    default:
      return state
  }
}
export const userInfo = (state = {data:{}}, action) => {
  switch (action.type) {
    case 'USER_INFO':
      return {
        data:action.data
      }
      case 'SET_PHOTO':
        return {
          data:{
            ...state.data,
            photo: action.data,
          }
        }
    default:
      return state
  }
}

const st = {
  error: '',
  errorYou: ''
}
export const errorsValidate = (state = st, action) => {
  switch (action.type) {
    case 'RADIO_ERROR_YOU':
      return {
        ...state,
        errorYou: action.errorYou
      }
    case 'RADIO_ERROR_REMOVE_YOU':
      return {
        ...state,
        errorYou:''
      }
    case 'RADIO_ERROR':
      return {
        ...state,
        error: action.error,
        //name: action.name,
      }
    case 'RADIO_ERROR_REMOVE':
      return {
        ...state,
        error:''
      }
    default:
      return state
  }
}

