import React, { Component } from "react";
import { connect } from "react-redux";
import { dict } from "dict";
import styles from "./styles.css";
import { TutorBlock } from "../TutorBlock";
import { MyGroup } from "../MyGroup";
import Loader from "../../../../../../../components/componentKit/Loader";
import { isDataNotFetched } from "../../../../../../utils/utils";

const mapDispatchToProps = dispatch => ({ dispatch });
const mapStateToProps = state => ({ lang: state.lang, userInfo: state.userInfo, statistic: state.mlm.mlmStatistic, myGroup: state.mlm.mlmStatisticMyGroup });

export const SecondLevelTutors = connect(mapStateToProps, mapDispatchToProps)(({...props}) => {

   
        const { lang, statistic, myGroup } = props;
        const i18n = dict[lang];
        const grandparent = statistic && statistic.data.grandparentUserInfo
        const parent = statistic && statistic.data.parentUserInfo
        

        return (
            <div className={styles.tutorsBlock}>  
                <TutorBlock 
                    level={1}
                    title={i18n["mlm.mlmStructure.tutor"]}
                    avatar={grandparent.photo}
                    firstName={grandparent.firstName}
                    lastName={grandparent.lastName}
                    country={grandparent.country}
                    city={grandparent.city}
                /> 
                <div className={styles.line} />
                <TutorBlock 
                    level={2}
                    title={i18n["mlm.mlmStructure.myTutor"]}
                    avatar={parent.photo}
                    firstName={parent.firstName}
                    lastName={parent.lastName}
                    county={parent.country}
                    city={parent.city}
                /> 
                <div className={styles.line} />      
                {isDataNotFetched(myGroup) && <Loader />}             
                <MyGroup level={2}/> 
                         
            </div>
        )}
        )