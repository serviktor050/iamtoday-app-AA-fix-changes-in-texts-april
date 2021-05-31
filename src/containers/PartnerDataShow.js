import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as actions from '../actions'
import PromoCodeReportGrid from '../components/partner/promo/PromoCodeReportGrid'
import CSSModules from 'react-css-modules'
import styles from './partnerDataShow.css'

let PartnerDataShow = ({ profile, showError, setToken }) => {
  return (
    <div className={styles.layoutLogin}>

      <div className={styles.header}>
        <div className={styles.gridHeaderInner}>
          <h1 className={styles.gridCellHeaderLogo}>
            Ясегодня
            <img src="/assets/img/ys_logo.svg" alt="Ясегодня"/>
          </h1>
        </div>
      </div>
      <div>
       Ясегодня.Промокоды
      <br/>
      <br/>
      <PromoCodeReportGrid/>
    </div>
    </div>
  )
}

const mapStateToProps = state => ({ profile: state.profile })

const mapDispatchToProps = dispatch => ({
  showError: bindActionCreators(actions.createProfile, dispatch),
  setToken: bindActionCreators(actions.setToken, dispatch)
})

PartnerDataShow = connect(
  mapStateToProps,
  mapDispatchToProps
)(PartnerDataShow)

export default CSSModules(PartnerDataShow, styles)
