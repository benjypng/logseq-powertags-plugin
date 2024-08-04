import '@logseq/libs'

import { createRoot } from 'react-dom/client'

import PowerTags from './components/PowerTags'
import { handlePopup } from './handle-popup'
import settings from './services/callSettings'
import observerCallback from './services/observerCallback'

const main = () => {
  console.log('logseq-powertags-plugin loaded')
  handlePopup()

  const el = document.getElementById('app')
  if (!el) return
  const root = createRoot(el)
  root.render(<PowerTags />)

  // MANAGE TAGS
  logseq.provideModel({
    async managePowerTags() {
      logseq.showMainUI()
    },
  })

  logseq.App.registerUIItem('toolbar', {
    key: 'logseq-powertags-plugin',
    template: `<a data-on-click="managePowerTags" class="button"><i class="ti ti-tag"></i></a>`,
  })

  //@ts-expect-error need to access Logseq parent
  const observer = new parent.MutationObserver(observerCallback)

  observer.observe(parent.document.getElementById('app-container'), {
    attributes: false,
    childList: true,
    subtree: true,
  })
}

logseq.useSettingsSchema(settings).ready(main).catch(console.error)
