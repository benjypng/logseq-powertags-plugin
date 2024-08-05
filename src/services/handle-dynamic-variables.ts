import { format, startOfTomorrow, startOfYesterday } from 'date-fns'
import { getDateForPage } from 'logseq-dateutils'

type DynamicVariable =
  | 'today'
  | 'yesterday'
  | 'tomorrow'
  | 'time'
  | 'current page'

const getPreferredDateFormat = async (): Promise<string> => {
  return (await logseq.App.getUserConfigs()).preferredDateFormat
}

const dynamicVariableHandlers: Record<DynamicVariable, () => Promise<string>> =
  {
    today: async () =>
      getDateForPage(new Date(), await getPreferredDateFormat()),
    yesterday: async () =>
      getDateForPage(startOfYesterday(), await getPreferredDateFormat()),
    tomorrow: async () =>
      getDateForPage(startOfTomorrow(), await getPreferredDateFormat()),
    time: async () => format(new Date(), 'HH:mm'),
    'current page': async () => {
      const currBlock = await logseq.Editor.getCurrentBlock()
      if (!currBlock) return ''
      const currPage = await logseq.Editor.getPage(currBlock.page.id)
      if (!currPage) return ''
      return `[[${currPage.name}]]`
    },
  }

export const handleDynamicVariables = async (
  propValue: string,
): Promise<string> => {
  const match = propValue.match(/<%\s*(.*?)\s*%>/)
  if (!match || !match[1]) return propValue

  const dVar = match[1] as DynamicVariable
  const handler = dynamicVariableHandlers[dVar]
  return handler ? await handler() : propValue
}
