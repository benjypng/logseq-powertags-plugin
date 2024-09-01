import { Flex, Space, Text, Title } from '@mantine/core'
import { useEffect, useState } from 'react'

import { TagManagement } from '../../components/TagManagement'
import { Tag } from '..'

export const ManageTags = ({ tags }: { tags: Tag }) => {
  const [localTags, setLocalTags] = useState<Tag>({})

  useEffect(() => {
    setLocalTags(tags)
  }, [tags])

  if (!localTags) return <h2>Error in plugin settings...</h2>

  return (
    <Flex direction="column" bg="white" p="md">
      <Title fz="lg">Manage</Title>
      <Text fz="sm">
        Deleting a PowerTag or property will affect all blocks that reference
        this PowerTag, even if they were not created with this plugin.
      </Text>
      <Space h="1rem" />
      <Flex gap="md" direction="column">
        {Object.entries(localTags).map(([index, properties]) => (
          <TagManagement
            key={index}
            index={index}
            setLocalTags={setLocalTags}
            properties={properties}
            tags={tags}
          />
        ))}
      </Flex>
    </Flex>
  )
}
