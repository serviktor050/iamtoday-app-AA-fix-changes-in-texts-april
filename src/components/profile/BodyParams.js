import PropTypes from 'prop-types';
import React, { Component } from 'react';
import moment from 'moment'
import { connect } from 'react-redux'
import SelectField from 'material-ui/SelectField'
import MenuItem from 'material-ui/MenuItem';
import Modal from 'boron-react-modal/FadeModal'
import {dataHeight} from '../../utils/data'
import { api, domen } from '../../config.js'
import cookie from 'react-cookie'
import CSSModules from 'react-css-modules'
import styles from './bodyParams.css'
import weight from './imgs/weight.png'
import chest from './imgs/chest.png'
import thigh from './imgs/thigh.png'
import waist from './imgs/waist.png'
import hips from './imgs/hips.png'
import ReactTooltip from 'react-tooltip'
import Tooltip from '../componentKit2/Tooltip'

const contentStyle = {
  borderRadius: '18px',
  padding: '30px'
}
const modalStyle={
  maxWidth: '500px',
  width: '90%'
}
/**
 *  Компонент BodyParams.
 *  Используется параметров тела в профиле
 *
 */
class BodyParams extends Component {
  /**
   * @memberof BodyParams
   * @prop {object} propTypes - the props that are passed to this component
   * @prop {object} propTypes.bodyMeasure Сохранение параметров
   * @prop {array} propTypes.bodyParams Параметры для рендеринга
   * */

  static propTypes = {
    bodyMeasure: PropTypes.array,
    bodyParams: PropTypes.array.isRequired
  }

  state = {
    height: ''
  }

  componentWillMount(){
    const {dispatch, bodyMeasures} = this.props

    if (bodyMeasures) {
      dispatch({
        type: 'SAVE_BODY_PARAMS',
        bodyMeasures
      })
    }
  }
  componentDidMount(){
    const select = document.querySelector('.heightSelect')
    const button = select.querySelector('button')
    const divs = select.querySelectorAll('div')
    divs[4].style.lineHeight = '43px'
    divs[4].style.top = '-10px'
    divs[4].style.left = '16px'
    button.style.display = 'none'
  }

  onChangeHeight(event, index, value) {
    this.setState({ height: value});
  }

