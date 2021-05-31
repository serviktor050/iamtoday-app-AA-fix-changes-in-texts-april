import PropTypes from 'prop-types';
import React, { Component } from "react";
import CSSModules from "react-css-modules";
import styles from "./postItem.css";
import { getCustomStyleMap } from "draftjs-utils";
import { dict } from "dict";
import cookie from "react-cookie";
//import EmojiPicker from 'emojione-picker';
import Poll from "../componentKit/Poll";
//import 'emoji-mart/css/emoji-mart.css'
//import { Picker } from 'emoji-mart'
import { browserHistory, Link } from "react-router";
import Modal from "boron-react-modal/FadeModal";
import moment from "moment";
import { EmojiPicker as Emodji } from "./emodji/index";
import Stickers from "./Stickers";
import classnames from "classnames";
import {
  Entity,
  Editor,
  EditorState,
  convertFromRaw,
  CompositeDecorator,
} from "draft-js";
import { SMM_CHAT_ID } from "../../actions";

import { api, host, domen } from "../../config.js";
import classNames from "classnames";
const isAlfa = domen.isAlfa;
const customStyleMap = getCustomStyleMap();

const emojiFilter = {
  "263A-FE0F": true,
};

const visibleComments = 1;
let contentStyle = {
  borderRadius: "18px",
  padding: "30px",
};
const modalStyle = {
  maxWidth: "500px",
  width: "90%",
};
let categories = {
  people: {
    title: "Люди",
    emoji: "smile",
  },
  nature: {
    title: "Природа",
    emoji: "mouse",
  },
  food: {
    title: "Еда",
    emoji: "pizza",
  },
  activity: {
    title: "Развлечения",
    emoji: "soccer",
  },
  travel: {
    title: "Путешествия",
    emoji: "earth_americas",
  },
};
const regex = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
const getYouTubeID = (url) => {
  let result = "";
  if (url) {
    const match = url.match(regex);

    if (match && match[7] && match[7].length === 11) result = match[7];
  }
  return result;
};

