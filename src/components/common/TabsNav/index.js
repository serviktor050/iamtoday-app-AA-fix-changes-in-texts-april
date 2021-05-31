import React, {Component} from 'react'
import classNames from 'classnames/bind';
import styles from './styles.css'

const cx = classNames.bind(styles);

class TabsNav extends Component {

  render() {
    const { tabs, onClick, setActive, tabNavClass, tabTypeClass, mobile, live=[] } = this.props;
    const isScroll = mobile === 'scroll';


    return (

       <div className={cx('tabNavList', tabNavClass,  (tabTypeClass || 'tabStandard'), {
           [styles.tabNavListStandart]: isScroll,
       })}>
          {
            tabs.map((tab) => {
              const hasInactiveIcon = tab.inactiveIcon

              return (
                <div
                    key={tab.name}
                    className={classNames(styles.tabNavItemWrap, {
                        [styles.active]: setActive(tab),
                        [styles.tabNavItemWrapStandart]: isScroll,
                    })}
                    onClick={() => onClick(tab)}
                >
                  <div className={classNames(styles.iconWrap, {
                      [styles.active]: setActive(tab),
                      [styles.hide]: isScroll,
                  })}>
                          {/* to show different icons when tab is active/inactive in big screens*/}
                          {!hasInactiveIcon && <svg className={cx(`i-${tab.icon}`, 'icon-menu')}>
                                                  <use xlinkHref={`#${tab.icon}`}/>
                                              </svg>
                          }

                          {hasInactiveIcon && setActive(tab) && <svg className={cx(`i-${tab.icon}`, 'icon-menu')}>
                                                                    <use xlinkHref={`#${tab.icon}`}/>
                                                                </svg>
                          } 

                          {hasInactiveIcon && !setActive(tab) && <svg className={cx(`i-${tab.icon}`, 'icon-menu')}>
                                                                    <use xlinkHref={`#${tab.inactiveIcon}`}/>
                                                                </svg>
                          }
                    <div className={classNames(styles.iconWrapPoint, {[styles.active]: setActive(tab) })}/>
                  </div>
                  <div
                      className={classNames(styles.tabNavItem, {
                          [styles.active]: setActive(tab),
                          [styles.show]: isScroll
                      })}
                  >
                      {tab.label}
                  </div>
                  {live.includes(tab.name) && <div className={styles.tabNavItemWrapLive}>!</div>}
                </div>
              )
            })
          }
      </div>

    )
  }
}
export default TabsNav;
