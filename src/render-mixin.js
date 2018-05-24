import render from '../node_modules/custom-renderer/src/render.js';
import html from '../node_modules/custom-html-tag/src/html.js';
window.html = window.html || html;

export default (base = HTMLElement) =>
class RenderMixin extends base {
  constructor() {
    super();
      // check template for slotted and set shadowRoot when nece
    // if (!this.shadowRoot) this.attachShadow({mode: 'open'});


    // this._isValidRenderer(this.render);
  }

  connectedCallback() {
    if (super.connectedCallback) super.connectedCallback();
      this.render = (properties = this.properties) =>
        render(this, this.template, properties);

    if (this.render) {
      this.render();
      this.rendered = true;
    };
  }
}
