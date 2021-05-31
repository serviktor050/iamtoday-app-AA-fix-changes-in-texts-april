import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form'
import { connect } from 'react-redux'
import moment from 'moment'
import InputProfile from '../componentKit/InputProfile'
import InputDayPicker from './InputDayPicker'
import cookie from 'react-cookie'
import Modal from 'boron-react-modal/FadeModal'
import { api } from '../../config.js'
import MobileDayPicker from './MobileDayPicker'
import CSSModules from 'react-css-modules'
import styles from './insurance.css'
import ReactTooltip from 'react-tooltip'
import { bindActionCreators } from 'redux'
import * as actions from '../../actions'

let contentStyle = {
  borderRadius: '18px',
  padding: '30px'
}

const labelStyle = {
  marginBottom: '10px',
  fontSize: '1.6rem'
}
class InsuranceValue extends Component {
  render(){
    const {insurance} = this.props
    return (<div className="stage-box stage-box--big-padding pt0">
      <div className="stage-box__header stage-box__header--alpha">
        <img className="stage-box__header-logo" src="assets/img/box-headers/logo-alpha.svg" alt="Ясегодня" />
      </div>

      <div className="stage-box__inner">

        {!insurance
          ?
          <div>
            <h3 className="h2">Cтраховка отклонена</h3>
            <p className="base-parag">К сожалению, компания АльфаЦентр Страхование отказала в страховании вас на период проведения марафона</p>
          </div>
          :
          <div>
            <h3 className="h2">Cтраховка активна</h3>
            <p className="base-parag"> Ваша страховка действует по {moment(insurance.dateEnd).format('DD-MM-YYYY')}</p>
          </div>
        }

      </div>
    </div>)
  }
}

class InsuranceDoActive extends Component {
  showForm(){
    this.props.toggleForm(true)
  }
  render(){
    const {insurance} = this.props
    return (
      <div className={styles.stageBoxBigPadding}>
        <div className={styles.stageBoxHeaderAlpha}>
          <img className={styles.stageBoxHeaderLogo} src="assets/img/box-headers/logo-alpha.svg" alt="Ясегодня" />
        </div>

        <div className={styles.stageBoxInner}>

          <h3 className={styles.h2}>Анкета</h3>

          <p className={styles.baseParag}>Безопасность – прежде всего!</p>
          <p className={styles.baseParag}>
            Несмотря на то, что тренировки ЯСЕГОДНЯ разработаны настоящими профи, и ничего кроме пользы ты от них не получишь, наша жизнь полна опасностей. Поэтому мы предлагаем тебе оформить полис страхования жизни. Поверь, лишним не будет! Тем более, что страхует тебя группа «АльфаСтрахование» – одна из крупнейших компаний России (3-е место по итогам 2015 года).</p>
          <p className={styles.baseParag}>Полис действует в течение одного сезона марафона – 28 дней, а страховая сумма по нему составляет 100 000 (Сто тысяч) рублей. </p>
          <p className={styles.baseParag}>Чтобы активировать страховку, нажми на одноименную кнопку и ответь на несколько вопросов. Полис начнет действовать автоматически в день начала тренировок.</p>
          <div className={styles.textCenterMt30}>
            <div
              className={styles.btnSecondary}
              onClick = {() => this.showForm()}
            >Активировать страховку</div>
          </div>

        </div>
      </div>
    )
  }
}
class InsuranceCheck extends Component {

  showForm(){
    this.props.toggleForm(true)
  }

