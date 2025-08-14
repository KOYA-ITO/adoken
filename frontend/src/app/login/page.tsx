'use client'
import { useSearchParams, useRouter } from 'next/navigation'
import { useState } from 'react'
import useSWR, { mutate } from "swr";


export default function LoginPage() {
  const router = useRouter()
  const search = useSearchParams()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const sp = useSearchParams();
  const redirectTo = sp.get("redirect") ?? "/"; // ← ログイン後にここへ

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
    <main style={{ maxWidth: 360, margin: "80px auto", padding: 24 }}>
      <h1 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16 }}>ログイン</h1>
      <form onSubmit={onSubmit} style={{ display: "grid", gap: 12 }}>
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="ユーザー名"
          style={{ padding: 10, border: "1px solid #e5e7eb", borderRadius: 8 }}
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="パスワード"
          style={{ padding: 10, border: "1px solid #e5e7eb", borderRadius: 8 }}
        />
        <button
          type="submit"
          style={{ padding: 10, borderRadius: 8, border: "1px solid #e5e7eb" }}
        >
          ログイン
        </button>
        {error && <div style={{ color: "crimson" }}>{error}</div>}
      </form>
    </main>
  );
}