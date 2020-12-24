/**
 * @param {Event} e
 */
export function cancelEvent(e) {
  e.preventDefault();
  e.stopImmediatePropagation();
  e.stopPropagation();
}
