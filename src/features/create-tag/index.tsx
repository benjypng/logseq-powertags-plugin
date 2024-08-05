import { useFieldArray, useForm } from 'react-hook-form'

interface PowerTag {
  tagName: string
  properties: {
    name: string
    value: string
  }[]
}

export const CreateTag = () => {
  const { register, control, handleSubmit, watch, reset } = useForm<PowerTag>({
    defaultValues: {
      tagName: '',
      properties: [{ name: '', value: '' }],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'properties',
    rules: {
      minLength: 1,
    },
  })

  const onSubmit = async (data: PowerTag) => {
    // Check if tag already exists
    const currSavedTags = logseq.settings!.savedTags
    if (currSavedTags[data.tagName]) {
      await logseq.UI.showMsg(`#${data.tagName} already exists`, 'error')
      return
    }

    logseq.updateSettings({
      savedTags: {
        [data.tagName]: data.properties,
      },
    })
    reset()
    logseq.hideMainUI()
    await logseq.UI.showMsg('PowerTag saved!', 'success')
  }

  return (
    <div id="section-create-powertag">
      <h2>Create</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="tag-input">
          <div className="hashtag-input-wrapper">
            <div className="hashtag">#</div>
            <input
              {...register('tagName', { required: true })}
              placeholder="Tag Input"
            />
          </div>
          <button type="button" onClick={() => append({ name: '', value: '' })}>
            Add Property
          </button>
        </div>
        {fields.map((field, index) => (
          <div key={field.id} className="property-input">
            <input
              {...register(`properties.${index}.name`, {
                required: true,
              })}
              placeholder="Property"
            />
            <input
              {...register(`properties.${index}.value`)}
              placeholder="Default value"
            />
            {watch('properties').length > 1 && (
              <button type="button" onClick={() => remove(index)}>
                -
              </button>
            )}
          </div>
        ))}
        <button type="submit">Create Tag</button>
      </form>
    </div>
  )
}
