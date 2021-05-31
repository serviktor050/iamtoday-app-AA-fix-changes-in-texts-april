import React, { Component } from "react";
import cookie from "react-cookie";
import * as R from "ramda";
import styles from "./styles.css";
import classNames from "classnames/bind";
import { dict } from "../../../dict";
import { getMlmStatisticData, getPartnerInfo } from "../ducks";
import { dateFormatter } from "../../Mlm/utils";
import { compose } from "redux";
import { connect } from "react-redux";
import * as selectors from "../selectors";
import moment from "moment";
import Loader from "../../../components/componentKit/Loader";
import { EmptyTable } from "components/common/Table/HeaderCell/EmptyTable";
import { addPartnerNote } from "../../../utils/api.js";
import Avatar from "../../../assets/img/png/ava-ph-big.png";
import { getFIO } from "../utils.js";

const cx = classNames.bind(styles);
const today = moment().local().format("YYYY-MM-DD");

class PartnerStatistic extends Component {
  state = {
    filter: {
      orderByDirection: "asc",
      orderByField: "lastName",
      dateStart: "2020-01-01",
      dateEnd: today,
    },
    notes: [],
    newNote: "",
  };

  isDataNotFetched() {
    const { partnerInfo } = this.props;
    return !partnerInfo || partnerInfo.isFetching || !partnerInfo.data;
  }
  handleTextarea = (e) => {
    const note = e.target.value;
    this.setState({ newNote: note });
  };

  addNote = () => {
    const token = cookie.load("token");
    const { partnerInfo } = this.props;
    const { newNote } = this.state;

    addPartnerNote({
      AuthToken: token,
      Data: {
        itemId: partnerInfo.data.user.id,
        text: newNote,
      },
    })
      .then((res) =>
        this.setState({
          notes: res.data.data,
        })
      )
      .catch(console.error);
  };

  componentDidUpdate(prevProps, prevState, snapshot) {
    const { dispatch, filter, partnerInfo } = this.props;
    const { data } = partnerInfo;
    const { user } = data;
    const { notes } = this.state;

    notes.id && dispatch(getPartnerInfo({ id: user.id }));
  }

  render() {
    const { lang, partnerInfo } = this.props;
    const { data } = partnerInfo;
    const i18n = dict[lang];
    const dataNotFetched = this.isDataNotFetched();
    return (
      <div>
        {this.isDataNotFetched() ? (
          <Loader />
        ) : (
            <div className={styles.summary}>
              {!data.user.userNotes[0] && (
                <EmptyTable message={i18n["partnerInfo.tableEmpty"]} />
              )}
              {this.renderNotes()}
              <br />
              {this.renderNotePad()}
            </div>
          )}
      </div>
    );
  }

  renderNotes() {
    const { partnerInfo, userInfo } = this.props;
    const { userNotes } = partnerInfo.data.user;

    return (
      <div>
        {userInfo &&
          userNotes &&
          userNotes.map((item) => (
            <div className={styles.note}>
              <img
                className={styles.note_avatar}
                src={userInfo.photo ? userInfo.photo : Avatar}
              />
              <div className={styles.note__body}>
                <p className={styles.note_name}>
                  {getFIO(userInfo.lastName, userInfo.firstName, userInfo.middleName)}
                  <span className={styles.note_time}>
                    {moment(item.date).format("DD.MM.YYYY")}
                  </span>
                </p>
                <p className={styles.note_text}>{item.text}</p>
              </div>
            </div>
          ))}
      </div>
    );
  }
  renderNotePad() {
    const { newNote } = this.state;
    const { lang } = this.props;
    const i18n = dict[lang];

    return (
      <div>
        <p className={styles.notePadHeader}>
          {i18n["partnerInfo.partnerNotes.header"]}
        </p>
        <div className={styles.notePad}>
          <textarea
            onChange={this.handleTextarea}
            className={styles.notePad_textarea}
            wrap="off"
            id="note"
            name="note"
            rows="5"
            value={newNote}
          ></textarea>
          <button className={styles.notePad_button} onClick={this.addNote}>
            {i18n["partnerInfo.partnerNotes.saveButton"]}
          </button>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    partnerInfo: selectors.selectPartnerInfo(state),
    lang: state.lang,
    userInfo: state.userInfo.data,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    dispatch,
  };
};

export default compose(connect(mapStateToProps, mapDispatchToProps))(
  PartnerStatistic
);
