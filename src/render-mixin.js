import render from '../../custom-renderer/src/render.js';
import html from '../../custom-html-tag/src/html.js';
window.html = window.html || html;

export default (base = HTMLElement) =>
class RenderMixin extends base {

  constructor() {
    super();
      // check template for slotted and set shadowRoot if not set already
    if (this.template && this.shouldAttachShadow() && !this.shadowRoot)
      this.attachShadow({mode: 'open'});
  }

  /**
   * wether or not the template contains slot tags
   */
  shouldAttachShadow() {
    if (this.shadowRoot) return false;
    else return Boolean(String(this.template({}).template).match(/<slot>(.*)<\/slot>/));
  }

  /**
   * wether or not properties is just an object or indexed object (like {prop: {value: 'value'}})
   */
  isFlat(object) {
    if (object[Object.keys(object)[0]] && object[Object.keys(object)[0]].hasOwnProperty('value')) return false;
    else return true;
  }

  connectedCallback() {
    if (super.connectedCallback) super.connectedCallback();
      this.render = (properties = this.properties, template = this.template) => {
        if (!properties) properties = {};
        else if (!this.isFlat(properties)) {
          // check if we are dealing with an flat or indexed object
          // create flat object getting the values from super if there is one
          // default to given properties set properties[key].value
          // this implementation is meant to work with 'property-mixin'
          // checkout https://github.com/vandeurenglenn/backed/src/mixin/property-mixin
          // while I did not test, I believe it should be compatible with PolymerElements
          const object = {};
          Object.keys(properties).forEach(key => object[key] = this[key] || properties[key].value);
          properties = object;
        }
        render(this, template, properties);
      }
    if (this.render) {
      this.render();
      this.rendered = true;
    };
  }
}
