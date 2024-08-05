type DynamicVariable =
  | 'today'
  | 'yesterday'
  | 'tomorrow'
  | 'time'
  | 'current page'

const DYNAMIC_VARIABLES = [
  'today',
  'yesterday',
  'tomorrow',
  'time',
  'current page',
]

export const handleDynamicVariables = async (
  propValue: string,
): Promise<string> => {
  if (!DYNAMIC_VARIABLES.includes(propValue)) return propValue

  const dVar = propValue as DynamicVariable
  const { preferredDateFormat } = await logseq.App.getUserConfigs()

  switch (dVar) {
    case 'today':
      return
  }
}
