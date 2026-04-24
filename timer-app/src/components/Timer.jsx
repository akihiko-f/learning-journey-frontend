function Timer({
    minutes,
    seconds,
    setMinutes,
    setSeconds,
    elapsedTime,
    isRunning,
    pushStart,
    pushStop,
    resetTimer
}) {
    const formatTime = (totalSeconds) => {
        const mins = Math.floor(totalSeconds / 60)
        const secs = totalSeconds % 60
        return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
    }

    return (
            <div className="timer-container">
                <h2 className="timer-title">タイマー</h2>

                <div className="timer-input">
                    <div className="input-group">
                        <label>分</label>
                        <input
                            type="number"
                            min="0"
                            max="59"
                            value={minutes}
                            onChange={(e) => setMinutes(Number(e.target.value))}
                            disabled={isRunning}
                        />
                    </div>
                    <div className="input-group">
                        <label>秒</label>
                        <input
                            type="number"
                            min="0"
                            max="59"
                            value={seconds}
                            onChange={(e) => setSeconds(Number(e.target.value))}
                            disabled={isRunning}
                        />
                    </div>
                </div>

                <div className="timer-display">{formatTime(elapsedTime)}</div>
                {elapsedTime === 0 && !isRunning && (
                    <div className="timeout-message">時間切れ！</div>
                )}

                <button className="timer-button start-button" onClick={pushStart}>開始</button>
                <button className="timer-button stop-button" onClick={pushStop}>停止</button>
                <button className="timer-button reset-button" onClick={resetTimer}>リセット</button>

            </div>
    )
}

export default Timer
