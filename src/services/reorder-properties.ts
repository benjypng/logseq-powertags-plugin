interface GenericProperty {
  [key: string]: any
}

export const reorderProperties = (
  properties: { [key: string]: any },
  order: string[],
) => {
  const newProperties: GenericProperty = {}
  order.forEach((key) => {
    if (Object.prototype.hasOwnProperty.call(properties, key)) {
      newProperties[key] = properties[key]
    }
  })
  return newProperties
}
