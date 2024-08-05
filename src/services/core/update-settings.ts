import { PropertiesProps } from '../../components/TagProperties'

export const updateSettings = (
  updateFn: (currSettings: { [key: string]: PropertiesProps[] }) => void,
) => {
  const currSavedTags = logseq.settings!.savedTags
  const updatedSettings = updateFn(currSavedTags)

  logseq.updateSettings({
    savedTags: 'Need to add some arbitrary string first',
  })
  logseq.updateSettings({ savedTags: updatedSettings })
}
