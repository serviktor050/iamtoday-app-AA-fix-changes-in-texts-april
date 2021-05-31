import React, { Component } from "react";
import styles from "./styles.css";
import classNames from "classnames/bind";
import { UncontrolledTooltip } from "reactstrap";

const uniqueId = require("lodash.uniqueid");

const cx = classNames.bind(styles);

class MlmSummaryCard extends Component {
  constructor(props, context) {
    super(props, context);
    this.helpId = props.help ? uniqueId("card-help-") : null;
  }

  render() {
    const { header, children, help } = this.props;
    return (
      <div className={cx("card")}>
        <div className={cx("header")}>
          {header}
          {help && (
            <div className={styles.svgRight}>
              <div id={this.helpId} className={styles.svgIco}>
                <svg className={styles.icon}>
                  <use xlinkHref="#question"></use>
                </svg>
              </div>
              <UncontrolledTooltip placement="top" target={this.helpId}>
                {help}
              </UncontrolledTooltip>
            </div>
          )}
        </div>
        <div className={cx("content")}>{children}</div>
      </div>
    );
  }
}

export default MlmSummaryCard;
