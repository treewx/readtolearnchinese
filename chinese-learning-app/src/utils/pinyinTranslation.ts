import { pinyin } from 'pinyin-pro';

// Translation cache to avoid repeated API calls
const translationCache: { [key: string]: string } = {};

// Rate limiting for API calls
let lastAPICall = 0;
const API_RATE_LIMIT_MS = 500; // 500ms between API calls

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
  
  // Missing words from user screenshot
  '种': 'kind, type, to plant',
  '增': 'to increase',
  '明': 'bright, clear, to understand',
  '择': 'to choose, to select',
  '稳': 'stable, steady',
  '定': 'fixed, certain, to decide',
  '期': 'period, to expect',
  '发': 'to send out, to develop',
  '展': 'to unfold, to develop',
  
  // Additional common single characters
  '选': 'to choose, to select',
  '使': 'to use, to make',
  '包': 'bag, package, to wrap',
  '含': 'to contain, to include',
  '部': 'part, department',
  '分': 'to divide, part, minute',
  '共': 'together, common',
  '同': 'same, together',
  '并': 'and, moreover',
  '且': 'and, moreover',
  '或': 'or',
  '若': 'if, as if',
  '除': 'except, to remove',
  '加': 'to add, plus',
  '减': 'to subtract, to reduce',
  '乘': 'to multiply, to ride',
  '等': 'equal, to wait',
  '约': 'approximately, to invite',
  '近': 'close, near',
  '远': 'far, distant',
  '深': 'deep',
  '浅': 'shallow',
  '宽': 'wide',
  '窄': 'narrow',
  '厚': 'thick',
  '薄': 'thin',
  '重': 'heavy, important',
  '轻': 'light (weight)',
  '强': 'strong',
  '弱': 'weak',
  '富': 'rich, wealthy',
  '穷': 'poor',
  '贵': 'expensive, precious',
  '便宜': 'cheap, inexpensive',
  '免费': 'free (no cost)',
  '昂贵': 'expensive',
  
  // Business and investment terms
  '股': 'share, stock',
  '券': 'ticket, certificate',
  '债': 'debt',
  '借': 'to borrow, to lend',
  '还': 'to return, still',
  '付': 'to pay',
  '收': 'to receive, to collect',
  '赚': 'to earn, to make profit',
  '亏': 'to lose money',
  '涨': 'to rise, to increase',
  '跌': 'to fall, to drop',
  '升': 'to rise, liter',
  '降': 'to fall, to reduce',
  '售': 'to sell',
  '购': 'to purchase',
  '销': 'to sell, to market',
  
  // More financial vocabulary
  '账': 'account',
  '户': 'household, account',
  '余': 'remainder, balance',
  '额': 'amount, quota',
  '率': 'rate, ratio',
  '值': 'value, worth',
  '价': 'price, value',
  '费': 'fee, cost',
  '税': 'tax',
  '息': 'interest, breath',
  '利': 'profit, beneficial',
  '润': 'profit, moist',
  '损': 'loss, damage',
  '盈': 'profit, full',
  '亏损': 'loss, deficit',
  '盈利': 'profit',
  '获利': 'to gain profit',
  '回收': 'to recover, to recycle',
  '报酬': 'reward, payment',
  '薪水': 'salary',
  '工资': 'wages',
  '奖金': 'bonus',
  '补贴': 'subsidy',
  '津贴': 'allowance',
  
  // Additional common characters
  '闲': 'idle, free time, leisure',
  '忙': 'busy',
  '累': 'tired',
  '饿': 'hungry',
  '渴': 'thirsty',
  '困': 'sleepy, trapped',
  '病': 'sick, illness',
  '疼': 'pain, ache',
  '疲': 'tired, exhausted',
  '乏': 'tired, lacking',
  '醉': 'drunk',
  '醒': 'awake, sober',
  '清': 'clear, clean',
  '脏': 'dirty',
  '净': 'clean, pure',
  '满': 'full',
  '空': 'empty, sky',
  '够': 'enough',
  '缺': 'lack, missing',
  '剩': 'left over, remaining',
  '存': 'exist, save',
  '留': 'stay, remain',
  '飞': 'fly',
  '游': 'swim, tour',
  '开': 'open, drive',
  '关': 'close, shut',
  '停': 'stop',
  '始': 'begin, start',
  '终': 'end, final',
  '完': 'finish, complete',
  '成': 'become, succeed',
  '败': 'fail, defeat',
  '胜': 'win, victory',
  '输': 'lose, transport',
  '赢': 'win',
  '得': 'get, obtain',
  '失': 'lose, miss',
  '找': 'look for, find',
  '寻': 'search, seek',
  '发现': 'discover',
  '丢': 'lose, throw away',
  '拿': 'take, hold',
  '放': 'put, place',
  '举': 'lift, raise',
  '拉': 'pull',
  '推': 'push',
  '扔': 'throw',
  '打': 'hit, play',
  '踢': 'kick',
  '抓': 'grab, catch',
  '握': 'hold, grasp',
  '抱': 'hug, hold',
  '亲': 'kiss, relatives',
  '笑': 'laugh, smile',
  '哭': 'cry',
  '叫': 'call, shout',
  '喊': 'shout, yell',
  '唱': 'sing',
  '跳': 'jump, dance',
  '舞': 'dance',
  '玩': 'play',
  '睡觉': 'sleep',
  '起床': 'get up',
  '洗': 'wash',
  '刷': 'brush',
  '穿': 'wear, put on',
  '脱': 'take off',
  '换': 'change, exchange',
  '试': 'try, test',
  '练': 'practice',
  '习': 'practice, study',
  '教': 'teach',
  '讲': 'speak, tell',
  '告': 'tell, inform',
  '诉': 'tell, complain',
  '问': 'ask',
  '答': 'answer',
  '回': 'return, reply',
  '应': 'answer, respond',
  '忘': 'forget',
  '记': 'remember, record',
  '懂': 'understand',
  '明白': 'understand, clear',
  '糊涂': 'confused',
  '清楚': 'clear',
  '模糊': 'blurry, vague',
  '正确': 'correct',
  '错误': 'mistake, wrong',
  '错': 'wrong, mistake',
  '真': 'real, true',
  '假': 'fake, false',
  '诚': 'sincere',
  '实': 'real, solid',
  
  // Very common characters that were missing
  '过': 'pass, through, over, past',
  '再': 'again, more',
  '只': 'only, just',
  '才': 'only then, just',
  '而': 'and, but, while',
  '以': 'with, by, in order to',
  '及': 'and, reach',
  '者': 'person, one who',
  '其': 'his, her, its, that',
  '此': 'this, here',
  '些': 'some, these',
  '每': 'every, each',
  '各': 'each, every',
  '另': 'another, other',
  '某': 'certain, some',
  '任': 'any, appoint',
  '无': 'no, without',
  '非': 'not, wrong',
  '未': 'not yet',
  '曾': 'once, ever',
  '即': 'namely, at once',
  '则': 'then, rule',
  '否': 'no, whether',
  '亦': 'also, too',
  '乃': 'thus, then',
  '至': 'to, until, most',
  '由': 'by, from, due to',
  '自': 'self, from',
  '将': 'will, shall',
  '令': 'make, cause, order',
  '愿': 'wish, willing',
  '希': 'hope',
  '望': 'hope, look',
  '待': 'wait, treat',
  '准': 'accurate, allow',
  '许': 'allow, perhaps',
  '该': 'should, that',
  '当': 'when, should',
  '正': 'just, right',
  '内': 'inside, within',
  '外': 'outside, foreign',
  '间': 'between, room',
  '边': 'side, edge',
  '旁': 'beside, side',
  '侧': 'side',
  '角': 'corner, angle',
  '处': 'place, handle',
  '所': 'place, that which',
  '位': 'position, place',
  '点': 'point, dot, o\'clock',
  '面': 'face, surface',
  '方': 'square, direction',
  '道': 'way, path, say',
  '路': 'road, way',
  '街': 'street',
  '巷': 'lane, alley',
  '院': 'courtyard, hospital',
  '楼': 'building, floor',
  '层': 'layer, floor',
  '室': 'room',
  '厅': 'hall, living room',
  '门': 'door, gate',
  '窗': 'window',
  '墙': 'wall',
  '地': 'ground, place',
  '土': 'soil, earth',
  '石': 'stone',
  '木': 'wood, tree',
  '草': 'grass',
  '花': 'flower',
  '树': 'tree',
  '山': 'mountain',
  '水': 'water',
  '火': 'fire',
  '电': 'electricity',
  '气': 'gas, air',
  '风': 'wind',
  '雨': 'rain',
  '雪': 'snow',
  '云': 'cloud',
  '星': 'star',
  '光': 'light',
  '影': 'shadow',
  '色': 'color',
  '声': 'sound, voice',
  '音': 'sound, music'
};

