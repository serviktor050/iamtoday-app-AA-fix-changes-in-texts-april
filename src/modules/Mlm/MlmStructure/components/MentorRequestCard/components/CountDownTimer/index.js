import React from "react";
import styles from "./style.css";

export class CountDownTimer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hours: 0,
      minutes: 0,
      seconds: 0,
    };
  }

  componentDidMount() {
    this.getTimeDifference(this.props.eventDate);
    this.timerId = setInterval(() => this.getTimeDifference(this.props.eventDate), 1000);
  }

  componentDidUpdate() {
    if (this.state.hours < 0) {
      clearInterval(this.timerId)
    }
  }

  componentWillUnmount() {
    clearInterval(this.timerId);
  }

  leadingZero(num) {
    return num > 0 ? (num < 10 && num > 0 ? "0" + num : num) : "00";
  }

  getTimeDifference(eventDate) {
    const time = Date.parse(eventDate) - Date.parse(new Date()) + 1000 * 60 * 60 * 72;

    const days = Math.floor(time / (1000 * 60 * 60 * 24));
    const hours = Math.floor((time / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((time / 1000 / 60) % 60);
    const seconds = Math.floor((time / 1000) % 60);
    this.setState({ hours: hours + days * 24, minutes, seconds });
  }

  render() {
    const {tooltip = true} = this.props
    return (
      <div className={styles.timerWrapper}>
        <div
          className={styles.CountDownTimer}
          style={{ background: this.state.hours > 12 ? "#79C330" : "#FF6F6F" }}
        >
          {`${this.leadingZero(this.state.hours)}:${this.leadingZero(this.state.minutes)}:${this.leadingZero(this.state.seconds)}`}
        </div>
        {tooltip && <div className={styles.tooltip}>
          <div className={styles.tooltipSvgContainer}>
            <svg height="27px" width="27px" className={styles.tooltipSVG}>
              <use xlinkHref="#question" />
            </svg>
          </div>
          <span className={styles.tooltiptext}>
            Таймер оставшегося времени. На подтверждение наставничества дается
            72 ч.
          </span>
        </div>}
      </div>
    );
  }
}
