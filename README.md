# サンプルAPI

VercelにデプロイするシンプルなAPIプログラムです。

## 機能

- GETリクエストでJSONデータのリストを返す
- カテゴリによるフィルタリング
- ページネーション対応
- CORS対応

## ファイル構成

```
├── api/
│   └── index.js          # APIエンドポイント
├── data/
│   └── sample.json       # サンプルデータ
├── vercel.json           # Vercel設定
├── package.json          # プロジェクト設定
├── jest.config.js        # Jest設定
├── __tests__/            # テストファイル
│   ├── api.test.js      # APIテスト
│   └── data.test.js     # データテスト
└── README.md            # このファイル
```

## 使用方法

### ローカル開発

1. Vercel CLIをインストール
```bash
npm i -g vercel
```

2. 開発サーバーを起動
```bash
npm run dev
```

### テスト

```bash
# 依存関係をインストール
npm install

# テストを実行
npm test

# テストをウォッチモードで実行
npm run test:watch
```

### デプロイ

## API エンドポイント

### GET /api

サンプルデータのリストを返します。

#### クエリパラメータ

- `category`: カテゴリでフィルタリング（例：`?category=カテゴリA`）
- `limit`: 取得件数を制限（例：`?limit=3`）
- `offset`: 開始位置を指定（例：`?offset=2`）

#### 使用例

```bash
# 全データを取得
curl https://your-domain.vercel.app/api

# カテゴリAのデータのみ取得
curl https://your-domain.vercel.app/api?category=カテゴリA

# 最初の3件を取得
curl https://your-domain.vercel.app/api?limit=3

# 2件目から3件取得
curl https://your-domain.vercel.app/api?limit=3&offset=2
```

#### レスポンス例

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "サンプルアイテム1",
      "description": "これは最初のサンプルアイテムです",
      "category": "カテゴリA",
      "price": 1000,
      "created_at": "2024-01-01T00:00:00Z"
    }
  ],
  "total": 5,
  "returned": 1,
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## カスタマイズ

`data/sample.json`ファイルを編集することで、返すデータを変更できます。
