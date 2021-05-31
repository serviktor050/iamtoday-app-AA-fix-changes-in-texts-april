import React from 'react';
import { dict } from "dict";
import { connect } from "react-redux";
import styles from './MentorRequestDeclining.css';
import { declineMentorRequest } from '../ducks.jsx';
import Layout from "components/componentKit2/Layout";
import NotFound from "components/profile/NotFound";
import { withRouter, browserHistory } from 'react-router';
import { Breadcrumb } from "components/common/Breadcrumb";
import { selectMlmMentorshipRequests } from '../selectors';
import { MentorRequestCard } from '../MlmStructure/components/MentorRequestCard';

const mapDispatchToProps = dispatch => ({ dispatch });
const mapStateToProps = state => ({ lang: state.lang, mentorshipRequests: selectMlmMentorshipRequests(state) });

class MlmMentorRequestDeclining extends React.Component {
  constructor() {
    super();
    this.state = {
      isDeclined: false,
      response: ""
    }
  }

  handleDecline = _ => {
    this.props.dispatch(declineMentorRequest({ id: this.props.params.id, status:"rejected_tutor", tutorResponse: this.state.response }));
    this.setState({isDeclined: true});
  };

  render () {
    const i18n = dict[this.props.lang];
    const links = ["/", "/mlm", "/mlm/structure"];
    const items = [i18n["admin.main"], i18n["menu.mlm"], i18n["mlm.breadcrumb.students"], i18n["mlm.mentorshipRequest"]];

    return this.props.mentorshipRequests ? (
      <Layout page={"decline-mentorship-request"} location={this.props.location}>
        <div className={styles.MentorRequestDeclining}>

          <span className={styles.header}>{i18n["mlm.mentorshipRequest"]}</span>
          <Breadcrumb items={items} links={links} />

          {this.state.isDeclined ? (
            <div className={styles.declinedWindowWrapper}>

              <div className={styles.exclamationBlock}>
                <div className={styles.exclamation}></div>
                <div>
                  <p className={styles.headline}>{i18n["mlm.mentorship.declinedHeadline"]}</p>
                  <p className={styles.description}>{i18n["mlm.mentorship.declinedDescription"]}</p>
                  <div className={styles.helpBlock}>
                    <div className={styles.helpBlockText}>{i18n["mlm.mentorship.declinedHelpMessage"]}</div>
                    <button onClick={_ => browserHistory.push('/chats/7639')} className={styles.helpBlockButton}>{i18n["mlm.mentorship.declinedSupporButton"]}</button>
                  </div>
                </div>
                
              </div>

              

            </div>
          ) : (
            <div>

              <div className={styles.RequestsContainer}>
                {[this.props.mentorshipRequests.data.find(({id}) => id == this.props.params.id)]
                    .map(({userInfo, createTs, id}) => (
                      <MentorRequestCard
                        name={`${userInfo.firstName} ${userInfo.lastName}`}
                        occupation={"None for now"}
                        pictureUrl={userInfo.photo}
                        city={userInfo.city}
                        createTs={createTs}
                        cardId={id}
                        isStatic
                      />
                    ))}
              </div>

              <span className={styles.text}>{i18n["mlm.mentorshipRequestText"]}</span>
              {/* <span className={styles.text}>{i18n["mlm.declineReason"]}</span> */}

              <div className={styles.textareaWrapper}>
                <textarea placeholder={i18n["mlm.declineReason"]} onChange={res => this.setState({response: res.target.value})} className={styles.textarea} cols="30" rows="10"></textarea>

                <div className={styles.buttonsBlock}>
                  <button onClick={this.handleDecline} className={styles.button}>{i18n["mlm.mentorship.declineButton"]}</button>
                  <button onClick={_ => browserHistory.push("/mlm/structure")} className={styles.button}>{i18n["mlm.mentorship.cancelButton"]}</button>
                </div>
              </div>
            </div>)}
        </div>
      </Layout>
    ) : <NotFound />;
  };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(MlmMentorRequestDeclining));
