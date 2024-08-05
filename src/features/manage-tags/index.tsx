import { useCallback, useEffect, useState } from 'react'

import { TagProperties } from '../../components/TagProperties'
import { Tag } from '..'

export const ManageTags = ({ tags }: { tags: Tag }) => {
  const [localTags, setLocalTags] = useState<Tag>({})

  useEffect(() => {
    setLocalTags(tags)
  }, [tags])

  const deletePowertag = useCallback(
    async (index: string) => {
      const currSavedTags = logseq.settings!.savedTags
      delete currSavedTags[index]

      logseq.updateSettings({
        savedTags: 'Need to add some arbitrary string first',
      })
      logseq.updateSettings({ savedTags: currSavedTags })

      logseq.hideMainUI()
      await logseq.UI.showMsg(`PowerTag: ${index} deleted`, 'success')

      const blocksWithPowertag = await logseq.DB.q(`[[${index}]]`)
      if (!blocksWithPowertag || blocksWithPowertag.length == 0) return
      for (const block of blocksWithPowertag) {
        const props = await logseq.Editor.getBlockProperties(block.uuid)
        const propKeyArr = Object.keys(props)
        if (!propKeyArr || propKeyArr.length == 0) continue

        propKeyArr.forEach(
          async (propKey) =>
            await logseq.Editor.removeBlockProperty(block.uuid, propKey),
        )
      }
    },
    [tags],
  )

  if (!localTags) return <h2>Loading...</h2>

  return (
    <div className="powertags-section">
      <h2>Manage</h2>
      <p>
        Deleting a PowerTag or property will affect all blocks that reference
        this PowerTag, even if they were not created with this plugin.
      </p>
      {Object.entries(localTags).map(([index, properties]) => (
        <div key={index} className="tag-management">
          <div className="tag-management-header">
            <h3>{index}</h3>
            <button onClick={() => deletePowertag(index)}>
              Delete PowerTag
            </button>
          </div>
          <TagProperties
            setLocalTags={setLocalTags}
            index={index}
            properties={properties}
            tags={tags}
          />
        </div>
      ))}
    </div>
  )
}
