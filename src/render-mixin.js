import render from '../../custom-renderer/src/render.js';
import html from '../../custom-html-tag/src/html.js';
window.html = window.html || html;

export default (base = HTMLElement) =>
class RenderMixin extends base {

  constructor() {
    super();
    this.set = [];
    this.renderer = this.renderer.bind(this);
    this.render = this.renderer;
  }

  beforeRender({values, strings, keys}) {
    const dict = values[values.length - 1] || {};
    const changes = {};
    let template = null;
    if (!this.rendered) template = strings[0];

    if (values[0] !== undefined) {
      keys.forEach((key, i) => {
        const string = strings[i + 1];
        let value = Number.isInteger(key) ? values[key] : dict[key];
        if (value === undefined && Array.isArray(key)) {
          value = key.join('');
        } else if (value === undefined && !Array.isArray(key) && this.set[i]) {
          value = this.set[i].value; // set previous value, doesn't require developer to pass all properties
        } else if (value === undefined && !Array.isArray(key) && !this.set[i]) {
          value = '';
        }
        if (!this.rendered) {
          template = template.replace(/(>)[^>]*$/g,  ` render-mixin-id="${key}">`)
          template += `${value}${string}`;
        }
        if (this.set[key] && this.set[key] !== value) {
          changes[key] = value;
          this.set[key] = value;
        } else if (!this.set[key]) {
          this.set[key] = value;
          changes[key] = value
        }
      });
    } else {
      template += strings[0];
    }
    return {
      template,
      changes
    };
  }

  renderer(properties = this.properties, template = this.template) {
    if (!properties) properties = {};
    else if (!this.isFlat(properties)) {
      // check if we are dealing with an flat or indexed object
      // create flat object getting the values from super if there is one
      // default to given properties set properties[key].value
      // this implementation is meant to work with 'property-mixin'
      // checkout https://github.com/vandeurenglenn/backed/src/mixin/property-mixin
      // while I did not test, I believe it should be compatible with PolymerElements
      const object = {};
      // try getting value from this.property
      // try getting value from properties.property.value
      // try getting value from property.property
      // fallback to property
      for (const key of Object.keys(properties)) {
        let value;
        if (this[key] !== undefined) value = this[key];
        else if (properties[key] && properties[key].value !== undefined) {
          value = properties[key].value;
        } else {
          value = '';
        }
        object[key] = value
      };
      properties = object;
    }
    render(this, this.beforeRender(template(properties)));
  }

  /**
   * wether or not properties is just an object or indexed object (like {prop: {value: 'value'}})
   */
  isFlat(object) {
    const firstObject = object[Object.keys(object)[0]];
    if (firstObject)
      if (firstObject.hasOwnProperty('value') ||
          firstObject.hasOwnProperty('reflect') ||
          firstObject.hasOwnProperty('observer') ||
          firstObject.hasOwnProperty('render'))
        return false;
    else return true;
  }

  connectedCallback() {
    if (super.connectedCallback) super.connectedCallback();

    if (this.render) {
      this.render();
      this.rendered = true;
    };
  }
}
