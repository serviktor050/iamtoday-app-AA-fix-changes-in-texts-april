import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux'
import {
  fetchSmmPosts,
  answerToChat,
  fetchLikePosts,
  SMM_CHAT_ID
} from '../actions'
import CSSModules from 'react-css-modules'
import styles from './smm.css'
import Loader from '../components/componentKit/Loader'
import Layout from '../components/componentKit2/Layout'
import PostItem from '../components/profile/PostItem'
import Modal from 'boron-react-modal/FadeModal';
import classNames from 'classnames';
import { api, host, domen } from '../config.js'
import { dict } from 'dict';
const isAlfa = domen.isAlfa;


let contentStyle = {
  borderRadius: '18px',
  textAlign: 'center',
  padding: '30px'
}
const modalStyle={
  maxWidth: '500px',
  width: '90%'
}
/**
 *  Контейнер Smm.
 *  Используется для отображения страницы smm
 *
 */

class Smm extends Component {

  state = {
    showAllComments: false,
    showEmojiPopup: false,
    message: ''
  }
  /**
   * @memberof ChatPage
   * @prop {object} propTypes - the props that are passed to this component
   * @prop {func} propTypes.clearRenderChat Очистка чата
   * @prop {func} propTypes.setMenuList установка выбранной старницы в меню
   * @prop {func} propTypes.fetchTaskDayIfNeeded Получение данных для страницы дня
   * @prop {object} propTypes.userInfo Данные пользователя
   *
   * */

  componentDidMount(){
    const {fetchSmmPosts, smm, sign} = this.props;
    if (smm && smm.posts && smm.posts.length) {
      return;
    }
    fetchSmmPosts(smm.skip, smm.take, sign.isRegistered);
  }
  componentWillReceiveProps(nextProps){
    const {fetchSmmPosts, smm, sign} = this.props;

    if(sign.isRegistered !== nextProps.sign.isRegistered){
      const skip = {
        auth: 0,
        notAuth: 0
      };
			fetchSmmPosts(skip, smm.take, nextProps.sign.isRegistered)
    }
  }

  loadMore(){
    const { fetchSmmPosts, smm, sign } = this.props;
    fetchSmmPosts(smm.skip, smm.take, sign.isRegistered, true, true);
  }

  renderPosts(){
    const {smm, answerToChat, userInfo, sign, fetchLikePosts, pollWasSend, lang } = this.props;
    const {posts, counter} = smm;
    const postOdd = posts.filter((item, idx) => idx % 2 !== 0);
    const postEven = posts.filter((item, idx) => idx % 2 === 0);

    return (
      <div className={classNames(styles.layoutSmm, {
          [styles.alfa]:isAlfa
      })}>
        <div className="layout__wrap layout__wrap--mobile">
            {
              posts.map(item => {
                return(
                  <PostItem
                    key={'post-' + item.id}
                    item={item}
                    answerToChat={answerToChat}
                    fetchLikePosts={fetchLikePosts}
                    userInfo={userInfo}
                    sign={sign}
                    pollWasSend={pollWasSend}
                    lang={lang}
                  />
                )
              })
            }
        </div>
        <div className="layout__wrap layout__wrap--desktop">
          {
            postEven.map(item => {
              return(
                <PostItem
                  key={'post-' + item.id}
                  item={item}
                  sign={sign}
                  answerToChat={answerToChat}
                  fetchLikePosts={fetchLikePosts}
                  userInfo={userInfo}
                  pollWasSend={pollWasSend}
                />
              )
            })
          }
        </div>
        <div className="layout__wrap layout__wrap--desktop">
          {
            postOdd.map(item => {
              return(
                <PostItem
                  key={'post-' + item.id}
                  item={item}
                  sign={sign}
                  answerToChat={answerToChat}
                  fetchLikePosts={fetchLikePosts}
                  userInfo={userInfo}
                  pollWasSend={pollWasSend}
                />
              )
            })
          }
        </div>
        {counter !== posts.length && <div className={styles.btnMore} onClick ={() => this.loadMore()}>{dict[lang]['moreLoad']}</div>}
      </div>
    )
  }

  render() {
    const {smm, location, userInfo} = this.props;
    const {posts, isLoading, isLoad, isError} = smm;

    document.body.style.backgroundColor = "#fff";
    document.body.style.backgroundImage = 'url(/assets/img/antiage/pt.png) repeat';

    return  (
      <div>
        <Layout
          scroller={true}
          isLoadSmm={isLoad}
          page={'news'}
          errorModal={this.refs.errorModal}
          loadingModal={this.refs.loadingModal}
          smm={true}
          location={location}
        >
          {this.renderPosts()}
        </Layout>
        <Modal ref='errorModal' modalStyle={modalStyle} contentStyle={contentStyle}>
          <h2 className={styles.entryTitle}>Неправильный e-mail или пароль</h2>
          <br/>
          <button className={styles.buttonAction} onClick={() => this.refs.errorModal.hide()}>
            Продолжить
          </button>
        </Modal>
        <Modal ref='loadingModal' contentStyle={contentStyle} backdrop={false}>
          <div className={styles.entryHeader}>
            <h2 className={styles.entryTitleCenter}>Загружается...</h2>
          </div>
          <div className={styles.textCenter}>
            <div className={styles.loaderMain}></div>
          </div>
        </Modal>
      </div>
    )
  }
}

const mapStateToProps = state => {
  const { smm, userInfo, sign, pollWasSend, lang } = state;
  return {
    smm,
    sign,
    userInfo,
    pollWasSend,
    lang
  }
};

Smm = connect(
  mapStateToProps,
  {
    fetchSmmPosts,
    fetchLikePosts,
    answerToChat
  }

)(Smm);

export default CSSModules(Smm, styles)