  render(){
    return (
      <div className="stage-box stage-box--big-padding pt0">
        <div className="stage-box__header stage-box__header--alpha">
          <img className="stage-box__header-logo" src="assets/img/box-headers/logo-alpha.svg" alt="Ясегодня" />
        </div>

        <div className="stage-box__inner">

          <div className="insurance__success">
            <div className="insurance__img">
              <img src="assets/img/ico-insurance-success.svg" alt="" />
            </div>

            <h3 className="h3 text-center mb30">Ура!</h3>

            <p className="base-parag text-center">Данные по страховке отправлены в страховкую компанию. В том случае если мы найдем ошибки, мы свяжемся  с вами для уточнения информации!</p>

             <div className="text-center mt30">
                <div
                  className="btn btn--secondary"
                  onClick = {() => this.showForm()}
                >Вернуться к анкете</div>
              </div>
          </div>

        </div>
      </div>
    )
  }
}
class InsuranceValidationForm extends Component {
  render(){
    const { insurance, valid, handleSubmit,  onSubmitAction, profileData, initialValues} = this.props
    let firstName, middleName, lastName
    if(insurance){
      firstName = insurance.fullNameItems.firstName
      middleName = insurance.fullNameItems.middleName
      lastName = insurance.fullNameItems.lastName
    }
    return (
      <form  className={styles.stageBoxBigPadding} onSubmit={handleSubmit(onSubmitAction)}>
        <div className={styles.stageBoxHeaderAlpha}>
          <img className={styles.stageBoxHeaderLogo} src="assets/img/box-headers/logo-alpha.svg" alt="Ясегодня"/>
        </div>

        <div className={styles.stageBoxInner}>

          <h3 className={styles.h2}>Анкета</h3>

          <div className={styles.gridMb20}>

            <div className={styles.gridCell12}>
              <div data-tip data-for='firstName' className={styles.input}>
                <Field  disabled={firstName ? true : false} ref="firstName" name="firstName" placeholder="Ваше имя" component={InputProfile} />
                { firstName ?<ReactTooltip id='firstName'>
                  <p>Для изменения обратитесь</p>
                  <p>в службу поддержки!</p>
                </ReactTooltip> : null}
              </div>
              <div data-tip data-for='middleName' className={styles.input}>
                <Field  disabled={middleName ? true : false} ref="middleName" name="middleName" placeholder="Ваше отчество" component={InputProfile} />
                { middleName ?<ReactTooltip id='middleName'>
                  <p>Для изменения обратитесь</p>
                  <p>в службу поддержки!</p>
                </ReactTooltip> : null}
              </div>
            </div>

            <div className={styles.gridCell12}>
              <div data-tip data-for='lastName' className={styles.input}>
                <Field  disabled={lastName ? true : false} ref="lastName" name="lastName" placeholder="Ваша фамилия" component={InputProfile} />
                { lastName ?<ReactTooltip id='lastName'>
                  <p>Для изменения обратитесь</p>
                  <p>в службу поддержки!</p>
                </ReactTooltip> : null}
              </div>
              <div className={styles.input}>
                {window.mobileAndTabletcheck()
                  ? <Field name="birthday" placeholder="дд-мм-гггг" component={MobileDayPicker} />
                  : <Field name="birthday" placeholder="дд-мм-гггг" component={InputDayPicker} />
                }
              </div>
            </div>

          </div>

          <div className={styles.grid}>
            <div className={styles.gridCell12}>
              <div className={styles.input}>
                <Field ref="number" name="number" placeholder="Номер и серия паспорта" component={InputProfile} />
              </div>
            </div>
          </div>

          <div className={styles.grid}>
            <div className={styles.gridCell}>
              <div className={styles.input}>
                <Field ref="issuePlace" name="issuePlace" placeholder="Кем выдан" component={InputProfile} />
              </div>
            </div>
          </div>

          <div className={styles.grid}>
            <div className={styles.gridCell13}>
              <div className={styles.input}>
                {window.mobileAndTabletcheck()
                  ? <Field name="issueDate"
                           value={initialValues.issueDate}
                           placeholder="дд-мм-гггг"
                           component={MobileDayPicker} />
                  : <Field name="issueDate"
                           value={initialValues.issueDate}
                           placeholder="дд-мм-гггг"
                           component={InputDayPicker} />
                }
              </div>
            </div>
            <div className={styles.gridCell13}>
              <div className={styles.input}>
                <Field ref="issueCode" name="issueCode" placeholder="Код подразделения" component={InputProfile} />
              </div>
            </div>
            <div className={styles.gridCell13}>
              <div className={styles.input}>
                <Field ref="city" name="city" placeholder="Гор. Рождения" component={InputProfile} />
              </div>
            </div>
          </div>

          <div className={styles.insuranceFooter}>
            <span className={styles.insuranceFooterLine}></span>
            <div className={styles.insuranceFooterInfo}>
              <p>Страховой <a href="#">договор</a> на сумму</p>
              <p className={styles.insuranceFooterPrice}>100 000 руб.</p>
            </div>
          </div>

          <p className={styles.baseParag}>В рамках настоящего Договора существенными условиями признаётся предоставление Страхователем сведений о том, что Застрахованный относится к нижеперечисленным категориям на дату заключения настоящего Договора (включения Застрахованного в Список Застрахованных лиц):</p>

          <ul className={styles.baseListMb40}>
            <li className={styles.baseListItem}>больные онкологическими заболеваниями, СПИДом, ВИЧ-инфицированные;</li>
            <li className={styles.baseListItem}>лица со стойкими нервными или психическими расстройствами (включая эпилепсию), состоящие на диспансерном учете по этому поводу;</li>
            <li className={styles.baseListItem}>лица, находящиеся под следствием (обвиняемые, подозреваемые, подсудимые) и в местах лишения  свободы;</li>
            <li className={styles.baseListItem}>лица, связанные с рисковой профессиональной деятельностью, такие как: промышленные альпинисты, летный состав, пиротехники, водолазы, пожарные, военнослужащие, службы МЧС, МВД, ФТС, ФМС и прочие аналогичные структуры, шахтеры, лица, связанные с работой под  землей, каскадеры, инкассаторы, сотрудники с правом ношения оружия, цирковые артисты,  журналисты и операторы в горячих точках или местах массовых волнений, профессиональные  спортсмены.</li>
          </ul>


          <div className={styles.textCenterMt30}>
            <button type='submit' className={styles.btnSecondary} onClick={() => {
              if (!valid) {
                this.refs.submitFailModal.show()
              }
            }}>
              Отправить данные
            </button>
          </div>

        </div>

        {/*----------------------------------*/}
        <Modal ref='submitFailModal' contentStyle={contentStyle}>
          <h2>Одно или несколько полей были заполнены не правильно, проверьте  еще раз</h2>
          <br/>
          <div className={styles.btnAction} onClick={() => this.refs.submitFailModal.hide()}>
            Продолжить
          </div>
        </Modal>

        <Modal ref='loadingModal' contentStyle={contentStyle} backdrop={false}>
          <div className={styles.entryHeader}>
            <h2 className={styles.entryTitleCenter}>Загружается...</h2>
          </div>
          <div className={styles.textCenter}>
            <div className={styles.loaderMain}></div>
          </div>
        </Modal>
        <Modal ref='failModal' contentStyle={contentStyle}>
          <h2>Что-то пошло не так, возможно не все данные по старховке заполнены</h2>
          <br/>
          <div className={styles.btnAction} onClick={() => this.refs.failModal.hide()}>
            Продолжить
          </div>
        </Modal>
        <Modal ref='successModal' contentStyle={contentStyle}>
          <h2>Данные отправлены! В случае выявления ошибок мы свяжемся с вами дополнительно.</h2>
          <br/>
          <div className={styles.btnAction} onClick={e => this.refs.successModal.hide()}>
            Продолжить
          </div>
        </Modal>
      </form>
    )
  }
}
/**
 *  Компонент Insurance.
 *  Используется для вывода страховки
 *
 */
