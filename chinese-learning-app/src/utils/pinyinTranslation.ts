import { pinyin } from 'pinyin-pro';

// Basic dictionary for common Chinese words with English translations
const chineseDict: { [key: string]: string } = {
  // Pronouns
  '我': 'I, me',
  '你': 'you',
  '他': 'he, him',
  '她': 'she, her',
  '它': 'it',
  '我们': 'we, us',
  '你们': 'you (plural)',
  '他们': 'they, them',
  
  // Time expressions
  '今天': 'today',
  '明天': 'tomorrow',
  '昨天': 'yesterday',
  '现在': 'now',
  '时间': 'time',
  '年': 'year',
  '月': 'month',
  '日': 'day',
  '天': 'day, sky',
  '小时': 'hour',
  '分钟': 'minute',
  
  // Common verbs
  '是': 'to be',
  '有': 'to have',
  '去': 'to go',
  '来': 'to come',
  '看': 'to see, to watch',
  '听': 'to listen',
  '说': 'to speak, to say',
  '读': 'to read',
  '写': 'to write',
  '学': 'to learn, to study',
  '学习': 'to study, to learn',
  '工作': 'to work, work',
  '吃': 'to eat',
  '喝': 'to drink',
  '睡': 'to sleep',
  '起': 'to get up',
  '走': 'to walk, to leave',
  '坐': 'to sit',
  '站': 'to stand',
  '跑': 'to run',
  '买': 'to buy',
  '卖': 'to sell',
  '做': 'to do, to make',
  '想': 'to think, to want',
  '知道': 'to know',
  '认识': 'to know (a person)',
  '喜欢': 'to like',
  '爱': 'to love',
  '帮助': 'to help',
  '需要': 'to need',
  '可以': 'can, may',
  '应该': 'should',
  '会': 'can, will, know how to',
  
  // Common nouns
  '人': 'person, people',
  '家': 'home, family',
  '朋友': 'friend',
  '老师': 'teacher',
  '学生': 'student',
  '医生': 'doctor',
  '中国': 'China',
  '北京': 'Beijing',
  '上海': 'Shanghai',
  '学校': 'school',
  '医院': 'hospital',
  '银行': 'bank',
  '公司': 'company',
  '商店': 'store, shop',
  '餐厅': 'restaurant',
  '家里': 'at home',
  '地方': 'place',
  '房子': 'house',
  '车': 'car',
  '火车': 'train',
  '飞机': 'airplane',
  '汽车': 'car, automobile',
  '手机': 'mobile phone',
  '电脑': 'computer',
  '书': 'book',
  '电影': 'movie',
  '音乐': 'music',
  '钱': 'money',
  '问题': 'problem, question',
  '方法': 'method, way',
  '机会': 'opportunity',
  '历史': 'history',
  '文化': 'culture',
  '语言': 'language',
  '中文': 'Chinese (language)',
  '英文': 'English (language)',
  
  // Adjectives
  '好': 'good',
  '坏': 'bad',
  '大': 'big',
  '小': 'small',
  '高': 'tall, high',
  '矮': 'short (height)',
  '长': 'long',
  '短': 'short (length)',
  '新': 'new',
  '旧': 'old (things)',
  '年轻': 'young',
  '老': 'old (age)',
  '快': 'fast',
  '慢': 'slow',
  '多': 'many, much',
  '少': 'few, little',
  '容易': 'easy',
  '难': 'difficult',
  '重要': 'important',
  '有意思': 'interesting',
  '没意思': 'boring',
  '漂亮': 'beautiful',
  '帅': 'handsome',
  '聪明': 'smart',
  '热': 'hot',
  '冷': 'cold',
  '暖和': 'warm',
  '凉快': 'cool',
  
  // Numbers
  '一': 'one',
  '二': 'two',
  '三': 'three',
  '四': 'four',
  '五': 'five',
  '六': 'six',
  '七': 'seven',
  '八': 'eight',
  '九': 'nine',
  '十': 'ten',
  '百': 'hundred',
  '千': 'thousand',
  '万': 'ten thousand',
  
  // Common phrases
  '谢谢': 'thank you',
  '不客气': 'you\'re welcome',
  '对不起': 'sorry',
  '没关系': 'it\'s okay',
  '再见': 'goodbye',
  '您好': 'hello (polite)',
  '你好': 'hello',
  '早上好': 'good morning',
  '晚上好': 'good evening',
  '晚安': 'good night',
  '欢迎': 'welcome',
  '祝你好运': 'good luck',
  '生日快乐': 'happy birthday',
  '新年快乐': 'happy new year',
  
  // Grammar words
  '的': 'possessive particle',
  '了': 'aspect particle (completed action)',
  '在': 'at, in, on (location)',
  '和': 'and, with',
  '或者': 'or',
  '但是': 'but',
  '因为': 'because',
  '所以': 'so, therefore',
  '如果': 'if',
  '虽然': 'although',
  '不过': 'however',
  '还是': 'still, or (in questions)',
  '已经': 'already',
  '就': 'then, just',
  '都': 'all',
  '也': 'also, too',
  '很': 'very',
  '太': 'too (much)',
  '非常': 'very, extremely',
  '特别': 'especially',
  '比较': 'relatively, compared to',
  '最': 'most',
  '更': 'more',
  '不': 'not',
  '没': 'not (have), did not',
  '别': 'don\'t',
  '请': 'please',
  '让': 'to let, to make',
  '给': 'to give, for',
  '把': 'to take (disposal construction)',
  '被': 'by (passive construction)',
  '从': 'from',
  '到': 'to, until',
  '向': 'towards',
  '对': 'towards, to, correct',
  '为': 'for',
  '跟': 'with, to follow',
  '关于': 'about, concerning',
  
  // Additional common words
  '中心': 'center',
  '附近': 'nearby',
  '旁边': 'beside',
  '前面': 'in front',
  '后面': 'behind',
  '上面': 'above',
  '下面': 'below',
  '里面': 'inside',
  '外面': 'outside',
  '左边': 'left side',
  '右边': 'right side',
  '这里': 'here',
  '那里': 'there',
  '哪里': 'where',
  '什么': 'what',
  '为什么': 'why',
  '怎么': 'how',
  '多少': 'how much/many',
  '几': 'how many, several',
  '谁': 'who',
  '什么时候': 'when',
  
  // Financial and business terms
  '投资': 'investment, to invest',
  '股票': 'stocks, shares',
  '基金': 'fund, foundation',
  '理财': 'financial management',
  '收益': 'income, returns, profit',
  '风险': 'risk',
  '市场': 'market',
  '资产': 'assets',
  '财务': 'finance, financial affairs',
  '经济': 'economy, economic',
  '金融': 'finance, financial',
  '保险': 'insurance',
  '证券': 'securities',
  '债券': 'bonds',
  '期货': 'futures',
  '外汇': 'foreign exchange',
  '房地产': 'real estate',
  '股市': 'stock market',
  '股价': 'stock price',
  '利润': 'profit',
  '损失': 'loss',
  '回报': 'return, payback',
  '投资者': 'investor',
  '资金': 'funds, capital',
  '资本': 'capital',
  '财富': 'wealth',
  '收入': 'income',
  '支出': 'expenditure',
  '费用': 'cost, expense',
  '成本': 'cost',
  '预算': 'budget',
  '储蓄': 'savings',
  '贷款': 'loan',
  '利息': 'interest',
  '通胀': 'inflation',
  '汇率': 'exchange rate',
  '负债': 'debt, liability',
  '净值': 'net worth',
  '分红': 'dividend',
  '股息': 'dividend',
  '市值': 'market value',
  '估值': 'valuation',
  '波动': 'fluctuation',
  '趋势': 'trend',
  '行情': 'market condition',
  '交易': 'transaction, trading',
  '买入': 'buy in',
  '卖出': 'sell out',
  '一个': 'one, a',
  '这个': 'this',
  '那个': 'that',
  '怎么样': 'how about',
  '第一': 'first',
  '第二': 'second',
  '最后': 'last, final',
  '开始': 'start, begin',
  '结束': 'end, finish',
  '继续': 'continue',
  '停止': 'stop',
  '完成': 'complete',
  '成功': 'success',
  '失败': 'failure',
  '必要': 'necessary',
  '困难': 'difficult',
  '简单': 'simple',
  '复杂': 'complex',
  '有趣': 'interesting',
  '无聊': 'boring',
  '股票市场': 'stock market',
  '基金公司': 'fund company',
  '理财产品': 'financial product',
  '风险评估': 'risk assessment',
  '收益率': 'rate of return',
  '股票投资': 'stock investment',
  '基金投资': 'fund investment',
  '理财规划': 'financial planning',
  '风险管理': 'risk management',
  '资产配置': 'asset allocation',
};

