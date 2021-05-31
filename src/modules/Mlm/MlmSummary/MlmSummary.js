import React, { Component } from "react";
import { connect } from "react-redux";
import * as R from "ramda";
import { compose } from "redux";
import classNames from "classnames/bind";
import Layout from "components/componentKit2/Layout";
import { dict } from "dict";
import { pluralize } from "utils/helpers";
import { Breadcrumb } from "components/common/Breadcrumb";
import { browserHistory } from "react-router";
import { Button } from "components/common/Button";
import Loader from "components/componentKit/Loader";
import MlmSummaryCard from "../MlmSummaryCard/MlmSummaryCard";
import { getMlmSummary, getOutcommingRequests } from "../ducks";
import * as selectors from "../selectors";
import styles from "./styles.css";
import { pluralizeScores } from "../utils";
import PointsPlank from "../components/PointsPlank";
import InformingBlock from "../../../components/common/InformingBlock";
import TutorCard from "./TutorCard";
import { select } from "react-cookie";
import { isDataNotFetched } from '../../Admin/utils';

const cx = classNames.bind(styles);

const page = "mlm-summary";

class MlmSummary extends Component {
  constructor(props) {
    super(props);
    this.state = { isLinkCopied: false };
  }

  isDataNotFetched() {
    const { summary } = this.props;
    return !summary || summary.isFetching || !summary.data;
  }

  componentDidMount() {
    const { dispatch } = this.props;
    const currUserId = R.path(["userInfo", "data", "id"], this.props);
    if (currUserId > 0) {
      dispatch(getMlmSummary({ id: currUserId }));
    }
    dispatch(getOutcommingRequests({ take: 10, skip: 0, status: 'rejected_manager' }))
  }

  shouldComponentUpdate(nextProps, nextState, nextContext) {
    const nextUserId = R.path(["userInfo", "data", "id"], nextProps);
    return nextUserId > 0;
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const { dispatch } = this.props;
    const currUserId = R.path(["userInfo", "data", "id"], this.props);
    const prevUserId = R.path(["userInfo", "data", "id"], prevProps);
    if (prevUserId !== currUserId) {
      dispatch(getMlmSummary({ id: currUserId }));
    }
  }

  renderHeader() {
    const { lang } = this.props;
    const i18n = dict[lang];
    const items = [
      i18n["breadcrumb.main"],
      i18n["mlm.breadcrumb.mlm"],
      i18n["mlm.breadcrumb.mlmSummary"],
    ];
    const links = ["/", "/mlm"];
    return (
      <div className={cx(styles.mlmSummaryHeader)}>
        <h2 className={cx(styles.title)}>{i18n["mlm.mlmSummary.title"]}</h2>
        <Breadcrumb items={items} links={links} />
        <hr />
      </div>
    );
  }

  renderGraph() {
    const { lang, userInfo } = this.props;
    const i18n = dict[lang];
    const imgs = {
      first: '../../../../assets/img/svg/click1.svg',
      second: '../../../../assets/img/svg/webinar1.svg',
      third: '../../../../assets/img/svg/people1.svg',
      fourth: '../../../../assets/img/svg/shopping-cart3.svg',
    }
    const headers = {
      first: 'mlm.mlmSummary.steps.choose-tutor',
      second: 'mlm.mlmSummary.steps.listen-lection',
      third: 'mlm.mlmSummary.steps.invite-one-student',
      fourth: 'mlm.mlmSummary.steps.buy-any-product',
    }
    return (
      <div className={cx('steps__graph')}>
        <div className={cx('steps__graph-line')}></div>
        {userInfo.data.mlmUserInfo.parentUser && <div className={cx('steps__graph-lineProgress')}></div>}
        <div className={cx('steps__graph-card')}>
          <div className={cx('steps__graph-iconWrapper', { 'steps__graph-iconWrapper-completed': !!userInfo.data.mlmUserInfo.parentUser })}>
            {!userInfo.data.mlmUserInfo.parentUser && <img className={cx('steps__grapg-icon')} src={imgs.first} height='30' width='30' />}
          </div>
          <span className={cx('steps_graph-header')}>{i18n[headers.first]}</span>
        </div>
        <div className={cx('steps__graph-card')}>
          <div className={cx('steps__graph-iconWrapper')}>
            <img className={cx('steps__grapg-icon')} src={imgs.second} height='30' width='30' />
          </div>
          <span className={cx('steps_graph-header')}>{i18n[headers.second]}</span>
        </div>
        <div className={cx('steps__graph-card')}>
          <div className={cx('steps__graph-iconWrapper')}>
            <img className={cx('steps__grapg-icon')} src={imgs.third} height='30' width='30' />
          </div>
          <span className={cx('steps_graph-header')}>{i18n[headers.third]}</span>
        </div>
        <div className={cx('steps__graph-card')}>
          <div className={cx('steps__graph-iconWrapper')}>
            <img className={cx('steps__grapg-icon')} src={imgs.fourth} height='30' width='30' />
          </div>
          <span className={cx('steps_graph-header')}>{i18n[headers.fourth]}</span>
        </div>
      </div>
    )
  }

