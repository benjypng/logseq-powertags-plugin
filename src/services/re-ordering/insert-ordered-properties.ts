import { GenericProperty } from './reorder-properties'

export const insertOrderedProps = async (
  uuid: string,
  properties: GenericProperty,
) => {
  await Promise.all(
    Object.entries(properties).map(([key, value]) =>
      logseq.Editor.upsertBlockProperty(uuid, key, value),
    ),
  )
}
