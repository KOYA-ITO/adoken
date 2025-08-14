"use client";

import { useState } from "react";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import useSWR from "swr";
import { jsonFetcher } from "../lib/fetcher";
import type { SurveyListItem, SurveyDetail } from "../types/survey";

function useAuthGuard() {
  const pathname = usePathname();
  const { error } = useSWR("/api/auth/check", jsonFetcher, {
    shouldRetryOnError: false,
  });

  useEffect(() => {
    if (error) {
      const redirect = encodeURIComponent(pathname || "/");
      window.location.href = `/login?redirect=${redirect}`;
    }
  }, [error, pathname]);
}

export default function Page() {
  useAuthGuard(); // ← これだけで未ログインはログイン画面へ

  const { data: list, error, isLoading } = useSWR<SurveyListItem[]>("/api/surveys", jsonFetcher);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const { data: detail } = useSWR<SurveyDetail>(
    selectedId ? `/api/surveys/${selectedId}` : null,
    jsonFetcher
  );

  if (isLoading) return <div style={{ padding: 16 }}>読み込み中...</div>;
  if (error) return <div style={{ padding: 16 }}>取得に失敗しました: {String(error)}</div>;
  if (!list) return null;

  return (
    <main style={{ padding: 24, maxWidth: 960, margin: "0 auto", fontFamily: "system-ui, sans-serif" }}>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 16 }}>アンケート一覧（必要項目のみ表示）</h1>

      <table style={{ width: "100%", borderCollapse: "collapse", border: "1px solid #e5e7eb" }}>
        <thead>
          <tr style={{ background: "#f9fafb" }}>
            <th style={th}>ID</th>
            <th style={th}>タイトル</th>
            <th style={th}>作成者</th>
            <th style={th}>設問数</th>
            <th style={th}>公開</th>
          </tr>
        </thead>
        <tbody>
          {list.map((s) => (
            <tr
              key={s.id}
              onClick={() => setSelectedId(s.id)}
              style={{ cursor: "pointer" }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#f3f4f6")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "")}
            >
              <td style={td}>{s.id}</td>
              <td style={td}>{s.title}</td>
              <td style={td}>{s.creatorName}</td>
              <td style={td}>{s.questionCount}</td>
              <td style={td}>{s.published ? "公開中" : "下書き"}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* 右側に詳細カード（必要なときだけ取得） */}
      <section style={{ marginTop: 24 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>詳細</h2>
        {selectedId == null && <div style={{ color: "#6b7280" }}>行をクリックすると詳細を表示します。</div>}
        {selectedId != null && !detail && <div>詳細を読み込み中...</div>}
        {detail && (
          <div style={card}>
            {/* “必要なものだけ”を前提にセレクティブに表示 */}
            <div style={{ fontSize: 18, fontWeight: 700 }}>{detail.title}</div>
            <div style={{ marginTop: 4, color: "#6b7280" }}>
              作成者: {detail.creatorName} ／ 設問数: {detail.questionCount} ／ {detail.published ? "公開中" : "下書き"}
            </div>
            <div style={{ marginTop: 8, fontSize: 14, color: "#6b7280" }}>
              作成日時: {new Date(detail.createdAt).toLocaleString()}
            </div>
            {/* ここで “不要” と判断した項目は出さない（= 必要なものだけ表示） */}
          </div>
        )}
      </section>

      
    </main>
  );
}

const th: React.CSSProperties = { textAlign: "left", padding: "10px 12px", borderBottom: "1px solid #e5e7eb", fontWeight: 600, fontSize: 14 };
const td: React.CSSProperties = { padding: "10px 12px", borderBottom: "1px solid #f3f4f6", fontSize: 14 };
const card: React.CSSProperties = { border: "1px solid #e5e7eb", borderRadius: 12, padding: 16, boxShadow: "0 1px 2px rgba(0,0,0,0.04)" };


// 'use client'
// import Link from 'next/link'
// import { useMe } from '@/lib/swr'

// export default function HomePage() {
//   const { me } = useMe()

//   return (
//     <div>
//       <h1>トップ</h1>
//       {me ? (
//         <>
//           <p>ようこそ、{me.username} さん。</p>
//           <p>
//             <Link href="/user">ユーザーコンテンツへ</Link>
//           </p>
//           <form
//             onSubmit={async (e) => {
//               e.preventDefault()
//               await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' })
//               // 明示的に /api/auth/check を未認証状態に
//               location.href = '/login'
//             }}
//           >
//             <button type="submit">ログアウト</button>
//           </form>
//         </>
//       ) : (
//         <>
//           <p>ログインしてください。</p>
//           <p>
//             <Link href="/login">ログインページへ</Link>
//           </p>
//         </>
//       )}
//     </div>
//   )
// }


// // import Image from "next/image";

// // export default function Home() {
// //   return (
// //     <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
// //       <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
// //         <Image
// //           className="dark:invert"
// //           src="/next.svg"
// //           alt="Next.js logo"
// //           width={180}
// //           height={38}
// //           priority
// //         />
// //         <ol className="list-inside list-decimal text-sm/6 text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
// //           <li className="mb-2 tracking-[-.01em]">
// //             Get started by editing{" "}
// //             <code className="bg-black/[.05] dark:bg-white/[.06] px-1 py-0.5 rounded font-[family-name:var(--font-geist-mono)] font-semibold">
// //               src/app/page.tsx
// //             </code>
// //             .
// //           </li>
// //           <li className="tracking-[-.01em]">
// //             Save and see your changes instantly.
// //           </li>
// //         </ol>

// //         <div className="flex gap-4 items-center flex-col sm:flex-row">
// //           <a
// //             className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
// //             href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
// //             target="_blank"
// //             rel="noopener noreferrer"
// //           >
// //             <Image
// //               className="dark:invert"
// //               src="/vercel.svg"
// //               alt="Vercel logomark"
// //               width={20}
// //               height={20}
// //             />
// //             Deploy now
// //           </a>
// //           <a
// //             className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-full sm:w-auto md:w-[158px]"
// //             href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
// //             target="_blank"
// //             rel="noopener noreferrer"
// //           >
// //             Read our docs
// //           </a>
// //         </div>
// //       </main>
// //       <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
// //         <a
// //           className="flex items-center gap-2 hover:underline hover:underline-offset-4"
// //           href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
// //           target="_blank"
// //           rel="noopener noreferrer"
// //         >
// //           <Image
// //             aria-hidden
// //             src="/file.svg"
// //             alt="File icon"
// //             width={16}
// //             height={16}
// //           />
// //           Learn
// //         </a>
// //         <a
// //           className="flex items-center gap-2 hover:underline hover:underline-offset-4"
// //           href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
// //           target="_blank"
// //           rel="noopener noreferrer"
// //         >
// //           <Image
// //             aria-hidden
// //             src="/window.svg"
// //             alt="Window icon"
// //             width={16}
// //             height={16}
// //           />
// //           Examples
// //         </a>
// //         <a
// //           className="flex items-center gap-2 hover:underline hover:underline-offset-4"
// //           href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
// //           target="_blank"
// //           rel="noopener noreferrer"
// //         >
// //           <Image
// //             aria-hidden
// //             src="/globe.svg"
// //             alt="Globe icon"
// //             width={16}
// //             height={16}
// //           />
// //           Go to nextjs.org →
// //         </a>
// //       </footer>
// //     </div>
// //   );
// // }
