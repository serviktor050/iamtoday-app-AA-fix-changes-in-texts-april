import PropTypes from 'prop-types';
import React, { Component } from 'react';
import cookie from 'react-cookie'
import Layout from '../components/componentKit2/Layout'
import {api} from '../config.js'
import CSSModules from 'react-css-modules'
import styles from './errorReport.css'
import Modal from 'boron-react-modal/FadeModal'
import {connect} from 'react-redux'
import {Link, browserHistory} from 'react-router'
import { dict } from 'dict';

let contentStyle = {
  borderRadius: '18px',
  padding: '45px 20px',
  marginLeft: 'auto',
  marginRight: 'auto',
  width: '340px',
  textAlign: 'center'
};
const modalStyle={
  maxWidth: '500px',
  width: '90%'
};
/**
 *  Контейнер ErrorReport.
 *  Используется для отображения страницы Нашел ошибку? (/error-report)
 *
 */
class ErrorReport extends Component {

  state = {
    /**
     * Текст ошибки
     * @memberof ErrorReport
     */
    text: '',
    /**
     * Массив скриншотов или видео
     * @memberof ErrorReport
     */
    docs:[]
  }

  onChangeText(event) {
    this.setState({
      text: event.target.value
    })
  }

  onChangeFile(event) {
    const {target} = event
    this.refs.loadingModal.show()
    if (target.files && target.files[0]) {
      var reader = new FileReader()
      reader.onload = e => {
        let content
        if(reader.result.indexOf('data:video') !== -1){
          content = reader.result.replace(/data:video\/\w+;base64,/, '')
        } else {
          content = reader.result.replace(/data:image\/\w+;base64,/, '')
        }

         const name = target.files[0].name
         const payload = {
           authToken: cookie.load('token'),
           data: {
             name,
             content
           }
         }
        const headers = {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
        return fetch(`${api}/data/file-upload`, {
          headers,
          method: 'POST',
          body: JSON.stringify(payload)
        })
          .then(response => response.json())
          .then(json => {
            this.refs.loadingModal.hide()
            this.setState({
              docs: this.state.docs.concat({
                name:name,
                uid: json.data.uid
              })
            })
          })
      }
      reader.readAsDataURL(target.files[0])
    }
  }

  send() {
    if (!this.state.docs.length && !this.state.text) return;
    this.refs.loadingModal.show()
    const uids = this.state.docs.map(item => item.uid)
    const payload = {
      authToken: cookie.load('token'),
      data: {
        message: this.state.text,
       // email: this.state.email,
        //name: this.state.name,
        screenshots: uids
      }
    };
    return fetch(`${api}/data/errorReport-create`, {
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
        if (json.errorCode === 1) {
          this.refs.successModal.show()
          this.setState({
           // screenshotsName: [],
            //email: '',
            //name: '',
            text: '',
            docs: []
           // screenshots: []
          })
        } else {
          this.refs.errorModal.show()
        }
      })
  }

  onRemove(doc){
    this.setState({
      docs: this.state.docs.filter(item => item.uid !== doc.uid)
    })
    this.refs.error.value = ''
  }

  render() {
    const {userInfo, location, lang } = this.props;
    return (
      <Layout location={location} page={'errors'} prevSeasons={userInfo.data.prevSeasons}>
        <div className="stage-box stage-box--small-padding">
          <div className="stage-box__inner">
            <div className={styles.top}>
              <div className={styles.topInfo}>
                <div className={styles.title}>{dict[lang]['errorsPresentMessage.1']}</div>
                <p>{dict[lang]['errorsPresentMessage.2']}</p>
                <p>{dict[lang]['errorsPresentMessage.3']}</p>
                <p>{dict[lang]['errorsPresentMessage.4']}</p>
                <p><span className={styles.bold}>{dict[lang]['errorsPresentMessage.5']}</span>{dict[lang]['errorsPresentMessage.6']}<span><Link to="/chats">{dict[lang]['errorsPresentMessage.7']}</Link></span></p>

              </div>
              <div className={styles.topBtn}>
                <button
                  className={styles.btnPrimary}
                  type="button"
                  onClick={() => browserHistory.push('/chats')}
                >{dict[lang]['write']}
                </button>
              </div>
            </div>
         {/*   <h2 className="h1 text-center mb10">Отчет об ошибке</h2>
            <p className="sub-title">К сожалению, на нашем ресурсе иногда встречаются ошибки или неточности, поэтому мы
              будем благодарны Вам за сообщение об ошибке.</p>*/}
         <div className={styles.main}>
           <div className={styles.title}>{dict[lang]['offers.1']}</div>
           <p>{dict[lang]['offers.2']}<span className={styles.bold}>{dict[lang]['offers.3']}</span></p>
           <p>{dict[lang]['offers.4']}</p>
         </div>

            <div className="textarea mb30">
            <textarea
              className="textarea__field"
              name="text"
              placeholder={dict[lang]['yourSuggestion']}
              value={this.state.text}
              onChange={(event) => this.onChangeText(event)}
            />
            </div>
            {
              this.state.docs.map((item, index) => {
                return (
                  <div className={styles.doneList} key={index}>
                    <span className={styles.listName}>{item.name}</span>
                    <span className={styles.listNameIcons}>
                      <span>
                        <svg className={styles.svgIcoDone}>
                          <use xlinkHref="#ico-big-done"></use>
                        </svg>
                      </span>
                      <span className={styles.trash}  onClick={() => this.onRemove(item)}>
                        <svg className="svg-icon ico-trash">
                          <use xlinkHref="#ico-trash"></use>
                        </svg>
                      </span>
                    </span>
                  </div>
                )
              })
            }
            <div className="input input--btn">
              <span className="input__text">{dict[lang]['screenOrVideo']}</span>
              <input
                multiple=""
                type="file"
                ref="error"
              /*  accept="image/!*"*/
                id="file-upload"
                className="input__field"
                placeholder=""
                onChange={(event) => this.onChangeFile(event)}
              />
              <label
                htmlFor="file-upload"
                className={styles.btnBase}
              >{dict[lang]['attachFile']}</label>
            </div>

            <p className="text-center">
              <button
                className={styles.btnPrimary}
                type="button"
                onClick={() => this.send()}
              >{dict[lang]['sendMessage']}
              </button>
            </p>

          </div>
          <Modal ref='loadingModal' contentStyle={contentStyle}>
            <div className={styles.entryHeader}>
              <h2 className={styles.entryTitleCenter}>{dict[lang]['regs.loading']}</h2>
            </div>
            <div className={styles.textCenter}>
              <div className={styles.loaderMain}></div>
            </div>
          </Modal>

          <Modal ref='errorModal' modalStyle={modalStyle} contentStyle={contentStyle}>
            <h2>{dict[lang]['regs.smthWrong']}</h2>
            <br/>
            <button className={styles.btnAction} onClick={() => {
              this.refs.errorModal.hide()
            }}>
              {dict[lang]['continue']}
            </button>
          </Modal>
          <Modal ref='successModal' modalStyle={modalStyle} contentStyle={contentStyle}>
            <h2>{dict[lang]['regs.ty']}</h2>
            <br/>
            <button className={styles.btnAction} onClick={() => {
              this.refs.successModal.hide()
            }}>
              {dict[lang]['regs.continue']}
            </button>
          </Modal>

        </div>
      </Layout>
    )
  }
}
const mapStateToProps = state => {
  const {userInfo, lang } = state;
  return {
    userInfo,
    lang
  }
};
ErrorReport = connect(
  mapStateToProps
)(ErrorReport);
export default CSSModules(ErrorReport, styles)
