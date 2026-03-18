import { useState, useEffect } from 'react'
import axios from 'axios'


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
  const [persons, setPersons] = useState([])

  useEffect(() => {
    const fetchPersons = async() => {
      console.log("Fetch persons from json server");
      try {
        const response = await axios.get('http://localhost:3001/persons');
        setPersons(response.data);
      } catch (err) {
        console.error(err);
      }
    }
    
    fetchPersons();
  }, [])

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