  renderInfoBlock() {
    const { userInfo: {data: userInfo} } = this.props;
    const { mlmUserInfo: { parentUser, tutorRequests } } = userInfo;

    if (parentUser || tutorRequests.length) return

    const styledText = (<p styles={{fontWeight: 'bold'}}>{dict[this.props.lang]['mlm.mlmSummary.informing-block-text']}</p>)

    const props = {
      linkText: dict[this.props.lang]['mlm.mlmSummary.informing-block-link'],
      mainText: styledText,
      buttonText: dict[this.props.lang]['lecture.info-block.btn-chose-mentor'],
      buttonClick: _ => browserHistory.push('/chose-mentor'),
      linkHref: '/chose-mentor',
      type: 'alert',
      isButton: false,
    };

    return <div className={cx('informingBlock__wrapper')}><InformingBlock {...props} /></div>
  }

  renderTutorCards() {
    const { userInfo: { data: userInfo}, rejectedRequests: { data: [rejectedRequests]} } = this.props;
    const { mlmUserInfo: { tutorRequests } } = userInfo;

    return (
      <div className={cx('tutorCards__wrapper')}>
        {tutorRequests.find(item => item.status === 'waiting_user') ? <TutorCard key={rejectedRequests.id} item={rejectedRequests} location={location} /> : null}
        {tutorRequests.map((item) => 
          <TutorCard key={item.id} item={item} location={location} />
        )}
      </div>
    )
  }

  render() {
    const { location, lang, userInfo: { data: userInfo } } = this.props;
    const i18n = dict[lang];
    return (
      <Layout page={page} location={location} buy={true}>
        <div className={cx("mlmSummary")}>
          {this.renderHeader()}
          <div className={styles.info}>{i18n["mlm.mlmSummary.info"]}</div>
          <div className={cx('steps')}>
            <h3 className={cx('steps__header')}>{i18n['mlm.mlmSummary.steps.header']}</h3>
            <br />
            <p className={cx('steps__mainText')}>{i18n['mlm.mlmSummary.steps.main-text-first']}</p>
            <p className={cx('steps__mainText')}>{i18n['mlm.mlmSummary.steps.main-text-second']}</p>
            <br />
            <p className={cx('steps__mainText')}>{i18n['mlm.mlmSummary.steps.tutorial-video-text']} &nbsp; <a href='#'>{i18n['mlm.mlmSummary.steps.tutorial-video-link']}&nbsp;&#8594;</a></p>
            {!this.isDataNotFetched() && userInfo && this.renderGraph()}
          </div>
          {!this.isDataNotFetched() && this.renderInfoBlock()}
          {!this.isDataNotFetched() && userInfo && userInfo.mlmUserInfo && userInfo.mlmUserInfo.tutorRequests.length ? this.renderTutorCards() : null}
        </div>
        {this.isDataNotFetched() ? (
          <Loader />
        ) : (
          <div>
            <div className={cx("mlmSummary", 'no-padding')}>{this.renderPoints()}</div>
            <div className={cx("mlmSummary")}>
              <div className={styles.contentList}>
                {this.renderInfoCard()}
                {this.renderReward()}
                {this.renderStructure()}
                {this.renderMentor()}
              </div>
            </div>
          </div>
        )}
      </Layout>
    );
  }

