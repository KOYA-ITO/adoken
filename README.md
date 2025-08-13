プロジェクト起動手順
このプロジェクトは以下の構成で動作します：

Backend: Spring Boot（ポート: 8080）

Frontend: Next.js（ポート: 3000）

Database: PostgreSQL（ポート: 5432）

※ とーるさんの構成をベースに調整しています。

1. PostgreSQL のセットアップ
A. ローカルにインストール（Windows / macOS / Linux）
公式インストーラから PostgreSQL をインストール
→ https://www.enterprisedb.com/downloads/postgres-postgresql-downloads

psql が使えるか確認

bash
コピーする
編集する
psql --version
サーバー起動（通常は自動起動）

Windows: サービス一覧で postgresql-XX を開始

macOS (Homebrew):

bash
コピーする
編集する
brew services start postgresql
Linux (systemd):

bash
コピーする
編集する
sudo systemctl start postgresql
セキュリティ注意：このプロジェクトの初期データは学習用で平文パスワードを含みます。本番では必ずハッシュ化されたパスワードを使用してください。

B. データベース作成（mydb）
bash
コピーする
編集する
# postgres データベースに接続し、mydb を作成
psql -U postgres -h localhost -p 5432 -d postgres -c "CREATE DATABASE mydb;"
C. init.sql を流し込む
リポジトリ直下に init.sql がある想定です。

bash
コピーする
編集する
psql -U postgres -h localhost -p 5432 -d mydb -v ON_ERROR_STOP=1 -f ./init.sql
D. 実行後の動作確認
bash
コピーする
編集する
# テーブル一覧（public スキーマ）
psql -U postgres -d mydb -c "\dt public.*"

# users の中身を確認
psql -U postgres -d mydb -c "TABLE public.users;"

# 行数・採番の確認
psql -U postgres -d mydb -c "SELECT COUNT(*) FROM public.users;"
psql -U postgres -d mydb -c "\d+ public.users"
想定される初期データ（例）

text
コピーする
編集する
 id | username |        email         | password
----+----------+----------------------+----------
  1 | admin    | admin@example.com    | a
  2 | user1    | user1@example.com    | a
  3 | user2    | user2@example.com    | a
2. バックエンド（Spring Boot）起動（Eclipse）
Gradle の無限ループ対策（※重要）
伊東は B の「◎」設定で解決

A. build.gradle を確認

id 'eclipse' を削除（書いていたら）

依存は annotationProcessor を使用（net.ltgt.apt など旧 APT プラグインは不要）

B. Eclipse の設定

ウィンドウ > 設定 > Gradle > 同期

「ワークスペースを自動的にリフレッシュ」 を オフ（まずは様子見）

プロジェクト > プロパティ > Java コンパイラー > アノテーション処理

有効化（Enabled）

生成先に build/generated/sources/annotationProcessor/java/main を指定（無ければ追加）

C. プロジェクト操作

右クリック → Gradle > Refresh Gradle Project（.classpath 等が整備されます）

以後、gradle eclipse / cleanEclipse は実行しない

その後、Eclipse の「実行」から Spring Boot アプリを起動（ポート 8080）。

3. フロントエンド（Next.js）起動（VSCode など）
bash
コピーする
編集する
# プロジェクトの frontend ディレクトリへ
cd frontend

# 依存インストール
npm install

# 開発サーバー起動
npm run dev
# → http://localhost:3000
ログイン情報（学習用）

username: user1

password: a （DB 初期化データと一致）

Appendix
8/14 午後、API から受け取る練習用の実装を試すかもしれません（気分次第です僕は）

ChatGPT くん頼りがちですがご容赦を。直近リリースの GPT-5 がかなり優秀で、「ソース（情報源）を示して」と頼むと良い感じに返ってきます
→ そのままコピペ運用は避け、出典の確認やコード解説を求めて理解して使う、が個人的ベストプラクティスです

トラブルシュート（簡易）
password authentication failed for user "postgres"
→ パスワード再確認。開発用途なら一時的に:

bash
コピーする
編集する
PGPASSWORD=postgres psql -U postgres -h localhost -d mydb -f ./init.sql
database "mydb" does not exist
→ 「1-B. データベース作成」を実行してください

これまでのデータを完全消去してやり直したい（開発用）

bash
コピーする
編集する
# （Docker で運用している場合の例）
docker compose down -v && docker compose up -d
-v でボリュームも削除＝データが消えます。注意してください。
