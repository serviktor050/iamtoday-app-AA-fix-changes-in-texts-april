import React from 'react'

const IMAGE_PATH = 'https://api.todayme.ru/'
import CSSModules from 'react-css-modules'
import styles from './profilePhotos.css'

export default ({
  title,
  front,
  back,
  left,
  right,
  video
}) => (
  <div className={styles.pendingPhotos}>
    <h3 className={styles.pendingPhotosTitle}>
      {title}
    </h3>

    <div className={styles.pendingPhotosRow}>

      <div className={styles.pendingPhotosPhoto}>
        <div className={styles.pendingPhotosPhotoTitle}>
          Спереди
        </div>
        <img
          className={styles.pendingPhotosPhotoImage}
          src={IMAGE_PATH + front}
          alt="Спереди"/>
      </div>
      <div className={styles.pendingPhotosPhoto}>
        <div className={styles.pendingPhotosPhotoTitle}>
          Сзади
        </div>
        <img
          className={styles.pendingPhotosPhotoImage}
          src={IMAGE_PATH + back}
          alt="Сзади"/>
      </div>
      <div className={styles.pendingPhotosPhoto}>
        <div className={styles.pendingPhotosPhotoTitle}>
          Слева
        </div>
        <img
          className={styles.pendingPhotosPhotoImage}
          src={IMAGE_PATH + left}
          alt="Слева"/>
      </div>
      <div className={styles.pendingPhotosPhoto}>
        <div className={styles.pendingPhotosPhotoTitle}>
          Справа
        </div>
        <img
          className={styles.pendingPhotosPhotoImage}
          src={IMAGE_PATH + right}
          alt="Справа"/>
      </div>
    </div>
    <p>Видео: {video ? video : 'Видео не приложено'}</p>
  </div>
)
