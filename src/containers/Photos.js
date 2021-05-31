import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {browserHistory} from 'react-router'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import * as actions from '../actions'
//import {fetchTaskDayIfNeeded } from '../actions'
import {api} from '../config.js'
import cookie from 'react-cookie'
import Chat from './Chat'
//import { PRIVATE_CHAT_ID } from '../actions'
import Layout from '../components/componentKit2/Layout'
import Loader from '../components/componentKit/Loader'
import {
  Entity,
  Editor,
  EditorState,
  convertFromRaw,
  CompositeDecorator
} from 'draft-js'
import {getCustomStyleMap} from 'draftjs-utils'
import Modal from 'boron-react-modal/FadeModal'
import CSSModules from 'react-css-modules'
import styles from './photos.css'
import LogoLink from '../components/componentKit/LogoLink'
import ChatTabItem from '../components/Chat/ChatTabItem'

let contentStyle = {
  borderRadius: '18px',
  padding: '45px 20px',
  marginLeft: 'auto',
  marginRight: 'auto',
  width: '340px',
  textAlign: 'center'
}
const modalStyle={
  maxWidth: '500px',
  width: '90%'
}

let url = 'https://api.todayme.ru'
const customStyleMap = getCustomStyleMap()


let photoBeforeVideoExt
let photoAfterVideoExt

// флаг фото до/после
//const photoBefore = false


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
        <a href={url}>
          {props.children}
        </a>
      )
    }
  }
])

const Image = (props) => {
  return <img role="presentation" src={props.src} style={{
    maxWidth: '100%',
    display: 'block',
    marginLeft: 'auto',
    marginRight: 'auto'
  }}/>
}

