'use client'
import { useMe } from '@/lib/swr'

export default function UserPage() {
  const { me, isLoading, isError } = useMe()

  if (isLoading) return <p>読み込み中...</p>
  if (isError || !me) return <p>未ログインです。</p>

  return (
    <div>
      <h1>ユーザーコンテンツ</h1>
      <ul>
        <li>ユーザー名: {me.username}</li>
        <li>メール: {me.email ?? '（未提供）'}</li>
        <li>
          パスワード: <span>******</span>
          <small style={{ marginLeft: 8, opacity: 0.7 }}>
            ※安全のため実値は取得/表示しません
          </small>
        </li>
      </ul>
    </div>
  )
}
