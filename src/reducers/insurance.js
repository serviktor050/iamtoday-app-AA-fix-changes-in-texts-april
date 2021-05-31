const insuranceDoc = (state, action) => {
  switch (action.type) {
    case 'ADD_INSURANCE_DOC':
      return {
        name: action.name,
        uid: action.uid
      }
    case 'REMOVE_INSURANCE_DOC':
      return action.doc.uid
    default:
      return state
  }
}

export const insuranceDocs = (state = [], action) => {
  switch (action.type) {
    case 'ADD_INSURANCE_DOC':
      return [
        ...state,
        insuranceDoc(undefined, action)
      ]
    case 'REMOVE_INSURANCE_DOC':
      return state.filter(doc => doc.uid !== insuranceDoc(undefined, action))
    case 'SAVE_INSURANCE_DOCS':
      return action.docs
    default:
      return state
  }
}

export const insurance = (state = {showForm: false, checkIns: false}, action) => {
  switch (action.type) {
    case 'TOOGLE_FORM':
      return {
        ...state,
        showForm: action.data
      }
    case 'SET_CHECK_INS':
      return {
        ...state,
        checkIns: action.data
      }
    default:
      return state
  }
}