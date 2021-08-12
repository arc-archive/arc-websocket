import { html } from 'lit-html';
import { DemoPage } from '@advanced-rest-client/arc-demo-helper';
import '@advanced-rest-client/arc-demo-helper/arc-interactive-demo.js';
import '@anypoint-web-components/anypoint-button/anypoint-button.js';
import '@anypoint-web-components/anypoint-checkbox/anypoint-checkbox.js';
import '@advanced-rest-client/arc-models/websocket-url-history-model.js';
import { ExportHandlerMixin } from '@advanced-rest-client/arc-demo-helper/src/ExportHandlerMixin.js';
import encodingHelper from '@advanced-rest-client/arc-demo-helper/src/EncodingHelpers.js';
import { ArcMock } from '@advanced-rest-client/arc-data-generator';
import { ImportEvents, ArcModelEvents } from '@advanced-rest-client/arc-events';
import { MonacoLoader } from '@advanced-rest-client/monaco-support';
import { BodyProcessor } from '@advanced-rest-client/body-editor';
import { v4 } from '@advanced-rest-client/uuid-generator';
import '../arc-websocket-editor.js';

/** @typedef {import('@advanced-rest-client/arc-types').WebSocket.WebsocketEditorRequest} WebsocketEditorRequest */
/** @typedef {import('@advanced-rest-client/arc-events').ArcExportFilesystemEvent} ArcExportFilesystemEvent */
/** @typedef {import('@advanced-rest-client/arc-events').GoogleDriveSaveEvent} GoogleDriveSaveEvent */


const REQUEST_STORE_KEY = 'demo.arc-websocket-ui.editorRequest';

class ComponentDemo extends ExportHandlerMixin(DemoPage) {
  constructor() {
    super();
    this.initObservableProperties([
      'editorRequest', 'withMenu', 'initialized',
    ]);
    this.componentName = 'ARC websocket editor';
    this.compatibility = false;
    this.withMenu = false;
    this.initialized = false;
    
    /** 
     * @type {WebsocketEditorRequest}
     */
    this.editorRequest = {
      id: v4(),
      request: {
        kind: 'ARC#WebsocketRequest',
      },
    };
    this.generator = new ArcMock();
    
    this.generateData = this.generateData.bind(this);
    this.deleteData = this.deleteData.bind(this);
    
    this.initEditors();
    this.restoreRequest();

    this.renderViewControls = true;

    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      this.darkThemeActive = true;
    }

    encodingHelper();
    this._requestChangeHandler = this._requestChangeHandler.bind(this);
  }

  async initEditors() {
    await this.loadMonaco();
    this.initialized = true;
  }

  async generateData() {
    await this.generator.store.insertWebsockets();
    ImportEvents.dataImported(document.body);
  }

  async deleteData() {
    await this.generator.store.destroyWebsockets();
    ArcModelEvents.destroyed(document.body, 'all');
  }

  async loadMonaco() {
    const base = `../node_modules/monaco-editor/`;
    MonacoLoader.createEnvironment(base);
    await MonacoLoader.loadMonaco(base);
    await MonacoLoader.monacoReady();
  }

  restoreRequest() {
    const valueRaw = localStorage.getItem(REQUEST_STORE_KEY);
    if (!valueRaw) {
      return;
    }
    let data;
    try {
      data = JSON.parse(valueRaw);
    } catch (e) {
      return;
    }
    if (data.request) {
      data.request = BodyProcessor.restoreRequest(data.request);
    }
    console.log('restored', data);
    this.editorRequest = data;
  }

  _requestChangeHandler() {
    const editor = document.querySelector('arc-websocket-editor');
    const object = editor.serialize();
    console.log('storing request data', object);
    this.storeValue(object);    
  }

  /**
   * Stores request value data in the local store
   * @param {WebsocketEditorRequest} data
   */
  async storeValue(data) {
    if (!data) {
      window.localStorage.removeItem(REQUEST_STORE_KEY);
      return;
    }
    const safeRequest = await BodyProcessor.stringifyRequest(data.request);
    localStorage.setItem(REQUEST_STORE_KEY, JSON.stringify({
      ...data,
      request: safeRequest,
    }));
  }

  _demoTemplate() {
    if (!this.initialized) {
      return html`<progress></progress>`;
    }
    const {
      demoStates,
      darkThemeActive,
      compatibility,
      editorRequest,
    } = this;
    const { request } = editorRequest;
    const { url, payload, ui } = request;

    return html`
      <section class="documentation-section">
        <h3>Interactive demo</h3>
        <p>
          This demo lets you preview the web socket request editor element with various configuration options.
        </p>

        <arc-interactive-demo
          .states="${demoStates}"
          @state-changed="${this._demoStateHandler}"
          ?dark="${darkThemeActive}"
        >
          <div class="demo-app" slot="content">
            <arc-websocket-editor
              .url="${url}"
              .payload="${payload}"
              .uiConfig="${ui}"
              ?compatibility="${compatibility}"
              @change="${this._requestChangeHandler}"
            ></arc-websocket-editor>
          </div>

          <label slot="options" id="mainOptionsLabel">Options</label>
          <anypoint-checkbox
            aria-describedby="mainOptionsLabel"
            slot="options"
            name="withMenu"
            @change="${this._toggleMainOption}"
            title="Uses request objects instead of request ids"
          >
            Render menu
          </anypoint-checkbox>
        </arc-interactive-demo>
      </section>
    `;
  }

  _dataControlsTemplate() {
    return html`
    <section class="documentation-section">
      <h3>Data control</h3>
      <p>
        This section allows you to control demo data
      </p>
      <anypoint-button @click="${this.generateData}">Generate data</anypoint-button>
      <anypoint-button @click="${this.deleteData}">Clear list</anypoint-button>
    </section>`;
  }

  contentTemplate() {
    return html`
      <websocket-url-history-model></websocket-url-history-model>
      ${this._demoTemplate()}
      ${this._dataControlsTemplate()}
      ${this.exportTemplate()}
    `;
  }
}

const instance = new ComponentDemo();
instance.render();
