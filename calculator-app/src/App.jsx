import { useState } from "react"
import './App.css'

function App() {
  const [display, setDisplay] = useState('0')
  const [firstValue, setFirstValue] = useState(null)
  const [operator, setOperator] = useState(null)
  const [shouldResetDisplay, setShouldResetDisplay] = useState(false)

  const buttons = [7, 8 , 9, '/', 4, 5, 6, '*', 1, 2, 3, '-', 0, 'C', '=', '+']

  const handleNumberClick = (number) => {
    if (shouldResetDisplay) {
      setDisplay(String(number))
      setShouldResetDisplay(false)
    } else {
      setDisplay(display === '0' ? String(number) : display + number)
    }
  }

  const handleOperatorClick = (op) => {
    const currentValue = parseFloat(display)

    if (firstValue === null) {
      setFirstValue(currentValue)
    } else if (operator) {
      const result = calculate(firstValue, currentValue, operator)
      setDisplay(String(result))
      setFirstValue(result)
    }

    setOperator(op)
    setShouldResetDisplay(true)
  }

  const handleEqualsClick = () => {
    if (firstValue !== null && operator) {
      const currentValue = parseFloat(display)
      const result = calculate(firstValue, currentValue,operator)
      setDisplay(String(result))
      setFirstValue(null)
      setOperator(null)
      setShouldResetDisplay(true)
    }
  }

  const calculate = (a, b, op) => {
    switch (op) {
      case '+':
        return a + b
      case '-':
        return a - b
      case '*':
        return a * b
      case '/':
        return b !==0 ? a / b : 0
      default:
        return b
    }
  }

  const handleButtonClick = (btn) => {
    if (typeof btn === 'number'){
      handleNumberClick(btn)
    } else if (btn === '=') {
      handleEqualsClick()
    } else if (['+', '-', '*', '/'].includes(btn)) {
      handleOperatorClick(btn)
    } else if (btn === 'C') {
      setDisplay('0')
      setFirstValue(null)
      setOperator(null)
      setShouldResetDisplay(false)
    }
  }

  return (
    <div className="calculator">
      <h1>簡易計算機</h1>

      <div className="display">{display}</div>

      <div className="buttons">
        {buttons.map((btn, index) => (
            <button
              key={index}
              onClick={() => handleButtonClick(btn)}
            >
              {btn}
            </button>
          ))}
      </div>
    </div>
  )
}

export default App