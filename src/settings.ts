import { SettingSchemaDesc } from '@logseq/libs/dist/LSPlugin.user'

const settings: SettingSchemaDesc[] = [
  {
    key: 'autoParse',
    type: 'boolean',
    default: true,
    title: 'Auto Parse',
    description: `If set to true, blocks containing a #powertag will automatically have its properties added.`,
  },
]

export default settings
