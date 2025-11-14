import { useEffect, useState } from "react"
import './App.css'

function App(){
  const [type, setType] = useState('expense')
  const [category, setCategory] = useState('食費')
  const [amount, setAmount] = useState('')
  const [description, setDescription] = useState('')
  const [date, setDate] = useState('')

  const [transactions, setTransactions] = useState(() => {
    try {
      const savedTransactions = localStorage.getItem('transactions')
      return savedTransactions ? JSON.parse(savedTransactions) : []
    } catch (error) {
      console.error('LocalStorageからのデータ読み込みに失敗しました:', error)
      return []
    }
  })

  const [selectedMonth, setSelectedMonth] = useState('')

  const expenseCategories = ['食費', '交通費', '娯楽', '光熱費', '通信費', 'その他']
  const incomeCategories = ['給与', '副業', 'お小遣い', 'その他']

  useEffect(() => {
    localStorage.setItem('transactions', JSON.stringify(transactions))
  }, [transactions])

  const handleAddTransaction = () => {
    if (!amount || !date){
      alert('金額と日付を入力してください')
      return
    }

    if (Number(amount) <= 0) {
      alert('金額は0より大きい値を入力してください')
      return
    }

    const newTransaction = {
      id: Date.now(),
      type: type,
      category: category,
      amount: Number(amount),
      description: description,
      date: date
    }

    setTransactions([newTransaction, ...transactions])

    setAmount('')
    setDescription('')
    setDate('')
  }

  const handleDeleteTransaction = (id) => {
    setTransactions(transactions.filter(t => t.id !== id))
  }

  const filteredTransactions = selectedMonth
    ? transactions.filter(t => t.date.startsWith(selectedMonth))
    : transactions

  const totalIncome = filteredTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0)

  const totalExpense = filteredTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0)

  const balance = totalIncome - totalExpense

  const expenseByCategoryData = expenseCategories.map(cat => {
    const total = filteredTransactions
      .filter(t => t.type === 'expense' && t.category === cat)
      .reduce((sum, t) => sum + t.amount, 0)
    return { category: cat, amount: total }
  })

  const maxExpense = Math.max(...expenseByCategoryData.map(d => d.amount), 1)

  return (
    <div className="app">
      <h1>家計簿アプリ</h1>

      <div className="month-selector">
        <label>表示する月:</label>
        <input
          type="month"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
        />
        {selectedMonth && (
          <button onClick={() => setSelectedMonth('')}>
            全期間を表示
          </button>
        )}
      </div>

      <div className="summary">
        <div className="summary-item income">
          <div className="summary-label">収入</div>
          <div className="summary-amount">+{totalIncome.toLocaleString()}円</div>
        </div>
        <div className="summary-item expense">
          <div className="summary-label">支出</div>
          <div className="summary-amount">-{totalExpense.toLocaleString()}円</div>
        </div>
        <div className="summary-item balance">
          <div className="summary-label">残高</div>
          <div className="summary-amount">{balance.toLocaleString()}円</div>
        </div>
      </div>

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

        <button
          className="add-button"
          onClick={handleAddTransaction}
        >
          追加
        </button>
      </div>
      <div className="charts">
        <h2>カテゴリ別支出</h2>
        <div className="category-chart">
          {expenseByCategoryData.map(item => (
            <div key={item.category} className="chart-row">
              <div className="chart-label">{item.category}</div>
              <div className="chart-bar-container">
                <div
                  className="chart-bar"
                  style={{ width: `${(item.amount / maxExpense) * 100}%` }}
                >
                  <span className="chart-amount">
                    {item.amount > 0 ? `${item.amount.toLocaleString()}円` : ''}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <h2>収入・支出比較</h2>
        <div className="comparison-chart">
          <div className="bar-group">
            <div className="bar income-bar" style={{ height: `${totalIncome > 0 ? (totalIncome /              
            Math.max(totalIncome, totalExpense)) * 200 : 0}px` }}>
              <span className="bar-label">収入</span>
              <span className="bar-amount">{totalIncome.toLocaleString()}円</span>
            </div>
          </div>
          <div className="bar-group">
            <div className="bar expense-bar" style={{ height: `$`}}
          </div>
        </div>
      </div>
      <div className="transactions">
        <h2>取引履歴</h2>
        {transactions.length === 0 ? (
          <p>取引がありません</p>
        ) : (
          filteredTransactions.map(transaction => (
            <div
              key={transactions.id}
              className={`transaction-item ${transaction.type}`}
            >
              <div className="transaction-info">
                <div className="transaction-date">{transaction.date}</div>
                <div className="transaction-category">{transaction.category}</div>
                <div className="transaction-description">{transaction.description}</div>
              </div>
              <div className="transaction-amount">
                {transaction.type === 'income' ? '+' : '-'}
                {transaction.amount.toLocaleString()}円
              </div>
              <button
                className="delete-button"
                onClick={() => handleDeleteTransaction(transaction.id)}
              >
                削除
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default App