import { useCallback } from 'react'
import { useForm } from 'react-hook-form'

import {
  PropertiesProps,
  TagProperties,
  TagPropertiesProps,
} from './TagProperties'

interface FormData {
  [key: string]: {
    newProp: string
    defaultValue: string
  }
}

export const TagManagement = ({
  index,
  setLocalTags,
  properties,
  tags,
}: TagPropertiesProps) => {
  const { register, handleSubmit, reset } = useForm()

  const deletePowertag = useCallback(
    async (index: string) => {
      const currSavedTags = logseq.settings!.savedTags
      delete currSavedTags[index]

      logseq.updateSettings({
        savedTags: 'Need to add some arbitrary string first',
      })
      logseq.updateSettings({ savedTags: currSavedTags })

      const blocksWithPowertag = await logseq.DB.q(`[[${index}]]`)
      if (!blocksWithPowertag || blocksWithPowertag.length == 0) return
      blocksWithPowertag.forEach(async (block) => {
        const props = await logseq.Editor.getBlockProperties(block.uuid)
        const propKeyArr = Object.keys(props)
        if (!propKeyArr || propKeyArr.length == 0) return
        propKeyArr.forEach(
          async (propKey) =>
            await logseq.Editor.removeBlockProperty(block.uuid, propKey),
        )
        await logseq.UI.showMsg(
          `PowerTag ${index} deleted. Properties removed from ${block.uuid}`,
          'success',
        )

        logseq.hideMainUI()
      })
    },
    [tags],
  )

  const addNewProp = useCallback(
    async (data: FormData) => {
      const index = Object.keys(data)[0]
      if (!index || !data[index]) return
      const tag = data[index]

      const currSavedTags = logseq.settings!.savedTags
      const properties = currSavedTags[index]
      const hasProp = properties.some(
        (property: PropertiesProps) => property.name == tag.newProp,
      )
      if (hasProp) {
        await logseq.UI.showMsg(`${tag.newProp} already exists`, 'error')
        return
      }
      currSavedTags[index].push({
        name: tag.newProp,
        value: tag.defaultValue,
      })

      logseq.updateSettings({
        savedTags: 'Need to add some arbitrary string first',
      })
      logseq.updateSettings({ savedTags: currSavedTags })
      reset()

      const blocksWithPowertag = await logseq.DB.q(`[[${index}]]`)
      if (!blocksWithPowertag || blocksWithPowertag.length == 0) return

      blocksWithPowertag.forEach(async (block) => {
        await logseq.Editor.upsertBlockProperty(
          block.uuid,
          tag.newProp,
          tag.defaultValue,
        )
        await logseq.UI.showMsg(
          `New property added to ${index}. ${block.uuid} updated with new property`,
          'success',
        )
      })

      logseq.hideMainUI()
    },
    [tags],
  )

  return (
    <div key={index} className="tag-management">
      <div className="tag-management-header">
        <h3>{index}</h3>
        <button onClick={() => deletePowertag(index)}>Delete PowerTag</button>
      </div>
      <TagProperties
        setLocalTags={setLocalTags}
        index={index}
        properties={properties}
        tags={tags}
      />
      <form onSubmit={handleSubmit(addNewProp)}>
        <input
          {...register(`${index}.newProp`, { required: true })}
          placeholder="Add new property"
        />
        <input
          {...register(`${index}.defaultValue`)}
          placeholder="Default value"
        />
        <button type="submit">Add New Property</button>
      </form>
    </div>
  )
}