class Insurance extends Component {
  /**
   * @memberof Insurance
   * @prop {object} propTypes - the props that are passed to this component
   * @prop {array} propTypes.docs Документы страховки
   * @prop {object} propTypes.profileData Данные юзера
   * @prop {func} propTypes.onSubmitAction Отправка страховки
   * */

  static propTypes = {
    docs: PropTypes.array,
    profileData: PropTypes.object.isRequired,
    onSubmitAction: PropTypes.func.isRequired
  }
  componentWillMount() {
    if (window.mobilecheck()) {
      contentStyle.margin = '100px'
      contentStyle.width = '300px'
    }

    const { dispatch, docs } = this.props
    dispatch({
      type: 'SAVE_INSURANCE_DOCS',
      docs
    })
  }

  componentDidMount(){
    const { profileData, setCheckIns} = this.props
    if(profileData.insurance && profileData.insurance.isVerified === null){
      setCheckIns(true)
    }
  }

  renderForm(){
    let {valid, handleSubmit,  setCheckIns, onSubmitAction, profileData, initialValues, showForm, toggleForm, checkIns} = this.props
    if(showForm){
      return (
        <InsuranceValidationForm
          valid={valid}
          initialValues={initialValues}
          handleSubmit={handleSubmit}
          onSubmitAction={onSubmitAction}
          insurance={profileData.insurance}
        />
      )
    } else if(!showForm && !checkIns){
      return (
        <InsuranceDoActive toggleForm={toggleForm}/>
      )
    } else if(checkIns){
      return(<InsuranceCheck toggleForm={toggleForm}/>)
    }
  }

