import { useState, useEffect } from 'react'
import PersonList from './components/PersonList.jsx'
import PersonForm from './components/PersonForm.jsx'
import Filter from './components/Filter.jsx'
import personService from './services/persons.js'

const App = () => {
  const [persons, setPersons] = useState([])

  useEffect(() => {
    const fetchPersons = async() => {
      console.log("Fetch persons from json server");
      try {
        const response = await personService.getAll();
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

    const savePerson = async () => {
      try {
        const response = await personService.create(newPerson);
        setPersons(persons.concat(response.data));
        setNewPerson(blankPerson);
      } catch (err) {
        console.error(err);
      }
    }
    
    savePerson(); 
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