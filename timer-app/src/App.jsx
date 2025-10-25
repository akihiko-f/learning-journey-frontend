import { useState, useEffect } from "react"
import './App.css'
import Timer from './components/Timer'

function App() {
  // タイマーアプリのState管理
  const [time, settingTime] = useState(0)
  const [elapsedTime, setElapsedTime] = useState(0)
  const [isRunning, setIsRunning] = useState(false)

  const pushStart = () => {
    setIsRunning(true)
  }

  const pushStop = () => {
    setIsRunning(false)
  }

  const resetTimer = () => {
    setIsRunning(false)
    setElapsedTime(0)
  }

  useEffect(() => {
    let timerId
    if (isRunning) {
      timerId = setInterval(() => {
        setElapsedTime((prevTime) => {
          if (prevTime > 1) {
            return prevTime - 1
          } else {
            setIsRunning(false)
            return 0
          }
        })
      } , 1000)
    }
    return () => {
      clearInterval(timerId)
    }
  }, [isRunning])

  // TODO: 時間設定の入力欄（分・秒）を追加する
  // TODO: elapsedTimeをMM:SS形式で表示する関数を作る
  // TODO: 時間切れメッセージを表示する

  return (
    <div className="timer-app">
      <h1>カウントダウンタイマー</h1>

      <Timer
        settingTime={settingTime}
        elapsedTime={elapsedTime}
        pushStart={pushStart}
        pushStop={pushStop}
        resetTimer={resetTimer}
      />
    </div>
  )
}

export default App
