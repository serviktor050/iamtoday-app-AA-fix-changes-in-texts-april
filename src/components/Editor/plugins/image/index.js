import creator from './components/image';

// import createFocusPlugin, {FocusDecorator} from 'draft-js-focus-plugin';
// import FocusDecorator from 'draft-js-focus-plugin/createDecorator';

import {Entity} from 'draft-js';

const imagePlugin = (config = {}) => {
  const component = creator(config);

  return {
    blockRendererFn: (contentBlock, { getEditorState, setEditorState, getReadOnly, getProps }) => {
      if (contentBlock.getType() === 'atomic') {
        // const contentState = getEditorState().getCurrentContent();
        // const entity = contentState.getEntity(contentBlock.getEntityAt(0));
        const entityKey = contentBlock.getEntityAt(0);
        const entity = entityKey && Entity.get(entityKey);
        const type = entity && entity.getType();

        if (entity && type === 'IMAGE') {
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

export default imagePlugin;

export const imageTheme = {};
export const imageCreator = creator;