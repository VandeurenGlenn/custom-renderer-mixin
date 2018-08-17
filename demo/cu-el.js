import RenderMixin from '../src/render-mixin.js';

customElements.define('cu-el', class CuEl extends RenderMixin(HTMLElement) {
  static get properties() {
    return  {
      variable: {
       value: 'hello',
     },
     world: {
       value: 'world'
     }
    }
  }
  /**
   * set to get static properties (needed for property- & other mixins)
   */
  get properties() {
    return customElements.get(this.localName).properties;
  }

  constructor() {
    super();
  }

  connectedCallback() {
    super.connectedCallback()
    // this.render(this.properties)
    setTimeout(() => {
      this.render({variable: 'hello hello hello', world: 'woooooooooooooorld'})
    }, 5000);
  }

  get data() {
    return [{text: '0'}, {text: '1'}, {text: '2'}, {text: '3'}, {text: '4'}]
  }

  get template() {
    return html`
    <p>${'variable'}</p>
    <p>${'world'}</p>
    ${this.data.map(i => `<p>${i.text}</p>`)}
    `;
  }
})
