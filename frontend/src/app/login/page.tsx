'use client'
import { useSearchParams, useRouter } from 'next/navigation'
import { useState } from 'react'
import { mutate } from 'swr'            // ← 追加

export default function LoginPage() {
  const router = useRouter()
  const search = useSearchParams()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const redirectTo = search.get('redirect') || '/user'

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // form-urlencoded で /api/auth/login へ（Spring Security formLogin 前提）
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      credentials: 'include',
      body: new URLSearchParams({ username, password }),
    })

if (res.ok) {
      // ★ ここで /api/auth/check を取り直してキャッシュ更新
      await mutate('/api/auth/check')
      router.replace(redirectTo)
    } else {
      setError('ログインに失敗しました（' + res.status + '）')
    }
  }

  return (
    <div style={{ maxWidth: 360 }}>
      <h1>ログイン</h1>
      <form onSubmit={onSubmit}>
        <div style={{ marginBottom: 12 }}>
          <label>
            Username
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              required
              style={{ width: '100%', padding: 8, display: 'block' }}
            />
          </label>
        </div>
        <div style={{ marginBottom: 12 }}>
          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
              style={{ width: '100%', padding: 8, display: 'block' }}
            />
          </label>
        </div>
        <button type="submit">ログイン</button>
        {error && <p style={{ color: 'crimson' }}>{error}</p>}
      </form>
    </div>
  )
}
