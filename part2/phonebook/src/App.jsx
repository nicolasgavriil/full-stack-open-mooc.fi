import { useState } from 'react'

const PersonList = ({filteredPersons}) => {
  console.log(filteredPersons);
  
  return(
    <>
      {filteredPersons.map((person) => <Person key={person.name} person={person} />)}
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
      Search for specific names: <input value={searchName} onChange={handleSearchChange} />
      <h2>Add new person</h2>
      <form onSubmit={addPerson}>
        <div>
          name: <input value={newPerson.name} onChange={handleNameChange}/> <br />
          number: <input value={newPerson.number} onChange={handleNumberChange}/>
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      <PersonList filteredPersons={persons.filter((person) => person.name.toLowerCase().includes(searchName.toLowerCase()))} />
    </div>
  )
}

export default App