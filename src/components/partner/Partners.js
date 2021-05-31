import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {connect} from 'react-redux'
import * as actions from '../../actions'
import {bindActionCreators} from 'redux'
import CSSModules from 'react-css-modules'
import styles from './partners.css'
import Layout from '../componentKit2/Layout'
import {Link} from 'react-router'
import Loader from '../../components/componentKit/Loader'


/**
 *  Контейнер Partners
 *  Используется для страницы Партнеры (/partners)
 *
 */
class Partners extends Component {
  /**
   * @memberof Partners
   * @prop {func} propTypes.fetchPartners Получение данных с сервера
   * @prop {object} propTypes.partners Объет для рендеринга партнеров
   *
   * */
  static propTypes = {
    fetchFaq: PropTypes.func,
    faq: PropTypes.object
  }

  componentWillMount() {
    if (this.props.partners.data.length) {
      return;
    }
    this.props.fetchPartners()
  }

  flag(flag) {
    let text, style

    switch (flag) {
      case 'popular':
        text = 'Популярное'
        style = styles.partnersActivityLabelPopular
        break

      case 'new':
        text = 'Новое'
        style = styles.partnersActivityLabelNew
        break

      default:
        text = ''
        style = styles.partnersActivityLabel
        break

    }

    if (!flag) return null

    return (
      <span className={style}>{text}</span>
    )

  }

  render() {
    const {partners, userInfo} = this.props
    return (

      <Layout page={'partners'} prevSeasons={userInfo.data.prevSeasons}>
        {!partners.isLoad
          ? (partners.isFetching
            ? <Loader/>
            : <div><p>Если вы видите это окно, значит мы делаем личный кабинет для вас удобнее! Напишите нам в чат тех
              подержки (внизу справа) или на почту av@todayme.ru</p></div>)
          :
          <div>
            <ul className={styles.bc}>
              <li className={styles.bcItem}>Партнёры</li>
            </ul>
            <div className={styles.stageBoxSmallPadding}>

              <div className={styles.stageBoxInner}>
                <div className={styles.promos}>
                  <h1 className={styles.h1}>Ваши промокоды:</h1>
                  <div className={styles.promosList}>
                    <div className={styles.promosItem}>
                      <div className={styles.promosTitle}>Промокоды для друзей</div>
                      {
                        partners.data.personalPromos.map((item, index) => {
                          if(item.type !== 1){
                            return;
                          }
                          let discount = JSON.parse(item.discount)
                          const value = discount[0].percent ? discount[0].percent : discount[0].money
                          const symbol = discount[0].percent ? '%' : 'руб.'
                          return (
                            <div key={'type-1' + index} className={styles.promosGroup}>
                              <div className={styles.promosDiscount}>
                                <div className={styles.promosCode}>
                                  <span>{value}</span>
                                  <span className={styles.promosSymbol}>{symbol}</span>
                                </div>
                                <div>cкидка</div>
                              </div>
                              <div className={styles.promosCode}>
                               <span className={styles.promoTablePromoCode}>
                                  <span className={styles.promoTableCode}>{item.promoName}</span>
                                </span>
                              </div>
                            </div>
                          )
                        })
                      }
                      <div className={styles.promosNotice}>+ приведи 3-х друзей и получи следующий сезон</div>
                    </div>
                    <div className={styles.promosItem}>
                      <div className={styles.promosTitle}>
                        <p>Промокоды для регистрации</p>
                        <p>участников при покупке</p>
                        <p>пакетов</p>
                        <p>на двоих и троих</p>
                      </div>
                      {
                        partners.data.personalPromos.map((item, index) => {
                          if(item.type !== 2){
                            return;
                          }
                          let discount = JSON.parse(item.discount)
                          const value = discount[0].percent ? discount[0].percent : discount[0].money
                          const symbol = discount[0].percent ? '%' : 'руб.'
                          return (
                            <div key={'type-2' + index} className={styles.promosGroup}>
                              <div className={styles.promosDiscount}>
                                <div className={styles.promosCode}>
                                  <span>{value}</span>
                                  <span className={styles.promosSymbol}>{symbol}</span>
                                </div>
                                <div>cкидка</div>
                              </div>
                              <div className={styles.promosCode}>
                               <span className={styles.promoTablePromoCode}>
                                  <span className={styles.promoTableCode}>{item.promoName}</span>
                                </span>
                              </div>
                            </div>
                          )
                        })
                      }
                    </div>
                    <div className={styles.promosItem}>
                      <div className={styles.promosTitle}>
                        <p>Промокоды</p>
                        <p>за активность</p>
                        <p>в социальных сетях</p>
                      </div>
                      {
                        partners.data.personalPromos.map((item, index) => {
                          if(item.type !== 3){
                            return;
                          }
                          let discount = JSON.parse(item.discount)
                          const value = discount[0].percent ? discount[0].percent : discount[0].money
                          const symbol = discount[0].percent ? '%' : 'руб.'
                          return (
                            <div key={'type-3' + index} className={styles.promosGroup}>
                              <div className={styles.promosDiscount}>
                                <div className={styles.promosCode}>
                                  <span>{value}</span>
                                  <span className={styles.promosSymbol}>{symbol}</span>
                                </div>
                                <div>cкидка</div>
                              </div>
                              <div className={styles.promosCode}>
                               <span className={styles.promoTablePromoCode}>
                                  <span className={styles.promoTableCode}>{item.promoName}</span>
                                </span>
                              </div>
                            </div>
                          )
                        })
                      }
                    </div>
                  </div>
                  <div className={styles.partnersActivityGrid}>
                    <h1 className={styles.h1p20}>Партнеры:</h1>
                    {!partners.isFetching && partners.isLoad && partners.data.partnerAdvs.map((item, index) => {
                      return (
                        <div key={'partner-' + index} className={styles.partnersActivityItemDesk13}>
                          <Link to={`/partners/${item.link}`}>
                            <div className={styles.partnersActivityImgWrap}>
                              {this.flag(item.flag)}
                              <img className={styles.partnersActivityImg} src={item.headerTopImage} alt=""/>
                            </div>
                          </Link>
                          <p className={styles.partnersActivityDesc}>{item.headerText}</p>
                          <div className={styles.partnersActivityLogo}>
                            <img src={item.contentTitleImage} alt="" className={styles.partnersActivityLogoImg}/>
                          </div>
                        </div>
                      )
                    })
                    }
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
  const {partners, userInfo} = state
  return {
    partners,
    userInfo
  }
}
Partners = connect(
  mapStateToProps,
  mapDispatchToProps
)(Partners)
export default CSSModules(Partners, styles)
