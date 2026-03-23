const PersonForm = ({newPerson, onNameChange, onNumberChange, onSubmit}) => {
  return (
    <form onSubmit={onSubmit}>
        <div>
          name: <input value={newPerson.name} onChange={onNameChange}/> <br />
          number: <input value={newPerson.number} onChange={onNumberChange}/>
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
  )
}

export default PersonForm;