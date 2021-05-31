import React, { Component } from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import * as R from "ramda";
import { browserHistory } from "react-router";
import cookie from 'react-cookie';
import Layout from "components/componentKit2/Layout";
import TabsNav from "components/common/TabsNav";
import { Playlist } from "./components/Playlist";
import ListNav from "components/common/ListNav";
import * as ducks from "./ducks";
import * as selectors from "./selectors";
import Loader from "components/componentKit/Loader";
import { dict } from "dict";
import Media from "react-media";
import { GLOBAL_MEDIA_QUERIES } from "../../utils/data";
import classNames from "classnames/bind";
import styles from "./styles.css";
import Glossary from "./containers/Glossary/index";

import InformingBlock from '../../components/common/InformingBlock';
import { parseDate, parseTime } from "./components/Playlist/index";
import { EmailConfirmation } from './components/EmailConfirmation';

export const page = "trainings";

const cx = classNames.bind(styles);

const MODULE_CATEGORY_MODULES = "modules";
const MODULE_CATEGORY_THEMATIC = "thematic";
const MODULE_CATEGORY_CONGRESS = "congress";
const MODULE_CATEGORY_WEBINARS = "webinars";
const MODULE_CATEGORY_GLOSSARY = "glossary";

let categoriesData = [
  {
    name: "all",
    label: "all",
    order: 1,
    icon: "user",
  },
  {
    name: MODULE_CATEGORY_MODULES,
    label: "lecture.modules",
    order: 2,
    icon: "userss",
  },
  {
    name: MODULE_CATEGORY_CONGRESS,
    label: "lecture.congress",
    order: 4,
    icon: "star",
  },
  {
    name: MODULE_CATEGORY_THEMATIC,
    label: "lecture.thematicModule",
    order: 5,
    icon: "userss",
  },
  {
    name: MODULE_CATEGORY_WEBINARS,
    label: "lecture.webinars",
    order: 6,
    icon: "userss",
  },
  {
    name: MODULE_CATEGORY_GLOSSARY,
    label: "lecture.glossary",
    order: 7,

  },
  // {
  //   name: 'videos',
  //   label: 'lecture.videos',,
  //   order: 3,
  //   icon: 'star'
  // },
];

/**
 *  Контейнер Training.
 *  Используется для отображения Training
 *
 */

class Training extends Component {
  state = {
    showAll: {
      video: false,
      modules: false,
      thematic: false,
      congress: false,
      webinars: false,
      glossary: false
    },
    categories: [],
    isNotVisibleConfirm: false,
  };

  componentDidMount() {
    const { dispatch, playlists, lang } = this.props;
    let categories = categoriesData.map((item) => {
      return { ...item, label: dict[lang][item.label] };
    });

    this.setState({
      categories,
    });
    if (playlists && playlists.data) {
      return;
    }

    dispatch(ducks.getPlayListGroups());
  }

  componentDidUpdate(prevProps) {
    const { location } = this.props;
    if (prevProps.location !== location) {
      const pathname = location.pathname.split("/");
    }
  }

  goToPlaylist = (playlist) => {
    const { dispatch } = this.props;

    const url = playlist.isStandalone
      ? `/trainings/video/${playlist.id}`
      : `/trainings/module/${playlist.id}`;
    browserHistory.push(url);
    // dispatch(ducks.setPlaylist(playlist));
  };

