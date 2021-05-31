import creator from './components/embedded';

import {Entity} from 'draft-js';

const embeddedPlugin = (config = {}) => {
  const component = creator(config);

  return {
    blockRendererFn: (contentBlock) => {
      if (contentBlock.getType() === 'atomic') {
        const entityKey = contentBlock.getEntityAt(0);
        const entity = entityKey && Entity.get(entityKey);
        const type = entity && entity.getType();
        
        if (entity && type === 'EMBEDDED_LINK') {
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

export default embeddedPlugin;

export const embeddedTheme = {};
export const embeddedCreator = creator;