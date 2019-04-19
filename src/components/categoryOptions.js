import categories from './Categories'

const categoryOptions = categories.map(
  ({ id, title }) => {
    var newTitle = title.replace(" not elsewhere classified", "")
    return {
      key: id,
      text: newTitle,
      value: id,
    }
  }
)

export default categoryOptions
