import './index.css'
import '@mantine/core/styles.css'

import {
  CloseButton,
  Flex,
  Group,
  MantineProvider,
  Space,
  Title,
} from '@mantine/core'
import { useEffect, useState } from 'react'

import { THEME } from '../constants'
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
    <MantineProvider theme={THEME}>
      <Flex bg="none" justify="right" p="md">
        <Flex
          p="md"
          mt="xl"
          bg="#eee"
          w="40rem"
          direction="column"
          id="powertags-container"
        >
          <Group justify="space-between" mb="md">
            <Title fz="lg">PowerTags Menu</Title>
            <CloseButton size="md" onClick={closeModal} />
          </Group>
          <CreateTag />
          <Space h="1rem" />
          <ManageTags tags={tags} />
        </Flex>
      </Flex>
    </MantineProvider>
  )
}

export default PowerTags
