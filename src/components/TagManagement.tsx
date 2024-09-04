import { Button, Group, Input, Paper, Space, Title } from '@mantine/core'
import { useCallback } from 'react'
import { Controller, useForm } from 'react-hook-form'

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
  const { control, handleSubmit, reset } = useForm<FormData>()

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
    <Paper shadow="sm" radius="md" px="lg" pb="lg" withBorder>
      <Group justify="space-between" mt="md" mb="xs">
        <Title fz="md">#{index}</Title>
        <Button color="red" onClick={() => deletePowertag(index)}>
          Delete PowerTag
        </Button>
      </Group>
      <Space h="1rem" />
      <TagProperties
        setLocalTags={setLocalTags}
        index={index}
        properties={properties}
        tags={tags}
      />
      <Space h="1rem" />
      <form onSubmit={handleSubmit(addNewProp)}>
        <Group justify="space-between" gap="0.5rem">
          <Controller
            name={`${index}.newProp`}
            control={control}
            rules={{ required: 'Required' }}
            render={({ field }) => (
              <Input {...field} placeholder="New property" w="10rem" />
            )}
          />
          <Controller
            name={`${index}.defaultValue`}
            control={control}
            rules={{ required: 'Required' }}
            render={({ field }) => (
              <Input {...field} placeholder="Default value" />
            )}
          />
          <Button type="submit" size="sm" variant="outline" w="10rem">
            Add New Property
          </Button>
        </Group>
      </form>
    </Paper>
  )
}
