import React from "react";
import MenuButton from "../componentKit/MenuButton";
import CSSModules from "react-css-modules";
import classNames from "classnames";
import styles from "./menuItem.css";
import { dict } from "dict";
import { Link } from "react-router";

import { BAGES, getBage } from 'utils/menuBages';

const MenuItem = ({
  item,
  dayId,
  active,
  onClick,
  unReadMsgs,
  menuBadges,
  location,
  lang,
}) => {
  let link = "/" + item.link;
  if (!item.link) {
    link = "/";
  }
  /*   if(item.link == 'chats'){
        link = '/' + item.link + '/' + dayId
    }*/
  const pathname = location ? location.pathname : null;
  return (
    <li className={styles.liNavItem}>
      <div
        key={item.id}
        className={classNames({
          [styles.mainNavItemUnselectable]: !!item.subItems,
          [styles.mainNavItem]: true,
          [styles.mainNavItemActive]: item.active || (item.subItems ? item.subItems.find((subItem) => subItem.id === item.page) : false),
          [styles.disabled]: item.disabled,
        })}
      >
        <MenuButton
          link={item.disabled && pathname ? location.pathname : link}
          icon={item.icon}
          onClick={onClick}
          disabled={item.disabled}
          location={location}
          lang={lang}
          unReadMsgs={unReadMsgs || null}
        >
          {dict[lang][item.name]}
        </MenuButton>
      </div>
      {item.subItems && (
        <div className={styles.subItems}>
          <ul className={styles.subItemsNav}>
            {item.subItems.map((subItem, index) => {
              return (
                <li key={subItem.id}>
                  <Link
                    className={classNames(styles.subItemLink, {
                      [styles.active]: subItem.id === item.page,
                    })}
                    to={"/" + subItem.link}
                    onClick={onClick}
                  >
                    {dict[lang][subItem.name]}
                    {menuBadges ? getBage({ name: subItem.link, BAGES, menuBadges }) ? <span className={styles.unReadMsgs}>{getBage({ name: subItem.link, BAGES, menuBadges })}</span> : null : null}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </li>
  );
};

export default CSSModules(MenuItem, styles);
