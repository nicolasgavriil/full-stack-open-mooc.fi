const PersonList = ({persons, onClick}) => {
  return(
    <>
      {persons.map((person) => <Person key={person.id} person={person} onClick={onClick} />)}
    </>
  )
}

const Person = ({person, onClick}) => {
  return(
    <div>
      {person.name} {person.number} <button type="button" onClick={() => onClick(person)}>delete</button>
    </div>
  )
}

export default PersonList;