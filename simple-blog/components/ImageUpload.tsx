'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'

interface ImageUploadProps {
  value?: string
  onChange: (url: string | undefined) => void
}

export function ImageUpload({ value, onChange }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setError('')
    setIsUploading(true)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error?.message || 'アップロードに失敗しました')
        return
      }

      onChange(data.url)
    } catch (err) {
      setError('アップロードに失敗しました')
    } finally {
      setIsUploading(false)
    }
  }

  const handleRemove = () => {
    onChange(undefined)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        アイキャッチ画像
      </label>

      {error && (
        <p className="text-red-600 text-sm mb-2">{error}</p>
      )}

      {value ? (
        <div className="relative">
          <Image
            src={value}
            alt="アイキャッチ画像"
            width={600}
            height={300}
            className="w-full h-48 object-cover rounded-lg"
            data-testid="cover-image-preview"
          />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
          >
            削除
          </button>
        </div>
      ) : (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/gif,image/webp"
            onChange={handleFileChange}
            disabled={isUploading}
            className="hidden"
            id="cover-image-upload"
            data-testid="cover-image-upload"
          />
          <label
            htmlFor="cover-image-upload"
            className="cursor-pointer"
          >
            <div className="text-gray-500">
              {isUploading ? (
                <span>アップロード中...</span>
              ) : (
                <>
                  <p className="mb-2">クリックして画像を選択</p>
                  <p className="text-sm">JPEG, PNG, GIF, WebP（5MB以下）</p>
                </>
              )}
            </div>
          </label>
        </div>
      )}
    </div>
  )
}
