# プロジェクト起動手順

このプロジェクトは以下の構成で動作します：
- **Backend**: Spring Boot (ポート: 8080)
- **Frontend**: Next.js (ポート: 3000)
- **Database**: PostgreSQL (ポート: 5432)

※とーるさんのをベースに色々いじって構築しています。

## 起動方法

### 1. postgresダウンロード・セットアップ

A)ローカルにインストール（Windows / macOS / Linux）
公式インストーラ等で PostgreSQL をインストールし、psql が使えることを確認
https://www.enterprisedb.com/downloads/postgres-postgresql-downloads

bash
psql --version

サーバー起動（通常は自動起動されます）

Windows: 「Services」で「postgresql-XX」開始
macOS (Homebrew): brew services start postgresql
Linux (systemd): sudo systemctl start postgresql

B). mydb を作成
ローカル
bash
# postgres データベースに接続し、mydb を作成
psql -U postgres -h localhost -p 5432 -d postgres -c "CREATE DATABASE mydb;"

C). init.sql を流し込む
ローカル
bash
psql -U postgres -h localhost -p 5432 -d mydb -v ON_ERROR_STOP=1 -f ./init.sql

D)5. 実行後の動作確認
bash
# テーブル一覧（public スキーマ）
psql -U postgres -d mydb -c "\dt public.*"

# users の中身を確認
psql -U postgres -d mydb -c "TABLE public.users;"

# 行数・採番の確認
psql -U postgres -d mydb -c "SELECT COUNT(*) FROM public.users;"
psql -U postgres -d mydb -c "\d+ public.users"
想定される初期データ（例）:

sql
コピーする
編集する
 id | username |        email         | password
----+----------+----------------------+----------
  1 | admin    | admin@example.com    | a
  2 | user1    | user1@example.com    | a
  3 | user2    | user2@example.com    | a


### 2. Eclipseでバックエンド起動

☆gradleの無限ループに陥ったときの対処法
→伊東はBの◎で解決しました
A. build.gradle を確認
・id 'eclipse' を 削除（書いていたら）。
・依存関係は既に annotationProcessor を使っているので OK（net.ltgt.apt などの旧APTプラグインは不要）。

B. Eclipseの設定
◎「ウィンドウ > 設定 > Gradle > 同期」
  “ワークスペースを自動的にリフレッシュ” を オフ（まずは様子見; 重い環境で暴発しやすい）
・「プロジェクト > プロパティ > Java コンパイラー > アノテーション処理」
  有効にする（Enabled）
・生成先: build/generated/sources/annotationProcessor/java/main を指定（無ければ追加）

C. プロジェクト操作
・右クリック > Gradle > Refresh Gradle Project（これだけで.classpath等が整います）
・以後、gradle eclipseやcleanEclipseは実行しない。

### 3. VSCodeでフロントエンドサーバー起動
ログインのusernameは「user1」
パスワードは「a」(DB参照通り)


### apendix.その他
・8/14午後に、APIから受け取る練習用の実装やってみようかな(気分次第です僕は)
・ChatGPTくん頼りまくりですあしからず。
　ただつい先日リリースされたGPT5がめっちゃ優秀で、ソースちゃんと投げろって言ったらめちゃくちゃいい感じに返してくれるようになったので、よかったら使ってみてね。
 →運営的には出てきたコードそのまま理解せずに使うのが良くない、って感じだったので、ソース(情報源)求めたり、投げられたコード解説してって聞いて理解できればOKと個人的には思っています。

