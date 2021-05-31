import React, { Component } from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import classNames from "classnames/bind";
import Layout from "components/componentKit2/Layout";
import * as selectors from "../selectors";
import { dict } from "dict";
import { Breadcrumb } from "components/common/Breadcrumb";
import TabsNav from "components/common/TabsNav";
import styles from "./styles.css";
import { structureTabs } from "../utils";
import { TreeStructure } from "./components/TreeStructure";
import TableStructure from "./components/TableStructure";
import { MentorRequestCard } from "./components/MentorRequestCard";
import { TutorStructure } from "./components/TutorStructure";
import { getMentorshipRequests, getNewMentorshipRequests } from "../ducks";

const cx = classNames.bind(styles);
const page = "mlm-structure";



class MlmStructure extends Component {
  state = {
    activeTab: "tableView",
  };

  componentDidMount() {
    const { dispatch } = this.props;
    
    dispatch(getMentorshipRequests({ "take": 10, "skip": 0, status: "waiting_tutor" }));
    dispatch(getNewMentorshipRequests({ "take": 10, "skip": 0, status: "waiting_new" }));
   
  }

  

  toggleTab = (activeTab) => this.setState({ activeTab });

  renderTabContent = (tabName) => {
    switch (tabName) {
      case "tableView":
        return <TableStructure location={this.props.location} />;

      case "treeView":
        return <TreeStructure />;
        
      case "tutorView":
          return <TutorStructure />;

      default:
        return <div />;
    }
  };

  render() {
    const { activeTab } = this.state;
    const i18n = dict[this.props.lang];

    const items = [
      i18n["breadcrumb.main"],
      i18n["mlm.breadcrumb.mlm"],
      i18n["mlm.breadcrumb.mlmStructure"],
    ];
    const links = ["/", "/mlm"];

    return (
      <div>
        <Layout page={page} location={this.props.location} buy={true}>
          <div className={cx("mlmStructure")}>
            <div className={cx(styles.mlmStructureHeader)}>
              <h2 className={cx(styles.title)}>{i18n["mlm.mlmStructure.title"]}</h2>
              <Breadcrumb items={items} links={links} />
              <hr />
            </div>


            {!(this.props.mentorshipRequests && Array.isArray(this.props.mentorshipRequests.data)) ? null : this.props.mentorshipRequests.data.map(({ userInfo, createTs, id }) => (
              <MentorRequestCard
                name={`${userInfo.lastName} ${userInfo.firstName} ${userInfo.middleName}`}
                occupation={"None for now"}
                pictureUrl={userInfo.photo}
                city={userInfo.city}
                createTs={createTs}
                cardId={id}
                time={userInfo.timezone}
                recommended={true}
                userId={userInfo.id}
              />
            ))}

            {!(this.props.newMentorshipRequests && Array.isArray(this.props.newMentorshipRequests.data)) ? null : this.props.newMentorshipRequests.data.map(({ userInfo, createTs, id }) => (
              <MentorRequestCard
                name={`${userInfo.lastName} ${userInfo.firstName} ${userInfo.middleName}`}
                occupation={"None for now"}
                pictureUrl={userInfo.photo}
                city={userInfo.city}
                createTs={createTs}
                cardId={id}
                time={userInfo.timezone}
                userId={userInfo.id}
              />
            ))}
            <div className={styles.info}>{i18n["mlm.mlmStructure.info"]}</div>
          </div>
          <br />
          <div className={cx("mlmStructure")}>
            
            <TabsNav
              tabs={structureTabs}
              setActive={(tab) => {
                return tab.name === activeTab;
              }}
              tabNavClass="tabWebinars"
              onClick={(tab) => this.toggleTab(tab.name)}
            />
            {this.renderTabContent(activeTab)}
          </div>


        </Layout>
      </div>
    );
  }

}

const mapStateToProps = (state) => {
  return {
    userInfo: selectors.userInfo(state),
    //structure: selectors.selectMlmStructure(state),
    lang: state.lang,
    statistic: selectors.selectMlmStatistic(state),
    mentorshipRequests: selectors.selectMlmMentorshipRequests(state),
    newMentorshipRequests: selectors.selectNewMlmMentorshipRequests(state),
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    dispatch,
  };
};

export default compose(connect(mapStateToProps, mapDispatchToProps))(
  MlmStructure
);