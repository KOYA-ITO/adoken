# 全体像（まずはイメージ）
```
[login/page.tsx]  ←ユーザーがログインする画面
   └─ POST /login（Cookie発行）→ 成功したら /?redirect=... へ

[/app/page.tsx]   ←ログイン後に開く一覧ページ
   ├─ useAuthGuard() が /api/auth/check を確認（未ログインなら /login へ）
   ├─ useSWR("/api/surveys") で一覧JSONを取得してテーブル表示
   └─ 行クリック → selectedId を更新 → useSWR("/api/surveys/{id}") で詳細を取得
```

**データの出入りのポイント**
- API呼び出しは必ず **fetcher.ts** 経由（Cookieを同送するため）
- 受け取ったJSONは **types/survey.ts（型）** で形を決め、表示では**必要な項目だけ**使う

---

## 1) `.env.local`（環境変数）
```ini
NEXT_PUBLIC_API_BASE=http://localhost:8080
```
- **役割**：バックエンドのURLを切り替え可能にします（本番/開発で差し替えたい）。
- **なぜ `NEXT_PUBLIC_` が必要？**  
  これが付かないと**ブラウザ側**（クライアント）に値が渡らず、`undefined` になってしまいます。

---

## 2) `app/lib/fetcher.ts`（APIクライアントの土台）
```ts
export const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:8080";

export async function jsonFetcher<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    cache: "no-store",
    credentials: "include",  // ← セッションCookieをAPIへ同送（超重要）
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}
```
- **役割**：APIの呼び出し方法を1か所に集約。  
  - **`credentials: 'include'`** が要点：Spring Securityが発行した**セッションCookie**を一緒に送るため。
  - 失敗時は例外を投げ、画面側で「失敗しました」と表示できます。
- **メリット**：全ページで同じ呼び方ができ、CORSやCookieの設定ミスを防げる。

---

## 3) `app/types/survey.ts`（TypeScriptの型）
```ts
export type SurveyListItem = {
  id: number;
  title: string;
  creatorName: string;
  questionCount: number;
  published: boolean;
};

export type SurveyDetail = {
  id: number;
  title: string;
  creatorName: string;
  questionCount: number;
  published: boolean;
  createdAt: string; // ISO日時文字列（表示時に Date に変換）
};
```
- **役割**：APIレスポンスの形を**明文化**。  
  - コード補完が効く・ミス（typo/型不一致）を**コンパイル時**に検出できる。
- **初心者ポイント**：  
  JSONのキー名は**サーバーと一致**させましょう。違う場合は**バックでDTO整形**か、フロントで**マッピング**が必要です。

---

## 4) `app/login/page.tsx`（ログイン画面のページ）
**役割**：ユーザー名とパスワードを受け取り、`/login` に送信。成功したら一覧へ遷移。

見どころ：
- **状態管理（useState）**：入力中の `username` / `password`、エラーメッセージを保持。
- **フォーム送信**：`URLSearchParams` で `application/x-www-form-urlencoded` 形式に変換。  
  Spring Securityの**標準ログイン**はこの形式が最短で動きます。
- **Cookie同送**：`credentials: 'include'` を必ず付与。
- **リダイレクト**：クエリの `?redirect=/` を読んで、ログイン成功後に戻る先を制御。
- **SWRのキャッシュ更新**：`mutate('/api/auth/check')` で「ログイン済み」にキャッシュを切り替え、  
  画面遷移後すぐに保護ページが動くようにします。

初心者がつまずきやすい点：
- **CORS**：バック側のCORS設定で `allowCredentials=true` と `http://localhost:3000` を許可していないとCookieが飛びません。
- **CSRF**：まずはデモとして無効化でOK。運用ではCookieのCSRF対策へ。

---

## 5) `app/page.tsx`（ログイン後の「一覧＋詳細」ページ）
**役割**：  
- 未ログインなら**ログイン画面へ誘導**（Authガード）  
- ログイン済みなら `/api/surveys` を叩いて一覧表示  
- クリックされたら `/api/surveys/{id}` を叩いて詳細を表示

