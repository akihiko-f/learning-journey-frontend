import { useState, useMemo, useCallback, memo } from "react";

function expensiveCalculation(num) {
    console.log('重い計算を実行中...')
    let result = 0
    for (let i = 0; i < 100000000; i++) {
        result += num
    }
    return result
}

// メモ化されていないボタン（比較用）
function RegularButton({ onClick, children }) {
    console.log(`RegularButton "${children}" rendered`)
    return (
        <button onClick={onClick} style={{ padding: '0.5rem 1rem', margin: '0.5rem', background: '#ff6b6b', color: 'white', border: 'none', borderRadius: '4px' }}>
            {children}
        </button>
    )
}

// React.memoでメモ化されたボタン
const MemoizedButton = memo(function Button({ onClick, children }) {
    console.log(`MemoizedButton "${children}" rendered`)
    return (
        <button onClick={onClick} style={{ padding: '0.5rem 1rem', margin: '0.5rem', background: '#51cf66', color: 'white', border: 'none', borderRadius: '4px' }}>
            {children}
        </button>
    )
})

function PerformanceDemo() {
    const [count, setCount] = useState(0)
    const [input, setInput] = useState(5)

    const calculation = useMemo(() => {
        return expensiveCalculation(input)
    }, [input])

    const handleIncrement = useCallback(() => {
        setCount(prev => prev + 1)
    }, [])

    const handleReset = useCallback(() => {
        setCount(0)
    }, [])

    return (
        <div className="page">
            <h1>パフォーマンス最適化デモ</h1>

            <section style={{ marginBottom: '3rem', padding: '1.5rem', border: '2px solid #667eea', borderRadius: '10px' }}>
                <h2>1. useMemo - 計算結果のメモ化</h2>
                <div style={{ marginBottom: '2rem' }}>
                    <h3>カウンター（関係ない操作）</h3>
                    <button onClick={() => setCount(prev => prev + 1)} style={{ padding: '0.5rem 1rem' }}>
                        カウント: {count}
                    </button>
                    <p style={{ color: '#666' }}>
                        ボタンをクリックしても、下の重い計算は実行されません
                    </p>
                </div>

                <div>
                    <h3>重い計算（useMemoで最適化）</h3>
                    <label>
                        数数を入力：
                        <input
                            type="number"
                            value={input}
                            onChange={(e) => setInput(Number(e.target.value))}
                            style={{ marginLeft: '1rem', padding: '0.5rem' }}
                        />
                    </label>
                    <p>計算結果：{calculation}</p>
                    <p style={{ color: '#999', fontSize: '0.9rem' }}>
                        ※ コンソールを開いて「重い計算を実行中...」のログを確認してください
                    </p>
                </div>
            </section>

            <section style={{ marginBottom: '3rem', padding: '1.5rem', border: '2px solid #764ba2', borderRadius: '10px' }}>
                <h2>2. useCallback - 関数のメモ化</h2>
                <p style={{ marginBottom: '1rem'}}>カウント: {count}</p>
                <div>
                    <button onClick={handleIncrement} style={{ padding: '0.5rem 1rem' }}>インクリメント</button>
                    <button onClick={handleReset} style={{ padding: '0.5rem 1rem', marginLeft: '0.5rem' }}>リセット</button>
                </div>

                <p style={{ color: '#999', fontSize: '0.9rem', marginTop: '1rem' }}>
                    ※ useCallbackで関数をメモ化することで、関数の参照が保持されます
                </p>
            </section>

            <section style={{ marginBottom: '3rem', padding: '1.5rem', border: '2px solid #f59f00', borderRadius: '10px' }}>
                <h2>3. React.memo - コンポーネントのメモ化</h2>
                <p style={{ marginBottom: '1rem'}}>カウント: {count}</p>

                <div style={{ marginBottom: '1.5rem' }}>
                    <h3 style={{ fontSize: '1.1rem', color: '#ff6b6b' }}>❌ メモ化なし（RegularButton）</h3>
                    <RegularButton onClick={handleIncrement}>インクリメント</RegularButton>
                    <RegularButton onClick={handleReset}>リセット</RegularButton>
                    <p style={{ color: '#666', fontSize: '0.9rem', marginTop: '0.5rem' }}>
                        カウントが変わるたびに再レンダリングされます
                    </p>
                </div>

                <div>
                    <h3 style={{ fontSize: '1.1rem', color: '#51cf66' }}>✅ React.memoあり（MemoizedButton）</h3>
                    <MemoizedButton onClick={handleIncrement}>インクリメント</MemoizedButton>
                    <MemoizedButton onClick={handleReset}>リセット</MemoizedButton>
                    <p style={{ color: '#666', fontSize: '0.9rem', marginTop: '0.5rem' }}>
                        propsが変わらないため再レンダリングされません
                    </p>
                </div>

                <p style={{ color: '#999', fontSize: '0.9rem', marginTop: '1.5rem' }}>
                    ※ コンソールを開いて、レンダリングログを確認してください。<br/>
                    インクリメントボタンを押すと、RegularButtonは毎回レンダリングされますが、<br/>
                    MemoizedButtonは初回のみレンダリングされます（useCallbackと組み合わせているため）
                </p>
            </section>
            <div style={{ padding: '1.5rem', background: '#f0f0f0', borderRadius: '10px' }}>
                <h3>最適化のまとめ</h3>
                <ul style={{ lineHeight: '1.8' }}>
                    <li><strong>useMemo</strong>: 計算結果をキャッシュ（値のメモ化）</li>
                    <li><strong>useCallback</strong>: 関数をキャッシュ（関数のメモ化）</li>
                    <li><strong>React.memo</strong>: コンポーネントをメモ化（propsが同じなら再レンダリングをスキップ）</li>
                    <li>💡 <strong>組み合わせが重要</strong>: useCallback + React.memoで最大の効果</li>
                    <li>⚠️ 依存配列に必要な値を全て含める</li>
                    <li>⚠️ 最初から最適化せず、遅いと感じてから使う（早すぎる最適化は悪）</li>
                </ul>
            </div>
        </div>
    )
}

export default PerformanceDemo