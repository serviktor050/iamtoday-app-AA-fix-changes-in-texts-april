import React, { Component } from 'react'
import { browserHistory } from 'react-router'
import cookie from 'react-cookie'
import moment from 'moment'
import { connect } from 'react-redux'
import  fetchJsonp from 'fetch-jsonp'
// import Modal from 'boron-react-modal/FadeModal'
import Modal from 'react-modal'
import { getCustomStyleMap } from 'draftjs-utils'
import CSSModules from 'react-css-modules'
import {
  Entity,
  Editor,
  EditorState,
  convertFromRaw,
  CompositeDecorator
} from 'draft-js'

// import Editor from '../Editor'
import styles from './taskIntro.css'
import { api, domen } from '../../config.js'
import * as actions from '../../actions'

import {
    ShareButtons,
    // ShareCounts,
    generateShareIcon
} from 'react-share'

let contentStyleModal = {
  borderRadius: '18px',
  padding: '30px'
}

let backdropStyle = {
  zIndex:'9998'
}

let modalStyle = {
  zIndex:'9999'
}
// задать для репоста
const publicId = -134753171
const postId = 1209


const customStylesMobile = {
    overlay : {
        position          : 'fixed',
        top               : 0,
        left              : 0,
        right             : 0,
        bottom            : 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        zIndex: 13
    },
    content : {
        position                   : 'absolute',
        top                        : '40px',
        left                       : '30px',
        right                      : '30px',
        bottom                     : '40px',
        border                     : '1px solid #ccc',
        background                 : '#fff',
        overflow                   : 'auto',
        WebkitOverflowScrolling    : 'touch',
        borderRadius               : '4px',
        outline                    : 'none',
        maxWidth: '600px',
        margin: '0 auto',
        padding                    : '20px'

    }
}

const customStyles = {
    overlay : {
        position          : 'fixed',
        top               : 0,
        left              : 0,
        right             : 0,
        bottom            : 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        zIndex: 13
    },
    content : {
        position                   : 'absolute',
        top                        : '40px',
        left                       : '30px',
        right                      : '30px',
        bottom                     : 'none',
        border                     : '1px solid #ccc',
        background                 : '#fff',
        overflow                   : 'auto',
        WebkitOverflowScrolling    : 'touch',
        borderRadius               : '4px',
        outline                    : 'none',
        maxWidth: '600px',
        margin: '0 auto',
        padding                    : '20px'

    }
}

const {
  FacebookShareButton,
  VKShareButton
} = ShareButtons

const FacebookIcon = generateShareIcon('facebook')
const VKIcon = generateShareIcon('vk')

let contentStyle = {
  borderRadius: '18px',
  padding: '30px'
}

const customStyleMap = getCustomStyleMap()

const decorator = new CompositeDecorator([
  {
    strategy: (contentBlock, callback) => {
      contentBlock.findEntityRanges(
        (character) => {
          const entityKey = character.getEntity()
          return (
            entityKey !== null &&
            Entity.get(entityKey).getType() === 'LINK'
          )
        },
        callback
      )
    },
    component: (props) => {
      const {url} = Entity.get(props.entityKey).getData()
      return (
        <a href='#' onClick={() => {
          window.open(url, '_blank')
          return false
        }}>
          {props.children}
        </a>
      )
    }
  }
])

const Image = (props) => {
  return <img src={props.src} style={{
    maxWidth: '100%',
    display: 'block',
    marginLeft: 'auto',
    marginRight: 'auto' }}/>
}

const Atomic = (props) => {
  const entity = Entity.get(props.block.getEntityAt(0))
  const {src} = entity.getData()
  const type = entity.getType()

  let media
  if (type === 'IMAGE') {
    media = <Image src={src} />
  }

  return media
}

function mediaBlockRenderer(block) {
  if (block.getType() === 'atomic') {
    return {
      component: Atomic,
      editable: false
    }
  }

  return null
}

const description = `задолбалась: Ага, ты, значит, тренируешься с #ЯСЕГОДНЯ,
а твои друзья так ничего и не знают?! Не надо так! У нас есть клевые лайфхаки,
как качать пресс и булки, сидя в пробке. Расскажи про них друзьям, а мы продлим
прием твоего экзамена. Можешь присылать Видео до конца воскресенья! Идет?
Сидя в машине, напряги мышцы ягодиц. Задержи это положение на 2-3 сек., потом расслабься.
Повтори 15 раз. А тренировать пресс помогут дыхательные упражнения.
Их тоже легко выполнять в авто. Сложи губы в трубочку и выдыхай быстро и отрывисто.
В этот момент будет напрягаться твой пресс.
#ЯСЕГОДНЯ #фитнесмарафон #спорт #здоровье #тренировки #диета #полезное #третий_сезон #призы`

class TaskIntroBanner extends Component {

