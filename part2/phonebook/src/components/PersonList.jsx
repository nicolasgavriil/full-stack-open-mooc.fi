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

export default PersonList;