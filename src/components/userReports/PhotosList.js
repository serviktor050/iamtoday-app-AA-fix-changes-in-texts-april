import React from 'react'
import {Link} from 'react-router'
import CSSModules from 'react-css-modules'
import styles from './photosList.css'

export const ProfileListItem = ({id, fullName, waitingStatus, link, timePassed}) => (
  <li className={styles.pendingProfilesItem}>
    <Link className={styles.pendingProfilesItemLink} to={link}>
      <div className={styles.pendingProfilesItemName}>
        {fullName}
      </div>

      {
        timePassed ? <div className={styles.pendingProfilesItemTimestamp}>
          Изменил анкету: {timePassed}
        </div> : null
      }
    </Link>
  </li>
)

export default CSSModules(({list}) => (
  <div className={styles.pendingProfiles}>
    {
      list.map((item, index) => <ProfileListItem key={index} {...item} />)
    }
  </div>
), styles)
