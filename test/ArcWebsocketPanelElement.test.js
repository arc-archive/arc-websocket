import { fixture, assert, html } from '@open-wc/testing';
import { loadMonaco } from './MonacoSetup.js';
import '../arc-websocket-panel.js';

/** @typedef {import('../index').ArcWebsocketPanelElement} ArcWebsocketPanelElement */

describe('ArcWebsocketPanelElement', () => {
  /**
   * @returns {Promise<ArcWebsocketPanelElement>}
   */
  async function basicFixture() {
    return fixture(html`<arc-websocket-panel></arc-websocket-panel>`);
  }

  before(async () => loadMonaco());

  describe('constructor()', () => {
    let element = /** @type ArcWebsocketPanelElement */ (null);
    beforeEach(async () => { element = await basicFixture(); });

    it('has the default editorRequest', () => {
      assert.typeOf(element.editorRequest, 'object');
    });

    it('has the default loading property', () => {
      assert.isFalse(element.loading);
    });

    it('has the default compatibility property', () => {
      assert.isFalse(element.compatibility);
    });

    it('has the default outlined property', () => {
      assert.isFalse(element.outlined);
    });

    it('has the default exportOptionsOpened property', () => {
      assert.isFalse(element.exportOptionsOpened);
    });
  });
});