  renderPlaylists = () => {
    const { playlists, selectCategories, lang, dispatch } = this.props;

    if (R.path(["isFetching"], playlists)) {
      return <Loader />;
    }
    if (R.path(["isError"], playlists)) {
      return <div>error</div>;
    }
    if (R.path(["data"], playlists)) {
      if (R.isEmpty(playlists.data)) {
        return <div>{dict[lang]["lecture.noPlaylists"]}</div>;
      }

      if (selectCategories === "all") {
        return (
          <div className={styles.contentWrap}>
            {(playlists.data.videos.length || "") &&
              this.renderVideos(lang, playlists)}
            {(playlists.data.modules.length || "") &&
              this.renderModules(lang, playlists, MODULE_CATEGORY_MODULES)}
            {(playlists.data.congress.length || "") &&
              this.renderModules(lang, playlists, MODULE_CATEGORY_CONGRESS)}
            {(playlists.data.thematic.length || "") &&
              this.renderModules(lang, playlists, MODULE_CATEGORY_THEMATIC)}
            {(playlists.data.webinars.length || "") &&
              this.renderModules(lang, playlists, MODULE_CATEGORY_WEBINARS)}
          </div>
        );
      }

      const isGlossary = selectCategories === MODULE_CATEGORY_GLOSSARY;
      if (isGlossary) {
        return <Glossary />
      }

      const isWebinars = selectCategories === MODULE_CATEGORY_WEBINARS;
      if (isWebinars) {
        // dispatch(ducks.getWebinarsPlaylist({take: 4, skip: 1}))
        if (
          playlists.data[selectCategories] &&
          playlists.data[selectCategories].length
        ) {
          let webinarsList = playlists.data[selectCategories];
          const futureWebinar = webinarsList.filter(
            (item) => Date.parse(item.date) > Date.now()
          )[0];
          const liveWebinar = webinarsList.filter(
            (item) =>
              (0 <= Date.now() - Date.parse(item.date) &&
                Date.now() - Date.parse(item.date) <= 1000 * 60 * 60 * 6) ||
              (0 <= Date.parse(item.date) - Date.now() &&
                Date.parse(item.date) - Date.now() <= 1000 * 60 * 60)
          )[0];
          webinarsList = futureWebinar
            ? webinarsList.filter((item) => item.id !== futureWebinar.id)
            : webinarsList;
          return (
            <div className={cx("contentList")}>
              {futureWebinar && !liveWebinar && (
                <div className={cx("nextWebinar")}>
                  <h2 className={cx("nextWebinar-title")}>
                    {dict[lang]["lecture.next-webinar"]}
                  </h2>
                  <div className={cx("nextWebinar__content")}>
                    <div className={cx("nextWebinar__thumbnail")}>
                      <div
                        className={cx("nextWebinar__thumbnail-time")}
                      >{`${parseDate(futureWebinar.date)
                        .split(" ")
                        .slice(0, 2)
                        .join(" ")} в ${parseTime(futureWebinar.date)}`}</div>
                      <img
                        className={cx("nextWebinars__thumbnail-img")}
                        src={futureWebinar.thumbnail}
                        alt="webinar-img"
                      />
                    </div>
                    <div className={cx("nextWebinar__name")}>
                      <span>{futureWebinar.name}</span>
                    </div>
                    <div className={cx("nextWebinar__info")}>
                      <button
                        className={cx("nextWebinar__info-btn")}
                        onClick={() => this.goToPlaylist(futureWebinar)}
                      >
                        {dict[lang]["lecture.details"]}
                      </button>
                      <button
                        className={cx(
                          !futureWebinar.remind
                            ? "nextWebinar__info-remindBtn"
                            : "nextWebinar__info-remindBtn-active"
                        )}
                        onClick={() => {
                          const payload = {
                            remind: true,
                            id: futureWebinar.id,
                          };
                          dispatch(ducks.setRemind({ itemType: 1, payload }));
                        }}
                      >
                        {dict[lang]["lecture.remindMe"]}
                      </button>
                    </div>
                  </div>
                </div>
              )}
              {liveWebinar && (
                <div className={cx("nextWebinar")}>
                  <h2 className={cx("nextWebinar-title")}>
                    {dict[lang]["lecture.live-webinar"]}
                  </h2>
                  <div className={cx("nextWebinar__content")}>
                    <div className={cx("nextWebinar__thumbnail")}>
                      <div className={cx("liveWebinar__thumbnail-time")}>
                        {dict[lang]["lecture.live-now"]}
                      </div>
                      <img
                        className={cx("nextWebinars__thumbnail-img")}
                        src={liveWebinar.thumbnail}
                        alt="webinar-img"
                      />
                    </div>
                    <div className={cx("nextWebinar__name")}>
                      <span>{liveWebinar.name}</span>
                    </div>
                    <div className={cx("nextWebinar__info")}>
                      <button
                        className={cx("nextWebinar__info-btn")}
                        onClick={() => this.goToPlaylist(liveWebinar)}
                      >
                        {dict[lang]["lecture.webinar-watch"]}
                      </button>
                    </div>
                  </div>
                </div>
              )}
              <h2 className={cx("old-webinars-title")}>
                {dict[lang]["lecture.old-webinars"]}
              </h2>
              {webinarsList.map((playlist) => {
                return (
                  <Playlist
                    key={playlist.id}
                    playlist={playlist}
                    categorie={selectCategories}
                    lang={lang}
                    goToPlaylist={this.goToPlaylist}
                    goToExercise={this.goToExercise}
                  />
                );
              })}
            </div>
          );
        } else {
          return (
            <div className={styles.contentEmpty}>
              {dict[lang]["lecture.noContent"]}
            </div>
          );
        }
      }
      if (
        playlists.data[selectCategories] &&
        playlists.data[selectCategories].length
      ) {
        return (
          <div className={styles.contentList}>
            {playlists.data[selectCategories].map((playlist) => {
              return (
                <Playlist
                  key={playlist.id}
                  playlist={playlist}
                  categorie={selectCategories}
                  lang={lang}
                  goToPlaylist={this.goToPlaylist}
                  goToExercise={this.goToExercise}
                />
              );
            })}
          </div>
        );
      } else {
        return (
          <div className={styles.contentEmpty}>
            {dict[lang]["lecture.noContent"]}
          </div>
        );
      }

    }
  };
  renderModules(lang, playlists, moduleCategory) {
    const datum = playlists.data[`${moduleCategory}`];
    const modules = this.state.showAll[`${moduleCategory}`]
      ? datum
      : datum.slice(0, 3);

    return (
      <div className={styles.contentItem}>
        <div className={styles.contentTop}>
          <div className={styles.contentTitle}>
            {dict[lang][`lecture.${moduleCategory}`]}
          </div>
          {datum.length > 3 && (
            <div
              className={cx("contentToggle", {
                hide: this.state.showAll[`${moduleCategory}`],
              })}
              onClick={() =>
                this.setState({
                  showAll: {
                    ...this.state.showAll,
                    [`${moduleCategory}`]: true,
                  },
                })
              }
            >
              <img
                className={cx("contentIcon")}
                src="/assets/img/antiage/list.png"
                alt=""
              />
              <div className={cx("contentToggleText")}>
                {dict[lang]["lecture.showAll"]}
              </div>
            </div>
          )}
        </div>
        <div className={styles.contentList}>
          {" "}
          {modules.map((playlist) => {
            return (
              <Playlist
                key={playlist.id}
                playlist={playlist}
                goToPlaylist={this.goToPlaylist}
                goToExercise={this.goToExercise}
              />
            );
          })}
        </div>
      </div>
    );
  }

