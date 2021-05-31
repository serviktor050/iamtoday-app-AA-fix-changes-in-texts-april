import React, {Component} from 'react'
import CSSModules from 'react-css-modules'
import styles from './promoCodeSummary.css'

class PromoCodeSummary extends Component {
  static renderMoney(value, currency) {
    return (value ? value : 0).toFixed(2) + ' ' + (currency ? currency : '')
  }

  render() {
    const {summary} = this.props
    return (
        <div className={styles.promoReportTotal}>
            <div className={styles.grid}>
                <div className="1/1--pocket 1/1--lap 1/1--desk grid__cell  promo-report-total-cell">
                    <br/><h3>Суммарная информация</h3> <br/><br/>
                    <div className={styles.grid}>
                        <div className="1/1--pocket 1/1--lap 1/1--desk grid__cell">
                            <div className="1/3--pocket 1/3--lap 1/3--desk grid__cell total-cell">
                                <h4>Промокодов:</h4>
                            </div>
                            <div className="2/3--pocket 2/3--lap 2/3--desk grid__cell total-cell">
                                <h3>{summary.promoCodeCount}</h3>
                            </div>
                        </div>
                        <div className="1/1--pocket 1/1--lap 1/1--desk grid__cell">
                            <div className="1/3--pocket 1/3--lap 1/3--desk grid__cell total-cell">
                                <h4>Общий трафик:</h4>
                            </div>
                            <div className="2/3--pocket 2/3--lap 2/3--desk grid__cell total-cell">
                                <h3>{summary.trafficCount}</h3>
                            </div>
                        </div>
                        <div className="1/1--pocket 1/1--lap 1/1--desk grid__cell">
                            <div className="1/3--pocket 1/3--lap 1/3--desk grid__cell total-cell">
                                <h4>Регистраций:</h4>
                            </div>
                            <div className="2/3--pocket 2/3--lap 2/3--desk grid__cell total-cell">
                                <div><h3>{summary.regCount}</h3> <h4>&nbspс оплатами&nbsp</h4>
                                    <h3>{summary.regPaidCount}</h3></div>
                            </div>
                        </div>
                        <div className="1/1--pocket 1/1--lap 1/1--desk grid__cell">
                            <div className="1/3--pocket 1/3--lap 1/3--desk grid__cell total-cell">
                                <h4>Общая сумма оплат:</h4>
                            </div>
                            <div className="2/3--pocket 2/3--lap 2/3--desk grid__cell total-cell">
                                <h3>{PromoCodeSummary.renderMoney(summary.paidAmount, summary.currency)}</h3>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
  }
}

export default CSSModules(PromoCodeSummary, styles)
