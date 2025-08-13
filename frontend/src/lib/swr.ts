'use client'
import useSWR from 'swr'
import type { ViewUser } from '@/types'

// Cookie送受信用（credentials: 'include'）のfetcher
export const fetcher = (url: string) =>
  fetch(url, { credentials: 'include', cache: 'no-store' }).then(async (r) => {
    if (!r.ok) throw new Error(String(r.status))
    return r.json()
  })

// /api/auth/check を初回だけ取得して共有（SWRがグローバルキャッシュに載せる）
export const useMe = () => {
  const { data, error, isLoading, mutate } = useSWR<ViewUser>('/api/auth/check', fetcher, {
    revalidateOnFocus: false,
    shouldRetryOnError: false,
  })
  return {
    me: data,
    isLoading,
    isError: !!error,
    mutate,
  }
}
