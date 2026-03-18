import { useState } from 'react'

const Filter = ({searchName, onChange}) => {
  return(
    <div>
      Search for specific names: <input value={searchName} onChange={onChange} />
    </div>
  )
}

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

const PersonList = ({persons}) => {
  return(
    <>
      {persons.map((person) => <Person key={person.name} person={person} />)}
    </>
  )
}

const Person = ({person}) => {
  return(
    <>
      {person.name} {person.number} <br />
    </>
  )
}

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456', id: 1 },
    { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
    { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
    { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 }
  ])
  const blankPerson = {
    name: '',
    number: '',
  }
  const [newPerson, setNewPerson] = useState(blankPerson);
  const [searchName, setSearchName] = useState('');

  const nameExists = () => {
    return persons.some((person) => person.name === newPerson.name)
  }

  const addPerson = (event) => {
    event.preventDefault();

    if (nameExists()) {
      window.alert(`${newPerson.name} is already added to phonebook`);
      return;
    }

    setPersons(persons.concat(newPerson));
    setNewPerson(blankPerson);
  }

  const handleSearchChange = (event) => {
    setSearchName(event.target.value);
  }

  const handleNameChange = (event) => {
    setNewPerson({ ...newPerson, name: event.target.value});
  }

  const handleNumberChange = (event) => {
    setNewPerson({ ...newPerson, number: event.target.value});
  }


  return (
    <div>
      <h2>Phonebook</h2>
      <Filter searchName={searchName} onChange={handleSearchChange} />
      <h3>Add new person</h3>
      <PersonForm onSubmit={addPerson} newPerson={newPerson} onNameChange={handleNameChange} onNumberChange={handleNumberChange}/>
      <h3>Numbers</h3>
      <PersonList persons={persons.filter((person) => person.name.toLowerCase().includes(searchName.toLowerCase()))} />
    </div>
  )
}

export default App