  state = {
    modal:false
  }
  componentWillMount() {
    if (window.mobilecheck()) {
      contentStyle.margin = '100px'
      contentStyle.width = '300px'
    }
    const { dispatch, selectedPayment } = this.props
    dispatch(actions.fetchPaymentIfNeeded(selectedPayment))
    dispatch(actions.fetchPromo(2))

    const script = document.createElement("script");

    script.src = "https://yastatic.net/share2/share.js"
    script.async = true

    document.body.appendChild(script)
  }

  shareVk(){
    this.refs.successShare.show()
  }

  onClickVk() {
    const vkUrl = 'https://oauth.vk.com/authorize?client_id=5960742&display=page&redirect_uri=https://oauth.vk.com/blank.html&scope=wall&response_type=token&v=5.63'
    //browserHistory.push(vkUrl)
    //window.location.href = vkUrl
    window.VK.Auth.login(getit)

    let $this = this

    function getit(response) {
      if (response.session) {
        var id = response.session.mid;

          fetchJsonp('https://api.vk.com/method/wall.repost?object=wall-134753171_1190&scope=wall&access_token=727904da9e5fccf74ab97d834dcfbbdd2cf8a373c24f0b26cefd182a1126d2cc70067352f3ec873eb832e')
            .then(function(response) {
              return response.json()
            }).then(function(json) {
            $this.refs.successShare.show()
          }).catch(function(ex) {

          })
        }
      }
  }

  componentDidMount() {
    !function (d, id, did, st, title, description, image) {
      var js = d.createElement("script");
      js.src = "https://connect.ok.ru/connect.js";
      js.onload = js.onreadystatechange = function () {
        if (!this.readyState || this.readyState == "loaded" || this.readyState == "complete") {
          if (!this.executed) {
            this.executed = true;
            setTimeout(function () {
              window.OK.CONNECT.insertShareWidget(id, did, st, title, description, image);
            }, 0);
          }
        }
      };
      d.documentElement.appendChild(js);
    }(document,"ok_shareWidget","https://gohero.todayme.ru",'{"sz":45,"st":"oval","nc":1,"nt":1}',"","задолбалась: Ага, ты, значит, тренируешься с #ЯСЕГОДНЯ, а твои друзья так ничего и не знают?! Не надо так! У нас есть клевые лайфхаки, как качать пресс и булки, сидя в пробке. Расскажи про них друзьям, а мы продлим прием твоего экзамена. Можешь присылать Видео до конца воскресенья! Идет? Сидя в машине, напряги мышцы ягодиц. Задержи это положение на 2-3 сек., потом расслабься. Повтори 15 раз. А тренировать пресс помогут дыхательные упражнения. Их тоже легко выполнять в авто. Сложи губы в трубочку и выдыхай быстро и отрывисто. В этот момент будет напрягаться твой пресс. #ЯСЕГОДНЯ #фитнесмарафон #спорт #здоровье #тренировки #диета #полезное #третий_сезон #призы","https://lk2.todayme.ru/assets/img/png/bannerShow.jpg");
  }

