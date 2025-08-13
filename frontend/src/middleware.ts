import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// 保護したいパス（必要に応じて追加）
const PROTECTED_PREFIXES = ['/user']

export async function middleware(req: NextRequest) {
  const { pathname, origin } = req.nextUrl
  // 保護対象でなければ素通り
  if (!PROTECTED_PREFIXES.some((p) => pathname.startsWith(p))) {
    return NextResponse.next()
  }

  // 同一オリジンに見える /api/auth/check を叩く（cookie 前方転送）
  const res = await fetch(`${origin}/api/auth/check`, {
    method: 'GET',
    headers: { cookie: req.headers.get('cookie') ?? '' },
    cache: 'no-store',
  })

  if (res.status === 401) {
    const url = new URL('/login', req.url)
    url.searchParams.set('redirect', pathname) // ログイン後に戻りたい場合
    const redirect = NextResponse.redirect(url, { status: 307 })
    //redirect.headers.set('Cache-Control', 'no-store')
    return redirect
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/user/:path*'], // ルート単位で絞る場合はこちら
}
