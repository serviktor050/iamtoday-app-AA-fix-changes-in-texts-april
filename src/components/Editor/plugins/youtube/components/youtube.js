import PropTypes from 'prop-types';
import React from 'react';

export default () => {
  const Youtube = ({blockProps}) => {
    const {entityData} = blockProps;
    const {src, height, width} = entityData;

    return (
      <div style={{display: 'flex', justifyContent: 'center', width: '100%'}}>
        <iframe height={height} width={width} src={src} frameBorder="0" allowFullScreen/>
      </div>
    );
  };

  Youtube.propTypes = {
    blockProps: PropTypes.object,
    contentState: PropTypes.object,
  };

  return Youtube;
}