中の部品と動き：

1) **useAuthGuard（認可ガード）**  
   - 起動時に `/api/auth/check` を呼び、**401ならログインへリダイレクト**。  
   - これにより「保護ページ」を簡単に実現できます。  
   - ポイント：副作用処理なので `useEffect` を使うのが自然です。

2) **一覧取得（useSWR）**
```ts
const { data: list, error, isLoading } =
  useSWR<SurveyListItem[]>("/api/surveys", jsonFetcher);
```
- **SWR** は「データを取ってキャッシュし、必要に応じて再取得（再検証）する」フック。
- 画面側は **`isLoading` / `error` / `data`** の3分岐で描画を切り替えるだけ。  
  → 初心者にとって「いつ表示するか」の判断が分かりやすい。

3) **選択状態（useState）**
```ts
const [selectedId, setSelectedId] = useState<number | null>(null);
```
- 一覧テーブルの行クリックで `selectedId` をセット。  
  「今、どの行を選んでいるか」＝**UIの最小の状態**だけを持つのがコツ。

4) **詳細取得（条件付きuseSWR）**
```ts
const { data: detail } = useSWR<SurveyDetail>(
  selectedId ? `/api/surveys/${selectedId}` : null, // ← nullで“今は取らない”
  jsonFetcher
);
```
- `key` を `null` にすると**呼び出さない**。必要になった時だけAPIを叩く、が簡単に書けます。
- 詳細は**右側カード**に必要な項目だけ表示。

5) **テーブル表示（必要な項目だけ描画）**
- JSONに他のフィールドがあっても、**テーブルでは使わない**＝「必要なものだけ表示」の練習。
- `key` 属性（ここでは `key={s.id}`）を付けるのを忘れないように。

---

## 6) もしコンポーネントを分割するなら（推奨の切り方）
最初は `page.tsx` に全部書いてOK。慣れたら分割しましょう。

```
app/
├─ components/
│   ├─ SurveyTable.tsx       // 一覧テーブル（props: list, onSelect）
│   ├─ SurveyDetailCard.tsx  // 右側の詳細カード（props: detail）
│   └─ LogoutButton.tsx      // 任意：/logout を叩いて /login へ戻す
├─ hooks/
│   └─ useAuthGuard.ts       // 認可ガードを独立させると他ページでも使える
└─ page.tsx                  // 上記を組み合わせる“画面（Pageコンポーネント）”
```

- **役割の分け方の基準**  
  - **再利用できるUI**は `components/`  
  - **データ取得のフック**や**認可ガード**は `hooks/`  
  - **ページ遷移（ルーティング）を担う親**が `page.tsx`

---

## 7) よくあるエラーと対処
- **CORSエラー**：  
  - バック：`allowCredentials=true`、`allowedOrigins=["http://localhost:3000"]`  
  - フロント：`credentials: 'include'`
- **Cookieが付かない/セッション切れる**：  
  - 開発中は `http` + `localhost` なので Cookie の `Secure` 属性が付いていないか確認
- **.envが反映されない**：  
  - `NEXT_PUBLIC_` が付いているか、起動し直したかを確認
- **日付の表示がおかしい**：  
  - ISO文字列はタイムゾーンで見え方が変わります。`new Date(iso).toLocaleString()` でOK。必要なら `Intl.DateTimeFormat` を使う。

---

## 8) ミニまとめ（暗記カード）
- **API呼び出しは fetcher に集約**（Cookie込み、失敗時例外）
- **SWR**：`isLoading / error / data` の3分岐、`key=null` で“今は呼ばない”
- **状態は最小限だけ**（ここでは `selectedId`）
- **必要な項目だけを描画**（DTOで最小化＋UIで取捨選択）
- **保護ページは Authガード**（`/api/auth/check` で 401→/login）

- https://chatgpt.com/share/68a3305d-431c-8004-80bd-1253552bb4e5
