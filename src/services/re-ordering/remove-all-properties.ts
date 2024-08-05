export const removeAllProperties = async (uuid: string, propKeys: string[]) => {
  await Promise.all(
    propKeys.map((propKey) => logseq.Editor.removeBlockProperty(uuid, propKey)),
  )
}
