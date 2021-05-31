import PropTypes from 'prop-types';
import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import * as actions from "../actions";
import LoginPartnerValidationForm from "../components/profile/LoginPartnerValidationForm";
import { browserHistory } from "react-router";
import { SubmissionError } from "redux-form";
import cookie from "react-cookie";
import { api } from "../config.js";

let AdminLogin = (setToken) => {
  const token = cookie.load('token')
  if (token) {
    setTimeout(() => browserHistory.push("/admin/profiles"), 100)
  } else {
    return (
      <LoginPartnerValidationForm
        onSubmit={(data) => {
          return fetch(`${api}/user/authenticate`, {
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            method: "POST",
            body: JSON.stringify(data),
          })
            .then((response) => response.json())
            .then((json) => {
              if (json.data && json.data.authToken && json.data.role === 2) {
                cookie.save("token", json.data.authToken, {
                  path: "/",
                  maxAge: 60 * 60 * 24 * 365 * 10,
                });
                cookie.save("role", json.data.role, {
                  path: "/",
                  maxAge: 60 * 60 * 24 * 365 * 10,
                });
                browserHistory.push("/admin/profiles");
              } else {
                throw new SubmissionError({
                  password: "",
                  _error: "Неправильное имя или пароль!",
                });
              }
            });
        }}
      />
    );
  }
};

const mapDispatchToProps = (dispatch) => ({
  setToken: bindActionCreators(actions.setToken, dispatch),
});

AdminLogin = connect(mapDispatchToProps)(AdminLogin);

export default AdminLogin;
