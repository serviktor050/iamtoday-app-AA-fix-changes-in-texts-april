import React from 'react'
import {Link} from 'react-router'
import CSSModules from 'react-css-modules'
import styles from './examsList.css'

export default CSSModules(({title, list, unread, isFetching, loadMoreButton = true, onLoadMore}) => (
  <div className={styles.chatGroup}>
    <div className={styles.chatGroupHeader}>
      <div className={styles.chatGroupName}>
        {title}
      </div>
    </div>

    <div className={styles.chatGroupBody}>
      {
        list.map((item, index) => (

          <Link
            to={item.link}
            key={index}
            className={styles.chatsListItem}>
            <div className={styles.chatsListItemName}>
              {`${item.fullName} / ${item.status}`}
            </div>
            <div>
              {item.userInfo.isSpectator ? '' : <div className={styles.chatsListSpectator}>
                  <svg className={styles.svgIco}><use xlinkHref="#ico-done"></use></svg></div>}
            </div>
          </Link>
        ))
      }

      {/* {
        loadMoreButton ? (
          <button
            onClick={!isFetching ? onLoadMore : null}
            className="pending-profile__load-more btn btn--action">
            {isFetching ? 'Загружается...' : 'Загрузить больше'}
          </button>
        ) : null
      } */}
    </div>
  </div>
), styles)
