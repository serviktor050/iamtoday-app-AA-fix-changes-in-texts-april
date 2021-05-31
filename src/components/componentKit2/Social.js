import React, {Component} from 'react'
import CSSModules from 'react-css-modules'
import styles from './social.css'
import { Link} from 'react-router'

class Social extends Component {
  render() {
    return (
      <div className={styles.social}>
        <div className={styles.socialSignin}>
          <a className={styles.socialSigninItem} href="https://vk.com/todaymeru" target="blank">
            <svg className={styles.svgIconVk}>
              <use xlinkHref="#vk"></use>
            </svg>
          </a>

          <a className={styles.socialSigninItem} href="https://www.instagram.com/todaymeru" target="blank">
            <svg className={styles.svgIconInsta}>
              <use xlinkHref="#insta"></use>
            </svg>
          </a>

          <a className={styles.socialSigninItem} href="https://www.facebook.com/todaymeru" target="blank">
            <svg className={styles.svgIconFb}>
              <use xlinkHref="#fb"></use>
            </svg>
          </a>

          <a className={styles.socialSigninItem} href="https://ok.ru/group/53371420672073" target="blank">
            <svg className={styles.svgIconOk}>
              <use xlinkHref="#odnoklassniki"></use>
            </svg>
          </a>
          <a className={styles.socialSigninItem} href="https://www.youtube.com/channel/UC-mD0FrmH82u34-J5lFS-BA" target="blank">
            <svg className={styles.svgIconYoutube}>
              <use xlinkHref="#youtube"></use>
            </svg>
          </a>


        </div>
      </div>
    )
  }
}
export default CSSModules(Social, styles)
