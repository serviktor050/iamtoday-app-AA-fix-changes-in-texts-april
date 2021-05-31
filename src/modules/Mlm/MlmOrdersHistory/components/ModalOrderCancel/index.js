import React from 'react';
import {connect} from 'react-redux';
import classNames from 'classnames/bind';

import {Modal} from '../../../MlmStructure/components/MentorRequestCard/components/Modal';

import {dict} from 'dict';

import styles from './styles.css';

const cx = classNames.bind(styles);

const ConnectModalOrderCancel = ({onHide, lang}) => {
  const i18n = dict[lang];

  return (
    <Modal customClass={cx('modalContainer--modalOrderCancel')} isStyle={false} isButtons={false} onOk={() => {}} onCancel={onHide}>
      <div className={cx('modalOrderCancel')}>
        <p className={cx('modalOrderCancel__text')}>{i18n['mlm.mlmOrdersHistory.modalOrderCancel.question']}</p>
        <div className={cx('modalOrderCancel__buttons')}>
          <button className={cx('modalOrderCancel__button', 'modalOrderCancel__button--cancel')} type='button'>
            {i18n['admin.mentoring.modal.default-accept']}
          </button>
          <button className={cx('modalOrderCancel__button')} onClick={onHide} type='button'>{i18n['admin.questions.cancel']}</button>
        </div>
      </div>
    </Modal>
  );
};

const mapStateToProps = (state) => {
  return {
    lang: state.lang,
  }
}

export const ModalOrderCancel = connect(mapStateToProps)(ConnectModalOrderCancel);
