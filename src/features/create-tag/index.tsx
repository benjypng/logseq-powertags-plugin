import {
  ActionIcon,
  Button,
  Flex,
  Group,
  Input,
  Space,
  Title,
} from '@mantine/core'
import { Controller, useFieldArray, useForm } from 'react-hook-form'

interface PowerTag {
  tagName: string
  properties: {
    name: string
    value: string
  }[]
}

export const CreateTag = () => {
  const { register, control, handleSubmit, watch, reset } = useForm<PowerTag>({
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

  const onSubmit = async (data: PowerTag) => {
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
  }

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
                  leftSection={'#'}
                  w="22rem"
                />
              )}
            />
            <Button
              type="button"
              onClick={() => append({ name: '', value: '' })}
            >
              Add Property
            </Button>
          </Group>

          {fields.map((field, index) => (
            <Flex key={field.id}>
              <input
                {...register(`properties.${index}.name`, {
                  required: true,
                })}
                placeholder="Property"
              />
              <input
                {...register(`properties.${index}.value`)}
                placeholder="Default value"
              />
              {watch('properties').length > 1 && (
                <ActionIcon type="button" onClick={() => remove(index)}>
                  -
                </ActionIcon>
              )}
            </Flex>
          ))}
          <Button type="submit">Create Tag</Button>
        </form>
      </Flex>
    </Flex>
  )
}
