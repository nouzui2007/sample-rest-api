const sampleData = [
  {
    "id": 1,
    "name": "サンプルアイテム1",
    "description": "これは最初のサンプルアイテムです",
    "category": "カテゴリA",
    "price": 1000,
    "created_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": 2,
    "name": "サンプルアイテム2",
    "description": "これは2番目のサンプルアイテムです",
    "category": "カテゴリB",
    "price": 2000,
    "created_at": "2024-01-02T00:00:00Z"
  },
  {
    "id": 3,
    "name": "サンプルアイテム3",
    "description": "これは3番目のサンプルアイテムです",
    "category": "カテゴリA",
    "price": 1500,
    "created_at": "2024-01-03T00:00:00Z"
  },
  {
    "id": 4,
    "name": "サンプルアイテム4",
    "description": "これは4番目のサンプルアイテムです",
    "category": "カテゴリC",
    "price": 3000,
    "created_at": "2024-01-04T00:00:00Z"
  },
  {
    "id": 5,
    "name": "サンプルアイテム5",
    "description": "これは5番目のサンプルアイテムです",
    "category": "カテゴリB",
    "price": 2500,
    "created_at": "2024-01-05T00:00:00Z"
  }
];

module.exports = async (req, res) => {
  // CORSヘッダーを設定
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // OPTIONSリクエスト（プリフライト）の処理
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // GETリクエストのみ許可
  if (req.method !== 'GET') {
    res.status(405).json({ 
      error: 'Method not allowed',
      message: 'GETメソッドのみサポートしています'
    });
    return;
  }

  try {
    // クエリパラメータの処理
    const { category, limit, offset } = req.query;
    
    let filteredData = [...sampleData];
    
    // カテゴリでフィルタリング
    if (category) {
      filteredData = filteredData.filter(item => 
        item.category.toLowerCase() === category.toLowerCase()
      );
    }
    
    // ページネーション処理
    let result = filteredData;
    if (limit || offset) {
      const start = parseInt(offset) || 0;
      const end = limit ? start + parseInt(limit) : undefined;
      result = filteredData.slice(start, end);
    }
    
    // レスポンスを返す
    res.status(200).json({
      success: true,
      data: result,
      total: filteredData.length,
      returned: result.length,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'サーバー内部でエラーが発生しました'
    });
  }
};
