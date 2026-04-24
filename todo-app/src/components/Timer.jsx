function Timer({
    settingTime,
    elapsedTime,
    pushStart,
    pushStop,
    resetTimer
}) {
    // TODO: elapsedTimeを「MM:SS」形式で表示する関数を作る（例: 05:30）
    // 例: const formatTime = (seconds) => { ... }

    // TODO: elapsedTime === 0 の時に「時間切れ！」と表示する判定を作る

    return (
            <div className="timer-container">
                <h2 className="timer-title">タイマー</h2>

                {/* TODO: ここに時間設定の入力欄（分・秒）を追加 */}

                <div className="timer-display">{elapsedTime}</div>

                {/* TODO: elapsedTimeをMM:SS形式に変換して表示 */}

                <button className="timer-button start-button" onClick={pushStart}>開始</button>
                <button className="timer-button stop-button" onClick={pushStop}>停止</button>
                <button className="timer-button reset-button" onClick={resetTimer}>リセット</button>

                {/* TODO: 時間切れメッセージを表示 */}
            </div>
    )
}

export default Timer