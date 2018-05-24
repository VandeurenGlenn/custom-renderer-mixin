import RenderMixin from '../src/render-mixin.js';

customElements.define('cu-el', class CuEl extends RenderMixin(HTMLElement) {
  get properties() {
    return this._properties || {
      variable: 'hello'
    }
  }

  set properties(value) {
    this._properties = value
  }
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback()
    setTimeout(() => {
      this.render({variable: 'hello hello hello'})
    }, 5000);
  }

  get data() {
    return [{text: '0'}, {text: '1'}, {text: '2'}, {text: '3'}, {text: '4'}]
  }

  get template() {
    return html`
    <p>${'variable'}</p>
    ${this.data.map(d => `<p>${d.text}</p>`)}
    `;
  }
})
