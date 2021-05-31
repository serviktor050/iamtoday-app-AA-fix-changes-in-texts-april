import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {connect} from 'react-redux';
import {compose} from 'redux';
import classNames from 'classnames/bind';
import {browserHistory, Link} from 'react-router';
import Layout from 'components/componentKit2/Layout';
import {Button} from 'components/common/Button';
import * as ducks from './ducks';
import * as selectors from './selectors';
import Loader from 'components/componentKit/Loader'
import moment from 'moment'
import styles from './styles.css';
import { dict } from 'dict';
import {
  Entity,
  EditorState,
  convertFromRaw,
  CompositeDecorator
} from 'draft-js'
import { getCustomStyleMap } from 'draftjs-utils';

const cx = classNames.bind(styles);

const page = 'purchases';
const ITEM_CATEGORY_CONGRESS = 'congress';

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

class Purchases extends Component {

  componentDidMount() {
    this.props.dispatch(ducks.getPurchasesList());
  }

  renderBtnTitle(product, isExpired){
    const { item } = product;
    const congress = this.isCongress(item);
    const lang = dict[this.props.lang];
    let title = product.isPaid ? lang['purchase.extendByMonth'] : lang['purchase.buyAccess'];
    if (product.itemType === 2) {
      title = product.isPaid
          ? congress
            ? lang['purchase.goToLecture']
            : lang['purchase.goToModule']
          : lang['purchase.buyModule'];
    }
    if (product.itemType === 1) {
      title = product.isPaid ? lang['purchase.goToVideo'] : lang['purchase.buyVideo']
    }
    return title;
  }

  isCongress(item) {
    return item
        && item.categories
        && item.categories === ITEM_CATEGORY_CONGRESS;
  }

  onClick(product){
    if (product.itemType === 3) {
      return;
    }
    if (product.itemType === 2) {
      const url = product.isPaid ? `/trainings/module/${product.itemId}` :  `/buy?itemType=2&itemId=${product.itemId}&returnUrl=/trainings/module/${product.itemId}`;
      return  browserHistory.push(url);
    }
    if (product.itemType === 1) {
      const url = product.isPaid ? `/trainings/video/${product.itemId}` :  `/buy?itemType=2&itemId=${product.itemId}&returnUrl=/trainings/video/${product.itemId}`;
      return  browserHistory.push(url);
    }
  }

  render() {
    const {location, purchasesList } = this.props;
    const lang = dict[this.props.lang];
    return (
      <Layout scroller={true} page={page} location={location}>
        <div className={cx('purchases')}>
          <h2 className={cx('title')}>{lang['purchase.myPurchase']}</h2>
          {
            !purchasesList || purchasesList.isFetching ? <Loader/> : purchasesList.isError ?
              <div>{purchasesList.errMsg}</div> :
              <div className={cx('list')}>
                {
                  purchasesList.data && purchasesList.data.length ?
                    purchasesList.data.map((product) => {
                      const { item } = product;
                      const remaining = moment(product.expirationDate).diff(moment(), 'days');
                      const isExpired = remaining <= 0;
                      if (!item) return;
                      const editorState = item.description ?  EditorState.createWithContent(convertFromRaw(JSON.parse(item.description)), decorator) : EditorState.createEmpty();
                      return (
                        <div className={cx('item', 'product', {
                          'chat': product.itemType === 3
                        })} key={product.id}>
                          <div className={cx('picture')}>
                            {
                              product.itemType ===3 &&
                                <div className={cx('chat')}>
                                  <img className={cx('img')} src="/assets/img/antiage/chat.png" alt=""/>
                                  <div
                                    onClick={() => {
                                      if (!product.isPaid){
                                        return null;
                                      }
                                      browserHistory.push('/chats');
                                    }}
                                    className={cx('action', {
                                    'paid': product.isPaid
                                  })}>
                                    <svg className={styles.icon}>
                                      <use xlinkHref="#ico-chat" />
                                    </svg>
                                    <div className={cx('text')}>{lang['purchase.goToChat']}</div>
                                  </div>
                                </div>
                            }
                            {product.itemType !==3 && <img className={cx('thumbnail')} src={item.thumbnail} alt=""/>}
                          </div>
                          <div className={cx('info')}>
                            <div className={cx('header')}>
                              <div className={cx('name')}>{item.name}</div>

                            </div>
                            {/*<div className={cx('desc')}>*/}
                              {/*<Editor*/}
                                {/*readOnly={true}*/}
                                {/*customStyleMap={customStyleMap}*/}
                                {/*editorState={editorState}*/}
                                {/*blockRendererFn={mediaBlockRenderer}*/}
                              {/*/>*/}
                            {/*</div>*/}
                            {
                              product.expirationDate !== 'undefined' &&

                              <div className={cx('access-info', 'module')}>
                                <div className={cx('date')}>
                                  <span className={cx('note')}>{lang['cost']}</span>
                                  <span className={cx('price')}>{product.amount? `${product.amount} ${product.currency}.` : "нет цены"}</span>
                                </div>
                                <div className={cx('date')}>
                                  <span className={cx('note')}>{lang['purchase.dataBuy']}</span>
                                  <span className={cx('value')}>{moment(product.date).lang(this.props.lang).format('ll')}</span>
                                </div>
                                <div className={cx('date')}>
                                  <span className={cx('note')}>{lang['purchase.remindDays']}</span>
                                  <span
                                    className={cx('value', {
                                      ['expired']: isExpired
                                    })}>{!product.expirationDate ? lang['purchase.forever'] : remaining > 0 ? remaining : lang['purchase.notAvailable'] }</span>
                                </div>
                              </div>
                            }

                            <div className={cx('btn')}>
                              <Button
                                kind={product.itemType === 3 || !product.isPaid ? 'main' : 'side'}
                                //className="tarif__btn"
                                onClick={() => this.onClick(product)}
                              >
                                {this.renderBtnTitle(product, isExpired)}
                              </Button>
                            </div>

                          </div>

                        </div>
                      )
                    }) : <div className={cx('empty')}>{lang['purchase.noPurchases']}</div>
                }
              </div>
          }
        </div>
      </Layout>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    purchasesList: selectors.purchasesList(state),
    lang: selectors.lang(state),
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    dispatch,
  };
};

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(Purchases);
