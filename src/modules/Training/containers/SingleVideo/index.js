import React, { Component } from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import classNames from "classnames/bind";
import PropTypes from 'prop-types';
import * as R from "ramda";
import YouTube from "react-youtube";
import { pluralize } from "utils/helpers";
import { browserHistory, Link } from "react-router";
import Layout from "components/componentKit2/Layout";
import ListExercises from "../../components/ListExercises";
import * as ducks from "../../ducks";
import * as selectors from "../../selectors";
import { pageNumber } from "../../main";
import Loader from "components/componentKit/Loader";
import { Button } from "components/common/Button";
import moment from "moment";
import TabsNav from "components/common/TabsNav";
import Media from "react-media";
import { GLOBAL_MEDIA_QUERIES } from "utils/data";
import { getTabs, getPreferSelectedTabName, TAB_NAMES } from "../../utils";
import ReactRichTextEditor from "react-rte";
import { dict } from "dict";
import NotePad from "components/common/NotePad";
import Questions from '../../components/Questions';

import {
  Entity,
  Editor,
  EditorState,
  convertFromRaw,
  CompositeDecorator,
} from "draft-js";
import { getCustomStyleMap } from "draftjs-utils";
import styles from "./styles.css";

import { parseDate, parseTime } from "../../components/Playlist/index";
import Video from "./components/Video";

const cx = classNames.bind(styles);
const videoSettings = (width, height, autoplay) => ({
  height: height,
  width: width,
  playerVars: {
    // https://developers.google.com/youtube/player_parameters
    autoplay: autoplay,
  },
});

const customStyleMap = getCustomStyleMap();

const decorator = new CompositeDecorator([
  {
    strategy: (contentBlock, callback) => {
      contentBlock.findEntityRanges((character) => {
        const entityKey = character.getEntity();
        return entityKey !== null && Entity.get(entityKey).getType() === "LINK";
      }, callback);
    },
    component: (props) => {
      const { url } = Entity.get(props.entityKey).getData();
      return (
        <a
          href="#"
          onClick={() => {
            window.open(url, "_blank");
            return false;
          }}
        >
          {props.children}
        </a>
      );
    },
  },
]);

const Image = (props) => {
  return (
    <img
      src={props.src}
      style={{
        maxWidth: "100%",
        display: "block",
        marginLeft: "auto",
        marginRight: "auto",
      }}
    />
  );
};

const Atomic = (props) => {
  const entity = Entity.get(props.block.getEntityAt(0));
  const { src } = entity.getData();
  const type = entity.getType();

  let media;
  if (type === "IMAGE") {
    media = <Image src={src} />;
  }

  return media;
};

function mediaBlockRenderer(block) {
  if (block.getType() === "atomic") {
    return {
      component: Atomic,
      editable: false,
    };
  }

  return null;
}

class SingleVideo extends Component {
  state = {
    video: null,
    exerciseIdx: 1,
    playTrailer: false,
    selectedTab: TAB_NAMES.DESCRIPTION,
    playVideo: false,
  };

  async componentDidMount() {
    const { dispatch, params } = this.props;
    const id = params.video;
    await dispatch(ducks.getWebinarVideo({ id }));

    const { exercise } = this.props;
    if (exercise) {
      this.setState({ video: exercise });
    }
    const video = exercise.video;
    const isHttp = video.slice(0, 4) === 'http';
    const isScript = video.slice(0, 7) === '<script';
    let src;
    if (isScript) {
      src = video.match(/src="\S+"/)[0].slice(4);
      const script = document.createElement("script");

      script.src = src.slice(1, -1);
      script.async = 'true';

      document.body.appendChild(script);
    }
  }

  getVideoId = (video) => {
    return video.split("/")[video.split("/").length - 1];
  };

  toMain = () => {
    browserHistory.push("/trainings");
  };

