import React, { Component } from 'react'
import { connect } from 'react-redux'
import CSSModules from 'react-css-modules'
import styles from './profileSignupDesc.css'
import LogoLink from '../componentKit/LogoLink'
import { browserHistory, Link } from 'react-router'
import { api, domen } from '../../config.js'



class ProfileSignupDesc extends Component {

  render() {
    const isUnipro = domen.isUnipro
    //document.body.style.backgroundColor = "rgba(252, 230, 190, 0.48)"
    return (
      <div className={styles.layout}>
        <div className={styles.header}>
          <div className={styles.gridHeaderInner}>
            <h1 className={styles.gridCellHeaderLogoUnipro}>
              <img
                src="/assets/img/unipro/logo_white2.png"
                className={styles.uniproLogo}
                onClick={() => {
                  browserHistory.push('/')
                }}
                alt=""/>
            </h1>
          </div>
        </div>

        <div className={styles.layoutInner}>
          <div className={styles.grid}>
            <div className={styles.gridCellLayoutContentPocket34}>
              <div className={styles.container}>
                <h1 className={styles.h1}>Описание программ</h1>

                <p className={styles.p}>Физкульт-привет!</p>
                <p className={styles.p}>С момента завершения первого сезона марафон <b>НаЗдоровье2.0</b> значительно преобразился. Мы хотим, чтобы вы были в курсе самых последних новостей, поэтому написали это сообщение.</p>

                <p className={styles.p}>Итак, что нового? Второй сезон – четыре программы: <b>«Новые старты»</b>, <b>«Мама может»</b>, <b>«Экстрим для продвинутых»</b> и <b>«Спортивная семья»</b>. Программ стало больше, и они все отличаются друг от друга. Чтобы вам было легче сделать выбор, рассказываем о них подробнее:</p>

                <p className={styles.p}><b>Новые старты</b> – программа для новичков. Тех, кто никогда не увлекался спортом, но решил попробовать свои силы в этом нелегком деле. Упражнения здесь подобраны таким образом, чтобы участники постепенно увеличивали темп. Программа подойдет даже тем, кто никогда не занимался спортом. Нагрузка в ежедневных тренировках будет распределена равномерно на все группы мышц.</p>
                <p className={styles.p}><b>Мама может</b> – программа для молодых мам, мечтающих о возвращении фигур образца «До» и даже лучше. Нагрузка в этой программе для мам идентична той, что дается участникам «Новые старты», но здесь есть специальный комплекс упражнений для тех, кому после родов был поставлен диагноз диастаз. Если у участницы нет проблем с данным заболеванием, она вполне может выбрать и программу «Я могу».</p>
                <p className={styles.p}><b>Экстрим для продвинутых</b> – программа для продвинутых спортсменов. Она подойдет тем, кто со спортом на «Ты». Это усиленные тренировки на полноценную проработку мышц. Занятия на грани человеческих возможностей, за время которых с вас сойдет семь потов. Эта программа действительно намного сложнее всех остальных. Здесь больше подходов и повторений каждого упражнения, кроме того, у ребят есть упражнения с утяжелителями. Нужно хорошенько рассчитать свои силы, чтобы выбрать эту программу.</p>
                <p className={styles.p}><b>Спортивная семья</b> – программа, в которой можно заниматься всей семьей. Мы придумали ее специально для тех, кто хочет больше времени проводить с родными, кто любит городские спортивные старты, постоянно придумывает что-то новое для своих детей и знает, что спорт – отличное времяпрепровождение, которое поднимает настроение и улучшает физическую форму.</p>
                <p className={styles.p}>Мы понимаем, что очень сложно сразу правильно оценить свои возможности. Именно поэтому мы не только призываем участников делать упражнения по мере сил и не перенапрягаться, но и даем право сменить выбранную программу до первого экзамена.</p>
                <p className={styles.p}>Мы всегда поможем и подскажем что делать, но выбор - за вами!</p>



              </div>

            </div>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  sign: state.sign
})

ProfileSignupDesc = connect(
  mapStateToProps,
)(ProfileSignupDesc)

export default CSSModules(ProfileSignupDesc, styles)



