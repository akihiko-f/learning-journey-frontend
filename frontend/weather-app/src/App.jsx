import { useState } from 'react'
import './App.css'

function App() {
  const [city, setCity] = useState('')
  const [weather, setWeather] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const API_KEY = 'YOUR_API_KEY_HERE' // OpenWeatherMap APIキー

  const handleSearch = async (e) => {
    e.preventDefault()

    if (!city.trim()) {
      setError('都市名を入力してください')
      return
    }

    setLoading(true)
    setError('')
    setWeather(null)

    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric&lang=ja`
      )

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('都市が見つかりませんでした')
        }
        throw new Error('天気情報の取得に失敗しました')
      }

      const data = await response.json()
      setWeather(data)
      setCity('')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="app">
      <h1>天気予報アプリ</h1>

      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="都市名を入力（例: Tokyo）"
          className="search-input"
        />
        <button type="submit" className="search-button" disabled={loading}>
          {loading ? '検索中...' : '検索'}
        </button>
      </form>

      {error && (
        <div className="error-message">
          ⚠️ {error}
        </div>
      )}

      {loading && (
        <div className="loading">
          <div className="spinner"></div>
          <p>天気情報を取得中...</p>
        </div>
      )}

      {weather && !loading && (
        <div className="weather-card">
          <h2>{weather.name}</h2>
          <div className="weather-main">
            <img
              src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
              alt={weather.weather[0].description}
              className="weather-icon"
            />
            <div className="temperature">
              {Math.round(weather.main.temp)}°C
            </div>
          </div>
          <div className="weather-description">
            {weather.weather[0].description}
          </div>
          <div className="weather-details">
            <div className="detail-item">
              <span className="detail-label">体感温度</span>
              <span className="detail-value">{Math.round(weather.main.feels_like)}°C</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">湿度</span>
              <span className="detail-value">{weather.main.humidity}%</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">風速</span>
              <span className="detail-value">{weather.wind.speed} m/s</span>
            </div>
          </div>
        </div>
      )}

      <div className="instructions">
        <p>💡 使い方：</p>
        <ul>
          <li>都市名を英語で入力してください（例: Tokyo, Osaka, London）</li>
          <li>OpenWeatherMap APIキーが必要です</li>
          <li>APIキーは <a href="https://openweathermap.org/api" target="_blank" rel="noopener noreferrer">こちら</a> から無料で取得できます</li>
        </ul>
      </div>
    </div>
  )
}

export default App
