/**
 * バリデーション関数
 * E2Eテストで使用される全てのバリデーションロジック
 */

export interface ValidationResult {
  valid: boolean
  error?: string
}

/**
 * メールアドレスのバリデーション
 * TC-002: 不正な形式のメールアドレスを検証
 */
export function validateEmail(email: string): ValidationResult {
  // 基本的なメールアドレス形式の正規表現
  // ローカル部@ドメイン名.TLD の形式
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

  if (!email || !emailRegex.test(email)) {
    return {
      valid: false,
      error: '有効なメールアドレスを入力してください',
    }
  }

  return { valid: true }
}

/**
 * パスワードのバリデーション
 * TC-003: 8文字未満
 * TC-007: 8文字ちょうど（境界値）
 */
export function validatePassword(password: string): ValidationResult {
  const MIN_LENGTH = 8

  if (!password || password.length < MIN_LENGTH) {
    return {
      valid: false,
      error: 'パスワードは8文字以上で入力してください',
    }
  }

  return { valid: true }
}

/**
 * 記事タイトルのバリデーション
 * TC-103: タイトルが空
 * TC-105: 100文字（境界値）
 * TC-106: 101文字（境界値超過）
 */
export function validatePostTitle(title: string): ValidationResult {
  const MAX_LENGTH = 100
  const trimmedTitle = title.trim()

  if (!trimmedTitle) {
    return {
      valid: false,
      error: 'タイトルを入力してください',
    }
  }

  if (trimmedTitle.length > MAX_LENGTH) {
    return {
      valid: false,
      error: 'タイトルは100文字以内で入力してください',
    }
  }

  return { valid: true }
}
