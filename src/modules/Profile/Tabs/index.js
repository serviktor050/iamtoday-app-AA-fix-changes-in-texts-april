import React, { Component } from 'react';
import { connect } from 'react-redux';
import { browserHistory } from "react-router";
import { dict } from "dict";
import { compose } from 'redux';

import TabsNav from "components/common/TabsNav";

const SECTION_PROFILE = "profile";
const SECTION_BANK_DETAILS = "bank-details";
const SECTION_DIPLOMS = "diploms";

let categoriesData = [
  {
    name: SECTION_PROFILE,
    label: "profile.title",
    order: 1,
    icon: "i-list-pencil",
  },
  // {
  //   name: SECTION_BANK_DETAILS,
  //   label: "profile.bank-details",
  //   order: 2,
  //   icon: "list",
  // },
  {
    name: SECTION_DIPLOMS,
    label: "profile.diploms",
    order: 3,
    icon: "i-charter",
  },
]

class ProfileTabs extends Component {
  constructor(props) {
    super(props)

    this.state = {
      categories: [],
    }
  }

  componentDidMount() {
    const { lang } = this.props;
    let categories = categoriesData.map((item) => {
        return { ...item, label: dict[lang][item.label] };
      });
    this.setState({
      categories,
    });
  }

  toggleTab = (tab) => {
    if (tab.name === SECTION_PROFILE) {
      browserHistory.push(`/${SECTION_PROFILE}`);
    } else {
      browserHistory.push(`/profile/${tab.name}`)
    }
  }

  checkTab = (tab) => {
    const currentTab = location.pathname.split('/');
    return tab.name === currentTab[currentTab.length - 1]
  }
  

  render() {
    return (
      <TabsNav
        tabs={this.state.categories}
        tabNavClass="tabProfile"
        setActive={(tab) => this.checkTab(tab)}
        onClick={this.toggleTab}
      />
    )
  }
}

const mapStateToProps = state => ({ lang: state.lang })
const mapDispatchToProps = dispatch => ({ dispatch })

export default ProfileTabs = compose(connect(mapStateToProps, mapDispatchToProps))(ProfileTabs)
