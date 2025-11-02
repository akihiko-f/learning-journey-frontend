import { useState } from "react"

function App() {
  const [display, setDisplay] = useState('0')
  const [firstValue, setFirstValue] = useState(null)
  const [operator, setOperator] = useState(null)
  const [shouldResetDisplay, setShouldResetDisplay] = useState(false)

  return (
    <div className="calculator">
      <h1>簡易計算機</h1>

      <div className="display">{display}</div>

      <div className="buttons">
        <button>7</button>
        <button>8</button>
        <button>9</button>
        <button>/</button>

        <button>4</button>
        <button>5</button>
        <button>6</button>
        <button>*</button>

        <button>1</button>
        <button>2</button>
        <button>3</button>
        <button>-</button>

        <button>0</button>
        <button>C</button>
        <button>=</button>
        <button>+</button>
      </div>
    </div>
  )
}

export default App