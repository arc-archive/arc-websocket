import { fixture, assert, html } from '@open-wc/testing';
import { loadMonaco } from './MonacoSetup.js';
import '../arc-websocket-editor.js';

/** @typedef {import('../index').ArcWebsocketEditorElement} ArcWebsocketEditorElement */

describe('ArcWebsocketEditorElement', () => {
  /**
   * @returns {Promise<ArcWebsocketEditorElement>}
   */
  async function basicFixture() {
    return fixture(html`<arc-websocket-editor></arc-websocket-editor>`);
  }

  before(async () => loadMonaco());

  describe('constructor()', () => {
    let element = /** @type ArcWebsocketEditorElement */ (null);
    beforeEach(async () => { element = await basicFixture(); });

    it('sets the default selectedTab property', () => {
      assert.equal(element.selectedTab, 0);
    });

    it('sets the default connected property', () => {
      assert.isFalse(element.connected);
    });

    it('sets the default readOnly property', () => {
      assert.isFalse(element.readOnly);
    });

    it('sets the default compatibility property', () => {
      assert.isFalse(element.compatibility);
    });

    it('sets the default outlined property', () => {
      assert.isFalse(element.outlined);
    });

    it('sets the default mimeType property', () => {
      assert.equal(element.mimeType, '');
    });

    it('sets the default mimeType property', () => {
      assert.equal(element.url, '');
    });

    it('sets the requestId property', () => {
      assert.typeOf(element.requestId, 'string');
    });
  });
});
