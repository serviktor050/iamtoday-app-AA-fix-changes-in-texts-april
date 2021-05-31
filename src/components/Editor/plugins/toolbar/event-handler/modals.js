export default class ModalHandler {

  callBacks = [];
  suggestionCallback = undefined;
  editorFlag = false;
  suggestionFlag = false;

  closeAllModals = (event) => {
    this.callBacks.forEach((callBack) => {
      callBack(event);
    });
  };

  init = (wrapperId) => {
    const wrapper = document.getElementById(wrapperId); // eslint-disable-line no-undef
    wrapper.addEventListener('click', () => {
      this.editorFlag = true;
    });
    document.addEventListener('click', () => { // eslint-disable-line no-undef
      if (!this.editorFlag) {
        this.closeAllModals();
        if (this.suggestionCallback) {
          this.suggestionCallback();
        }
      } else {
        this.editorFlag = false;
      }
    });
    document.addEventListener('keydown', (event) => { // eslint-disable-line no-undef
      if (event.key === 'Escape') {
        this.closeAllModals();
      }
    });
  };

  onEditorClick = () => {
    this.closeModals();
    if (!this.suggestionFlag && this.suggestionCallback) {
      this.suggestionCallback();
    } else {
      this.suggestionFlag = false;
    }
  }

  closeModals = (event) => {
    this.closeAllModals(event);
  };

  registerCallBack = (callBack) => {
    this.callBacks.push(callBack);
  };

  deregisterCallBack = (callBack) => {
    this.callBacks = this.callBacks.filter(cb => cb !== callBack);
  };

  setSuggestionCallback = (callBack) => {
    this.suggestionCallback = callBack;
  };

  removeSuggestionCallback = () => {
    this.suggestionCallback = undefined;
  };

  onSuggestionClick = () => {
    this.suggestionFlag = true;
  }
}
