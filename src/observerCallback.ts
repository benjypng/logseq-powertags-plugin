import { handlePowerTag } from './services/handle-power-tag'

export const observerCallback = async (mutationsList: any[]) => {
  for (const mutation of mutationsList) {
    if (
      mutation.type === 'childList' &&
      mutation.removedNodes.length > 0 &&
      mutation.removedNodes[0].className === 'editor-inner block-editor'
    ) {
      const uuid = mutation.target
        .closest('div[id^="ls-block"]')
        ?.getAttribute('blockid')

      await handlePowerTag(uuid)
    }
  }
}
