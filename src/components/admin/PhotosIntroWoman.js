import React, { Component } from 'react'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import * as actions from '../../actions'
import Header from '../componentKit/Header'
import LoadingView from '../componentKit/LoadingView'
import cookie from 'react-cookie'
import { api } from '../../config.js'
import Modal from 'boron-react-modal/FadeModal'
import MenuButton from '../componentKit/MenuButton'
import { Editor } from 'react-draft-wysiwyg'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import CSSModules from 'react-css-modules'
import styles from './photosIntro.css'

let contentStyle = {
  borderRadius: '18px',
  padding: '30px'
}

class PhotosIntro extends Component {
  componentDidMount() {
    const { dispatch, selectedPhotosIntro, selectPhotoFaq } = this.props
    dispatch(actions.fetchPhotosIntroIfNeeded(selectedPhotosIntro, selectPhotoFaq.currentValue))
  }

  componentWillReceiveProps(nextProps) {
    const { dispatch, selectedPhotosIntro } = nextProps

    if (nextProps.selectedPhotosIntro !== this.props.selectedPhotosIntro) {
      dispatch(actions.fetchPhotosIntroIfNeeded(selectedPhotosIntro, this.props.selectPhotoFaq.currentValue))
    }
  }

  uploadImageCallBack(file) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest()
      xhr.open('POST', 'https://api.imgur.com/3/image')
      xhr.setRequestHeader('Authorization', 'Client-ID 8d26ccd12712fca')
      const data = new FormData()
      data.append('image', file)
      xhr.send(data)
      xhr.addEventListener('load', () => {
        const response = JSON.parse(xhr.responseText)
        resolve(response)
      })
      xhr.addEventListener('error', () => {
        const error = JSON.parse(xhr.responseText)
        reject(error)
      })
    })
  }

  render() {
    const { photosIntro, token, isFetching, editor, content, selectedPhotosIntro, dispatch, selectPhotoFaq } = this.props
    return (
      <div className={styles.layout}>
        <Header burger={false} isTask={true}/>
        {isFetching
          ? <LoadingView title="??????????????????????..."/>
          : <div style={{ opacity: isFetching ? 0.5 : 1 }}>
              <div className={styles.layoutInner}>
                <div className={styles.grid}>
                  <div className={styles.gridCellLayoutMenu14}>
                    <div className={styles.gridLayoutMenuInner}>
                      <div className={styles.gridCellLayout66}>
                        <ul className={styles.mainNav}>
                          <li className={styles.mainNavItem}>
                            <MenuButton onClick={() => {
                              browserHistory.push('/superadmin/day')
                            }} icon="ico-m-book">
                              ?????????????? ????????
                            </MenuButton>
                          </li>
                          <li className={styles.mainNavItem}>
                            <MenuButton onClick={() => {
                              browserHistory.push('/userReports/pendingProfiles')
                            }} icon="ico-m-tasks">????????????</MenuButton>
                          </li>
                          <li className={styles.mainNavItem}>
                            <MenuButton onClick={() => {
                              browserHistory.push('/superadmin/food')
                            }} icon="ico-m-food">??????????????</MenuButton>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div className={styles.gridCellLayoutContentPocket34}>
                    <div className={styles.stageBoxSmallPadding}>
                      <div className={styles.grid}>
                        <div className={styles.deskGridCell12Mb30}>
                          <button type className={styles.btnPrimary} onClick={data => {
                            this.refs.loadingModal.show()
                            const payload = {
                              authToken: token ? token : cookie.load('token'),
                              data: {
                                paramName: selectPhotoFaq.currentValue,
                                paramValue: JSON.stringify(content[selectPhotoFaq.currentValue])
                              }
                            }

                            const headers = {
                              'Accept': 'application/json',
                              'Content-Type': 'application/json'
                            }

                            const method = 'POST'
                            return fetch(`${api}/data/siteParam-set`, {
                              headers,
                              method,
                              body: JSON.stringify(payload)
                            })
                            .then(response => response.json())
                            .then(json => {

                              this.refs.loadingModal.hide()
                              if (json.errorCode === 1) {
                                this.refs.successPromoModal.show()
                              } else {
                                this.refs.errorModal.show()
                              }
                            })
                          }}>
                            ??????????????????
                          </button>
                        </div>
                      </div>

                      <Editor
                        toolbarClassName="home-toolbar"
                        wrapperClassName="home-wrapper"
                        editorClassName="home-editor"
                        placeholder="???????????????? ??????????..."
                        onChange={(editorContent) => {
                          const { dispatch } = this.props

                          dispatch({ type: 'CONTENT', content: editorContent, index: selectPhotoFaq.currentValue })
                        }}
                        contentState={photosIntro.data.paramValue && photosIntro.data.paramValue !== 'html'
                          ? JSON.parse(photosIntro.data.paramValue)
                          : editor[0]
                        }
                        uploadCallback={this.uploadImageCallBack}
                      />
                    </div>
                  </div>
                </div>
                <Modal ref='loadingModal' contentStyle={contentStyle}>
                  <div className={styles.entryHeader}>
                    <h2 className={styles.entryTitleCenter}>??????????????????????...</h2>
                  </div>
                  <div className={styles.textCenter}>
                    <div className={styles.loaderMain}></div>
                  </div>
                </Modal>
                <Modal ref='errorModal' contentStyle={contentStyle}>
                  <h2>??????-???? ?????????? ???? ??????, ???????????????????? ??????????</h2>
                  <br/>
                  <button className={styles.btnAction} onClick={() => {
                    this.refs.loadingModal.hide()
                    this.refs.errorModal.hide()
                  }}>
                    ????????????????????
                  </button>
                </Modal>
                <Modal ref='successPromoModal' contentStyle={contentStyle}>
                  <h2>?????????????????? ??????????????????</h2>
                  <br/>
                  <button className={styles.btnAction} onClick={() => {
                    this.refs.loadingModal.hide()
                    dispatch(actions.fetchPhotosIntroIfNeeded(selectedPhotosIntro, selectPhotoFaq.currentValue))
                  }}>
                    ????????????????????
                  </button>
                </Modal>
              </div>
            </div>
          }
      </div>
    )
  }
}

const mapStateToProps = state => {
  const { selectedPhotosIntro, recivedPhotosIntro, editor, content, selectPhotoFaq } = state

  const {
    isFetching,
    photosIntro
  } = recivedPhotosIntro[selectedPhotosIntro] || {
    isFetching: true,
    photosIntro: {}
  }

  return {
    selectPhotoFaq,
    selectedPhotosIntro,
    isFetching,
    photosIntro,
    editor,
    content
  }
}

PhotosIntro = connect(
  mapStateToProps
)(PhotosIntro)

export default CSSModules(PhotosIntro, styles)
