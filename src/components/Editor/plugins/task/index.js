import creator from './components/task';

// import createFocusPlugin, {FocusDecorator} from 'draft-js-focus-plugin';
// import FocusDecorator from 'draft-js-focus-plugin/createDecorator';

import {Entity} from 'draft-js';

const taskPlugin = (config = {}) => {
  const component = creator(config);

  return {
    onChange(editorState) {
      const contentState = editorState.getCurrentContent();

      let number = 0;
      
      contentState
        .getBlocksAsArray()
        .map((contentBlock) => {
          const entityKey = contentBlock.getEntityAt(0);
          const entity = entityKey && Entity.get(entityKey);
          const type = entity && entity.getType();
          
          if (type === 'TASK') {
            Entity.mergeData(
              entity,
              { number: number++ }
            );
          }          
        });

      return editorState;
    },
    blockRendererFn: (contentBlock, {getReadOnly, getProps}) => {
      if (contentBlock.getType() === 'atomic') {
        const entityKey = contentBlock.getEntityAt(0);
        const entity = entityKey && Entity.get(entityKey);
        const type = entity && entity.getType();

        if (entity && type === 'TASK') {
          return {
            component,
            editable: false,
            props: {
              getProps,
              getReadOnly
            }
          };
        }
        return undefined;
      }
    },
  };
};

export default taskPlugin;

export const taskTheme = {};
export const taskCreator = creator;