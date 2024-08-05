import { useCallback } from 'react'
import { useForm } from 'react-hook-form'

import { updateBlocks } from '../services/core/update-blocks'
import { updateSettings } from '../services/core/update-settings'
import { handleDynamicVariables } from '../services/handle-dynamic-variables'
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
      updateSettings((currSavedTags) => {
        const { [index]: _, ...rest } = currSavedTags
        return rest
      })
      await updateBlocks(index, async (block) => {
        const props = await logseq.Editor.getBlockProperties(block.uuid)
        await Promise.all(
          Object.keys(props).map((propKey) =>
            logseq.Editor.removeBlockProperty(block.uuid, propKey),
          ),
        )
        await logseq.UI.showMsg(
          `PowerTag ${index} deleted. Properties removed from ${block.uuid}`,
          'success',
        )
      })
    },
    [tags],
  )

  const addNewProp = useCallback(
    async (data: FormData) => {
      const index = Object.keys(data)[0]
      if (!index || !data[index]) return
      const tag = data[index]

      updateSettings((currSavedTags) => {
        const properties = currSavedTags[index]
        if (!properties) return
        if (
          properties.some(
            (property: PropertiesProps) => property.name === tag.newProp,
          )
        ) {
          logseq.UI.showMsg(`${tag.newProp} already exists`, 'error')
          return currSavedTags
        }
        return {
          ...currSavedTags,
          [index]: [
            ...properties,
            { name: tag.newProp, value: tag.defaultValue },
          ],
        }
      })

      reset()

      await updateBlocks(index, async (block) => {
        const propValue = await handleDynamicVariables(tag.defaultValue)
        await logseq.Editor.upsertBlockProperty(
          block.uuid,
          tag.newProp,
          propValue,
        )
        await logseq.UI.showMsg(
          `New property added to ${index}. ${block.uuid} updated with new property`,
          'success',
        )
      })
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
