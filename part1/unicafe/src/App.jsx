import { useState } from 'react'

// Button component
const Button = ({ handleClick, text }) => {
  return <button onClick={handleClick}>{text}</button>
}

// Single statistic line
const Statistic = ({ text, value }) => {
  return (
    <tr>
      <td>{text}</td>
      <td>{value}</td>
    </tr>
  )
}

// Statistics component
const Statistics = ({ good, neutral, bad }) => {
  const total = good + neutral + bad

  // Show message if no feedback yet
  if (total === 0) {
    return <p>No feedback given</p>
  }

  const average = (good * 1 + neutral * 0 + bad * -1) / total
  const positivePercentage = ((good / total) * 100).toFixed(1) + ' %'

  return (
    <table>
      <tbody>
        <Statistic text="Good" value={good} />
        <Statistic text="Neutral" value={neutral} />
        <Statistic text="Bad" value={bad} />
        <Statistic text="All" value={total} />
        <Statistic text="Average" value={average.toFixed(2)} />
        <Statistic text="Positive" value={positivePercentage} />
      </tbody>
    </table>
  )
}

// Main App component
const App = () => {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  return (
    <div>
      <h1>Give feedback</h1>

      <Button handleClick={() => setGood(good + 1)} text="Good" />
      <Button handleClick={() => setNeutral(neutral + 1)} text="Neutral" />
      <Button handleClick={() => setBad(bad + 1)} text="Bad" />

      <h2>Statistics</h2>
      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  )
}

export default App