  renderCheckIns(){
    let {valid, handleSubmit,  setCheckIns, onSubmitAction, profileData, initialValues, showForm, toggleForm, checkIns} = this.props
    if(showForm){
      return (
        <InsuranceValidationForm
          valid={valid}
          initialValues={initialValues}
          handleSubmit={handleSubmit}
          onSubmitAction={onSubmitAction}
          insurance={profileData.insurance}
        />
      )
    } else {
      return(
        <InsuranceCheck toggleForm={toggleForm}/>
      )
    }
  }

  render() {
    let { profileData, setCheckIns, checkIns, toggleForm, showForm} = this.props
    ///const birthday = initialValues
    // const docsNames = insuranceDocs.map(doc => doc.name)
    // const docsString = docsNames.join()
    return (
      <div>
        { profileData.insurance
          ?
          (checkIns
              ?
              this.renderCheckIns()
              :(profileData.insurance.isVerified === true
                  ? <InsuranceValue insurance={profileData.insurance}/> : <InsuranceValue/>))
          :
          this.renderForm()

        }
      </div>
    )
  }
}
const validate = data => {
  const errors = {}

  if (!data.firstName) {
    errors.firstName = 'Поле должно быть заполнено'
  }

  if (!data.lastName) {
    errors.lastName = 'Поле должно быть заполнено'
  }
  if (!data.middleName) {
    errors.middleName = 'Поле должно быть заполнено'
  }

  if (!data.issueCode) {
    errors.issueCode = 'Поле должно быть заполнено'
  }
  if (!data.issueDate) {
    errors.issueDate = 'Поле должно быть заполнено'
  }

  if (!data.issuePlace) {
    errors.issuePlace = 'Поле должно быть заполнено'
  }

  if (!data.number) {
    errors.number = 'Поле должно быть заполнено'
  }
  if (!data.city) {
    errors.city = 'Поле должно быть заполнено'
  }
  if (!data.birthday) {
    errors.birthday = 'Поле должно быть заполнено'
  }
  if (!data.passport) {
    errors.passport = 'Поле должно быть заполнено'
  }

  return errors
}


Insurance= reduxForm({
  form: 'InsuranceValidationForm',
  validate
})(Insurance)

const mapDispatchToProps = dispatch => ({
  toggleForm: bindActionCreators(actions.toggleForm, dispatch),
  setCheckIns: bindActionCreators(actions.setCheckIns, dispatch),
  dispatch
})

const mapStateToProps = state => {
  const { insuranceDocs, userInfo, insurance} = state
  const {showForm, checkIns} = insurance
  return {
    insuranceDocs,
    showForm,
    checkIns,
    userInfo
  }
}

Insurance = connect(
  mapStateToProps,
  mapDispatchToProps
)(Insurance)

export default CSSModules(Insurance, styles)
