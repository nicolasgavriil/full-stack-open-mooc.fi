import { useState, useEffect } from 'react'
import PersonList from './components/PersonList.jsx'
import PersonForm from './components/PersonForm.jsx'
import Filter from './components/Filter.jsx'
import Notification from './components/Notification.jsx'
import personService from './services/persons.js'

const App = () => {
  const [persons, setPersons] = useState([])

  useEffect(() => {
    const fetchPersons = async() => {
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
  const [notification, setNotification] = useState({});

  useEffect(() => {
    if (!notification) {
      return;
    }
    setTimeout(() => {
        setNotification(null);
      }, 5000)
  }, [notification])

  const addPerson = (event) => {
    event.preventDefault();
    const message = `${newPerson.name} is already added to phonebook, replace the old number with new one?`;

    const existingPerson = persons.find((p) => p.name === newPerson.name);

    if (existingPerson && window.confirm(message)) {
      const updatedPerson = {...existingPerson, number: newPerson.number};
      replaceNumber(updatedPerson);
      return;
    }

    const createPerson = async () => {
      try {
        const response = await personService.create(newPerson);
        const createdPerson = response.data;
        setPersons(persons.concat(createdPerson));
        setNewPerson(blankPerson);
        setNotification({message: `Successfully added ${createdPerson.name}`, type: "success"});
      } catch (err) {
        console.error(err);
      }
    }
    
    createPerson(); 
  }

  const replaceNumber = async (updatedPerson) => {
    try {
      const response = await personService.update(updatedPerson);
      setPersons(persons.map((p) => p.id !== updatedPerson.id ? p : response.data));
      setNotification({message: `Successfully updated ${updatedPerson.name}`, type: "success"});
    } catch (err) {
      console.error(err);
      setNotification({message: `Error: ${updatedPerson.name} is not on the phonebook anymore`, type: "error"})
    }
    
  }

  const deletePerson = async (personToDelete) => {
    
    if (!window.confirm(`Delete ${personToDelete.name} ?`)) {
      return;
    }
    try {
      const response = await personService.remove(personToDelete.id);
      if (response.status !== 204) {
        throw new Error("Deletion failed");
      }
      setPersons(persons.filter((p) => p.id !== personToDelete.id));
      setNotification({message: `Successfully deleted ${personToDelete.name}`, type: "success"});
    } catch (err) {
      console.error(err);
      setNotification({message: `Error: ${personToDelete.name} is not on the phonebook anymore`, type: "error"})
    }
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
      <Notification notification={notification} />
      <Filter searchName={searchName} onChange={handleSearchChange} />
      <h3>Add new person</h3>
      <PersonForm onSubmit={addPerson} newPerson={newPerson} onNameChange={handleNameChange} onNumberChange={handleNumberChange}/>
      <h3>Numbers</h3>
      <PersonList persons={persons.filter((p) => p.name.toLowerCase().includes(searchName.toLowerCase()))} onClick={deletePerson} />
    </div>
  )
}

export default App