  renderBtns = () => {
    if (!this.state.video) {
      return;
    }
    const isPaid = this.state.video.isPaid;
    const isAfter = moment(this.state.video.date).isAfter(moment());

    return (
      <div
        className={cx("btns", {
          btns_paid: isPaid,
        })}
      >
        <div className={cx("btns__item")}>
          <Button kind="side">
            <svg className={styles.icon}>
              <use xlinkHref="#trailer" />
            </svg>
            <span>Трейлер</span>
          </Button>
        </div>
        {isAfter && (
          <div className={cx("btns__item")}>
            <Button
              kind={!this.state.video.remind ? "side-inverse" : "disabled"}
              onClick={() => {
                const payload = {
                  remind: true,
                  id: this.state.video.id,
                };
                this.props.dispatch(ducks.setRemind({ itemType: 1, payload }));
              }}
            >
              <svg className={styles.icon}>
                <use xlinkHref="#bell" />
              </svg>
              <span>Напомнить</span>
            </Button>
          </div>
        )}
        {!isAfter && (
          <div className={cx("btns__item")}>
            <Button
              kind={isPaid ? "disabled" : "main"}
              onClick={() => {
                if (!isPaid) {
                  return browserHistory.push(
                    `/buy?itemType=1&itemId=${this.state.video.id}&returnUrl=${location.pathname}`
                  );
                }
                return null;
              }}
            >
              <svg className={styles.icon}>
                <use xlinkHref="#shopping-cart" />
              </svg>
              <span>{isPaid ? "Куплен" : "Купить"}</span>
            </Button>
          </div>
        )}
      </div>
    );
  };

  renderTabContent = (tabName, lang, matches) => {
    // const playlist = { data: this.state.video };
    const { exercise } = this.props;
    switch (tabName) {
      case TAB_NAMES.DESCRIPTION:
        return this.renderDescriptionTabContent(exercise);
      case TAB_NAMES.ADDITIONAL_MATERIALS:
        return this.renderAdditionalMaterialTabContent(exercise);
      case TAB_NAMES.NOTES:
        return this.renderNotePad(exercise, lang);
      case TAB_NAMES.EXERCISES:
        return !matches.desktop && this.renderList();
      case TAB_NAMES.QUESTIONS: return <Questions exercise={exercise} />;
      default:
        return <div />;
    }
  };

  renderDescriptionTabContent(exercise) {
    const editorState = this.state.video
      ? EditorState.createWithContent(
          convertFromRaw(JSON.parse(this.state.video.description)),
          decorator
        )
      : EditorState.createEmpty();

    return (
      <div className={cx("tab__content")}>
        <div className={cx("title")}>
          <div className={cx("name")}>{R.path(["data", "name"], exercise)}</div>
        </div>
        <div className={cx("description")}>
          <Editor
            readOnly={true}
            customStyleMap={customStyleMap}
            editorState={editorState}
            blockRendererFn={mediaBlockRenderer}
          />
        </div>
      </div>
    );
  }

  notePadOnSave = ({ itemId, value }) => {
    const { dispatch } = this.props;
    dispatch(
      ducks.saveSingleVideoUserNote(itemId, value ? value.toString("html") : "")
    );
  };

  renderNotePad(exercise, lang) {
    console.log(exercise);
    let userNote = R.path(["userNote"], exercise);
    const value = userNote
      ? ReactRichTextEditor.createValueFromString(userNote, "html")
      : ReactRichTextEditor.createEmptyValue();
    return (
      <NotePad
        key={`moduleNotePad${exercise.id}`}
        itemId={exercise.id}
        placeholder={dict[lang]["notepad.placeholder"]}
        value={value}
        onSave={this.notePadOnSave}
      />
    );
  }

  toggleTab = (tab) => {
    const { dispatch } = this.props;
    dispatch(ducks.setModuleTab(tab.name));
  };

  handlePlay = (e) => {
    e.preventDefault();
    const { exercise } = this.props;
    const video = exercise.video;
    const isHttp = video.slice(0, 4) === 'http';
    const isScript = video.slice(0, 7) === '<script';
    if (isHttp || isScript) {
      this.setState({ playVideo: true });
    } else {
      return
    }
  };

  isDataNotFetched() {
    const { video } = this.props;
    return !video || video.isFetching || !video.data;
  }

