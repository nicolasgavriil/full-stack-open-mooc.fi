const Header = ({course}) => {
  return (
    <h1>{course}</h1>
  )
}

const Part = ({partData}) => {
  return (
    <p>
      {partData.name} {partData.amount}
    </p>
  )
}

const Content = ({exerciseData}) => {
  return(
    <>
      <Part partData={exerciseData[0]} />
      <Part partData={exerciseData[1]} />
      <Part partData={exerciseData[2]} />
    </>
  )
}

const Total = ({exerciseData}) => {
  const total = exerciseData.reduce((sum, part) => sum + part.amount, 0)
  return(
    <p>Number of exercises {total}</p>
  )
}

const App = () => {
  const course = 'Half Stack application development'
  const part1 = 'Fundamentals of React'
  const exercises1 = 10
  const part2 = 'Using props to pass data'
  const exercises2 = 7
  const part3 = 'State of a component'
  const exercises3 = 14

  const exerciseData = [
    { name: part1, amount: exercises1 },
    { name: part2, amount: exercises2 },
    { name: part3, amount: exercises3 },
  ]

  return (
    <div>
      <Header course={course} />
      <Content exerciseData={exerciseData} />
      <Total exerciseData={exerciseData} />
    </div>
  )
}

export default App
