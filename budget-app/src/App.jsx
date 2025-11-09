import { useState } from "react"
import './App.css'

function App(){
  const [type, setType] = useState('expense')
  const [category, setCategory] = useState('食費')
  const [amount, setAmount] = useState('')
  const [description, setDescription] = useState('')
  const [date, setDate] = useState('')

  const [transactions, setTransactions] = useState([])

  const expenseCategories = ['食費', '交通費', '娯楽', '光熱費', '通信費', 'その他']
  const incomeCategories = ['給与', '副業', 'お小遣い', 'その他']

  return (
    <div className="app">
      <h1>家計簿アプリ</h1>

      <div className="form">
        <h2>取引を追加</h2>
        <div className="form-group">
          <label>種類</label>
          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="expense">支出</option>
            <option value="income">収入</option>
          </select>
        </div>

        <div className="form-group">
          <label>カテゴリ</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {(type === 'expense' ? expenseCategories : incomeCategories).map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>金額</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0"
          />
        </div>

        <div className="form-group">
          <label>説明</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>日付</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        <button className="add-button">追加</button>
      </div>
      <div className="transactions">
        <h2>取引履歴</h2>
        <p>取引がありません</p>
      </div>
    </div>
  )
}

export default App