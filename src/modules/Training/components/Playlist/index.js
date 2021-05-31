import PropTypes from 'prop-types';
import React, { Component } from "react";
import classNames from "classnames/bind";
import { browserHistory, Link } from "react-router";
import { pluralize } from "utils/helpers";
import { dict } from  'dict';
import styles from "./styles.css";

const cx = classNames.bind(styles);

const LENGTH_OF_DESCRIPTION = 250;
const MONTHS = [
  "января",
  "февраля",
  "марта",
  "апреля",
  "мая",
  "июня",
  "июля",
  "августа",
  "сентября",
  "октября",
  "ноября",
  "декабря",
];

const createDescription = (str) => {
  const rawDescription = JSON.parse(str)
    .blocks.map((item) => item.text)
    .join(" ")
    .slice(0, LENGTH_OF_DESCRIPTION);
  const indexOfLastSpace = rawDescription.lastIndexOf(" ");
  const description = rawDescription.slice(0, indexOfLastSpace + 1) + "...";
  return description;
};

export const parseDate = (str) => {
  const rawDate = new Date(str);
  const year = rawDate.getFullYear();
  const month = Number(rawDate.getMonth());
  const day = rawDate.getDate();
  const date = `${day} ${MONTHS[month]} ${year} г.`;
  return date;
};

export const parseTime = (str) => {
  const rawDate = new Date(str);
  const hour = rawDate.getHours().toString().length === 1 ? `0${rawDate.getHours()}` : rawDate.getHours();
  const minutes = rawDate.getMinutes().toString().length === 1 ? `0${rawDate.getMinutes()}` : rawDate.getMinutes();
  const time = `${hour}:${minutes}`
  return time
}

export const Playlist = (props) => {
  const { playlist, goToPlaylist, categorie, lang } = props;
  const isWebinars = categorie === "webinars";
  const exercisesAmount = playlist.exercises ? playlist.exercises.length : 0;
  return (
    <div className={cx(isWebinars ? "webinars-playlist" : "playlist")}>
      {isWebinars ? (
        <div
          className={cx("webinars-link")}
          onClick={() => goToPlaylist(playlist)}
        >
          <div className={cx("webinars-play")}>
            <img
              className={cx("webinars-thumbnail")}
              src={playlist.thumbnail}
              alt=""
            />
          </div>
          <div className={cx("webinars-content")}>
            <div className={cx("webinars-title")}>{playlist.name}</div>
            <div className={cx("webinars-descr")}>
              {playlist.description ? createDescription(playlist.description) : playlist.shortDescription}
            </div>
            <div className={cx("webinars-info")}>
              <div className={cx("webinars-watches")}>
                <svg className={cx("svgIcon")}>
                  <use xlinkHref="#ico-eye" />
                </svg>
                {playlist.views}
              </div>
              <div className={cx("webinars-datewrapper")}>
                <span>{`${dict[lang]["webinars.date"]}: `}</span>
                <span className={cx('webinars-date')}>{parseDate(playlist.date)}</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className={cx("link")} onClick={() => goToPlaylist(playlist)}>
          <img className={cx("thumbnail")} src={playlist.thumbnail} alt="" />
          <div className={cx("name")}>
            <div className={cx("name-wrap")}>{playlist.name}</div>
          </div>
          {/*<div className={cx('info')}>*/}
          {/*<div className={cx('exercises')}>{`${exercisesAmount} ${pluralize(exercisesAmount, ['занятиe', 'занятия', 'занятий'])}`}</div>*/}
          {/*/!*<div className={cx('points')}>*/}
          {/*<span className={cx('points-number')}>+20</span>*/}
          {/*б.*/}
          {/*</div>*!/*/}
          {/*</div>*/}
          {/*<button className={cx('btn')}>*/}
          {/*<span className={cx('btn-text')}>Cмотреть весь плейлист</span>*/}
          {/*</button>*/}
        </div>
      )}
    </div>
  );
};


