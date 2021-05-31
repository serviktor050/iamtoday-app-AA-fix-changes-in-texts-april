import React, { Component } from 'react'
import moment from 'moment'
import CSSModules from 'react-css-modules'
import styles from './music.css'


class Music extends Component {
  render() {
    const  {playlists} = this.props

    return (
      <div className={styles.stageBoxSmallPaddingBoxStyle1}>
        <div className={styles.stageBoxInner}>
          <div className={styles.musicList}>
            {
              playlists.map((item, idx) => {
                const googleMusic = item.listenButtonName.match(/google/i);
                return (
                  <div key ={'playlist-' + idx} className={styles.musicItem}>
                    <div className={styles.musicItemImage}>
                      <span className={styles.musicItemLogo}>
                        {googleMusic ?
                          <svg className={styles.svgIcon}>
                            <use xlinkHref="#googleMusic"></use>
                          </svg>
                          :
                          <svg className={styles.svgIconApple}>
                            <use xlinkHref="#appleMusic"></use>
                          </svg>
                        }
                      </span>
                      <span className={styles.musicItemImgMobile}>
                        <img
                          className={styles.musicItemImg}
                          src={item.albumImageUrl}
                          width="80px"
                          height="80px"
                          alt=""
                        />
                      </span>
                      <div className={styles.musicItemPic}>
                        <img
                          className={styles.musicItemImg}
                          src={item.albumImageUrl}
                          width="100px"
                          height="100px"
                          alt=""
                        />
                      </div>
                    </div>
                    <div className={styles.musicItemText}>
                      <span className={styles.albumName}>{item.albumName}</span>
                      <a className={styles.musicItemLink} target='_blank' href={item.curatorUrl}>
                        {item.curatorName}
                      </a>
                      <div className={styles.musicItemDesc}>
                        <span className={styles.trackNumber}>{item.trackNumber}</span>
                        <span>композиций в альбоме</span>
                      </div>
                      <div className={styles.musicItemBtn}>
                        <a href={item.playlistUrl} target='_blank' className={styles.musicItemBtnLink}>
                          {item.listenButtonName}
                        </a>
                      </div>

                    </div>
                  </div>
                )
              })
            }
          </div>

        </div>
      </div>
    )
  }
}

export default CSSModules(Music, styles)