const Atomic = (props) => {
  const entity = Entity.get(props.block.getEntityAt(0))
  const {src} = entity.getData()
  const type = entity.getType()

  let media
  if (type === 'IMAGE') {
    media = <Image src={src}/>
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
/**
 *  Компонент Photos.
 *  Используется для отображения страницы 'Фото' (/photos)
 *
 */

let count = 0
class Photos extends Component {
  /**
   * @memberof Photos
   * @prop {object} propTypes - the props that are passed to this component
   * @prop {object} propTypes.photos Данные фото
   * @prop {string} propTypes. selectedPhotos Выбранные фото
   *
   * */
  static propTypes = {
    photos: PropTypes.object.isRequired,
    selectedPhotos: PropTypes.string.isRequired,
  }

  state = {
    tab:'instruction',
    videoBefore: '',
    videoAfter: '',
    photoBeforeRightUrl: null,
    photoBeforeLeftUrl: null,
    photoBeforeFrontUrl: null,
    photoBeforeBackUrl: null,

    photoAfterFrontUrl: null,
    photoAfterBackUrl: null,
    photoAfterLeftUrl: null,
    photoAfterRightUrl: null,

    beforeLoadingFront: false,
		beforeLoadingBack: false,
		beforeLoadingLeft: false,
		beforeLoadingRight: false,

    beforeErrorFront: false,
    beforeErrorBack: false,
    beforeErrorLeft: false,
    beforeErrorRight: false,

		afterLoadingFront: false,
		afterLoadingBack: false,
		afterLoadingLeft: false,
		afterLoadingRight: false,

		afterErrorFront: false,
		afterErrorBack: false,
		afterErrorLeft: false,
		afterErrorRight: false,

		photoBeforeFrontIsChecked: null,
		photoBeforeBackIsChecked: null,
		photoBeforeLeftIsChecked: null,
		photoBeforeRightIsChecked: null,

		photoAfterFrontIsChecked: null,
		photoAfterBackIsChecked: null,
		photoAfterLeftIsChecked: null,
		photoAfterRightIsChecked: null,

    beforeFrontLoad: false,
		beforeBackLoad: false,
		beforeLeftLoad: false,
		beforeRightLoad: false,

		afterFrontLoad: false,
		afterBackLoad: false,
		afterLeftLoad: false,
		afterRightLoad: false,
  }

  change(e) {
    this.setState({
      videoBefore: e.target.value
    })
  }

  changeVideoAfter(e) {
    this.setState({
      videoAfter: e.target.value
    })
  }

  change(e){
    this.setState({
      videoBefore: e.target.value
    })
  }
  changeVideoAfter(e){
    this.setState({
      videoAfter: e.target.value
    })
  }
  componentDidMount() {
    const {dispatch, selectedPhotos, selectedTaskDay} = this.props
    dispatch(actions.fetchPhotosIfNeeded(selectedPhotos))
    dispatch(actions.fetchTaskDayIfNeeded(selectedTaskDay))
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.selectedPhotos !== this.props.selectedPhotos) {
      const {dispatch, selectedPhotos} = nextProps
      dispatch(actions.fetchPhotosIfNeeded(selectedPhotos))
    }

    if (nextProps.photos !== this.props.photos) {
      const isEmpty = !nextProps.photos || !nextProps.photos.data || !nextProps.photos.data[0]
      if (!isEmpty) {
        const p = nextProps.photos.data[0]
        this.photoBeforeVideoExt = p.photoBeforeVideoExt ? p.photoBeforeVideoExt : ''
        this.photoAfterVideoExt = p.photoAfterVideoExt ? p.photoAfterVideoExt : ''

        this.setState({
          videoBefore: this.photoBeforeVideoExt,
          videoAfter: this.photoAfterVideoExt,
          photoBeforeRightUrl: p.photoBeforeRightUrl ? url + p.photoBeforeRightUrl : '',
          photoBeforeLeftUrl:  p.photoBeforeLeftUrl ? url + p.photoBeforeLeftUrl : '',
          photoBeforeFrontUrl:  p.photoBeforeFrontUrl ? url + p.photoBeforeFrontUrl : '',
          photoBeforeBackUrl:  p.photoBeforeBackUrl ? url + p.photoBeforeBackUrl : '',
          photoAfterFrontUrl: p.photoAfterFrontUrl ? url + p.photoAfterFrontUrl : '',
          photoAfterBackUrl: p.photoAfterBackUrl ? url + p.photoAfterBackUrl : '',
          photoAfterLeftUrl: p.photoAfterLeftUrl ? url + p.photoAfterLeftUrl : '',
          photoAfterRightUrl: p.photoAfterRightUrl ? url + p.photoAfterRightUrl : '',

					photoBeforeFrontIsChecked: p.photoBeforeFrontIsChecked,
					photoBeforeBackIsChecked: p.photoBeforeBackIsChecked,
					photoBeforeLeftIsChecked: p.photoBeforeLeftIsChecked,
					photoBeforeRightIsChecked: p.photoBeforeRightIsChecked,

					photoAfterFrontIsChecked: p.photoAfterFrontIsChecked,
					photoAfterBackIsChecked: p.photoAfterBackIsChecked,
					photoAfterLeftIsChecked: p.photoAfterLeftIsChecked,
					photoAfterRightIsChecked: p.photoAfterRightIsChecked,

        })
      }
    }
  }

  renderIco(isChecked, url, load) {
    if(load){
      return;
    }
    if(url){
      return (
        <span className={styles.uploadGallerystatus}>
                      {
                        !isChecked ? isChecked === null ?
                          <svg className={styles.svgIcoBigPending}>
                            <use xlinkHref="#ico-big-pending"></use>
                          </svg>
                          :
                          <svg className={styles.svgIcoRefuse}>
                            <use xlinkHref="#ico-big-refuse"></use>
                          </svg>
                          :
                          <svg className={styles.svgIcoBigDone}>
                            <use xlinkHref="#ico-big-done"></use>
                          </svg>
                      }
                    </span>
      )
    }
  }

  renderTitle(isChecked, place, url, loading, error, load){
    if(load){
      return;
    }
    if(loading || error){
			return (
				<span className={styles.uploadGalleryTitlePending}>
          {loading ? 'Загружается' : 'Ошибка загрузки'}
        </span>
			)
    }
    if(url && !isChecked){
      return (
        <span className={styles.uploadGalleryTitlePending}>
          {isChecked === null ? 'Проверяется' : 'Не принята'}
        </span>
      )
    } else {
      return (
        <span className={styles.uploadGalleryTitle}>{place}</span>
      )
    }
  }

  onClickTabs(tab){
    this.setState({
      tab:tab
    })
  }

  render() {
    let  {photos, taskDayData, userInfo, location} = this.props
    const isEmpty = !photos || !photos.data || !photos.data[0]
    const {isLoad} = taskDayData
    let json
    let userPhotoUploadState
    //let photoAfterBackIsChecked
    //let photoAfterFrontIsChecked
   // let photoAfterLeftIsChecked
    //let photoAfterRightIsChecked

    //let photoBeforeBackIsChecked
    //let photoBeforeFrontIsChecked
    //let photoBeforeLeftIsChecked
    //let photoBeforeRightIsChecked

    let photoBeforeVideoIsChecked
    if (!isEmpty) {
      const p = photos.data[photos.data.length - 1]
      photoBeforeVideoExt = p.photoBeforeVideoExt ? p.photoBeforeVideoExt : ''
      photoAfterVideoExt = p.photoAfterVideoExt ? p.photoAfterVideoExt : ''
      json = p.userPhotoCaption ? JSON.parse(p.userPhotoCaption) : {}
      userPhotoUploadState = photos.data[0].userPhotoUploadState
      photoBeforeVideoIsChecked = photos.data[0].photoBeforeVideoIsChecked

    }
    const editorState = json ? EditorState.createWithContent(convertFromRaw(json), decorator) : EditorState.createEmpty()
    const {
      photoBeforeFrontIsChecked,
			photoBeforeBackIsChecked,
			photoBeforeLeftIsChecked,
			photoBeforeRightIsChecked,

			photoAfterFrontIsChecked,
			photoAfterBackIsChecked,
			photoAfterLeftIsChecked,
			photoAfterRightIsChecked,
    } = this.state;

    return (

      <Layout location={location} page={'photos'} prevSeasons={userInfo.data.prevSeasons}>
        {!isEmpty && isLoad ?
          <div >
              <div className={styles.tabs}>
                {editorState &&
                <ChatTabItem
                  onClickTabs={this.onClickTabs.bind(this)}
                  tabName={'instruction'}
                  active={this.state.tab}
                >
                  Инструкции
                </ChatTabItem>
                }

                <ChatTabItem
                  onClickTabs={this.onClickTabs.bind(this)}
                  tabName={'photoBefore'}
                  active={this.state.tab}
                >
                  Фото До
                </ChatTabItem>

                {userPhotoUploadState !== 'before' &&
                  <ChatTabItem
                    onClickTabs={this.onClickTabs.bind(this)}
                    tabName={'photoAfter'}
                    active={this.state.tab}
                  >
                    Фото После
                  </ChatTabItem>
                }
              </div>
              { this.state.tab === 'instruction' &&
                <div className={styles.stageBoxSmallPadding}>
                  <div className={styles.stageBoxInnerCustom}>

                    {/*<h1 className={styles.h1}>{userPhotoUploadState === 'before' ? 'Фото До:' : 'Фото После:'}</h1>*/}

                    <Editor
                      readOnly={true}
                      customStyleMap={customStyleMap}
                      editorState={editorState}
                      blockRendererFn={mediaBlockRenderer}
                    />

                    <hr/>
                  </div>
                </div>
              }


            { this.state.tab !== 'instruction' && <div className={styles.stageBoxSmallPadding2}>
              {this.state.tab === 'photoBefore' && <div className={styles.stageBoxInner}>

                <h2 className={styles.h1}>Ваш фото отчет</h2>

                <p className={styles.baseParag}>До старта программы, если претендуете на призы, то должны прислать фото ДО.
                  Прислать вы их можете до первого экзамена! Фото ПОСЛЕ вы присылаете после последнего экзамена.</p>

                <h4 className={styles.h3TextCenter}>Фото До</h4>

                <ul className={styles.uploadGallery}>

                  <li ref="liBeforeFront"
                      className={this.state.photoBeforeFrontUrl ? styles.uploadGalleryItemUploaded : styles.uploadGalleryItem}>

                    <span className={styles.uploadGalleryItemInner}>

                        <span
                            className={this.state.beforeLoadingFront || this.state.beforeErrorFront || (this.state.photoBeforeFrontUrl && !photoBeforeFrontIsChecked) ? styles.uploadGalleryItemOverlayPending : styles.uploadGalleryItemOverlay}
                            onClick={() => {
                                this.refs.inputBeforeFront.click()
                            }}>
                          <input ref="inputBeforeFront" type="file" accept="image/*" className={styles.uploadFileInput}
                                 disabled={!this.state.beforeFrontLoad && this.state.photoBeforeFrontUrl && (photoBeforeFrontIsChecked || photoBeforeFrontIsChecked === null)}
                                 onChange={input => {
                                     const {target} = input;
                                     if (target.files && target.files[0]) {
                                         var reader = new FileReader()

                                         reader.onload = e => {
                                             this.refs.liBeforeFront.className = styles.uploadGalleryItemUploaded
                                             this.refs.beforeFront.src = e.target.result
                                             this.refs.frontIcon.style.cssText = 'display: none;'
                                             this.refs.frontButton.text = ""

                                             const content = reader.result.replace(/data:image\/\w+;base64,/, '')
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
                                             this.setState({
                                                 beforeLoadingFront: true,
                                                 beforeErrorFront: false,
																							   photoBeforeFrontIsChecked: null,
                                             })

                                                 return fetch(`${api}/data/file-upload`, {
                                                     headers,
                                                     method: 'POST',
                                                     body: JSON.stringify(payload)
                                                 })
                                                     .then(response => response.json())
                                                     .then(json => {

                                                         this.setState({beforeLoadingFront: false})
                                                         if (json.errorCode !== 1) {

                                                             this.setState({beforeErrorFront: true})
                                                             return;
                                                         }
                                                         this.photoBeforeFrontSend = json.data.uid

                                                          this.setState({
																														beforeFrontLoad: `${api}/files/${json.data.uid}.${json.data.extension}`.replace(/api\//, '')
                                                          })

                                                     })
                                                   .catch(err => {
																										 this.setState({
                                                       beforeErrorFront: true,
																											 beforeLoadingFront: false,
																										 })
                                                   })


                                         }

                                         reader.readAsDataURL(target.files[0])
                                     }
                                 }}/>


                           <span
                               ref="frontIcon"
                               className={styles.uploadGalleryIco}
                               style={this.state.photoBeforeFrontUrl ? {display: 'none'} : {}}

                           >
                            <svg className={styles.svgIconPhotoSide1}>
                              <use xlinkHref="#ico-photo-side-1" />
                            </svg>
                          </span>
                            {this.renderTitle(photoBeforeFrontIsChecked, 'Спереди', this.state.photoBeforeFrontUrl, this.state.beforeLoadingFront, this.state.beforeErrorFront, this.state.beforeFrontLoad)}
                            <div
                                ref="frontButton"
                                className={styles.btnUpload}
                                onClick={e => {
                                    e.preventDefault()
                                    this.refs.inputBeforeFront.click()
                                }}
                            >
                                {this.state.photoBeforeFrontUrl ? '' : 'Загрузить'}
                            </div>


                        </span>



                      <span
                          className={this.state.photoBeforeFrontUrl && (photoBeforeFrontIsChecked || photoBeforeFrontIsChecked === null) ? styles.uploadGalleryImgWrapDisable : styles.uploadGalleryImgWrap}>
                        {this.renderIco(photoBeforeFrontIsChecked, this.state.photoBeforeFrontUrl, this.state.beforeFrontLoad)}
                          <img ref='beforeFront'
                               className={styles.uploadGalleryImg}
                               onClick={e => {
                                   e.preventDefault()
                                   this.refs.inputBeforeFront.click()
                               }}
                               src={this.state.photoBeforeFrontUrl} alt=""/>
                      </span>

                    </span>

                  </li>


                  <li ref="liBeforeBack"
                      className={this.state.photoBeforeBackUrl ? styles.uploadGalleryItemUploaded : styles.uploadGalleryItem}>
                <span className={styles.uploadGalleryItemInner}>

                    <span className={this.state.beforeLoadingBack || this.state.beforeErrorBack || (this.state.photoBeforeBackUrl && !photoBeforeBackIsChecked) ? styles.uploadGalleryItemOverlayPending : styles.uploadGalleryItemOverlay}
                     onClick={() => {
                      this.refs.inputBeforeBack.click()
                    }}>
                  <input ref="inputBeforeBack" type="file" accept="image/*" className={styles.uploadFileInput}
                         disabled={!this.state.beforeBackLoad && this.state.photoBeforeBackUrl && (photoBeforeBackIsChecked || photoBeforeBackIsChecked === null)}
                         onChange={input => {
                           const {target} = input

                           if (target.files && target.files[0]) {
                             var reader = new FileReader()

                             reader.onload = e => {
                               this.refs.liBeforeBack.className = styles.uploadGalleryItemUploaded
                               this.refs.beforeBack.src = e.target.result
                               this.refs.backIcon.style.cssText = 'display: none;'
                               this.refs.backButton.text = ""

                               const content = reader.result.replace(/data:image\/\w+;base64,/, '')
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

                                 this.setState({
                                     beforeLoadingBack: true,
                                     beforeErrorBack: false,
																	 photoBeforeBackIsChecked: null,
                                 })


                               return fetch(`${api}/data/file-upload`, {
                                 headers,
                                 method: 'POST',
                                 body: JSON.stringify(payload)
                               })
                                 .then(response => response.json())
                                 .then(json => {
                                     this.setState({beforeLoadingBack: false})
                                     if (json.errorCode !== 1) {
                                         this.setState({beforeErrorBack: true})
                                         return;
                                     }
                                   this.photoBeforeBackSend = json.data.uid

																	 this.setState({
																		 beforeBackLoad: `${api}/files/${json.data.uid}.${json.data.extension}`.replace(/api\//, '')
																	 })
                                 })
																 .catch(err => {
																	 this.setState({
                                     beforeErrorBack: true,
																		 beforeLoadingBack: false,
																	 })
																 })

                             }

                             reader.readAsDataURL(target.files[0])
                           }
                         }}/>

                    <span
                      ref="backIcon"
                      className={styles.uploadGalleryIco}
                      style={this.state.photoBeforeBackUrl ? {display: 'none'} : {}}
                    >
                      <svg className={styles.svgIconPhotoSide1}>
                        <use xlinkHref="#ico-photo-side-1"></use>
                      </svg>
                    </span>
                    {this.renderTitle(photoBeforeBackIsChecked, 'Сзади', this.state.photoBeforeBackUrl, this.state.beforeLoadingBack, this.state.beforeErrorBack, this.state.beforeBackLoad)}
                     <div
                       ref="backButton"
                       className={styles.btnUpload}
                       onClick={e => {
                         e.preventDefault()
                         this.refs.inputBeforeBack.click()
                       }}
                     >
                       {this.state.photoBeforeBackUrl ? '' : 'Загрузить'}
                     </div>

                  </span>

                    <span className={this.state.photoBeforeBackUrl && (photoBeforeBackIsChecked || photoBeforeBackIsChecked === null) ? styles.uploadGalleryImgWrapDisable : styles.uploadGalleryImgWrap}>
                       {this.renderIco(photoBeforeBackIsChecked, this.state.photoBeforeBackUrl, this.state.beforeBackLoad)}
                      <img ref='beforeBack'
                           className={styles.uploadGalleryImg}
                           onClick={e => {
                             e.preventDefault()
                             this.refs.inputBeforeBack.click()
                           }}
                           src={this.state.photoBeforeBackUrl} alt=""/>
                  </span>

                  </span>
                  </li>



                  <li ref="liBeforeLeft"
                      className={this.state.photoBeforeLeftUrl ? styles.uploadGalleryItemUploaded : styles.uploadGalleryItem}>
                  <span className={styles.uploadGalleryItemInner}>

                        <span className={this.state.beforeLoadingLeft || this.state.beforeErrorLeft || (this.state.photoBeforeLeftUrl && !photoBeforeLeftIsChecked) ? styles.uploadGalleryItemOverlayPending : styles.uploadGalleryItemOverlay}
                          onClick={() => {
                           this.refs.inputBeforeLeft.click()
                         }}>
                      <input ref="inputBeforeLeft" type="file" accept="image/*" className={styles.uploadFileInput}
                             disabled={!this.state.beforeLeftLoad && this.state.photoBeforeLeftUrl && (photoBeforeLeftIsChecked || photoBeforeLeftIsChecked === null)}
                             onChange={input => {
                               const {target} = input
                               if (target.files && target.files[0]) {
                                 var reader = new FileReader()

                                 reader.onload = e => {
                                   this.refs.liBeforeLeft.className = styles.uploadGalleryItemUploaded
                                   this.refs.beforeLeft.src = e.target.result
                                   this.refs.leftIcon.style.cssText = 'display: none;'
                                   this.refs.leftButton.text = ""

                                   const content = reader.result.replace(/data:image\/\w+;base64,/, '')
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

                                     this.setState({
                                         beforeLoadingLeft: true,
                                         beforeErrorLeft: false,
																			 photoBeforeLeftIsChecked: null,
                                     })


                                   return fetch(`${api}/data/file-upload`, {
                                     headers,
                                     method: 'POST',
                                     body: JSON.stringify(payload)
                                   })
                                     .then(response => response.json())
                                     .then(json => {
                                         this.setState({beforeLoadingLeft: false})
                                         if (json.errorCode !== 1) {
                                             this.setState({beforeErrorLeft: true})
                                             return;
                                         }
                                       this.photoBeforeLeftSend = json.data.uid

																			 this.setState({
																				 beforeLeftLoad: `${api}/files/${json.data.uid}.${json.data.extension}`.replace(/api\//, '')
																			 })
                                     })
																		 .catch(err => {
																			 this.setState({
                                         beforeErrorLeft: true,
																				 beforeLoadingLeft: false,
																			 })
																		 })

                                 }

                                 reader.readAsDataURL(target.files[0])
                               }
                             }}/>
                      <span
                        ref="leftIcon"
                        className={styles.uploadGalleryIco}
                        style={this.state.photoBeforeLeftUrl ? {display: 'none'} : {}}
                      >
                        <svg className={styles.svgIconPhotoSide2}>
                          <use xlinkHref="#ico-photo-side-2"></use>
                        </svg>
                      </span>

                      {this.renderTitle(photoBeforeLeftIsChecked, 'Слева', this.state.photoBeforeLeftUrl, this.state.beforeLoadingLeft, this.state.beforeErrorLeft, this.state.beforeLeftLoad)}
                         <div
                           ref="leftButton"
                           className={styles.btnUpload}
                           onClick={e => {
                             e.preventDefault()
                             this.refs.inputBeforeLeft.click()
                           }}
                         >
                           {this.state.photoBeforeLeftUrl ? '' : 'Загрузить'}

                         </div>
                    </span>

                    <span className={this.state.photoBeforeLeftUrl && (photoBeforeLeftIsChecked || photoBeforeLeftIsChecked === null) ? styles.uploadGalleryImgWrapDisable : styles.uploadGalleryImgWrap}>
                       {this.renderIco(photoBeforeLeftIsChecked, this.state.photoBeforeLeftUrl, this.state.beforeLeftLoad)}
                        <img ref='beforeLeft'
                             className={styles.uploadGalleryImg}
                             onClick={e => {
                               e.preventDefault()
                               this.refs.inputBeforeLeft.click()
                             }}
                             src={this.state.photoBeforeLeftUrl} alt=""/>
                      </span>
                  </span>
                  </li>



                  <li ref="liBeforeRight"
                      className={this.state.photoBeforeRightUrl ? styles.uploadGalleryItemUploaded : styles.uploadGalleryItem}>
                <span className={styles.uploadGalleryItemInner}>

                    <span className={this.state.beforeLoadingRight || this.state.beforeErrorRight || (this.state.photoBeforeRightUrl && !photoBeforeRightIsChecked) ? styles.uploadGalleryItemOverlayPending : styles.uploadGalleryItemOverlay}
                     onClick={() => {
                      this.refs.inputBeforeRight.click()
                    }}>
                  <input ref="inputBeforeRight" type="file" accept="image/*" className={styles.uploadFileInput}
                         disabled={!this.state.beforeRightLoad && this.state.photoBeforeRightUrl && (photoBeforeRightIsChecked || photoBeforeRightIsChecked === null)}
                         onChange={input => {
                           const {target} = input
                           if (target.files && target.files[0]) {
                             var reader = new FileReader()

                             reader.onload = e => {
                               this.refs.liBeforeRight.className = styles.uploadGalleryItemUploaded
                               this.refs.beforeRight.src = e.target.result
                               this.refs.rightIcon.style.cssText = 'display: none;'
                               this.refs.rightButton.text = ""

                               const content = reader.result.replace(/data:image\/\w+;base64,/, '')
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

                                 this.setState({
                                     beforeLoadingRight: true,
                                     beforeErrorRight: false,
                                     photoBeforeRightIsChecked: null,
                                 })

                               return fetch(`${api}/data/file-upload`, {
                                 headers,
                                 method: 'POST',
                                 body: JSON.stringify(payload)
                               })
                                 .then(response => response.json())
                                 .then(json => {

                                     this.setState({beforeLoadingRight: false})
                                     if (json.errorCode !== 1) {
                                         this.setState({beforeErrorRight: true})

                                         return;
                                     }
                                   this.photoBeforeRightSend = json.data.uid

																	 this.setState({
																		 beforeRightLoad: `${api}/files/${json.data.uid}.${json.data.extension}`.replace(/api\//, '')
																	 })

                                 })
																 .catch(err => {
																	 this.setState({
                                     beforeErrorRight: true,
																		 beforeLoadingRight: false,
																	 })
																 })
                             }

                             reader.readAsDataURL(target.files[0])
                           }
                         }}/>
                  <span
                    ref="rightIcon"
                    className={styles.uploadGalleryIco}
                    style={this.state.photoBeforeRightUrl ? {display: 'none'} : {}}
                  >
                    <svg className={styles.svgIconPhotoSide3}>
                      <use xlinkHref="#ico-photo-side-3"></use>
                    </svg>
                  </span>

                    {this.renderTitle(photoBeforeRightIsChecked, 'Справа', this.state.photoBeforeRightUrl, this.state.beforeLoadingRight, this.state.beforeErrorRight, this.state.beforeRightLoad)}

                    <div
                      ref="rightButton"
                      className={styles.btnUpload}
                      onClick={e => {
                        e.preventDefault()
                        this.refs.inputBeforeRight.click()

                      }}
                    >
                        {this.state.photoBeforeRightUrl ? '' : 'Загрузить'}

                    </div>
                </span>

                   <span className={this.state.photoBeforeRightUrl && (photoBeforeRightIsChecked || photoBeforeRightIsChecked === null) ? styles.uploadGalleryImgWrapDisable : styles.uploadGalleryImgWrap}>
                     {this.renderIco(photoBeforeRightIsChecked, this.state.photoBeforeRightUrl, this.state.beforeRightLoad)}
                    <img ref='beforeRight'
                         className={styles.uploadGalleryImg}
                         onClick={e => {

                           e.preventDefault()
                           this.refs.inputBeforeRight.click()
                         }}
                         src={this.state.photoBeforeRightUrl} alt=""/>
                  </span>
                </span>
                  </li>
                </ul>


                <div className={styles.inputBox}>
                  <input
                    value={this.state.videoBefore}
                    type="text"
                    onChange={this.change.bind(this)}
                    className={styles.inputField}
                    placeholder="Ссылка на видео"
                  />
                  {/*<div className={styles.btnSecondary}>Прикрепить файл</div>*/}
                </div>

                <div className={styles.textCenter}>
                  <button type="button"
                          disabled={userPhotoUploadState !== 'before' || this.state.beforeErrorFront || this.state.beforeErrorBack|| this.state.beforeErrorRight|| this.state.beforeErrorLeft}
                          className={userPhotoUploadState !== 'before' || this.state.beforeErrorFront || this.state.beforeErrorBack|| this.state.beforeErrorRight|| this.state.beforeErrorLeft ? styles.btnCheckDisable : styles.btnCheck}
                          onClick={() => {
                            this.refs.loadingModal.show()
														const season = cookie.load('currentSeason')

                            const payload = {
                              authToken: cookie.load('token'),
                              data: {
																season: season ? season : 0,
                                photoBeforeFront: this.photoBeforeFrontSend,
                                photoBeforeBack: this.photoBeforeBackSend,
                                photoBeforeLeft: this.photoBeforeLeftSend,
                                photoBeforeRight: this.photoBeforeRightSend,

                                photoBeforeFrontUrl: this.state.beforeFrontLoad,
                                photoBeforeBackUrl: this.state.beforeBackLoad,
                                photoBeforeLeftUrl: this.state.beforeLeftLoad,
                                photoBeforeRightUrl: this.state.beforeRightLoad,
                                photoBeforeVideoExt: this.state.videoBefore

                              }
                            }

                            let url = `${api}/user/userPhoto-update`

                            if (
                              !(this.state.photoBeforeFrontUrl || this.state.beforeFrontLoad) ||
                              !(this.state.photoBeforeBackUrl || this.state.beforeBackLoad) ||
                              !(this.state.photoBeforeLeftUrl || this.state.beforeLeftLoad) ||
                              !(this.state.photoBeforeRightUrl || this.state.beforeRightLoad)
                            ) {

                              this.refs.photosModal.show()
                              return;
                            }

                            this.setState({
                              photoBeforeRightUrl: this.state.beforeRightLoad || this.state.photoBeforeRightUrl,
                              photoBeforeLeftUrl: this.state.beforeLeftLoad || this.state.photoBeforeLeftUrl,
                              photoBeforeFrontUrl: this.state.beforeFrontLoad || this.state.photoBeforeFrontUrl,
                              photoBeforeBackUrl: this.state.beforeBackLoad || this.state.photoBeforeBackUrl,
                            })
                            if (isEmpty || (!photos.data[photos.data.length - 1].photoBeforeFrontUrl &&
                                !photos.data[photos.data.length - 1].photoBeforeBackUrl &&
                                !photos.data[photos.data.length - 1].photoBeforeLeftUrl &&
                                !photos.data[photos.data.length - 1].photoBeforeRightUrl &&
                                !photos.data[photos.data.length - 1].photoBeforeVideoExt)) {
                              url = `${api}/user/userPhoto-create`
                            }


                            return fetch(url, {
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
                                } else {
                                  this.refs.errorModal.show()
                                }
                              })
                          }}
                  >Отправить на проверку
                  </button>
                </div>

              </div>}
              {/* ----------------------after------------------*/}
              {this.state.tab === 'photoAfter' && <div className={styles.stageBoxInnerCustom}>

                <h2 className={styles.h1}>Ваш фото отчет</h2>

                <p className={styles.baseParag}>До старта программы если претендуете на призы, то должны прислать фото ДО.
                  Прислать вы их можете до первого экзамена! Фото ПОСЛЕ вы присылаете после последнего экзамена.</p>

                <h4 className={styles.h3TextCenter}>Фото После</h4>

                <ul className={styles.uploadGallery}>


                  <li ref="liAfterFront"
                      className={this.state.photoAfterFrontUrl ? styles.uploadGalleryItemUploaded : styles.uploadGalleryItem}>
                <span className={styles.uploadGalleryItemInner}>

                  <span className={this.state.afterLoadingFront || this.state.afterErrorFront || (this.state.photoAfterFrontUrl && !photoAfterFrontIsChecked) ? styles.uploadGalleryItemOverlayPending : styles.uploadGalleryItemOverlay}
                        onClick={() => {
                          this.refs.inputAfterFront.click()
                        }}>
                    <input ref="inputAfterFront" type="file" accept="image/*" className={styles.uploadFileInput}
                           disabled={!this.state.afterFrontLoad && this.state.photoAfterFrontUrl && (photoAfterFrontIsChecked || photoAfterFrontIsChecked === null)}
                           onChange={input => {
                             const {target} = input
                             if (target.files && target.files[0]) {
                               var reader = new FileReader()

                               reader.onload = e => {
                                 this.refs.liAfterFront.className = styles.uploadGalleryItemUploaded
                                 this.refs.afterFront.src = e.target.result
                                 this.refs.frontIcon.style.cssText = 'display: none;'
                                 this.refs.frontButton.text = ""

                                 const content = reader.result.replace(/data:image\/\w+;base64,/, '')
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

																 this.setState({
																	 afterLoadingFront: true,
																	 afterErrorFront: false,
																	 photoAfterFrontIsChecked: null,
																 })

                                 return fetch(`${api}/data/file-upload`, {
                                   headers,
                                   method: 'POST',
                                   body: JSON.stringify(payload)
                                 })
                                   .then(response => response.json())
                                   .then(json => {

                                     this.photoAfterFrontSend = json.data.uid

																		 this.setState({
																			 afterFrontLoad: `${api}/files/${json.data.uid}.${json.data.extension}`.replace(/api\//, '')
																		 })
                                   })
																	 .catch(err => {
																		 this.setState({
																			 afterErrorFront: true,
																			 afterLoadingFront: false,
																		 })
																	 })
                               }

                               reader.readAsDataURL(target.files[0])
                             }
                           }}/>

                    <span
                      ref="frontIcon"
                      className={styles.uploadGalleryIco}
                      style={this.state.photoAfterFrontUrl ? {display: 'none'} : {}}
                    >
                      <svg className={styles.svgIconPhotoSide1}>
                        <use xlinkHref="#ico-photo-side-1"></use>
                      </svg>
                    </span>

                    {this.renderTitle(photoAfterFrontIsChecked, 'Спереди', this.state.photoAfterFrontUrl, this.state.afterLoadingFront, this.state.afterErrorFront, this.state.afterFrontLoad)}
                     <div
                       ref="frontButton"
                       className={styles.btnUpload}
                       onClick={e => {
                         e.preventDefault()
                         this.refs.inputAfterFront.click()
                       }}
                     >

                       {this.state.photoAfterFrontUrl || this.state.afterFrontLoad || this.state.afterLoadingFront ? '' : 'Загрузить'}

                     </div>
                  </span>



                  <span className={this.state.photoAfterFrontUrl && (photoAfterFrontIsChecked || photoAfterFrontIsChecked === null) ? styles.uploadGalleryImgWrapDisable : styles.uploadGalleryImgWrap}>
                      {this.renderIco(photoAfterFrontIsChecked, this.state.photoAfterFrontUrl, this.state.afterFrontLoad)}

                    <img ref='afterFront'
                         className={styles.uploadGalleryImg}
                         onClick={e => {
                           e.preventDefault()
                           this.refs.inputAfterFront.click()
                         }}
                         src={this.state.photoAfterFrontUrl} alt=""/>

                  </span>

                </span>

                  </li>


                  <li ref="liAfterBack"
                      className={this.state.photoAfterBackUrl ? styles.uploadGalleryItemUploaded : styles.uploadGalleryItem}>

                <span className={styles.uploadGalleryItemInner}>
                  <span className={this.state.afterLoadingBack || this.state.afterErrorBack || (this.state.photoAfterBackUrl && !photoAfterBackIsChecked) ? styles.uploadGalleryItemOverlayPending : styles.uploadGalleryItemOverlay}
                     onClick={() => {
                      this.refs.inputAfterBack.click()

                    }}>
                  <input ref="inputAfterBack" type="file" accept="image/*" className={styles.uploadFileInput}
                         disabled={!this.state.afterBackLoad && this.state.photoAfterBackUrl && (photoAfterBackIsChecked || photoAfterBackIsChecked === null)}
                         onChange={input => {
                           const {target} = input

                           if (target.files && target.files[0]) {
                             var reader = new FileReader()

                             reader.onload = e => {
                               this.refs.liAfterBack.className = styles.uploadGalleryItemUploaded
                               this.refs.afterBack.src = e.target.result
                               this.refs.backIcon.style.cssText = 'display: none;'
                               this.refs.backButton.text = ""

                               const content = reader.result.replace(/data:image\/\w+;base64,/, '')
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

															 this.setState({
																 afterLoadingBack: true,
																 afterErrorBack: false,
																 photoAfterBackIsChecked: null,
															 })

                               return fetch(`${api}/data/file-upload`, {
                                 headers,
                                 method: 'POST',
                                 body: JSON.stringify(payload)
                               })
                                 .then(response => response.json())
                                 .then(json => {
                                   this.photoAfterBackSend = json.data.uid

																	 this.setState({
																		 afterBackLoad: `${api}/files/${json.data.uid}.${json.data.extension}`.replace(/api\//, '')
																	 })
                                 })
																 .catch(err => {
																	 this.setState({
																		 afterErrorBack: true,
																		 afterLoadingBack: false,
																	 })
																 })
                             }

                             reader.readAsDataURL(target.files[0])
                           }
                         }}/>

                    <span
                      ref="backIcon"
                      className={styles.uploadGalleryIco}
                      style={this.state.photoAfterBackUrl ? {display: 'none'} : {}}
                    >
                      <svg className={styles.svgIconPhotoSide1}>
                        <use xlinkHref="#ico-photo-side-1"></use>
                      </svg>
                    </span>

                    {this.renderTitle(photoAfterBackIsChecked, 'Сзади', this.state.photoAfterBackUrl, this.state.afterLoadingBack, this.state.afterErrorBack, this.state.afterBackLoad)}
                     <div
                       ref="backButton"
                       className={styles.btnUpload}
                       onClick={e => {
                         e.preventDefault()
                         this.refs.inputAfterBack.click()
                       }}
                     >

                       {this.state.photoAfterBackUrl || this.state.afterBackLoad || this.state.afterLoadingBack ? '' : 'Загрузить'}

                     </div>

                  </span>

                    <span className={this.state.photoAfterBackUrl && (photoAfterBackIsChecked || photoAfterBackIsChecked === null) ? styles.uploadGalleryImgWrapDisable : styles.uploadGalleryImgWrap}>
                      {this.renderIco(photoAfterBackIsChecked, this.state.photoAfterBackUrl, this.state.afterBackLoad)}
                      <img ref='afterBack'
                           className={styles.uploadGalleryImg}
                           onClick={e => {
                             e.preventDefault()
                             this.refs.inputAfterBack.click()
                           }}

                           src={this.state.photoAfterBackUrl} alt=""/>

                  </span>

                  </span>
                  </li>


                  <li ref="liAfterLeft"
                      className={this.state.photoAfterLeftUrl ? styles.uploadGalleryItemUploaded : styles.uploadGalleryItem}>
                  <span className={styles.uploadGalleryItemInner}>
                      <span className={this.state.afterLoadingLeft || this.state.afterErrorLeft || (this.state.photoAfterLeftUrl && !photoAfterLeftIsChecked) ? styles.uploadGalleryItemOverlayPending : styles.uploadGalleryItemOverlay}
                         onClick={() => {
                           this.refs.inputAfterLeft.click()

                         }}>
                      <input ref="inputAfterLeft" type="file" accept="image/*" className={styles.uploadFileInput}
                             disabled={!this.state.afterLeftLoad && this.state.photoAfterLeftUrl && (photoAfterLeftIsChecked || photoAfterLeftIsChecked === null)}
                             onChange={input => {
                               const {target} = input
                               if (target.files && target.files[0]) {
                                 var reader = new FileReader()

                                 reader.onload = e => {
                                   this.refs.liAfterLeft.className = styles.uploadGalleryItemUploaded
                                   this.refs.afterLeft.src = e.target.result
                                   this.refs.leftIcon.style.cssText = 'display: none;'
                                   this.refs.leftButton.text = ""

                                   const content = reader.result.replace(/data:image\/\w+;base64,/, '')
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

																	 this.setState({
																		 afterLoadingLeft: true,
																		 afterErrorLeft: false,
																		 photoAfterLeftIsChecked: null,
																	 })

                                   return fetch(`${api}/data/file-upload`, {
                                     headers,
                                     method: 'POST',
                                     body: JSON.stringify(payload)
                                   })
                                     .then(response => response.json())
                                     .then(json => {
                                       this.photoAfterLeftSend = json.data.uid

																			 this.setState({
																				 afterLeftLoad: `${api}/files/${json.data.uid}.${json.data.extension}`.replace(/api\//, '')
																			 })
                                     })
																		 .catch(err => {
																			 this.setState({
																				 afterErrorLeft: true,
																				 afterLoadingLeft: false,
																			 })
																		 })
                                 }

                                 reader.readAsDataURL(target.files[0])
                               }
                             }}/>
                      <span
                        ref="leftIcon"
                        className={styles.uploadGalleryIco}
                        style={this.state.photoAfterLeftUrl ? {display: 'none'} : {}}

                      >
                        <svg className={styles.svgIconPhotoSide2}>
                          <use xlinkHref="#ico-photo-side-2"></use>
                        </svg>
                      </span>

                        {this.renderTitle(photoAfterLeftIsChecked, 'Слева', this.state.photoAfterLeftUrl, this.state.afterLoadingLeft, this.state.afterErrorLeft, this.state.afterLeftLoad)}
                         <div
                           ref="leftButton"
                           className={styles.btnUpload}
                           onClick={e => {
                             e.preventDefault()
                             this.refs.inputBeforeLeft.click()
                           }}
                         >

                           {this.state.photoAfterLeftUrl || this.state.afterLeftLoad || this.state.afterLoadingLeft ? '' : 'Загрузить'}

                         </div>
                    </span>

                    <span className={this.state.photoAfterLeftUrl && (photoAfterLeftIsChecked || photoAfterLeftIsChecked === null) ? styles.uploadGalleryImgWrapDisable : styles.uploadGalleryImgWrap}>
                      {this.renderIco(photoAfterLeftIsChecked, this.state.photoAfterLeftUrl, this.state.afterLeftLoad)}
                        <img ref='afterLeft'
                             className={styles.uploadGalleryImg}
                             onClick={e => {
                               e.preventDefault()
                               this.refs.inputAfterLeft.click()
                             }}
                             src={this.state.photoAfterLeftUrl} alt=""/>
                      </span>
                  </span>
                  </li>


                  <li ref="liAfterRight"
                      className={this.state.photoAfterRightUrl ? styles.uploadGalleryItemUploaded : styles.uploadGalleryItem}>
                <span className={styles.uploadGalleryItemInner}>
                  <span className={this.state.afterLoadingRight || this.state.afterErrorRight || (this.state.photoAfterRightUrl && !photoAfterRightIsChecked) ? styles.uploadGalleryItemOverlayPending : styles.uploadGalleryItemOverlay}
                     onClick={() => {
                      this.refs.inputAfterRight.click()

                    }}>
                  <input ref="inputAfterRight" type="file" accept="image/*" className={styles.uploadFileInput}
                         disabled={!this.state.afterRightLoad && this.state.photoAfterRightUrl && (photoAfterRightIsChecked || photoAfterRightIsChecked === null)}
                         onChange={input => {
                           const {target} = input
                           if (target.files && target.files[0]) {
                             var reader = new FileReader()

                             reader.onload = e => {
                               this.refs.liAfterRight.className = styles.uploadGalleryItemUploaded
                               this.refs.afterRight.src = e.target.result
                               this.refs.rightIcon.style.cssText = 'display: none;'
                               this.refs.rightButton.text = ""

                               const content = reader.result.replace(/data:image\/\w+;base64,/, '')
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

															 this.setState({
																 afterLoadingRight: true,
																 afterErrorRight: false,
																 photoAfterRightIsChecked: null,
															 })

                               return fetch(`${api}/data/file-upload`, {
                                 headers,
                                 method: 'POST',
                                 body: JSON.stringify(payload)
                               })
                                 .then(response => response.json())
                                 .then(json => {

                                   this.photoAfterRightSend = json.data.uid

																	 this.setState({
																		 afterRightLoad: `${api}/files/${json.data.uid}.${json.data.extension}`.replace(/api\//, '')
																	 })
                                 })
																 .catch(err => {
																	 this.setState({
																		 afterErrorRight: true,
																		 afterLoadingRight: false,
																	 })
																 })
                             }

                             reader.readAsDataURL(target.files[0])
                           }
                         }}/>
                  <span
                    ref="rightIcon"
                    className={styles.uploadGalleryIco}
                    style={this.state.photoAfterRightUrl ? {display: 'none'} : {}}
                  >
                    <svg className={styles.svgIconPhotoSide3}>
                      <use xlinkHref="#ico-photo-side-3"></use>
                    </svg>
                  </span>

                    {this.renderTitle(photoAfterRightIsChecked, 'Справа', this.state.photoAfterRightUrl, this.state.afterLoadingRight, this.state.afterErrorRight, this.state.afterRightLoad)}
                    <div
                      ref="rightButton"
                      className={styles.btnUpload}
                      onClick={e => {
                        e.preventDefault()
                        this.refs.inputAfterRight.click()
                      }}
                    >

                        {this.state.photoAfterRightUrl || this.state.afterRightLoad || this.state.afterLoadingRight ? '' : 'Загрузить'}

                    </div>
                </span>

                  <span className={this.state.photoAfterRightUrl && (photoAfterRightIsChecked || photoAfterRightIsChecked === null) ? styles.uploadGalleryImgWrapDisable : styles.uploadGalleryImgWrap}>
                    {this.renderIco(photoAfterRightIsChecked, this.state.photoAfterRightUrl, this.state.afterRightLoad)}
                    <img ref='afterRight'
                       className={styles.uploadGalleryImg}
                       onClick={e => {
                         e.preventDefault()
                         this.refs.inputAfterRight.click()
                       }}
                       src={this.state.photoAfterRightUrl} alt=""/>
                  </span>
                </span>
                  </li>
                </ul>

                <div className={styles.inputBox}>

                  <input value={this.state.videoAfter}
                         type="text"
                         onChange={this.changeVideoAfter.bind(this)}
                         className={styles.inputField}
                         placeholder="Ссылка на видео"/>
                  {/*  <div className={styles.btnSecondary}>Прикрепить файл</div>*/}

                </div>


                <div className={styles.textCenter}>

                  <button type="button"
                          disabled={userPhotoUploadState !== 'after'}
                          className={userPhotoUploadState !== 'after' ? styles.btnCheckDisable : styles.btnCheck}
                          onClick={() => {
                            this.refs.loadingModal.show()
														const season = cookie.load('currentSeason')

                            const payload = {
                              authToken: cookie.load('token'),
                              data: {
																season: season ? season : 0,
                                photoAfterFront: this.photoAfterFrontSend,
                                photoAfterBack: this.photoAfterBackSend,
                                photoAfterLeft: this.photoAfterLeftSend,
                                photoAfterRight: this.photoAfterRightSend,

                                photoAfterFrontUrl: this.state.afterFrontLoad,
                                photoAfterBackUrl: this.state.afterBackLoad,
                                photoAfterLeftUrl: this.state.afterLeftLoad,
                                photoAfterRightUrl: this.state.afterRightLoad,

                                photoAfterVideoExt: this.state.videoAfter


                              }
                            }


                            let url = `${api}/user/userPhoto-update`


                            if (
                              !(this.state.photoAfterFrontUrl || this.state.afterFrontLoad) ||
                              !(this.state.photoAfterBackUrl || this.state.afterBackLoad) ||
                              !(this.state.photoAfterLeftUrl || this.state.afterLeftLoad) ||
                              !(this.state.photoAfterRightUrl || this.state.afterRightLoad)
                            ) {
                              this.refs.photosModal.show()
                              return;
                            }
                            this.setState({
                              photoAfterFrontUrl: this.state.afterFrontLoad || this.state.photoAfterFrontUrl,
                              photoAfterBackUrl: this.state.afterBackLoad || this.state.photoAfterBackUrl,
                              photoAfterLeftUrl: this.state.afterLeftLoad || this.state.photoAfterLeftUrl,
                              photoAfterRightUrl: this.state.afterRightLoad || this.state.photoAfterRightUrl,
                            })

                            if (isEmpty || (!photos.data[photos.data.length - 1].photoBeforeFrontUrl &&
                                !photos.data[photos.data.length - 1].photoBeforeBackUrl &&
                                !photos.data[photos.data.length - 1].photoBeforeLeftUrl &&
                                !photos.data[photos.data.length - 1].photoBeforeRightUrl &&
                                !photos.data[photos.data.length - 1].photoBeforeVideoExt)) {
                              url = `${api}/user/userPhoto-create`
                            }

                            return fetch(url, {
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
                                } else {
                                  this.refs.errorModal.show()
                                }
                              })
                          }}
                  >Отправить на проверку
                  </button>
                </div>


              </div>}
            </div>}

          </div> : <Loader/>
        }
        <Modal ref='loadingModal' modalStyle={modalStyle} contentStyle={contentStyle}>
          <div className={styles.entryHeader}>
            <h2 className={styles.entryTitleCenter}>Загружается...</h2>
          </div>
          <div className={styles.textCenter}>
            <div className={styles.loaderMain}></div>
          </div>
        </Modal>
        <Modal ref='photosModal' modalStyle={modalStyle} contentStyle={contentStyle}>
          <h2>Загрузите все фотографии!</h2>
          <br/>
          <button className={styles.btnAction} onClick={() => {
            this.refs.photosModal.hide()
            this.refs.loadingModal.hide()
          }}>
            Продолжить
          </button>
        </Modal>

        <Modal ref='errorModal' modalStyle={modalStyle} contentStyle={contentStyle}>
          <h2>Что-то пошло не так, попробуйте снова</h2>
          <br/>
          <button className={styles.btnAction} onClick={() => {
            this.refs.errorModal.hide()
          }}>
            Продолжить
          </button>
        </Modal>
        <Modal ref='successModal' modalStyle={modalStyle} contentStyle={contentStyle}>
          <h2>Фотографии и видео отправлены на проверку!</h2>
          <br/>
          <button className={styles.btnAction} onClick={() => {
            this.refs.successModal.hide()
          }}>
            Продолжить
          </button>
        </Modal>

        <ul className={styles.menuMobBottom}>
          <li className={styles.menuMobBottomItem}>
            <a href="#" className={styles.menuMobBottomItemInner} onClick={
              () => browserHistory.push('/task')
            }>

          <span className={styles.menuMobBottomIco}>
            <svg className={styles.svgIcoTasksMobile}>
              <use xlinkHref="#ico-m-tasks"></use>
            </svg>
          </span>
              <span className={styles.menuMobBottomTitle}>Задания</span>
            </a>
          </li>

          <li className={styles.menuMobBottomItem}>
            <a href="#" className={styles.menuMobBottomItemInner} onClick={
              () => browserHistory.push('/food')
            }>
          <span className={styles.menuMobBottomIco}>
            <svg className={styles.svgIcoFoodMobile}>
              <use xlinkHref="#ico-m-food"></use>
            </svg>
          </span>
              <span className={styles.menuMobBottomTitle}>Питание</span>
            </a>
          </li>

          <li className={styles.menuMobBottomItem}>
            <a href="#" className={styles.menuMobBottomItemInner} onClick={
              () => browserHistory.push('/chats')
            }>
      <span className={styles.menuMobBottomIco}>
        <svg className={styles.svgIcoPhoto}>
          <use xlinkHref="#ico-chat"></use>
        </svg>
      </span>
              <span className={styles.menuMobBottomTitle}>Чат</span>
            </a>
          </li>

          <li className={styles.menuMobBottomItem}>
            <a href="#" className={styles.menuMobBottomItemInner} onClick={
              () => browserHistory.push('/photos')
            }>
          <span className={styles.menuMobBottomIco}>
            <svg className={styles.svgIcoPhoto}>
              <use xlinkHref="#ico-photo"></use>
            </svg>
          </span>
              <span className={styles.menuMobBottomTitle}>Фото</span>
            </a>
          </li>
        </ul>

        <div className="menu-mob-left">
          <div className="menu-mob-left__inner">
            <div className="menu-mob-left__ico-close">
              <svg className={styles.svgIcoClose}>
                <use xlinkHref="#ico-close"></use>
              </svg>
            </div>
            <div className="menu-mob-left__logo">
              <LogoLink/>
            </div>
            <ul className={styles.mainNav}>
              <li className="main-nav__item main-nav__item--active">
                <a href="#" className="main-nav__item-inner">
                  <svg className={styles.svgIcoTasksMobile}>
                    <use xlinkHref="#ico-m-tasks"></use>
                  </svg>
                  <span className="main-nav__title">Задания222</span>
                </a>
              </li>
              <li className={styles.mainNavItem}>
                <a href="#" className="main-nav__item-inner">
                  <svg className={styles.svgIcoBookMobile}>
                    <use xlinkHref="#ico-m-book"></use>
                  </svg>
                  <span className="main-nav__title">Зачетка</span>
                </a>
              </li>
              <li className={styles.mainNavItem}>
                <a href="#" className="main-nav__item-inner">
                  <svg className={styles.svgIcoFoodMobile}>
                    <use xlinkHref="#ico-m-food"></use>
                  </svg>
                  <span className="main-nav__title">Питание</span>
                </a>
              </li>
              <li className={styles.mainNavItem}>
                <a href="#" className="main-nav__item-inner">
                  <svg className={styles.svgIcoFaqMobile}>
                    <use xlinkHref="#ico-m-faq"></use>
                  </svg>
                  <span className="main-nav__title">Вопросы/Ответы</span>
                </a>
              </li>
            </ul>
            <hr/>
            <div className={styles.profile}>
              <a href="#">
                <p className={styles.profileName}>Анна Иванова</p>
                <p className={styles.profileSubText}>Профиль</p>
              </a>
            </div>
            <hr/>
            <ul className="banner-ls banner-ls--menu-mob-left">
              <li className="banner-ls__item">
                <a href="#">
                  <div className="banner-ls__img">
                    <img src="tmp/banner-2.png" alt=""/>
                  </div>
                  <p className="banner-ls__desc">В твой выходной день только сегодня TezTour дарит -10% на тур</p>
                </a>
              </li>
              <li className="banner-ls__item">
                <a href="#">
                  <div className="banner-ls__img">
                    <img src="tmp/banner-1.png" alt=""/>
                  </div>
                </a>
              </li>
            </ul>
            <hr/>
            <div className={styles.btnAction}>Выйти из кабинета</div>
          </div>
        </div>
      </Layout>
    )
  }
}

const mapStateToProps = state => {

  const {selectedPhotos, sign, recivedPhotos, userInfo, taskDayData, selectedTaskDay, userToken, showMobileLeftMenu} = state

  const {
    isFetching,
    photos
  } = recivedPhotos[selectedPhotos] || {
    isFetching: true,
    photos: {}
  }

  return {
    selectedPhotos,
    showMobileLeftMenu,
    taskDayData,
    sign,
    isFetching,
    selectedTaskDay,
    photos,
    userInfo,
    token: userToken.token
  }
}

const mapDispatchToProps = dispatch => ({
  setTypeId: bindActionCreators(actions.setTypeId, dispatch),
  changeChatType: bindActionCreators(actions.changeChatType, dispatch),
  clearRenderChat: bindActionCreators(actions.clearRenderChat, dispatch),
  showLeftMenu: bindActionCreators(
    () => dispatch({type: 'SHOW_LEFT_MENU', show: true}),
    dispatch
  ),
  hideLeftMenu: bindActionCreators(
    () => dispatch({type: 'SHOW_LEFT_MENU', show: false}),
    dispatch
  ),
  dispatch

})

Photos = connect(
  mapStateToProps,
  mapDispatchToProps
)(Photos)

export default CSSModules(Photos, styles)