  renderOldWebinar = () => {
    return (
      <div className={cx("content")}>
        <div className={cx("header")}>
          <div className={cx("goBack__btn")} onClick={this.toMain}>
            Назад
          </div>
          <div className={cx("header__title")}>{this.state.video.name}</div>
        </div>
        <div className={cx("bread")}>
          <div
            className={cx("bread__item", "bread__item--link")}
            onClick={this.toMain}
          >
            Лекторий
          </div>
          <div className={cx("bread__item")}>{this.state.video.name}</div>
        </div>
        <div className={cx("exercise")}>
          <div className={cx("main")}>
            {this.state.video.video && this.state.playVideo ? (
              <Video video={this.state.video.video} />
            ) : (
              <div className={cx("thumbnail")} onClick={this.handlePlay}>
                <img src={this.state.video.thumbnail} alt="" />
                <div className={cx("thimbnail__btn")}>
                  <div className={cx("thumbnail__btn-icon")}></div>
                  <span
                    className={cx("thumbnail__btn-text")}
                  >{`Смотреть вебинар`}</span>
                </div>
              </div>
            )}
            <div className={cx("video__info")}>
              <div className={cx("video__info-title")}>
                <span>{this.state.video.name}</span>
              </div>
              <div className={cx("video__info-dateInfo")}>
                <span className={cx("video__info-date")}>
                  {parseDate(this.state.video.date)}
                </span>
                <span className={cx("video__info-time")}>
                  {parseTime(this.state.video.date)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  renderNextWebinar = () => {
    const { dispatch, lang } = this.props;
    return (
      <div className={cx("content")}>
        <div className={cx("header")}>
          <div className={cx("goBack__btn")} onClick={this.toMain}>
            Назад
          </div>
          <div className={cx("header__title")}>
            {dict[lang]["lecture.next-webinar"]}
          </div>
        </div>
        <div className={cx("bread")}>
          <div
            className={cx("bread__item", "bread__item--link")}
            onClick={this.toMain}
          >
            Лекторий
          </div>
          <div className={cx("bread__item")}>
            {dict[lang]["lecture.next-webinar"]}
          </div>
        </div>
        <div className={cx("exercise")}>
          <div className={cx("main")}>
            {this.state.video.video && this.state.playVideo ? (
              <Video video={this.state.video.video} />
            ) : (
              <div className={cx("thumbnail")} onClick={this.handlePlay}>
                <img src={this.state.video.thumbnail} alt="" />
                <div className={cx("thimbnail__btn")}>
                  <div className={cx("thumbnail__btn-icon")}></div>
                  <span
                    className={cx("thumbnail__btn-text")}
                  >{`Смотреть вебинар`}</span>
                </div>
              </div>
            )}
            <div className={cx("video__info")}>
              <div className={cx("video__info-title")}>
                <span>{this.state.video.name}</span>
              </div>
              <div className={cx("video__info-dateInfo")}>
                <button
                  className={cx(
                    !this.state.video.remind
                      ? "nextWebinar__info-remindBtn"
                      : "nextWebinar__info-remindBtn-active"
                  )}
                  onClick={() => {
                    const payload = {
                      remind: true,
                      id: this.state.video.id,
                    };
                    dispatch(ducks.setRemind({ itemType: 1, payload }));
                  }}
                >
                  {dict[lang]["lecture.remindMe"]}
                </button>
                <span className={cx("video__info-date")}>
                  {parseDate(this.state.video.date)}
                </span>
                <span className={cx("video__info-time")}>
                  {parseTime(this.state.video.date)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  renderLiveWebinar = () => {
    const { lang } = this.props;
    return (
      <div className={cx("content")}>
        <div className={cx("header")}>
          <div className={cx("goBack__btn")} onClick={this.toMain}>
            Назад
          </div>
          <div className={cx("header__title")}>
            {dict[lang]["lecture.live-webinar"]}
          </div>
        </div>
        <div className={cx("bread")}>
          <div
            className={cx("bread__item", "bread__item--link")}
            onClick={this.toMain}
          >
            Лекторий
          </div>
          <div className={cx("bread__item")}>
            {dict[lang]["lecture.live-webinar"]}
          </div>
        </div>
        <div className={cx("exercise")}>
          <div className={cx("main")}>
            {this.state.video.video && this.state.playVideo ? (
              <Video video={this.state.video.video} />
            ) : (
              <div className={cx("thumbnail")} onClick={this.handlePlay}>
                <img src={this.state.video.thumbnail} alt="" />
                <div className={cx("thimbnail__btn")}>
                  <div className={cx("thumbnail__btn-icon")}></div>
                  <span
                    className={cx("thumbnail__btn-text")}
                  >{`Смотреть вебинар`}</span>
                </div>
              </div>
            )}
            <div className={cx("video__info")}>
              <div className={cx("video__info-title")}>
                <span>{this.state.video.name}</span>
              </div>
              <div className={cx("video__info-dateInfo")}>
                <span className={cx("video__info-date")}>
                  {parseDate(this.state.video.date)}
                </span>
                <span className={cx("video__info-time")}>
                  {parseTime(this.state.video.date)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  renderWebinar = () => {
    const futureWebinar = Date.parse(this.state.video.date) > Date.now();
    const liveWebinar =
      (0 <= Date.now() - Date.parse(this.state.video.date) &&
        Date.now() - Date.parse(this.state.video.date) <= 1000 * 60 * 60) ||
      (0 <= Date.parse(this.state.video.date) - Date.now() &&
        Date.parse(this.state.video.date) - Date.now() <= 1000 * 60 * 60);
    if (!futureWebinar && !liveWebinar) {
      return this.renderOldWebinar();
    }
    if (futureWebinar && !liveWebinar) {
      return this.renderNextWebinar();
    }
    if (liveWebinar) {
      return this.renderLiveWebinar();
    }
  };

  render() {
    const {
      location,
      video,
      userInfo,
      exercise,
      dispatch,
      lang,
      selectedTab,
    } = this.props;

    const prevSeasons = R.path(["data", "prevSeasons"], userInfo);
    const tagsArr =
      this.state.video && this.state.video.tags
        ? this.state.video.tags.split("|")
        : [];

    return (
      <Layout
        page={"trainings"}
        prevSeasons={prevSeasons}
        location={location}
        buy={true}
      >
        {this.isDataNotFetched() ? (
          <Loader />
        ) : video.isError ? (
          <div>{video.errMsg}</div>
        ) : !this.state.video ? (
          <div>Нет такого видео</div>
        ) : (
          <div>
            {this.renderWebinar()}
            <div className={cx("content")}>
              <Media queries={{ desktop: GLOBAL_MEDIA_QUERIES.desktop }}>
                {(matches) => {
                  const playlist = { data: this.state.video };
                  let tabs = getTabs(playlist, lang, !matches.desktop);
                  const selectedTabName = getPreferSelectedTabName(
                    matches,
                    tabs,
                    selectedTab,
                    true
                  );
                  return (
                    <div className={cx("info")}>
                      <div
                        className={cx("top", {
                          top_paid:
                            !R.path(["data", "videos"], playlist) ||
                            !playlist.data.videos.length,
                        })}
                      >
                        <div className={cx("tabs")}>
                          <TabsNav
                            tabs={tabs}
                            // tabTypeClass="tabSubContent"
                            tabNavClass="tabWebinars"
                            setActive={(tab) => tab.name === selectedTabName}
                            onClick={this.toggleTab}
                            mobile="scroll"
                          />
                          <div className={cx("tab__text")}>
                            {this.renderTabContent(
                              selectedTabName,
                              lang,
                              matches
                            )}
                          </div>
                        </div>
                      </div>
                      {R.path(["data", "videos"], playlist) &&
                        matches.desktop &&
                        this.renderList()}
                    </div>
                  );
                }}
              </Media>
            </div>
          </div>
        )}
      </Layout>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    exercise: selectors.selectExercise(state),
    playlists: selectors.selectPlaylists(state),
    playlist: selectors.selectPlaylist(state),
    video: selectors.selectSingleVideo(state),
    userInfo: selectors.userInfo(state),
    selectedTab:
      selectors.selectModuleSelectedTab(state) || TAB_NAMES.DESCRIPTION,
    lang: state.lang,
    userInfo: selectors.userInfo(state),
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    dispatch,
  };
};

export default compose(connect(mapStateToProps, mapDispatchToProps))(
  SingleVideo
);
