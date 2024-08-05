import './index.css'

import { IconX } from '@tabler/icons-react'
import { useEffect, useState } from 'react'

import { CreateTag } from './create-tag'
import { ManageTags } from './manage-tags'

export interface Tag {
  [key: string]: { name: string; value: string }[]
}

const PowerTags = () => {
  const [tags, setTags] = useState<Tag>({})

  useEffect(() => {
    setTags(logseq.settings!.savedTags)
  })

  const closeModal = () => {
    logseq.hideMainUI()
  }

  return (
    <div id="powertags-container">
      <div id="powertags-header">
        <h1>PowerTags Menu</h1>
        <button type="button" onClick={closeModal}>
          <IconX stroke={2} />
        </button>
      </div>
      <CreateTag />
      <ManageTags tags={tags} />
    </div>
  )
}

export default PowerTags