export interface WordInfo {
  word: string;
  pinyin: string;
  translation: string;
}

export function getWordInfo(word: string): WordInfo {
  // Get Pinyin using pinyin-pro library
  const pinyinResult = pinyin(word, { 
    toneType: 'symbol',
    type: 'array',
    nonZh: 'consecutive'
  });
  
  const pinyinString = pinyinResult.join(' ');
  
  // Get translation from local dictionary
  const translation = chineseDict[word] || getCharacterTranslations(word);
  
  return {
    word,
    pinyin: pinyinString,
    translation
  };
}

// For unknown words, try to provide character-by-character translation
function getCharacterTranslations(word: string): string {
  if (word.length === 1) {
    return 'No translation available';
  }
  
  const charTranslations = [];
  for (const char of word) {
    const charTranslation = chineseDict[char];
    if (charTranslation) {
      charTranslations.push(`${char}: ${charTranslation}`);
    } else {
      charTranslations.push(`${char}: ?`);
    }
  }
  
  return charTranslations.join('; ');
}

// Batch processing for multiple words
export async function getWordsInfo(words: string[]): Promise<WordInfo[]> {
  return new Promise((resolve) => {
    // Simulate async processing
    setTimeout(() => {
      const results = words.map(word => getWordInfo(word));
      resolve(results);
    }, 100);
  });
}