    openSunday(){
      fetch(`${api}/user/user-addsocshare`, {
          headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
          },
          method: 'POST',
          body: JSON.stringify({ authToken: cookie.load('token') })
      })
          .then(response => response.json())
          .then(json => {
          })
  }

    closeModal(){
        this.setState({
            modal:false
        })
        window.VK.Api.call('wall.get', {count: 5}, (r) => {
            if(r.response){
                let posts = r.response
                posts = posts.filter(item =>{
                    if(item.copy_owner_id){
                        return item.copy_owner_id == publicId && item.copy_post_id == postId
                    }
                })

                if(posts.length){
                    this.openSunday()
                }
            }
        });
    }

    onClickWidget(){
        let $this = this

        window.VK.Auth.login((response) =>{
            this.response = response
            if (response.session) {
                (function(d, s, id) { var js, fjs = d.getElementsByTagName(s)[0]; if (d.getElementById(id)) return; js = d.createElement(s); js.id = id; js.src = "//vk.com/js/api/openapi.js?146"; fjs.parentNode.insertBefore(js, fjs); }(document, 'script', 'vk_openapi_js'));
                (function() {
                    if (!window.VK || !window.VK.Widgets || !window.VK.Widgets.Post || !window.VK.Widgets.Post('vk_post_-134753171_1209', -134753171, 1209, 'Pj2aOWrtTwiWNSfiQEeL-m88FA')) setTimeout(arguments.callee, 50);
                }());

                $this.setState({
                    modal:true
                })
            }
        })
    }

  render() {
    const { dispatch, showPromos } = this.props

    const okLink = 'https://connect.ok.ru/offer?url='+encodeURIComponent('todayme.ru')+'&description='+encodeURIComponent(description) +'&imageUrl=' +encodeURIComponent('https://lk2.todayme.ru/assets/img/bannerShow.jpg')

    return (
      <div className={styles.taskIntroBanner}>
        <span>У нас есть крутейшие спортивные лайфхаки!</span>
        <p><strong>Расскажи</strong> про них друзьям и можешь сдавать экзамен <strong>до конца воскресенья!</strong></p>
        <img src="/assets/img/png/banner-bg-img.png" alt=""/>

        <div className={styles.shareButtonWrapper}>

          <ul className={!showPromos ? styles.socialSignin : styles.socialSigninShow}>

            <li className={styles.socialSigninItemVk} onClick={this.onClickWidget.bind(this)}>
              <svg className={styles.svgIconVk}>
                <use xlinkHref="#vk"></use>
              </svg>
            </li>

             {/*<li className={styles.socialSigninItem} onClick={this.openSunday()}>
              <VKShareButton
                url={'https://gohero.todayme.ru'}
                image={'https://lk2.todayme.ru/assets/img/png/bannerShow.jpg'}
                className="Demo__some-network__share-button"
              >
                <VKIcon
                  size={47}
                  round
                />
              </VKShareButton>
            </li>*/}

            {/* <li className={styles.socialSigninItem} onClick={this.openSunday()}>
               <div id="ok_shareWidget"></div>
            </li>*/}
            <li className={styles.socialSigninItem}>
              <div className={"ya-share2 " + styles.yaOk}
                   data-services="odnoklassniki"
                   data-url="https://gohero.todayme.ru"
                   data-image="https://lk2.todayme.ru/assets/img/png/bannerShow.jpg"
              ></div>
            </li>
            <li className={styles.socialSigninItemLast}>
              <FacebookShareButton
                url={'https://gohero.todayme.ru'}
                description={description}
                picture={'https://lk2.todayme.ru/assets/img/png/bannerShow.jpg'}
                className="Demo__some-network__share-button"
              >
                <FacebookIcon
                  size={47}
                  round
                />
              </FacebookShareButton>
            </li>
          </ul>

          <div className={!showPromos ? styles.btnSimple : styles.btnSimpleActive} onClick={() => {
             dispatch({ type: 'SHOW_PROMOS', showPromos: !showPromos })
          }}>
            <span className={styles.btnSimpleIco}>
              <svg className={styles.svgIcoShare}>
                <use xlinkHref="#ico-share"></use>
              </svg>
            </span>
            <span className={styles.btnSimpleTitle}>Поделиться</span>
          </div>
        </div>

        <Modal
          isOpen={this.state.modal}
          contentLabel="Modal"
        >
          <h1>Modal Content </h1>
          <p>Etc.</p>
          <div onClick={this.shareVk.bind(this)}>Поделиться</div>
        </Modal>

        <Modal ref='successShare' modalStyle={modalStyle} backdropStyle={backdropStyle} contentStyle={contentStyleModal}>
          <h3>Вы поделились</h3>
          <br/>
          <button className={styles.btnPrimary} onClick={() => this.refs.successShare.hide()}>
            Продолжить
          </button>
        </Modal>

          <Modal
              isOpen={this.state.modal}
              style={!window.mobileAndTabletcheck() ? customStyles : customStylesMobile}
              onRequestClose={this.closeModal.bind(this)}
          >
              <div>
                  <div id="vk_post_-134753171_1209"></div>
              </div>

          </Modal>
      </div>
    )
  }
}

const TaskIntro = ({ text, json, sign, paidState, isTasks, date, isFull, showFullContent }) => {
  const editorState = json ? EditorState.createWithContent(convertFromRaw(json), decorator) : EditorState.createEmpty()
  const todayNumber = moment().day();
  const showShareWrapper = todayNumber === 5 || todayNumber === 6;
  const isAlfa = domen.isAlfa;

  return (
    <div className={styles.stageBoxSmallPadding} style={window.mobilecheck() && isTasks && showShareWrapper ? { marginTop: '0px' } : {}}>
      <div className={styles.stageBoxInner} style={window.mobilecheck() ? { paddingTop: '0px' } : {}}>
     {/*   {!isAlfa && isTasks && showShareWrapper &&
          <div>
            <TaskIntroBanner />
          </div>}*/}


        {paidState == -1 && window.mobilecheck() &&
          <div className={styles.textCenter}>
            <br/>
            <div className={styles.btnPrimary} onClick={() => browserHistory.push('/season')}>
              Записаться на 4-ый сезон
            </div>
            <br/>
            <br/>
          </div>
        }

        <Editor
          readOnly={true}
          customStyleMap={customStyleMap}
          editorState={editorState}
          blockRendererFn={mediaBlockRenderer}
        />

        {/* <Editor
          flags={{showHidden: false}}
          isPresentation={true}
          editorState={json}
        /> */}
{/*
        {!isFull &&
          <div
            className={styles.textCenterMt20}
            onClick={showFullContent}
          >
            <span className={styles.stageBoxBtnExpand}>Показать больше</span>
          </div>
        }*/}
      </div>
    </div>
  )
}

const mapStateToProps = state => {
  const { showPromos} = state

  return {
    showPromos
  }
}

TaskIntroBanner = connect(
  mapStateToProps,
)(TaskIntroBanner)

export default CSSModules(TaskIntro, styles)
