import React, {Component} from 'react';
import cookie from 'react-cookie';
import classNames from 'classnames/bind';

import {SubmissionError} from 'redux-form';
import Modal from 'boron-react-modal/FadeModal';

import {api, host} from '../../../../config';
import {dict} from 'dict';

import style from './style.css';

const cx = classNames.bind(style);

export class EmailConfirmation extends Component {
  state = {
    failMessage: '',
  };

  _onEmailConfirm(data) {
    const lang = cookie.load('AA.lang') || dict.default;
    this.refs.loadingModal.show();
    data.url = `${host}/confirme`;

    return fetch(`${api}/user/user-sendconfirmEmail`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify(data),
    })
      .then(response => response.json())
      .then(json => {
        this.refs.loadingModal.hide();
        if (json.data) {
          if (json.data.resultCode === 1) {
            this.refs.successModal.show();
          } else {
            this.setState({
              failMessage: json.data.resultText,
            });
            this.refs.failModal.show();
          }
        } else {
          throw new SubmissionError({
            password: '',
            _error: dict[lang]['regs.smthWrong'],
          });
        }
      });
  }

  render() {
    const {email, onCloseEmailConfirm} = this.props;
    const lang = cookie.load('AA.lang') || dict.default;

    const contentStyle = {
      borderRadius: '18px',
      padding: '30px',
    };

    return (
      <div className={cx('email-confirmation')}>
        <div className={cx('email-confirmation__container')}>
          <p className={cx('email-confirmation__title')}>{dict[lang]['confirm.email.title']}</p>
          <p className={cx('email-confirmation__text')}>
            {dict[lang]['confirm.email.text']} <span className={cx('email-confirmation__email')}>{email}</span>
          </p>
          <button onClick={() => this._onEmailConfirm({email})}
            className={`${cx('email-confirmation__button')} ${cx('email-confirmation__confirm')}`}
            type="button">
            {dict[lang]['confirm.email.repeat.letter']}
          </button>
          <button onClick={() => onCloseEmailConfirm()} type="button"
            className={`${cx('email-confirmation__button')} ${cx('email-confirmation__close')}`}
            aria-label="Close notification" />

          <Modal ref="successModal" contentStyle={contentStyle}>
            <h2>{dict[lang]['regs.letterSend']}</h2>
            <div className={style.btnPrimary} onClick={() => {
              this.refs.successModal.hide();
            }}>
              {dict[lang]['regs.continue']}
            </div>
          </Modal>

          <Modal ref="failModal" contentStyle={contentStyle}>
            <h2>{this.state.failMessage}</h2>
            <div className={style.btnPrimary} onClick={() => {
              this.refs.failModal.hide();
            }}>
              {dict[lang]['regs.continue']}
            </div>
          </Modal>

          <Modal ref="loadingModal" contentStyle={contentStyle}>
            <div className={style.entryHeader}>
              <h2 className={style.entryTitleCenter}>{dict[lang]['regs.loading']}</h2>
            </div>
            <div className={style.textCenter}>
              <div className={style.loaderMain} />
            </div>
          </Modal>
        </div>
      </div>
    );
  }
}