  renderPoints() {
    const { summary, lang } = this.props;
    return <PointsPlank summary={summary} lang={lang} />;
  }

  renderMentor() {
    const { summary, lang, userInfo } = this.props;
    const { data } = summary;
    const { mlmUserInfo } = data;
    const i18n = dict[lang];
    return (
      mlmUserInfo.parentUser && !userInfo.data.mlmUserInfo.tutorRequests.length && (
        <div className={styles.contentItem}>
          <MlmSummaryCard header={i18n["mlm.mentorCard.title"]}>
            <div className={styles.mentor}>
              <div className={styles.imageItem}>
                <img src={mlmUserInfo.parentUser.photo} alt={"photo"} />
              </div>
              <div className={styles.imageDescription}>
                <div className={styles.surname}>
                  {mlmUserInfo.parentUser.lastName}
                </div>
                <div className={styles.firstName}>
                  {mlmUserInfo.parentUser.firstName}{" "}
                  {mlmUserInfo.parentUser.middleName}
                </div>
                <div className={styles.contact}>
                  <div className={styles.contactPhone}>
                    {mlmUserInfo.parentUser.phone}
                    <a href={"https://wa.me/" + mlmUserInfo.parentUser.phone}>
                      <svg className={styles.icon}>
                        <use xlinkHref="#phone" />
                      </svg>
                    </a>
                  </div>
                  <div className={styles.contactEmail}>
                    <a href={"mailto: " + mlmUserInfo.parentUser.email}>
                      {mlmUserInfo.parentUser.email}
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.tutorButtons}>
              <button className={cx('btn', 'btn-blue')} onClick={(_) => browserHistory.push(`/change-tutor/${mlmUserInfo.parentUser.id}?returnUrl=${location.pathname}`) } >{i18n['mlm.mentorship.changeTutor']}</button>
              <button className={cx('btn', "btn-blueOutline")} onClick={(_) => browserHistory.push(`/tutor/${mlmUserInfo.parentUser.id}?returnUrl=${location.pathname}`)} >{i18n['mlm.mentorship.tutorProfile']}</button>
            </div>  
          </MlmSummaryCard>
        </div>
      )
    );
  }

  renderStructure() {
    const { summary, lang } = this.props;
    const { data } = summary;
    const { mlmUserInfo } = data;
    const i18n = dict[lang];
    return (
      <div className={styles.contentItem}>
        <MlmSummaryCard header={i18n["mlm.structureCard.title"]}>
          <div>
            <div className={styles.cardItem}>
              <div className={styles.label}>
                {i18n["mlm.structureCard.partnersLevel1"]}
              </div>
              <div className={styles.valueBold}>{mlmUserInfo.partnersLevel1}</div>
            </div>
            <div className={styles.cardItem}>
              <div className={styles.label}>
                {i18n["mlm.structureCard.partnersLevel2"]}
              </div>
              <div className={styles.valueBold}>{mlmUserInfo.partnersLevel2}</div>
            </div>
            <div className={styles.cardItem}>
              <div className={styles.label}>
                {i18n["mlm.structureCard.partnersTotal"]}
              </div>
              <div className={styles.valueBold}>
                {mlmUserInfo.partnersLevel1 + mlmUserInfo.partnersLevel2}
              </div>
            </div>
            <div className={styles.cardAction}>
              <Button
                kind=""
                className={styles.structureCardAction}
                onClick={() => browserHistory.push("/mlm/structure")}
              >
                {i18n["mlm.action.goToStructure"]}
              </Button>
            </div>
          </div>
        </MlmSummaryCard>
      </div>
    );
  }

  renderReward() {
    const { summary, lang } = this.props;
    const { data } = summary;
    const { mlmUserInfo } = data;
    const i18n = dict[lang];
    const totalScores = mlmUserInfo.pointsLevel1 + mlmUserInfo.pointsLevel2;
    return (
      <div className={styles.contentItem}>
        <MlmSummaryCard
          header={i18n["mlm.rewardCard.title"]}
          help={
            <div className={styles.help}>{i18n["mlm.rewardCard.help"]}</div>
          }
        >
          <div>
            <div className={styles.cardItem}>
              <div className={styles.label}>
                {i18n["mlm.rewardCard.pointsLevel1"]}
              </div>
              <div className={styles.valueBold}>
                {pluralizeScores(mlmUserInfo.pointsLevel1, lang)}
              </div>
            </div>
            <div className={styles.cardItem}>
              <div className={styles.label}>
                {i18n["mlm.rewardCard.pointsLevel2"]}
              </div>
              <div className={styles.valueBold}>
                {pluralizeScores(mlmUserInfo.pointsLevel2, lang)}
              </div>
            </div>
            <div className={styles.cardItem}>
              <div className={styles.label}>
                {i18n["mlm.rewardCard.pointsTotal"]}
              </div>
              <div className={styles.valueBold}>
                {pluralizeScores(totalScores, lang)}
              </div>
            </div>
            <div className={styles.cardItem}>
              <div className={styles.label}>
                {i18n["mlm.rewardCard.pointsWithdrawn"]}
              </div>
              <div className={styles.valueBold}>
                {pluralizeScores(Math.abs(mlmUserInfo.pointsWithdrawn), lang)}
              </div>
            </div>
            <div className={styles.cardItem}>
              <div className={styles.label}>
                {i18n["mlm.rewardCard.pointsSpent"]}
              </div>
              <div className={styles.valueBold}>
                {pluralizeScores(Math.abs(mlmUserInfo.pointsPayment), lang)}
              </div>
            </div>
            <div className={styles.cardAction}>
              <Button
                kind=""
                className={styles.rewardActionHistory}
                onClick={() => browserHistory.push("/mlm/history")}
              >
                {i18n["mlm.action.history"]}
              </Button>
              {/* uncomment when it will ready to use <Button kind='' className={styles.rewardActionReward} onClick={() => browserHistory.push('/')}>
                            {i18n['mlm.action.reward']}
                        </Button>*/}
            </div>
          </div>
        </MlmSummaryCard>
      </div>
    );
  }

  renderInfoCard() {
    const { isLinkCopied } = this.state;
    const { summary, lang, tooltip } = this.props;
    const { data } = summary;
    const { mlmUserInfo } = data;
    const i18n = dict[lang];
    const inviteLink = `${window.location.protocol}//${window.location.host}/signup?invite=${data.id}`;
    const onCopyLinkButton = () => {
      if (navigator && navigator.clipboard) {
        navigator.clipboard.writeText(inviteLink);
        this.setState({ isLinkCopied: true });
      }
    };
    return (
      <div className={styles.contentItem}>
        <MlmSummaryCard header={i18n["mlm.infoCard.title"]}>
          <div>
            <div className={styles.cardItem}>
              <div className={styles.label}>{i18n["mlm.infoCard.id"]}</div>
              <div className={styles.valueBold}>{data.id}</div>
            </div>
            <div className={styles.cardItem}>
              <div className={styles.label}>
                {i18n["mlm.infoCard.allUsersCount"]}
              </div>
              <div className={styles.valueBold}>{mlmUserInfo.allUsersCount}</div>
            </div>
            <div className={styles.infoCardLinkLabel}>
              {i18n["mlm.infoCard.inviteLink"]}
            </div>
            <div className={styles.infoCardLink}>{inviteLink}</div>
            <div className={styles.cardAction}>
              {isLinkCopied ? (
                <Button kind="" className={styles.infoCardAction_done}>
                  {i18n["mlm.action.copyLink.copied"]}
                </Button>
              ) : (
                <Button
                  kind=""
                  className={styles.infoCardAction}
                  onClick={onCopyLinkButton}
                >
                  {i18n["mlm.acton.copyLink"]}
                </Button>
              )}
            </div>
          </div>
        </MlmSummaryCard>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    userInfo: selectors.userInfo(state),
    summary: selectors.selectMlmSummary(state),
    rejectedRequests: selectors.selectRejectedRequests(state),
    lang: state.lang,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    dispatch,
  };
};

export default compose(connect(mapStateToProps, mapDispatchToProps))(
  MlmSummary
);
