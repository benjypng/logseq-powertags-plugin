import { SettingSchemaDesc } from '@logseq/libs/dist/LSPlugin.user'

const settings: SettingSchemaDesc[] = [
  {
    key: 'addTypeProperty',
    type: 'boolean',
    default: false,
    title: 'Add Type Property',
    description: 'Add type property when using power tag.',
  },
  {
    key: 'autoParse',
    type: 'boolean',
    default: false,
    title: 'Auto Parse',
    description:
      'If set to true, plugin will autoparse whatever is between braces e.g. {}, in order of the properties that have been set.',
  },
  {
    key: 'parseBlock',
    type: 'boolean',
    default: false,
    title: 'Parse Block (Experimental)',
    description:
      'If set to true, plugin will parse the block based on what are in the properties.',
  },
]

export default settings
