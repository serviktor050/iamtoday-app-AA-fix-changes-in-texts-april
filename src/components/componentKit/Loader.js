import React from 'react'
import CSSModules from 'react-css-modules'
import styles from './loader.css'


const Loader = ({card}) => (

    <div className={styles.contentLoader}>
        {!card ? <div className={styles.contentLoaderItem}>
                <div className={styles.contentLoaderTitleH30}></div>
                <div className={styles.contentLoaderContentH80}></div>
                <div className={styles.contentLoaderContentH70}></div>
                <div className={styles.contentLoaderContentH40}></div>
                <div className={styles.contentLoaderBtnH30}></div>
            </div>
            : <div className={styles.loaderWrapper}>
                <div className={styles.layer}>
                    <div className={styles.contentLoaderTitleH30}></div>
                    <div className={styles.contentLoaderTitleH30}></div>
                    <div className={styles.contentLoaderTitleH30}></div>
                    <div className={styles.contentLoaderTitleH30}></div>
                </div>
            </div>}
    </div>
)

export default CSSModules(Loader, styles)
