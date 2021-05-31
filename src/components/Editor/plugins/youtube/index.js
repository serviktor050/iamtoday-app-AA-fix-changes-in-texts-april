import creator from './components/youtube';

import {Entity} from 'draft-js';

const youtubePlugin = (config = {}) => {
  const component = creator(config);

  return {
    blockRendererFn: (contentBlock) => {
      if (contentBlock.getType() === 'atomic') {
        const entityKey = contentBlock.getEntityAt(0);
        const entity = entityKey && Entity.get(entityKey);
        const type = entity && entity.getType();
        
        if (entity && type === 'YOUTUBE_LINK') {
          return {
            component,
            editable: false,
          };
        }
        return undefined;
      }
    },
  };
};

export default youtubePlugin;

export const youtubeTheme = {};
export const youtubeCreator = creator;