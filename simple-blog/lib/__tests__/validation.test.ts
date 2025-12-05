import { validateEmail, validatePassword, validatePostTitle } from '../validation'

describe('validateEmail', () => {
  describe('正常系', () => {
    it('有効なメールアドレスを受け入れる', () => {
      const result = validateEmail('user@example.com')
      expect(result.valid).toBe(true)
      expect(result.error).toBeUndefined()
    })

    it('サブドメインを含むメールアドレスを受け入れる', () => {
      const result = validateEmail('user@mail.example.com')
      expect(result.valid).toBe(true)
    })

    it('数字を含むメールアドレスを受け入れる', () => {
      const result = validateEmail('user123@example.com')
      expect(result.valid).toBe(true)
    })

    it('ハイフンとアンダースコアを含むメールアドレスを受け入れる', () => {
      const result = validateEmail('user_name-test@example.com')
      expect(result.valid).toBe(true)
    })
  })

  describe('異常系 - TC-002: 不正な形式', () => {
    it('@がないメールアドレスを拒否する', () => {
      const result = validateEmail('invalid-email')
      expect(result.valid).toBe(false)
      expect(result.error).toBe('有効なメールアドレスを入力してください')
    })

    it('ドメインがないメールアドレスを拒否する', () => {
      const result = validateEmail('user@')
      expect(result.valid).toBe(false)
      expect(result.error).toBe('有効なメールアドレスを入力してください')
    })

    it('ローカル部がないメールアドレスを拒否する', () => {
      const result = validateEmail('@example.com')
      expect(result.valid).toBe(false)
      expect(result.error).toBe('有効なメールアドレスを入力してください')
    })

    it('空文字列を拒否する', () => {
      const result = validateEmail('')
      expect(result.valid).toBe(false)
      expect(result.error).toBe('有効なメールアドレスを入力してください')
    })

    it('スペースを含むメールアドレスを拒否する', () => {
      const result = validateEmail('user name@example.com')
      expect(result.valid).toBe(false)
      expect(result.error).toBe('有効なメールアドレスを入力してください')
    })

    it('複数の@を含むメールアドレスを拒否する', () => {
      const result = validateEmail('user@@example.com')
      expect(result.valid).toBe(false)
      expect(result.error).toBe('有効なメールアドレスを入力してください')
    })

    it('TLDがないメールアドレスを拒否する', () => {
      const result = validateEmail('user@example')
      expect(result.valid).toBe(false)
      expect(result.error).toBe('有効なメールアドレスを入力してください')
    })
  })
})

describe('validatePassword', () => {
  describe('正常系', () => {
    it('8文字以上のパスワードを受け入れる', () => {
      const result = validatePassword('Password123')
      expect(result.valid).toBe(true)
      expect(result.error).toBeUndefined()
    })

    it('128文字のパスワードを受け入れる', () => {
      const result = validatePassword('a'.repeat(128))
      expect(result.valid).toBe(true)
    })
  })

  describe('境界値 - TC-007: 8文字ちょうど', () => {
    it('8文字のパスワードを受け入れる', () => {
      const result = validatePassword('Pass123!')
      expect(result.valid).toBe(true)
      expect(result.error).toBeUndefined()
    })
  })

  describe('異常系 - TC-003: 8文字未満', () => {
    it('7文字のパスワードを拒否する', () => {
      const result = validatePassword('Pass12')
      expect(result.valid).toBe(false)
      expect(result.error).toBe('パスワードは8文字以上で入力してください')
    })

    it('5文字のパスワードを拒否する', () => {
      const result = validatePassword('Pass1')
      expect(result.valid).toBe(false)
      expect(result.error).toBe('パスワードは8文字以上で入力してください')
    })

    it('空文字列を拒否する', () => {
      const result = validatePassword('')
      expect(result.valid).toBe(false)
      expect(result.error).toBe('パスワードは8文字以上で入力してください')
    })

    it('1文字のパスワードを拒否する', () => {
      const result = validatePassword('a')
      expect(result.valid).toBe(false)
      expect(result.error).toBe('パスワードは8文字以上で入力してください')
    })
  })

  describe('境界値 - 7文字（境界値-1）', () => {
    it('7文字のパスワードを拒否する', () => {
      const result = validatePassword('1234567')
      expect(result.valid).toBe(false)
      expect(result.error).toBe('パスワードは8文字以上で入力してください')
    })
  })
})

describe('validatePostTitle', () => {
  describe('正常系', () => {
    it('有効なタイトルを受け入れる', () => {
      const result = validatePostTitle('テスト記事のタイトル')
      expect(result.valid).toBe(true)
      expect(result.error).toBeUndefined()
    })

    it('1文字のタイトルを受け入れる', () => {
      const result = validatePostTitle('A')
      expect(result.valid).toBe(true)
    })

    it('50文字のタイトルを受け入れる', () => {
      const result = validatePostTitle('あ'.repeat(50))
      expect(result.valid).toBe(true)
    })
  })

  describe('境界値 - TC-105: 100文字', () => {
    it('100文字のタイトルを受け入れる', () => {
      const result = validatePostTitle('あ'.repeat(100))
      expect(result.valid).toBe(true)
      expect(result.error).toBeUndefined()
    })
  })

  describe('境界値 - TC-106: 101文字（超過）', () => {
    it('101文字のタイトルを拒否する', () => {
      const result = validatePostTitle('あ'.repeat(101))
      expect(result.valid).toBe(false)
      expect(result.error).toBe('タイトルは100文字以内で入力してください')
    })

    it('150文字のタイトルを拒否する', () => {
      const result = validatePostTitle('あ'.repeat(150))
      expect(result.valid).toBe(false)
      expect(result.error).toBe('タイトルは100文字以内で入力してください')
    })
  })

  describe('異常系 - TC-103: タイトルが空', () => {
    it('空文字列を拒否する', () => {
      const result = validatePostTitle('')
      expect(result.valid).toBe(false)
      expect(result.error).toBe('タイトルを入力してください')
    })
  })

  describe('エッジケース', () => {
    it('スペースのみのタイトルを拒否する', () => {
      const result = validatePostTitle('   ')
      expect(result.valid).toBe(false)
      expect(result.error).toBe('タイトルを入力してください')
    })

    it('前後のスペースをトリムして検証する', () => {
      const result = validatePostTitle('  有効なタイトル  ')
      expect(result.valid).toBe(true)
    })
  })
})
