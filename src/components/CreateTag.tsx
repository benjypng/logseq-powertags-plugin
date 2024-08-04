import { useFieldArray, useForm } from 'react-hook-form'

interface PowerTag {
  tagName: string
  properties: {
    name: string
    value: string
  }[]
}

export const CreateTag = () => {
  const { register, control, handleSubmit } = useForm({})

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'properties',
    rules: {
      minLength: 1,
    },
  })

  const onSubmit = (data: PowerTag) => {
    console.log('Submitted data:', data)
  }

  return (
    <div className="powertags-section">
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
          <button type="button" onClick={() => append({})}>
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
              {...register(`properties.${index}.value`, { required: true })}
              placeholder="Default value"
            />
            <button type="button" onClick={() => remove(index)}>
              -
            </button>
          </div>
        ))}
        <button type="submit">Create Tag</button>
      </form>
    </div>
  )
}
