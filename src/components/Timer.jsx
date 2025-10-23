function Timer({
    settingTime,
    elapsedTime,
    pushStart,
    pushStop,
    resetTimer
}) {
    return (
            <div className="timer-container">
                <h2 className="timer-title">タイマー</h2>
                <div className="timer-display">{elapsedTime}</div>
                <button className="timer-button start-button" onClick={pushStart}>開始</button>
                <button className="timer-button stop-button" onClick={pushStop}>停止</button>
                <button className="timer-button reset-button" onClick={resetTimer}>リセット</button>
            </div>
    )
}

export default Timer