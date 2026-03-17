import { useState } from 'react'

const Header = ({text}) => {
  return (
    <h1>{text}</h1>
  )
}

const Statistics = ({stats}) => {

  if (stats.total === 0) {
    return (
      <p>
        No feedback given
      </p>
    )
  }
  return (
    <div>
      <StatisticLine text="good" value={stats.good} />
      <StatisticLine text="neutral" value={stats.neutral} />
      <StatisticLine text="bad" value={stats.bad} />
      <StatisticLine text="all" value={stats.total} />
      <StatisticLine text="average" value={stats.average} />
      <StatisticLine text="positive" value={stats.positivePercent} symbol="%" />
    </div>
  )
}

const StatisticLine = ({text, value, symbol}) => {
  return (
    <>
      {text} {value} {symbol} <br />
    </>
  )
}

const Button = ({text, onClick}) => {
  return (
    <button onClick={onClick}>{text}</button>
  )
}

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const points = good - bad;
  const total = good + neutral + bad;
  const average = points / total;
  const positivePercent = (good / total) * 100;

  const stats = {good, neutral, bad, total, average, positivePercent}

  function handleClickGood() {
    setGood(good + 1);  
  } 

  function handleClickNeutral() {
    setNeutral(neutral + 1);
  } 

  function handleClickBad() {
    setBad(bad + 1);
  } 

  return (
    <div>
      <Header text="give feedback" />
      <Button text="good" onClick={handleClickGood} />
      <Button text="neutral" onClick={handleClickNeutral} />
      <Button text="bad" onClick={handleClickBad} />
      <Header text="statistics" />
      <Statistics stats={stats} />
    </div>
  )
}

export default App
