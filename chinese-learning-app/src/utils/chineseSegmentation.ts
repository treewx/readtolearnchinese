// Basic Chinese text segmentation utility
// This is a simplified implementation - in production, you'd want to use a proper segmentation API

interface SegmentedWord {
  word: string;
  start: number;
  end: number;
}

// Common Chinese words and patterns for basic segmentation
const commonWords = [
  // Common 2-character words
  '中国', '学习', '今天', '明天', '昨天', '现在', '时间', '地方', '朋友', '老师',
  '学生', '工作', '公司', '家里', '学校', '医院', '银行', '商店', '餐厅', '机场',
  '火车', '汽车', '飞机', '手机', '电脑', '问题', '方法', '机会', '历史', '文化',
  '音乐', '电影', '书籍', '新闻', '天气', '价格', '质量', '服务', '帮助', '需要',
  '希望', '相信', '感谢', '欢迎', '再见', '不过', '因为', '所以', '虽然', '但是',
  '如果', '可以', '应该', '可能', '一定', '非常', '特别', '已经', '还是', '或者',
  
  // Financial and business terms (from screenshot)
  '投资', '股票', '基金', '理财', '收益', '风险', '市场', '资产', '财务', '经济',
  '金融', '银行', '保险', '证券', '债券', '期货', '外汇', '房地产', '股市', '股价',
  '利润', '损失', '回报', '投资者', '资金', '资本', '财富', '收入', '支出', '费用',
  '成本', '预算', '储蓄', '贷款', '利息', '通胀', '汇率', '资产', '负债', '净值',
  '分红', '股息', '市值', '估值', '波动', '趋势', '行情', '交易', '买入', '卖出',
  
  // More common words
  '一个', '这个', '那个', '什么', '怎么', '为什么', '哪里', '什么时候', '怎么样',
  '多少', '几个', '第一', '第二', '最后', '开始', '结束', '继续', '停止', '完成',
  '成功', '失败', '重要', '必要', '容易', '困难', '简单', '复杂', '有趣', '无聊',
  
  // Common 3-character words
  '计算机', '互联网', '智能手机', '大学生', '小朋友', '老朋友', '好朋友',
  '中文系', '图书馆', '咖啡店', '购物中心', '火车站', '飞机场', '出租车',
  '投资者', '股票市场', '基金公司', '理财产品', '风险评估', '收益率',
  
  // Common 4-character words
  '北京大学', '清华大学', '人民大学', '外国语言', '计算机科学',
  '股票投资', '基金投资', '理财规划', '风险管理', '资产配置',
];

// Sort by length (longest first) for greedy matching
const sortedWords = commonWords.sort((a, b) => b.length - a.length);

export function segmentChineseText(text: string): SegmentedWord[] {
  if (!text) return [];
  
  const segments: SegmentedWord[] = [];
  let position = 0;
  
  while (position < text.length) {
    let matched = false;
    
    // Try to match the longest possible word
    for (const word of sortedWords) {
      if (text.substr(position, word.length) === word) {
        segments.push({
          word: word,
          start: position,
          end: position + word.length
        });
        position += word.length;
        matched = true;
        break;
      }
    }
    
    // If no word matched, treat as single character
    if (!matched) {
      const char = text.charAt(position);
      // Skip whitespace and punctuation
      if (char.trim() && /[\u4e00-\u9fff]/.test(char)) {
        segments.push({
          word: char,
          start: position,
          end: position + 1
        });
      }
      position++;
    }
  }
  
  return segments;
}

// Alternative simple segmentation by character (fallback)
export function segmentByCharacter(text: string): SegmentedWord[] {
  const segments: SegmentedWord[] = [];
  
  for (let i = 0; i < text.length; i++) {
    const char = text.charAt(i);
    if (char.trim() && /[\u4e00-\u9fff]/.test(char)) {
      segments.push({
        word: char,
        start: i,
        end: i + 1
      });
    }
  }
  
  return segments;
}

// Punctuation and spacing handling
export function preprocessText(text: string): string {
  return text
    .replace(/\s+/g, '') // Remove extra spaces
    .replace(/[，。！？；：]/g, ' $& ') // Add spaces around punctuation
    .trim();
}