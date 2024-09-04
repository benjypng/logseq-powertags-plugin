import {
  ActionIcon,
  Button,
  Flex,
  Group,
  Input,
  Space,
  Title,
} from '@mantine/core'
import { useCallback } from 'react'
import { Controller, useFieldArray, useForm } from 'react-hook-form'

interface PowerTag {
  tagName: string
  properties: {
    name: string
    value: string
  }[]
}

export const CreateTag = () => {
  const { control, handleSubmit, watch, reset } = useForm<PowerTag>({
    defaultValues: {
      tagName: '',
      properties: [{ name: '', value: '' }],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'properties',
    rules: {
      minLength: 1,
    },
  })

  const onSubmit = useCallback(async (data: PowerTag) => {
    // Check if tag already exists
    const currSavedTags = logseq.settings!.savedTags
    if (currSavedTags[data.tagName]) {
      await logseq.UI.showMsg(`#${data.tagName} already exists`, 'error')
      return
    }

    logseq.updateSettings({
      savedTags: {
        [data.tagName.toLowerCase()]: data.properties,
      },
    })
    reset()
    logseq.hideMainUI()
    await logseq.UI.showMsg('PowerTag saved!', 'success')
  }, [])

  return (
    <Flex direction="column" bg="white" p="md">
      <Title fz="lg">Create</Title>
      <Space h="1rem" />
      <Flex direction="column" gap="md">
        <form onSubmit={handleSubmit(onSubmit)}>
          <Group justify="space-between">
            <Controller
              control={control}
              name="tagName"
              rules={{ required: 'Tag required' }}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="Enter tag"
                  leftSection="#"
                  w="22rem"
                />
              )}
            />
          </Group>

          <Space h="0.5rem" />

          {fields.map((field, index) => (
            <Group key={field.id} mb="xs" gap="0.2rem">
              <Controller
                control={control}
                name={`properties.${index}.name`}
                rules={{ required: 'Property required' }}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="Enter property"
                    rightSection="::"
                  />
                )}
              />
              <Controller
                control={control}
                name={`properties.${index}.value`}
                render={({ field }) => (
                  <Input {...field} placeholder="Enter value" />
                )}
              />
              <ActionIcon
                type="button"
                size="lg"
                onClick={() => append({ name: '', value: '' })}
              >
                +
              </ActionIcon>
              {watch('properties').length > 1 && (
                <ActionIcon
                  type="button"
                  size="lg"
                  onClick={() => remove(index)}
                >
                  -
                </ActionIcon>
              )}
            </Group>
          ))}

          <Space h="1rem" />

          <Button type="submit">Create Tag</Button>
        </form>
      </Flex>
    </Flex>
  )
}
