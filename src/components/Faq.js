import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux'
import * as actions from '../actions'
import { bindActionCreators } from 'redux'
import Loader from '../components/componentKit/Loader'
import { dict } from 'dict';
import {
  Entity,
  Editor,
  EditorState,
  convertFromRaw,
  CompositeDecorator
} from 'draft-js'
import {getCustomStyleMap} from 'draftjs-utils'
import CSSModules from 'react-css-modules'
import styles from './faq.css'
import Layout from '../components/componentKit2/Layout'

const customStyleMap = getCustomStyleMap()

const offset = { left: '-45px' }
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
/**
 *  Контейнер Faq
 *  Используется для страницы Вопросы и ответы (/faq)
 *
 */
class Faq extends Component {
  /**
   * @memberof Faq
   * @prop {func} propTypes.fetchFaq Получение данныз с сервера
   * @prop {object} propTypes.faq Объет для рендеринга
   *
   * */
  static propTypes = {
    fetchFaq: PropTypes.func.isRequired,
    faq: PropTypes.object.isRequired
  }
  componentWillMount(){
    const {fetchFaq, faq} = this.props
    if(faq.data.faqs){
      return;
    }
    fetchFaq()
  }
  componentDidMount() {
    window.location.hash = window.decodeURIComponent(window.location.hash)
    const scrollToAnchor = () => {
      const hashParts = window.location.hash.split('#')
      if (hashParts.length > 2) {
        const hash = hashParts.slice(-1)[0]
        document.querySelector(`#${hash}`).scrollIntoView()
      }
    }
    scrollToAnchor()
    window.onhashchange = scrollToAnchor
  }

  render () {
    const { location: hash, dispatch, faq, userInfo, location, lang} = this.props
    const {activeAccordionFaqItems, data, isFetching, isLoad, isError} = faq

    const checkIsActive = item => (activeAccordionFaqItems.indexOf(item) !== -1)
    const activeItem = (e, item) => {
      let id = e.target.getAttribute('data-id')

      if (checkIsActive(item)) {
        dispatch({type: 'DELETE_ACCORDION_FAQ_ITEM', item})
        window.location.hash = ''
      } else {
        dispatch({type: 'ADD_ACCORDION_FAQ_ITEM', item})
        window.location.hash = '#' + id
      }
    }

    return (
      <Layout scroller={true} location={location} page={'faq'} prevSeasons={userInfo.data.prevSeasons}>
        {!faq.isLoad
          ? (faq.isFetching
            ? <Loader/>
            : <div><p>Если вы видите это окно, значит возникла ошибка! Напишите нам на почту av@todayme.ru и опишите сложившуюся ситуацию.</p></div>)
          :
        <div className={styles.stageBoxSmallPadding}>

            <div className={styles.title}>{dict[lang]['faq']}</div>
            <ul className={styles.accordion}>
              {!isFetching && isLoad && data.faqs.map((item, index)=> {
                let render, video
                if(!item.editor){
                  render = item.list.map(it => {
                    let  link, ans
                    link = it.link ? 'block' : 'none'
                    ans = it.ans ? it.ans.map((line, index) => {

                      if (!line) {

                        return <div className={styles.numListDescriptionEmpty}/> ;
                      }

                      return (<p key={index} className={styles.numListDescription}>
                        {line}
                      </p>)
                  }) : null


                    return (<li key={item.id + it.id} className={styles.numListItem}>
                      <span className={styles.numListNumber}>{it.id}.</span>
                      <h6 className={styles.numListTitle}>{it.qs}</h6>
                      {ans}
                      <p className={styles.numListDescription} style={{display:{link}}}>
                        <span>{it.ans1}</span>
                        <a href={it.href}>{it.link}</a>
                        <span>{it.ans2}</span>
                      </p>
                    </li>)
                  })
                } else {
                  const editorState = data.editorAns[item.id] ? EditorState.createWithContent(convertFromRaw(data.editorAns[item.id]), decorator) : EditorState.createEmpty()
                  render = <Editor
                    readOnly={true}
                    customStyleMap={customStyleMap}
                    editorState={editorState}
                    blockRendererFn={mediaBlockRenderer}
                  />


                  video = item.video.length && item.video[0] ? item.video.map((vid, index )=> (
                    <iframe key={'video' + index} className={styles.accordionVideo} src={vid} frameBorder="0" allowFullScreen></iframe>
                    )) : null
                }

              return (<li id={item.id} onClick={(e) => activeItem(e, index)} key ={item.id} className={checkIsActive(index) || hash.hash === '#' + item.id ? styles.accordionItemActive : styles.accordionItem } >
                <div  className={styles.accordionHeader}>
                  <div className={styles.accordionIcon}>
                    {
                      checkIsActive(index) ?
                        <svg data-id={item.id} className={styles.svgIconList}>
                          <use xlinkHref="#x"></use>
                        </svg> :

                        <svg data-id={item.id} className={styles.svgIconList}>
                          <use xlinkHref="#list"></use>
                        </svg>
                    }
                  </div>
                  <p   className={styles.h3AccordionHeaderTitle}>{item.title}</p>
                  <span data-id={item.id} className={styles.btnBase}>
                        <span data-id={item.id} className={styles.btnTitle}>Показать</span>

                        <span data-id={item.id} className={styles.btnIco}>
                          <svg data-id={item.id} className={styles.svgIconBoldArrowDown}>
                            <use xlinkHref="#ico-bold-arrow-down"></use>
                          </svg>
                        </span>
                    </span>
                </div>
                <div className={styles.accordionContent}>
                  <ul className={styles.numList}>
                    {render}
                    {video}
                  </ul>
                </div>
              </li>)
            })}

            </ul>
              </div>}
      </Layout>

    )
  }
}

const mapDispatchToProps = dispatch => ({
  fetchFaq: bindActionCreators(actions.fetchFaq, dispatch),
  dispatch
})
const mapStateToProps = state => {
  const { faq, userInfo, lang} = state
  return {
    faq,
    userInfo,
    lang
  }
}

Faq = connect(
  mapStateToProps,
  mapDispatchToProps
)(Faq)

export default CSSModules(Faq, styles)
