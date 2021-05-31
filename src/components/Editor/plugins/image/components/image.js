import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {Entity} from 'draft-js';
import classNames from 'classnames';
import Icon from '../../../components/Icon';
import Option from '../../../components/Option';
import styles from './styles.css'; // eslint-disable-line no-unused-vars

const getImageComponent = ({decorator}) => {

  class Image extends Component {

    constructor(props) {
      super(props);

      this.state = {
        hovered: false,
      }
    }

    setEntityAlignment(alignment) {
      const {blockProps} = this.props;
      const {setEntityData} = blockProps;

      setEntityData({alignment});
    };

    setFocus = () => {
      const {blockProps} = this.props;
      const {isFocused, setFocusToBlock} = blockProps;

      if (!isFocused) {
        setFocusToBlock();
      }
    };

    renderAlignmentOptions() {
      return (
        <div className="itd-image-alignment-options-popup">
          {
            ['left', 'center', 'right', 'justify']
              .map((value) => (
                <Option
                  key={value}
                  onClick={() => this.setEntityAlignment(value)}
                  className="itd-image-alignment-option"
                >
                  <Icon kind={`align-${value}`} />
                </Option>
              ))
          }
        </div>
      );
    }

    render() {
      const {blockProps} = this.props;
      const {entityData, getProps} = blockProps;
      const {isPresentation} = getProps();
      const {src, alignment, height, width} = entityData;

      return (
        <div
          onClick={e => {
            e.stopPropagation();
            this.setFocus();
          }}
          className={classNames(
            'itd-image-alignment',
            {
              'itd-image-left': alignment === 'left',
              'itd-image-right': alignment === 'right',
              'itd-image-center': !alignment || alignment === 'none' || alignment === 'center',
              'itd-image-justify': alignment === 'justify',
            }
          )}
        >
          <div className="itd-image-imagewrapper">
            <img
              src={src}
              role="presentation"
              style={{
                height,
                width,
              }}
            />

            { !isPresentation ? this.renderAlignmentOptions() : null }
          </div>
        </div>
      );
    }
  }

  Image.propTypes = {
    block: PropTypes.object,
    contentState: PropTypes.object,
  };

  return decorator ? decorator(Image) : Image;
};

export default getImageComponent;
