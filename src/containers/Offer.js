import React, { Component } from 'react';
import { connect } from 'react-redux';
import CSSModules from 'react-css-modules';
import styles from './offer.css';
import LogoLink from '../components/componentKit/LogoLink';
import { browserHistory, Link } from 'react-router';
import { api, host, domen } from '../config.js';
import classNames from 'classnames';
import { rules, agreement, offer, contractData, contractChat } from 'utils/data';
import { title, fav16, fav32 } from 'utils/helmet';
import {Helmet} from "react-helmet";
import { dict } from  'dict';
import cookie from 'react-cookie'

import {
    Entity,
    Editor,
    EditorState,
    convertFromRaw,
    CompositeDecorator
} from 'draft-js'
import { getCustomStyleMap } from 'draftjs-utils';

const isAlfa = domen.isAlfa

let srcLogo = "/assets/img/antiage/logo.png";

if(isAlfa){
    srcLogo = "/assets/img/alfa/logo-energy.svg";
    //srcLogoMobile = "/assets/img/alfa/logo-energy.svg";
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

class Offer extends Component {

  state = {
    rules: false,
    data: offer
  }

  componentDidMount(){
    const path = this.props.location.pathname;

    const lang = cookie.load('AA.lang') || this.props.lang;
    const isContract = this.props.location.query.contract;
    const isContractChats = this.props.location.query.contractChats;
    if (isContract) {
      this.setState({
        data: dict[lang].contractData
      })
    } else if(isContractChats) {
      this.setState({
        data: dict[lang].contractChats
      })
    } else {
      this.setState({
        data: dict[lang].offer
      })
    }
    if (path === '/rules') {
      this.setState({
          rules: true
      })
    }
  }

  // componentWillReceiveProps(nextProps) {
  //
  //   if (nextProps.sign.isLoadingLang !== this.props.sign.isLoadingLang) {
  //     if (!nextProps.sign.isLoadingLang) {
  //       this.refs.loadingModal.hide()
  //     }
  //   }
  // }


  render() {
    const { sign } = this.props;
    document.body.style.backgroundColor = "#fff";

      //const editorStateRules = EditorState.createWithContent(convertFromRaw(rules), decorator);
      const editorStateAgreement= EditorState.createWithContent(convertFromRaw(this.state.data), decorator);

    document.body.style.backgroundColor = "#fff";
    document.body.style.backgroundImage = 'url(/assets/img/antiage/pt.png) repeat';

    return (

      <div className={classNames(styles.layout, {
        [styles.alfa]: isAlfa
      })}>
        <div className={styles.header}>
          <div className={styles.gridHeaderInner}>
            <h1 className={styles.gridCellHeaderLogoTele2}>
              <img
                src={srcLogo}
                className={styles.tele2Logo}
                onClick={() => {
                  browserHistory.push('/trainings')
                }}
                alt=""/>
            </h1>
          </div>
        </div>
          <Helmet>
              <title>{title}</title>
              <link rel="icon" type="image/png" href={fav16} sizes="32x32" />
              <link rel="icon" type="image/png"  href={fav32} sizes="16x16" />
              <meta name="apple-mobile-web-app-title" content={title} />
              <meta name="application-name" content={title} />
          </Helmet>

        <div className={styles.layoutInner}>
          <div className={styles.grid}>
            <div className={styles.gridCellLayoutContentPocket34}>
              <div className={styles.container}>
                  <Editor
                      readOnly={true}
                      customStyleMap={customStyleMap}
                      editorState={editorStateAgreement}
                      blockRendererFn={mediaBlockRenderer}
                  />
              </div>

              {/*<div className={styles.container}>*/}
                {/*text*/}
              {/*</div>*/}

            </div>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  sign: state.sign,
  lang: state.lang
})

Offer = connect(
  mapStateToProps,
)(Offer)

export default CSSModules(Offer, styles)



