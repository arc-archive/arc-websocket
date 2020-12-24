import { ArcWebsocketEditorElement } from './src/ArcWebsocketEditorElement'

declare global {
  interface HTMLElementTagNameMap {
    "arc-websocket-editor": ArcWebsocketEditorElement;
  }
}
