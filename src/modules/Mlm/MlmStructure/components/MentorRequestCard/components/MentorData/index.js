import React from "react";
import styles from "./style.css";
import classNames from "classnames/bind";

const cx = classNames.bind(styles);

export const MentorData = ({
  pictureUrl,
  name,
  occupation,
  flag,
  city,
  time,
  experience,
}) => (
  <div className={cx(styles.MentorData, {'width-100': flag === 'mentor-requests'})}>
    <div className={styles.MentorDataBlock}>
      <div className={styles.MentorPicture}>
        <img height="100%" src={pictureUrl} alt="" />
      </div>
      <div className={styles.MentorData_info}>
        <span className={styles.MentorName}>{name}</span>
        <span className={styles.MentorOccupation}>{occupation}</span>
      </div>
    </div>
    <div className={cx("MentorLocationExperienceContainer", {'flex-container-mentor-reqeuests': flag === 'mentor-requests'})}>
      <span className={styles.MentorCity}>{`${city}, GMT +${+time}:00`}</span>
      <span className={styles.MentorExperienceContainer}>
        <span className={styles.MentorExperience}>Опыт работы в AntiAge </span>
        &nbsp;
        {`${experience ? experience + ' лет' : ""}`}
      </span>
    </div>
  </div>
);
