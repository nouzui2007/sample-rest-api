const sampleData = require('../data/sample.json');

describe('Sample Data Tests', () => {
  test('データが配列形式である', () => {
    expect(Array.isArray(sampleData)).toBe(true);
  });
  
  test('データが空でない', () => {
    expect(sampleData.length).toBeGreaterThan(0);
  });
  
  test('各アイテムに必要なフィールドが含まれている', () => {
    const requiredFields = ['id', 'name', 'description', 'category', 'price', 'created_at'];
    
    sampleData.forEach((item, index) => {
      requiredFields.forEach(field => {
        expect(item).toHaveProperty(field);
      });
    });
  });
  
  test('IDが一意である', () => {
    const ids = sampleData.map(item => item.id);
    const uniqueIds = new Set(ids);
    expect(ids.length).toBe(uniqueIds.size);
  });
  
  test('IDが正の整数である', () => {
    sampleData.forEach(item => {
      expect(typeof item.id).toBe('number');
      expect(item.id).toBeGreaterThan(0);
      expect(Number.isInteger(item.id)).toBe(true);
    });
  });
  
  test('名前が文字列である', () => {
    sampleData.forEach(item => {
      expect(typeof item.name).toBe('string');
      expect(item.name.length).toBeGreaterThan(0);
    });
  });
  
  test('説明が文字列である', () => {
    sampleData.forEach(item => {
      expect(typeof item.description).toBe('string');
      expect(item.description.length).toBeGreaterThan(0);
    });
  });
  
  test('カテゴリが文字列である', () => {
    sampleData.forEach(item => {
      expect(typeof item.category).toBe('string');
      expect(item.category.length).toBeGreaterThan(0);
    });
  });
  
  test('価格が数値である', () => {
    sampleData.forEach(item => {
      expect(typeof item.price).toBe('number');
      expect(item.price).toBeGreaterThanOrEqual(0);
    });
  });
  
  test('作成日時がISO形式の文字列である', () => {
    const isoDateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/;
    
    sampleData.forEach(item => {
      expect(typeof item.created_at).toBe('string');
      expect(isoDateRegex.test(item.created_at)).toBe(true);
    });
  });
  
  test('有効な日付である', () => {
    sampleData.forEach(item => {
      const date = new Date(item.created_at);
      expect(date.toString()).not.toBe('Invalid Date');
    });
  });
  
  test('カテゴリの種類を確認', () => {
    const categories = [...new Set(sampleData.map(item => item.category))];
    expect(categories).toContain('カテゴリA');
    expect(categories).toContain('カテゴリB');
    expect(categories).toContain('カテゴリC');
  });
  
  test('データ件数が期待値と一致', () => {
    expect(sampleData.length).toBe(5);
  });
});