const decorator = new CompositeDecorator([
  {
    strategy: (contentBlock, callback) => {
      const text = contentBlock.getText();

      if (getYouTubeID(text).length === 11) {
        const matchArr = regex.exec(text);
        if (matchArr !== null) {
          const start = matchArr.index;
          callback(start, start + matchArr[0].length);
        }
      }
    },
    component: (props) => {
      const id = getYouTubeID(props.decoratedText);
      return (
        <div className={styles.video}>
          <iframe
            id={`yt-${id}`}
            className={styles.youtube}
            src={`https://www.youtube.com/embed/${id}?autoplay=0`}
            type="text/html"
            frameBorder="0"
            allowFullScreen
            height="210px"
            width="100%"
          />
          <span> </span>
        </div>
      );
    },
  },
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

class PostItem extends Component {
  state = {
    showAllComments: false,
    showEmojiPopup: false,
    showAddComment: false,
    message: "",
    comments: [],
    content: null,
    showAllContent: false,
  };

  componentWillMount() {
    const { item } = this.props;

    if (item.chat) {
      this.setState({
        comments: item.chat.comments,
      });
    }
  }
  componentDidMount() {
    window.addEventListener("click", this.handleDocumentClick);

    this.setState({
      content: this.props.item.content,
    });
    this.setContentPreview(this.props.item.content);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.item !== this.props.item) {
      this.setState({
        content: nextProps.item.content,
      });
      this.setContentPreview(nextProps.item.content);
    }
  }

  componentWillUnmount() {
    window.removeEventListener("click", this.handleDocumentClick);
  }
  handleDocumentClick = (e) => {
    if (this.refs.btn !== e.target) {
      if (this.state.showEmojiPopup) {
        this.setState({
          showEmojiPopup: false,
        });
      }
    }
  };
  toggleListComments() {
    this.setState({
      showAllComments: !this.state.showAllComments,
    });
  }

  toggleEmojiPopup() {
    this.setState({ showEmojiPopup: !this.state.showEmojiPopup });
  }

  getEmoji(unicode) {
    const point = Number("0x" + unicode);
    const offset = point - 0x10000;
    const lead = 0xd800 + (offset >> 10);
    const trail = 0xdc00 + (offset & 0x3ff);
    const arr = [lead.toString(16), trail.toString(16)];
    return arr
      .map((el) => parseInt(el, 16))
      .map((el) => String.fromCharCode(el))
      .join("");
  }

  appendEmoji = (data) => {
    this.refs.text.value += this.getEmoji(data); //data.native
    const message = this.state.message + this.getEmoji(data); //this.state.message + data.native
    this.setState({
      message,
    });
  };

  sendMessage(typeId, sticker) {
    const { answerToChat, userInfo } = this.props;

    if (!this.state.message.length && !sticker) return;
    answerToChat(null, sticker || this.state.message, SMM_CHAT_ID, typeId);
    this.setState({ message: "" });

    this.setState({ comments: !this.state.showEmojiPopup });
    const item = {
      userInfo: userInfo.data,
      text: sticker || this.state.message,
      data: moment(),
    };
    const comments = this.state.comments.concat(item);
    this.setState({ comments: comments });
  }

  onMessageChanged(e) {
    this.setState({ message: e.target.value });
  }

  modalDialog() {
    this.refs.isNotRegs.show();
  }

  toComment() {
    const { sign } = this.props;

    if (!sign.isRegistered) {
      this.modalDialog();
      return;
    }
    this.setState({ showAddComment: true });
    if (this.refs.text) {
      this.refs.text.focus();
    }
  }

  toAnswer(e) {
    const { sign } = this.props;
    if (!sign.isRegistered) {
      this.modalDialog();
      return;
    }
    const name = e.target.getAttribute("data-name");
    //this.refs.text.value = name + ', ' || ''
    const message = name + ", " || "";
    this.setState({
      message,
    });
    this.refs.text.focus();
  }

  clickLike(item) {
    const { fetchLikePosts, sign } = this.props;
    if (!sign.isRegistered) {
      this.modalDialog();
      return;
    }
    let unlike = false;
    if (item.liked) {
      unlike = true;
    }
    fetchLikePosts(item.id, unlike);
  }

  renderBlockComentText = (text) => {
    const isSticker = text.indexOf("sticker:") !== -1;

    if (isSticker) {
      const sticker = text.split(":")[1];
      return (
        <div
          className={classnames(styles.blockCommentText, {
            [styles.sticker]: isSticker,
          })}
        >
          <img src={`/assets/img/alfa/stickers/${sticker}`} alt="" />
        </div>
      );
    }
    return <div className={styles.blockCommentText}>{text}</div>;
  };

  renderComments(comments) {
    const { lang } = this.props;
    if (!this.state.showAllComments) {
      comments = comments.slice(-visibleComments);
    }
    const arrComments = comments.map((com, idx) => {
      const name = `${com.userInfo.firstName || ""} ${
        com.userInfo.lastName || dict[lang]["guest"]
      }`;
      return (
        <div key={"comment-" + idx} className={styles.blockCommentItem}>
          <div className={styles.blockCommentAva}>
            <img
              className={styles.blockCommentAvaImg}
              src={
                com.userInfo.photo
                  ? com.userInfo.photo
                  : com.userInfo.gender === "male"
                  ? "/assets/img/png/boy.png"
                  : "/assets/img/png/girl.png"
              }
              alt=""
            />
          </div>
          <div className={styles.blockCommentInfo}>
            <div className={styles.blockCommentName}>{name}</div>
            {this.renderBlockComentText(com.text)}
            <div className={styles.blockCommentBottom}>
              <div className={styles.blockCommentDate}>
                {moment(com.date).startOf(com.date).fromNow()}
              </div>
              <div
                data-name={name}
                className={styles.blockCommentAnswer}
                onClick={(e) => this.toAnswer(e)}
              >
                {dict[lang]["toAnswer"]}
              </div>
            </div>
          </div>
        </div>
      );
    });
    return arrComments;
  }

  setContentPreview = (content) => {
    let contentPreview = { ...content };

    if (content && content.blocks && content.blocks.length) {
      contentPreview = {
        ...contentPreview,
        blocks: contentPreview.blocks.reduce((acc, cur) => {
          if (!acc.length || acc.map(item => item.text).join(' ').length < 250) {
            return [...acc, cur]
          }
          return acc
        }, []),
      };

      const b = { ...contentPreview.blocks[contentPreview.blocks.length - 1] };
      let lastIndexOfSpace = b.text
        .slice(
          0,
          contentPreview.blocks[contentPreview.blocks.length - 1].text.length
        )
        .lastIndexOf(" ");
      b.text =
        contentPreview.blocks[contentPreview.blocks.length - 1].text.slice(
          0,
          lastIndexOfSpace
        ) + "...";

      contentPreview = {
        ...contentPreview,
        blocks: [...contentPreview.blocks, b],
      };
    }

    this.setState({ contentPreview });
  };

  emojisToShowFilter = (emoji) => {
    if (!emojiFilter[emoji.unified]) {
      return true;
    }
  };

  addSticker = (sticker) => {
    const { sign, item } = this.props;

    if (!sign.isRegistered) {
      this.modalDialog();
      return;
    }

    this.sendMessage(item.id, sticker);
  };

  render() {
    const { item, sign, pollWasSend } = this.props;
    const { poll, id, isPollVoted } = item;
    const lang = cookie.load("AA.lang") || dict.default;

    const content = this.state.showAllContent
      ? this.state.content
      : this.state.contentPreview;
    const editorState = content
      ? EditorState.createWithContent(convertFromRaw(content), decorator)
      : EditorState.createEmpty();

    return (
      <div
        className={classNames(styles.layoutWrapItem, {
          [styles.alfa]: isAlfa,
        })}
      >
        <div className={styles.stageBox}>
          <div className={styles.editorWrap}>
            <div
              className={classNames(styles.logoBlock, {
                [styles.alfa]: isAlfa,
              })}
            >
              <div className={styles.logoBlockLogo}>
                <img src="/assets/img/antiage/apple.png" alt="" />
                {/*<svg className={styles.svgIconLogo} width='30px' height='30px'>
                  <use xlinkHref="#logo"></use>
                </svg>*/}
              </div>

              <div className={styles.logoBlockContent}>
                <div className={styles.logoBlockTitle}>Anti-Age Expert</div>
                <div className={styles.logoBlockDate}>
                  {moment(item.date).lang(lang).format("LLL")}
                </div>
              </div>
            </div>
            <Editor
              readOnly={true}
              customStyleMap={customStyleMap}
              editorState={editorState}
              blockRendererFn={mediaBlockRenderer}
            />
            {
              <div
                className={styles.more}
                onClick={() =>
                  this.setState({ showAllContent: !this.state.showAllContent })
                }
              >
                {this.state.showAllContent
                  ? dict[lang]["collapse"]
                  : dict[lang]["readMore"]}
              </div>
            }
            <div>
              {poll && poll.description && (
                <Poll
                  poll={poll}
                  id={id}
                  isPollVoted={isPollVoted}
                  pollWasSend={pollWasSend}
                  customClass={"smm"}
                  disabled={!sign.isRegistered}
                />
              )}
            </div>
          </div>
          <div className={styles.bottom}>
            <div className={styles.btns}>
              <button
                className={classNames(styles.btnsItemLike, {
                  [styles.btnsItemLikeDisable]: !sign.isRegistered,
                  [styles.liked]: item.liked,
                })}
                onClick={() => this.clickLike(item)}
                disabled={isAlfa ? null : !sign.isRegistered}
              >
                <svg
                  className={item.liked ? styles.svgIconLiked : styles.svgIcon}
                  width="20px"
                  height="20px"
                >
                  <use xlinkHref="#ico-heart" />
                </svg>
                <span className={styles.likeNumbers}>
                  {item.likes ? item.likes : 0}
                </span>
              </button>
              <button
                className={styles.btnsItem}
                type="button"
                onClick={() => this.toComment()}
              >
                <svg className={styles.svgIcon} width="20px" height="20px">
                  <use xlinkHref="#ico-msg-2" />
                </svg>
                <span className={styles.btnsTextComment}>
                  {dict[lang]["toComment"]}
                </span>
              </button>
            </div>
            <div className={styles.view}>
              <svg className={styles.svgIcon} width="20px" height="20px">
                <use xlinkHref="#ico-eye" />
              </svg>
              <span className={styles.btnsText}>{item.views}</span>
            </div>
          </div>

          {this.state.comments.length ? (
            <div className={styles.blockComment}>
              <div className={styles.blockCommentWrap}>
                {this.state.comments.length > visibleComments && (
                  <div
                    className={styles.blockCommentTitle}
                    onClick={() => this.toggleListComments()}
                  >
                    {!this.state.showAllComments
                      ? `${dict[lang]["wseeAllComments"]} ${
                          this.state.comments.length - visibleComments
                        }`
                      : dict[lang]["wseeAllComments"]}
                  </div>
                )}
              </div>
              <div className={styles.blockCommentList}>
                {this.renderComments(this.state.comments)}
              </div>
            </div>
          ) : null}

          {item.chat || this.state.showAddComment ? (
            <div className={styles.blockCommentAdd}>
              {this.state.showEmojiPopup ? (
                <div className={styles.chatEmoji}>
                  {/* <Picker
                        onSelect={this.appendEmoji}
                        exclude={['search', 'recent', 'nature', 'foods', 'activity', 'places', 'objects', 'symbols', 'flags', 'custom']}
                        showPreview={false}
                        emojisToShowFilter={this.emojisToShowFilter}
                      />*/}
                  <Emodji
                    categories={categories}
                    onChange={({ unicode }) => this.appendEmoji(unicode)}
                  />
                </div>
              ) : null}
              <button
                ref="btn"
                onClick={() => this.toggleEmojiPopup()}
                className={styles.chatEmojiButton}
              >
                😀
              </button>
              <Stickers smm={true} add={this.addSticker} />
              <textarea
                className={styles.blockCommentTextArea}
                onChange={this.onMessageChanged.bind(this)}
                placeholder={dict[lang]["writeComment"]}
                onFocus={(e) => (e.target.placeholder = "")}
                onBlur={(e) =>
                  (e.target.placeholder = dict[lang]["writeComment"])
                }
                value={this.state.message}
                ref="text"
              ></textarea>

              <div
                className={styles.blockCommentSubmit}
                onClick={() => {
                  const { sign } = this.props;
                  if (!sign.isRegistered) {
                    this.modalDialog();
                    return;
                  }
                  this.sendMessage(item.id);
                }}
              >
                <div className={styles.blockCommentBtnIcon}>
                  <svg>
                    <use xlinkHref="#i-send"></use>
                  </svg>
                </div>
              </div>
            </div>
          ) : null}
        </div>
        <Modal
          ref="isNotRegs"
          modalStyle={modalStyle}
          contentStyle={contentStyle}
        >
          <div className={styles.entryHeader}>
            <h2 className={styles.textCenter}>
              Авторизоваться, комментировать и лайкать вы сможете с 11 ноября.
            </h2>
          </div>
          <div className={styles.btnsModal}>
            <button
              className={styles.buttonAction}
              onClick={() => {
                this.refs.isNotRegs.hide();
              }}
            >
              {dict[lang]["regs.continue"]}
            </button>
            {/* <button className={styles.buttonAction} onClick={() => {
              this.refs.isNotRegs.hide()
              browserHistory.push('/signup?method=simple')
            }}>
              Зарегистрироваться
            </button>*/}
          </div>
        </Modal>
      </div>
    );
  }
}

export default CSSModules(PostItem, styles);
