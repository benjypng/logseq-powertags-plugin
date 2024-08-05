import '@logseq/libs'

import { createRoot } from 'react-dom/client'

import PowerTags from './features'
import { handlePopup } from './handle-popup'
import { observerCallback } from './observerCallback'
import { handlePowerTag } from './services/handle-power-tag'
import settings from './settings'

const main = () => {
  console.log('logseq-powertags-plugin loaded')
  handlePopup()

  const el = document.getElementById('app')
  if (!el) return
  const root = createRoot(el)

  logseq.provideModel({
    async managePowerTags() {
      root.render(<PowerTags />)
      logseq.showMainUI()
    },
  })
  logseq.App.registerUIItem('toolbar', {
    key: 'logseq-powertags-plugin',
    template: `<a data-on-click="managePowerTags" class="button"><i class="ti ti-hash"></i></a>`,
  })

  if (logseq.settings!.autoParse) {
    //@ts-expect-error need to access Logseq parent
    const observer = new parent.MutationObserver(observerCallback)
    observer.observe(parent.document.getElementById('app-container'), {
      attributes: false,
      childList: true,
      subtree: true,
    })
  }

  logseq.Editor.registerSlashCommand('Parse PowerTag', async (e) => {
    await handlePowerTag(e.uuid)
  })
}

logseq.useSettingsSchema(settings).ready(main).catch(console.error)