  render() {
    const { bodyParams, dispatch } = this.props;
    return (
      <div className={styles.stageBoxBigPadding}>
        <div className={styles.stageBoxHeaderTodayme}>
          <img src="/assets/img/alfa/logo-energy33.svg" width="180px" className={styles.uniproLogo} alt=""/>
       </div>

        <div className={styles.stageBoxInner}>

          <h3 className={styles.h2}>Ваши параметры</h3>

          <div className={styles.baseTableScroll}>
            <table className={styles.baseTableStats}>
              <tbody>
              <tr>
                <td className={styles.textLeft}>Подсказка</td>
                <td>
                  {/*   <div className={styles.tips} data-tooltip="<img class='tips__img' src='tmp/tip-for-stats.png'>">
                        <svg className={styles.svgIconFormHelp}>
                          <use xlinkHref="#ico-form-help"></use>
                        </svg>
                      </div>*/}
                </td>
                <td>
                  <div className={styles.tips} data-tip data-for='tooltip-weight'>
                      <Tooltip position='center' tooltipCls={styles.tooltipBlock} tooltipContainer={styles.tooltipContainer}>
                          {<img className={styles.tipsImg} src={weight} />}
                      </Tooltip>
                  </div>
                </td>
                <td>
                  <div className={styles.tips} data-tip data-for='tooltip-chest'>
                      <Tooltip position='center' tooltipCls={styles.tooltipBlock} tooltipContainer={styles.tooltipContainer}>
                          <img className={styles.tipsImg} src={chest} />
                      </Tooltip>
                  </div>
                </td>
                <td>
                  <div className={styles.tips} data-tip data-for='tooltip-waist'>
                      <Tooltip position='center' tooltipCls={styles.tooltipBlock} tooltipContainer={styles.tooltipContainer}>
                          <img className={styles.tipsImg} src={waist} />
                      </Tooltip>
                  </div>
                </td>
                <td>
                  <div className={styles.tips} data-tip data-for='tooltip-hips'>
                      <Tooltip position='center' tooltipCls={styles.tooltipBlock} tooltipContainer={styles.tooltipContainer}>
                          <img className={styles.tipsImg} src={hips} />
                      </Tooltip>
                  </div>
                </td>
                <td>
                  <div className={styles.tips} data-tip data-for='tooltip-thigh'>
                      <Tooltip position='center' tooltipCls={styles.tooltipBlock} tooltipContainer={styles.tooltipContainer}>
                          <img className={styles.tipsImg} src={thigh} />
                      </Tooltip>
                  </div>
                </td>
                {bodyParams.length ? <td></td> : null}
              </tr>
              <tr>
                <th className={styles.textLeft}>Дата</th>
                <th className={styles.baseTableStatsTh}>Рост, см</th>
                <th className={styles.baseTableStatsTh}>Вес, кг</th>
                <th className={styles.baseTableStatsTh}>Грудь, см</th>
                <th className={styles.baseTableStatsTh}>Талия, см</th>
                <th className={styles.baseTableStatsTh}>Бедра, см</th>
                <th className={styles.baseTableStatsTh}>Обхват бедра, см</th>
                {bodyParams.length ? <th></th> : null}
              </tr>
              {bodyParams.map((param, index) => (
                <tr key={index}>
                  <td className={styles.baseTableDateLeft}>{moment(param.date).format('YYYY-MM-DD')}</td>
                  <td>{param.height}</td>
                  <td>{param.weight}</td>
                  <td>{param.chest}</td>
                  <td>{param.waist}</td>
                  <td>{param.hips}</td>
                  <td>{param.thigh}</td>
                  <td>
                    <span className={styles.baseTableBtnDel} onClick={e => {
                      dispatch({ id: param.id, type: 'REMOVE_BODY_PARAM' })

                      const payload = {
                        authToken: cookie.load('token'),
                        data: { id: param.id }
                      }

                      return fetch(`${api}/user/bodyMeasure-delete`, {
                        headers: {
                          'Accept': 'application/json',
                          'Content-Type': 'application/json'
                        },
                        method: 'POST',
                        body: JSON.stringify(payload)
                      })
                        .then(response => response.json())
                        .then(json => {
                        })
                    }}>
                      <svg className={styles.svgIcoTrash}>
                        <use xlinkHref="#ico-trash"></use>
                      </svg>
                    </span>
                  </td>
                </tr>
              ))}

              <tr>
                <td className={styles.baseTableDateLeft}>{moment().format('YYYY-MM-DD')}</td>
                <td className='heightTd'>
                  <SelectField
                    value={this.state.height}
                    onChange={this.onChangeHeight.bind(this)}
                    /* hintText="Рост"*/
                    className="heightSelect"
                    style={{
                      width: '70px',
                      borderRadius:'3px',
                      display: 'inline-block',
                     /* left: '0px',
                      top: '13px',*/
                      verticalAlign: 'middle',
                      border: '1px solid #ced9eb',
                      height: '21px',
                      background: '#fff'
                    }}
                    hintStyle={{
                      bottom: '4px',
                      left: '17px'
                    }}
                    labelStyle={{
                      paddingRight: 0
                    }}
                    listStyle={{
                      maxHeight: '250px',
                      width: '52px'
                    }}
                    underlineStyle ={{display: 'none'}}
                  >
                    {dataHeight.map((item, i) => {
                      return (
                        <MenuItem key={i} value={i} primaryText={'' +item} />
                      )
                    })}
                  </SelectField>
                </td>
                <td>
                  <input ref="weight" type="text" className={styles.baseTableInput}/>
                </td>
                <td><input ref="chest" type="text" className={styles.baseTableInput}/></td>
                <td><input ref="waist" type="text" className={styles.baseTableInput}/></td>
                <td><input ref="hips" type="text" className={styles.baseTableInput}/></td>
                <td><input ref="thigh" type="text" className={styles.baseTableInput}/></td>
                {bodyParams.length ? <td></td> : null}
              </tr>
              </tbody>
            </table>
          </div>

          <div className={styles.textCenter}>
            <div onClick={() => {
              let emptyData = false
              let height = '' + dataHeight[this.state.height]
              let validData = [
                height, this.refs.weight.value,
                this.refs.chest.value, this.refs.waist.value,
                this.refs.hips.value, this.refs.thigh.value
              ].filter(value => {
                if (!value) {
                  emptyData = true
                }
                return /^[0-9.,]{1,100}$/.test(value)
              })
              validData = validData.map(d => {
                return d.replace(/,/, '.')
              })

              if (validData.length === 6 && !emptyData) {
                this.refs.loadingModal.show()
                const data = {
                  date: moment().format('YYYY-MM-DD'),
                  height: validData[0],
                  weight: validData[1],
                  chest: validData[2],
                  waist: validData[3],
                  hips: validData[4],
                  thigh: validData[5]
                }

                this.state.height = ''
                this.refs.weight.value = ''
                this.refs.chest.value = ''
                this.refs.waist.value = ''
                this.refs.hips.value = ''
                this.refs.thigh.value = ''

                const payload = {
                  authToken: cookie.load('token'),
                  data
                }

                return fetch(`${api}/user/bodyMeasure-create`, {
                  headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                  },
                  method: 'POST',
                  body: JSON.stringify(payload)
                })
                  .then(response => response.json())
                  .then(json => {
                    this.refs.loadingModal.hide()
                    if (json.errorCode === 1 && json.data) {
                      dispatch({ ...data, type: 'ADD_BODY_PARAM' })
                      this.refs.successModal.show()
                    } else {
                      this.refs.failModal.show()
                    }
                  })
              } else {
                if (emptyData) {
                  this.refs.failValidationEmptyModal.show()
                } else {
                  this.refs.failValidationModal.show()
                }
              }
            }} className={styles.btnPrimary}>
              Добавить
            </div>

            <Modal ref='loadingModal' modalStyle={modalStyle} contentStyle={contentStyle} backdrop={false}>
              <div className={styles.entryHeader}>
                <h2 className={styles.entryTitleCenter}>Загружается...</h2>
              </div>
              <div className={styles.textCenter}>
                <div className={styles.loaderMain}></div>
              </div>
            </Modal>
            <Modal ref='failValidationModal' modalStyle={modalStyle} contentStyle={contentStyle}>
              <h2>Данные могут содержать только цифры с точкой</h2>
              <br/>
              <div className={styles.btnAction} onClick={() => this.refs.failValidationModal.hide()}>
                Продолжить
              </div>
            </Modal>
            <Modal ref='failValidationEmptyModal' modalStyle={modalStyle} contentStyle={contentStyle}>
              <h2>Некоторые данные не заполнены!</h2>
              <br/>
              <div className={styles.btnAction} onClick={() => this.refs.failValidationEmptyModal.hide()}>
                Продолжить
              </div>
            </Modal>
            <Modal ref='failModal' modalStyle={modalStyle} contentStyle={contentStyle}>
              <h2>Что-то пошло не так, поробуйте снова</h2>
              <br/>
              <div className={styles.btnAction} onClick={() => this.refs.failModal.hide()}>
                Продолжить
              </div>
            </Modal>
            <Modal ref='submitFailModal' modalStyle={modalStyle} contentStyle={contentStyle}>
              <h2>Одно или несколько полей были заполнены не правильно, проверьте вашу анкету еще раз</h2>
              <br/>
              <div className={styles.btnAction} onClick={() => this.refs.submitFailModal.hide()}>
                Продолжить
              </div>
            </Modal>
            <Modal ref='successModal' modalStyle={modalStyle} contentStyle={contentStyle}>
              <h2>Данные добавлены!</h2>
              <br/>
              <div className={styles.btnAction} onClick={() => this.refs.successModal.hide()}>
                Продолжить
              </div>
            </Modal>
          </div>
        </div>
      </div>
    )
  }
}
const mapStateToProps = state => {
  const { bodyParams} = state

  return {
    bodyParams
  }
}
const mapDispatchToProps = dispatch => ({
  dispatch
})

BodyParams = connect(
  mapStateToProps,
  mapDispatchToProps
)(BodyParams)

export default CSSModules(BodyParams, styles)