export interface WordInfo {
  word: string;
  pinyin: string;
  translation: string;
}

export async function getWordInfo(word: string): Promise<WordInfo> {
  // Get Pinyin using pinyin-pro library
  const pinyinResult = pinyin(word, { 
    toneType: 'symbol',
    type: 'array',
    nonZh: 'consecutive'
  });
  
  const pinyinString = pinyinResult.join(' ');
  
  // Get translation - first check local dictionary
  let translation = chineseDict[word];
  
  // If not in dictionary, try API translation
  if (!translation) {
    translation = await translateWithAPI(word);
  }
  
  return {
    word,
    pinyin: pinyinString,
    translation
  };
}

// DeepL API configuration
const DEEPL_API_KEY = process.env.REACT_APP_DEEPL_API_KEY;
const DEEPL_BASE_URL = DEEPL_API_KEY && DEEPL_API_KEY.includes('fx') 
  ? 'https://api-free.deepl.com/v2' 
  : 'https://api.deepl.com/v2';

// Translation API service using DeepL
async function translateWithAPI(word: string): Promise<string> {
  // Check cache first
  if (translationCache[word]) {
    return translationCache[word];
  }

  // For single characters, check local dictionary first but don't return early
  // We want to try DeepL API if it's not in local dictionary

  // Skip API call if no API key is configured
  if (!DEEPL_API_KEY) {
    console.warn('DeepL API key not configured, falling back to local dictionary');
    return getCharacterTranslations(word);
  }

  // Rate limiting
  const now = Date.now();
  const timeSinceLastCall = now - lastAPICall;
  if (timeSinceLastCall < API_RATE_LIMIT_MS) {
    await new Promise(resolve => setTimeout(resolve, API_RATE_LIMIT_MS - timeSinceLastCall));
  }
  lastAPICall = Date.now();

  try {
    // Use DeepL API for accurate Chinese translation
    const formData = new URLSearchParams();
    formData.append('text', word);
    formData.append('source_lang', 'ZH');
    formData.append('target_lang', 'EN');

    const response = await fetch(`${DEEPL_BASE_URL}/translate`, {
      method: 'POST',
      headers: {
        'Authorization': `DeepL-Auth-Key ${DEEPL_API_KEY}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData
    });

    if (response.ok) {
      const data = await response.json();
      if (data.translations && data.translations.length > 0) {
        const translation = data.translations[0].text;
        
        // Basic validation for translation quality
        if (translation.toLowerCase() !== word.toLowerCase() && 
            translation.length > 0 && 
            translation.length < 200) {
          // Cache the successful translation
          translationCache[word] = translation;
          return translation;
        }
      }
    } else if (response.status === 403) {
      console.warn('DeepL API: Authentication failed - check API key');
    } else if (response.status === 456) {
      console.warn('DeepL API: Quota exceeded');
    } else {
      console.warn('DeepL API failed with status:', response.status);
    }
  } catch (error) {
    console.warn('DeepL API failed:', error);
  }

  // Fallback to character-by-character translation
  return getCharacterTranslations(word);
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
  try {
    // Process words with proper async handling
    const results = await Promise.all(
      words.map(word => getWordInfo(word))
    );
    return results;
  } catch (error) {
    console.error('Error in batch word processing:', error);
    // Fallback to synchronous processing with static dictionary only
    return words.map(word => {
      const pinyinResult = pinyin(word, { 
        toneType: 'symbol',
        type: 'array',
        nonZh: 'consecutive'
      });
      
      return {
        word,
        pinyin: pinyinResult.join(' '),
        translation: chineseDict[word] || 'No translation available'
      };
    });
  }
}