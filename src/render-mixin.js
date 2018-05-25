import render from '../../custom-renderer/src/render.js';
import html from '../../custom-html-tag/src/html.js';
window.html = window.html || html;

export default (base = HTMLElement) =>
class RenderMixin extends base {

  constructor() {
    super();
      // check template for slotted and set shadowRoot when nece
    if (this.template && this.shouldAttachShadow() && !this.shadowRoot)
      this.attachShadow({mode: 'open'});
    // this._isValidRenderer(this.render);
  }

  shouldAttachShadow() {
    return Boolean(String(this.template({}).template).match(/<slot>(.*)<\/slot>/));
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
