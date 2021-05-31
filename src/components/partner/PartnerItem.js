import React, { Component } from 'react'
import { connect } from 'react-redux'
import * as actions from '../../actions'
import { bindActionCreators } from 'redux'
import CSSModules from 'react-css-modules'
import styles from './partnerItem.css'
import Layout from '../componentKit2/Layout'
import { Link } from 'react-router'
import Loader from '../../components/componentKit/Loader'

class PartnerItem extends Component {
  componentWillMount(){
    if(this.props.partners.data.length){
      return;
    }
    this.props.fetchPartners()
  }

  render(){
    const {partners, params} = this.props
    const name = params.name
    let partner
    partners.data.partnerAdvs.forEach( item => {
      if(name === item.link){
        partner = item
      }
    })

    return(
      <Layout page={'parners'}>
        {!partners.isLoad
          ? (partners.isFetching
            ? <Loader/>
            : <div><p>Если вы видите это окно, значит возникла ошибка! Напишите нам на почту av@todayme.ru и опишите сложившуюся ситуацию.</p></div>)
          :
        <div>
          <ul className={styles.bc}>
            <li className={styles.bcItem}>
              <Link className={styles.bcItemLink} to={`/partners`}>
                Партнёры
              </Link>
            </li>
            <li className={styles.bcItemActive}>{partner.name}</li>
          </ul>
          <div className={styles.stageBoxSmallPadding}>
            <div className={styles.stageBoxInner}>
              <div className={styles.partnerLogo}>
                <img src={partner.contentTitleImage} alt="" className={styles.partnerLogoImg}/>
              </div>

              <h1 className={styles.h1}>{partner.contentTitle}</h1>

              <div className={styles.contentText} dangerouslySetInnerHTML={{__html: partner.contentText}} />

              <div className={styles.grid}>
                <div className={styles.gridCellLineRight50}>
                  <div dangerouslySetInnerHTML={{__html: partner.contentContacts}} />
                </div>
                <div className={styles.gridCelltextCenter50}>
                <span className={styles.btnPrimary}>
                    <a target="_blank" className={styles.btnPrimaryLink} href={partner.contentUrl}>Получить предложение</a>
                </span>
                </div>
              </div>
            </div>
          </div>
        </div>}
      </Layout>

    )
  }

}
const mapDispatchToProps = dispatch => ({
  fetchPartners: bindActionCreators(actions.fetchPartners, dispatch)
})
const mapStateToProps = state => {
  const { partners } = state
  return {
    partners
  }
}
PartnerItem = connect(
  mapStateToProps,
  mapDispatchToProps
)(PartnerItem)

export default CSSModules(PartnerItem, styles)