  renderVideos(lang, playlists) {
    const videos = this.state.showAll.video
      ? playlists.data.videos
      : playlists.data.videos.slice(0, 3);

    return (
      <div className={styles.contentItem}>
        <div className={styles.contentTop}>
          <div className={styles.contentTitle}>
            {dict[lang]["lecture.videos"]}
          </div>
          {playlists.data.videos.length > 3 && (
            <div
              className={cx("contentToggle", {
                hide: this.state.showAll.video,
              })}
              onClick={() =>
                this.setState({
                  showAll: { ...this.state.showAll, video: true },
                })
              }
            >
              <img
                className={cx("contentIcon")}
                src="/assets/img/antiage/on.png"
                alt=""
              />
              <div className={cx("contentToggleText")}>
                {dict[lang]["lecture.showAll"]}
              </div>
            </div>
          )}
        </div>

        <div className={styles.contentList}>
          {videos.map((playlist) => {
            return (
              <Playlist
                key={playlist.id}
                playlist={playlist}
                goToPlaylist={this.goToPlaylist}
                goToExercise={this.goToExercise}
              />
            );
          })}
        </div>
      </div>
    );
  }

  toggleTab = (tab) => {
    const { dispatch } = this.props;
    dispatch(ducks.setCategories(tab.name));
  };

  _onCloseEmailConfirm = () => {
    this.setState(() => {
      return {
        isNotVisibleConfirm: cookie.save('isNotVisibleConfirm', true, {path: '/', maxAge: 60 * 60 * 24}),
      }
    })
  }

