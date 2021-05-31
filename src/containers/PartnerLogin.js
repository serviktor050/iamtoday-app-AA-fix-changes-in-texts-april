import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as actions from '../actions'
import LoginPartnerValidationForm from '../components/profile/LoginPartnerValidationForm'
import { browserHistory } from 'react-router'
import { SubmissionError } from 'redux-form'
import cookie from 'react-cookie'
import { api } from '../config.js'

let PartnerLogin = ({ setToken, setRole }) => {
  return (
    <LoginPartnerValidationForm onSubmit={ data => {
      return fetch(`${api}/user/authenticate`, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify(data)
      })
      .then(response => response.json())
      .then(json => {
        if (json.data && json.data.authToken && json.data.role === 1) {
          cookie.save('token', json.data.authToken, { path: '/', maxAge: 60 * 60 * 24 * 365 * 10 })
          cookie.save('role', json.data.role, { path: '/', maxAge: 60 * 60 * 24 * 365 * 10 })
          setToken(json.data.authToken)
          setRole(json.data.role)
          browserHistory.push('/partner/show')
        } else {
          throw new SubmissionError({
            password: '',
            _error: 'Неправильное имя или пароль!'
          })
        }
      })
    }}/>
  )
}

const mapStateToProps = state => ({ token: state.userToken })

const mapDispatchToProps = dispatch => ({
  setToken: bindActionCreators(actions.setToken, dispatch),
  setRole: bindActionCreators(actions.setRole, dispatch)
})

PartnerLogin = connect(
  mapStateToProps,
  mapDispatchToProps
)(PartnerLogin)

export default PartnerLogin
