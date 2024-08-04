import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from 'react'

import { TagProperties } from '../../components/TagProperties'
import { Tag } from '..'

export const ManageTags = ({
  tags,
  setTags,
}: {
  tags: Tag
  setTags: Dispatch<SetStateAction<Tag>>
}) => {
  console.log(tags)
  const [localTags, setLocalTags] = useState<Tag>({})

  useEffect(() => {
    setLocalTags(tags)
  }, [tags])

  const deletePowertag = useCallback(
    (index: string) => {
      console.log(index)
      const currSavedTags = logseq.settings!.savedTags
      delete currSavedTags[index]
      logseq.updateSettings({
        savedTags: 'Need to add some arbitrary string first',
      })
      logseq.updateSettings({ savedTags: currSavedTags })
      logseq.hideMainUI()
    },
    [tags],
  )

  if (!localTags) return <h2>Loading...</h2>

  return (
    <div className="powertags-section">
      <h2>Manage</h2>
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
