const request = require('supertest');
const { createServer } = require('http');
const apiHandler = require('../api/index');

// テスト用のHTTPサーバーを作成
function createTestServer() {
  const server = createServer((req, res) => {
    // クエリパラメータを解析
    const url = new URL(req.url, `http://${req.headers.host}`);
    req.query = Object.fromEntries(url.searchParams);
    
    // レスポンスオブジェクトに必要なメソッドを追加
    if (!res.status) {
      res.status = function(code) {
        res.statusCode = code;
        return res;
      };
    }
    
    if (!res.json) {
      res.json = function(data) {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(data));
      };
    }
    
    // APIハンドラーを呼び出し
    apiHandler(req, res);
  });
  
  return server;
}

describe('API Tests', () => {
  let server;
  
  beforeAll(() => {
    server = createTestServer();
  });
  
  afterAll((done) => {
    if (server) {
      server.close(() => {
        done();
      });
    } else {
      done();
    }
  });
  
  describe('GET /api', () => {
    test('全データを取得できる', async () => {
      const response = await request(server)
        .get('/api')
        .expect(200);
      
      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeInstanceOf(Array);
      expect(response.body.data.length).toBeGreaterThan(0);
      expect(response.body.total).toBeDefined();
      expect(response.body.returned).toBeDefined();
      expect(response.body.timestamp).toBeDefined();
    });
    
    test('カテゴリでフィルタリングできる', async () => {
      const response = await request(server)
        .get('/api?category=' + encodeURIComponent('カテゴリA'))
        .expect(200);
      
      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeInstanceOf(Array);
      
      // すべてのアイテムがカテゴリAであることを確認
      response.body.data.forEach(item => {
        expect(item.category).toBe('カテゴリA');
      });
    });
    
    test('存在しないカテゴリの場合は空配列を返す', async () => {
      const response = await request(server)
        .get('/api?category=' + encodeURIComponent('存在しないカテゴリ'))
        .expect(200);
      
      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual([]);
      expect(response.body.total).toBe(0);
      expect(response.body.returned).toBe(0);
    });
    
    test('limitパラメータで件数を制限できる', async () => {
      const response = await request(server)
        .get('/api?limit=2')
        .expect(200);
      
      expect(response.body.success).toBe(true);
      expect(response.body.data.length).toBeLessThanOrEqual(2);
      expect(response.body.returned).toBeLessThanOrEqual(2);
    });
    
    test('offsetパラメータで開始位置を指定できる', async () => {
      const response1 = await request(server)
        .get('/api?limit=2&offset=0')
        .expect(200);
      
      const response2 = await request(server)
        .get('/api?limit=2&offset=2')
        .expect(200);
      
      expect(response1.body.data[0].id).not.toBe(response2.body.data[0].id);
    });
    
    test('無効なlimitパラメータを処理できる', async () => {
      const response = await request(server)
        .get('/api?limit=invalid')
        .expect(200);
      
      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeInstanceOf(Array);
    });
  });
  
  describe('HTTPメソッド', () => {
    test('POSTリクエストは405エラーを返す', async () => {
      const response = await request(server)
        .post('/api')
        .expect(405);
      
      expect(response.body.error).toBe('Method not allowed');
      expect(response.body.message).toBe('GETメソッドのみサポートしています');
    });
    
    test('PUTリクエストは405エラーを返す', async () => {
      const response = await request(server)
        .put('/api')
        .expect(405);
      
      expect(response.body.error).toBe('Method not allowed');
    });
    
    test('DELETEリクエストは405エラーを返す', async () => {
      const response = await request(server)
        .delete('/api')
        .expect(405);
      
      expect(response.body.error).toBe('Method not allowed');
    });
  });
  
  describe('レスポンス形式', () => {
    test('レスポンスに必要なフィールドが含まれている', async () => {
      const response = await request(server)
        .get('/api')
        .expect(200);
      
      const requiredFields = ['success', 'data', 'total', 'returned', 'timestamp'];
      requiredFields.forEach(field => {
        expect(response.body).toHaveProperty(field);
      });
    });
    
    test('データアイテムに必要なフィールドが含まれている', async () => {
      const response = await request(server)
        .get('/api')
        .expect(200);
      
      if (response.body.data.length > 0) {
        const item = response.body.data[0];
        const requiredFields = ['id', 'name', 'description', 'category', 'price', 'created_at'];
        requiredFields.forEach(field => {
          expect(item).toHaveProperty(field);
        });
      }
    });
  });
});
