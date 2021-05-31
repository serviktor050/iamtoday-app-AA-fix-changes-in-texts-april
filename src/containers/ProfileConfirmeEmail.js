import React, { Component } from 'react';
import { connect } from 'react-redux';
import { api, domen } from '../config.js';
import CSSModules from 'react-css-modules';
import styles from './profileConfirmeEmail.css';
import LogoLink from '../components/componentKit/LogoLink';
import { dict } from 'dict';
import cookie from 'react-cookie';
import {browserHistory} from 'react-router';

let contentStyle = {
  borderRadius: '18px',
  padding: '30px'
}

const defaultBg = <img className={styles.alfaBg} src="/assets/img/antiage/bg.jpg" alt=""/>

class ProfileConfirmeEmail extends Component {
  componentWillMount() {
    if (window.mobilecheck()) {
      contentStyle.width = '300px'
    }

    const token = this.props.location.query.token
    if(token){
      this.setState({
        loading:true
      })
    }
  }

  state = {
    resultText:'',
    loading: false
  }

  componentDidMount(){
    const token = this.props.location.query.token;

    if(token){
      const payload = {
        token
      }
      return fetch(`${api}/user/user-confirmEmail`, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify(payload)
      })
        .then(response => response.json())
        .then(json => {
          if (json.data) {
            if (json.data.resultCode === 1) {
              setTimeout(() => browserHistory.push('/trainings'), 2000);
            } else {
              setTimeout(() => browserHistory.push('/'), 2000);
            }
          } else {
            setTimeout(() => browserHistory.push('/'), 2000);
          }
        })
    }
  }

  render() {
    const lang = cookie.load('AA.lang') || dict.default;
    const  isAlfa = domen.isAlfa
    const isUnipro = domen.isUnipro
    let bg = defaultBg

    return (
      <div>
        <div className={styles.layoutEntry}>
          <div className={styles.gridEntryHeader}>
            <div className={styles.gridCellTodaymeLogo}>
              <LogoLink isUnipro={isUnipro} isAlfa={isAlfa}/>
            </div>
          </div>

          <div className={styles.entryMin}>
            <div className={styles.entryInner}>
              <div className={styles.entryHeader}>
                <h2 className={isAlfa ? styles.entryTitleCenterAlfa : styles.entryTitleCenter}>{dict[lang]['regs.confirmeEmail']}</h2>
              </div>
            </div>
          </div>

          <div className={styles.entryBg}>
            {bg}
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  lang: state.lang
});

ProfileConfirmeEmail = connect(
  mapStateToProps,
)(ProfileConfirmeEmail);

export default CSSModules(ProfileConfirmeEmail, styles);
