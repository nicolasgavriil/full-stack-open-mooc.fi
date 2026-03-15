const Header = ({course}) => {
  return (
    <h1>{course}</h1>
  )
}

const Part = ({partData}) => {
  return (
    <p>
      {partData.name} {partData.exercises}
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
  const total = exerciseData.reduce((sum, part) => sum + part.exercises, 0)
  return(
    <p>Number of exercises {total}</p>
  )
}

const App = () => {
  const course = 'Half Stack application development'
  const part1 = {
    name: 'Fundamentals of React',
    exercises: 10
  }
  const part2 = {
    name: 'Using props to pass data',
    exercises: 7
  }
  const part3 = {
    name: 'State of a component',
    exercises: 14
  }

  const exerciseData = [
    part1,
    part2,
    part3,
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
