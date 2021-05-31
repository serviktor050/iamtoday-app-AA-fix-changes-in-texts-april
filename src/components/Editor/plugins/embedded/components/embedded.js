import PropTypes from 'prop-types';
import React from 'react';

export default () => {
  const Embed = ({blockProps}) => {
    const {entityData} = blockProps;
    const {src, height, width} = entityData;

    return (<iframe height={height} width={width} src={src} frameBorder="0" allowFullScreen/>);
  };

  Embed.propTypes = {
    block: PropTypes.object,
    contentState: PropTypes.object,
  };

  return Embed;
}
