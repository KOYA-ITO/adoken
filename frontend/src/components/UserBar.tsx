'use client'
import Link from 'next/link'
import { useMe } from '@/lib/swr'

export default function UserBar() {
  const { me } = useMe()

  return (
    <div style={{ padding: '8px 12px', background: '#f5f5f5', display: 'flex', gap: 12, alignItems: 'center' }}>
      <Link href="/">Top</Link>
      <Link href="/user">User</Link>
      <span style={{ marginLeft: 'auto', opacity: 0.8 }}>
        {me ? (
          <>
            <strong>{me.username}</strong>
            <span style={{ marginLeft: 8 }}>ID: {me.id ?? '—'}</span>
          </>
        ) : (
          '（未取得）'
        )}
      </span>
    </div>
  )
}
