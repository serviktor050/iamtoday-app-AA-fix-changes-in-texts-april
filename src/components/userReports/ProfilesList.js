import React from 'react'
import {Link} from 'react-router'
import CSSModules from 'react-css-modules'
import styles from './profilesList.css'

export const ProfileListItem = ({id, fullName, waitingStatus, link, timePassed}) => (
  <div className={styles.pendingProfilesItem}>
    <Link className={styles.pendingProfilesItemLink} to={link}>
      <div className={styles.pendingProfilesItemName}>
        {fullName}

        {
          waitingStatus ? <strong className={styles.pendingProfilesItemStatus}>
            {waitingStatus}
          </strong> : null
        }
      </div>

      {
        timePassed ? <div className={styles.pendingProfilesItemTimestamp}>
          Изменил анкету: {timePassed}
        </div> : null
      }
    </Link>
  </div>
)

export default CSSModules(({list, isFetching, loadMoreButton = true, onLoadMore}) => (
  <div className={styles.pendingProfiles}>
    {
      list.map(item => <ProfileListItem key={item.id} {...item} />)
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
), styles)