  render() {
    const { userInfo, location, selectCategories, playlists } = this.props;

    const prevSeasons = R.path(["data", "prevSeasons"], userInfo);
    let liveWebinar;
    const isWebinars = selectCategories === MODULE_CATEGORY_WEBINARS;
    if (isWebinars) {
      if (
        playlists.data[selectCategories] &&
        playlists.data[selectCategories].length
      ) {
        let webinarsList = playlists.data[selectCategories];
        liveWebinar = webinarsList.filter(
          (item) =>
            (0 <= Date.now() - Date.parse(item.date) &&
              Date.now() - Date.parse(item.date) <= 1000 * 60 * 60) ||
            (0 <= Date.parse(item.date) - Date.now() &&
              Date.parse(item.date) - Date.now() <= 1000 * 60 * 60)
        )[0];
      }
    }
    let liveForum = Date.now() <= Date.parse('20 Feb 2021 00:00:00');
    const isForums = selectCategories === MODULE_CATEGORY_CONGRESS;
    if (isForums) {
      if (playlists.data[selectCategories] &&
        playlists.data[selectCategories].length) {
        let forumsList = playlists.data[selectCategories];
        liveForum = forumsList.filter(
          (item) =>
            (0 <= Date.now() - Date.parse(item.date) &&
              Date.now() - Date.parse(item.date) <= 1000 * 60 * 60) ||
            (0 <= Date.parse(item.date) - Date.now() &&
              Date.parse(item.date) - Date.now() <= 1000 * 60 * 60)
        )[0];
      }
    }

    const ShowCard = ({ userInfo: {data: userInfo} }) => {
      const { mlmUserInfo: { parentUser, tutorRequests}} = userInfo;
      let props;

      if(parentUser && typeof parentUser === 'object' && R.isNil(tutorRequests[0])) return null;

      if(tutorRequests.length && typeof tutorRequests === 'object') {

        const { firstName, middleName, lastName, id } = tutorRequests[0].tutorInfo.userInfo;
        const fullName = [firstName, middleName, lastName].filter(Boolean).join(' ');

        const helluva = (
          <div className={cx('informingBlock__mainText')}>
            <p>{dict[this.props.lang]['mlm.mentorship.chousenTutor']}</p>
            <p className={cx('informingBlock__tutorName')}>{fullName}</p>
          </div>
        );

        props = {
          linkText: '',
          mainText: helluva,
          buttonText: 'Открыть профиль наставника',
          buttonClick: _ => browserHistory.push(`/tutor/${id}`),
          linkHref: '#',
          type: 'alert',
          infoText: dict[this.props.lang]['mlm.mentorship.waitForApproving'],
        };
      }

      if(!parentUser && !tutorRequests.length) {
        props = {
          linkText: dict[this.props.lang]['lecture.info-block.message-why-i-need-mentor'],
          mainText: dict[this.props.lang]['lecture.info-block.message-chose-mentor'],
          buttonText: dict[this.props.lang]['lecture.info-block.btn-chose-mentor'],
          buttonClick: _ => browserHistory.push('/chose-mentor'),
          linkHref: '/faq#tutor',
          type: 'alert',
        };
      }

      return <InformingBlock {...props} />
    };

    console.log('userInfo: ', userInfo);

    return (
      <Layout
        scroller={true}
        page={page}
        prevSeasons={prevSeasons}
        location={location}
      >
        <div className={styles.tabNav}>
          <Media queries={{ desktop: GLOBAL_MEDIA_QUERIES.desktop }}>
            {(matches) => {
              return matches.desktop ? (
                <TabsNav
                  tabs={this.state.categories}
                  setActive={(tab) => tab.name === selectCategories}
                  onClick={this.toggleTab}
                  mobile="scroll"
                  live={[liveWebinar || '' ? MODULE_CATEGORY_WEBINARS : null, liveForum || '' ? MODULE_CATEGORY_CONGRESS : null]}
                />
              ) : (
                  <ListNav
                    tabs={this.state.categories}
                    isActive={(tab) => tab.name === selectCategories}
                    onClick={this.toggleTab}
                  />
                );
            }}
          </Media>
        </div>

        {!(userInfo.data.emailConfirmed || R.isEmpty(userInfo.data)) &&
        !cookie.load('isNotVisibleConfirm') &&
        <EmailConfirmation email={userInfo.data.email} onCloseEmailConfirm={this._onCloseEmailConfirm} />}

        <div className={styles.content}>
          {userInfo.data && userInfo.data.mlmUserInfo && <ShowCard userInfo={userInfo} />}
          {this.renderPlaylists()}
        </div>
      </Layout>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    userInfo: selectors.userInfo(state),
    selectCategories: selectors.selectCategories(state),
    playlists: selectors.selectPlaylists(state),
    lang: state.lang,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    dispatch,
  };
};

export default compose(connect(mapStateToProps, mapDispatchToProps))(Training);
