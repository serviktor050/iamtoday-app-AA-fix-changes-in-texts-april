import React, { Component } from 'react';
import { connect } from 'react-redux';
import { browserHistory } from "react-router";
import { dict } from "dict";
import { compose } from 'redux';

import TabsNav from "components/common/TabsNav";

const SECTION_TASKS = "tasks";
const SECTION_CALENDAR = "calendar";

let categoriesData = [
  {
    name: SECTION_TASKS,
    label: "calendar.tasks",
    order: 1,
    icon: "i-list",
  },
  {
    name: SECTION_CALENDAR,
    label: "calendar.title",
    order: 2,
    icon: "i-list-done",
  },
]

class CalendarTabs extends Component {
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
    if (tab.name === SECTION_CALENDAR) {
      browserHistory.push(`/${SECTION_CALENDAR}`);
    } else {
      browserHistory.push(`/${SECTION_CALENDAR}/${tab.name}`)
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

export default CalendarTabs = compose(connect(mapStateToProps, mapDispatchToProps))(CalendarTabs)