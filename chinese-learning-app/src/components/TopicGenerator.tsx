import React, { useState } from 'react';
import './TopicGenerator.css';

interface TopicGeneratorProps {
  onGeneratedText: (text: string) => void;
}

const TopicGenerator: React.FC<TopicGeneratorProps> = ({ onGeneratedText }) => {
  const [topic, setTopic] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [lastGenerated, setLastGenerated] = useState<string>('');

  const generateChineseText = async (topic: string): Promise<string> => {
    const apiKey = process.env.REACT_APP_OPENAI_API_KEY;
    
    // Check if API key is configured
    if (!apiKey || apiKey.trim() === '') {
      console.log('No OpenAI API key configured, using fallback generation');
      return generateFallbackText(topic);
    }

    try {
      const model = process.env.REACT_APP_AI_MODEL || 'gpt-3.5-turbo';
      const maxTokens = parseInt(process.env.REACT_APP_MAX_TOKENS || '200');
      const temperature = parseFloat(process.env.REACT_APP_TEMPERATURE || '0.7');
      
      const prompt = `Write a short paragraph in simplified Chinese about ${topic}. The paragraph should be educational and appropriate for Chinese language learners. Use common vocabulary and include some intermediate words for learning purposes. Make the content engaging and informative.`;
      
      console.log(`Using OpenAI API to generate text for topic: "${topic}"`);
      
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: model,
          messages: [
            {
              role: 'system',
              content: 'You are a Chinese language teacher who creates educational content for intermediate Chinese learners. Generate natural, engaging Chinese text that includes both common and intermediate vocabulary. Focus on practical, real-world topics that help students learn useful expressions and cultural context.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: maxTokens,
          temperature: temperature
        })
      });

      if (response.ok) {
        const data = await response.json();
        const generatedText = data.choices[0].message.content.trim();
        console.log('✅ Successfully generated text using OpenAI API');
        return generatedText;
      } else {
        const errorData = await response.json();
        console.error('OpenAI API error:', errorData);
        throw new Error(`API Error: ${errorData.error?.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.warn('OpenAI API failed, using fallback generation. Error:', error);
    }

    // Fallback: Generate sample Chinese text based on common topics
    return generateFallbackText(topic);
  };

  const generateFallbackText = (topic: string): string => {
    const topicLower = topic.toLowerCase().trim();
    
    // Add some randomness and context-awareness to make responses more unique
    const randomElements = [
      '现在让我们来讨论',
      '在当今世界中',
      '从不同角度来看',
      '许多专家认为',
      '根据最新研究'
    ];
    
    const randomConnectors = [
      '同时', '另外', '而且', '此外', '因此', '然而', '不过'
    ];
    
    const randomConclusions = [
      '这确实是一个值得深入探讨的主题',
      '我们每个人都可以从中学到很多',
      '这个领域还有很大的发展空间',
      '未来会有更多有趣的发展',
      '这对我们的生活产生了重要影响'
    ];
    
    // More specific templates with exact matching to avoid conflicts
    const exactTemplates: { [key: string]: string[] } = {
      'investing': [
        '投资是一种重要的理财方式。通过购买股票、债券和基金，人们可以增加自己的财富。但是投资也有风险，需要仔细研究市场趋势。成功的投资者通常会分散投资，降低风险。',
        '投资理财需要长远眼光。股票市场有涨有跌，投资者需要保持冷静和耐心。定期投资和分散投资是降低风险的有效策略。专业的财务顾问可以提供很好的建议。'
      ],
      'investing in china': [
        '在中国投资有着独特的机遇和挑战。中国经济快速发展，为投资者提供了许多机会。科技、消费、新能源等行业特别受到关注。但是投资者需要了解中国的法律法规和市场特点。',
        '中国市场对外国投资者越来越开放。从制造业到服务业，各个行业都有投资机会。中国的"一带一路"倡议也为国际投资创造了新的平台。投资前需要做好充分的市场调研。'
      ],
      'golf': [
        '高尔夫是一项优雅的运动。球员需要用球杆将小球打入洞中，用最少的杆数完成比赛。这项运动需要精确性、耐心和技巧。许多商业人士喜欢在高尔夫球场上进行商务谈判。',
        '高尔夫运动在中国越来越受欢迎。这项运动不仅锻炼身体，还能培养专注力和自律性。许多高尔夫球场设计得很漂亮，融合了自然景观。打高尔夫球是一种很好的休闲方式。'
      ]
    };
    
    // Check for exact match first
    if (exactTemplates[topicLower]) {
      const templates = exactTemplates[topicLower];
      const selectedTemplate = templates[Math.floor(Math.random() * templates.length)];
      const randomStart = randomElements[Math.floor(Math.random() * randomElements.length)];
      const randomConnector = randomConnectors[Math.floor(Math.random() * randomConnectors.length)];
      const randomEnd = randomConclusions[Math.floor(Math.random() * randomConclusions.length)];
      
      return `${randomStart}${topic}。${selectedTemplate}${randomConnector}，${randomEnd}。`;
    }
    
    // Check for partial matches as fallback
    const partialTemplates: { [key: string]: string } = {
      'invest': '投资是现代人理财的重要手段。无论是股票、房产还是基金，都需要仔细分析和规划。风险管理是投资成功的关键因素。',
      'china': '中国是一个历史悠久的国家，有着丰富的文化传统。现代中国在经济、科技等方面发展迅速，在国际舞台上发挥着重要作用。',
      'technology': '科技发展改变了我们的生活方式。人工智能、互联网、移动设备等技术让信息传播更快，工作效率更高。科技创新是社会进步的推动力。',
      'business': '商业活动是经济发展的基础。成功的企业需要创新、高质量的产品和优秀的服务。市场竞争促进了企业不断改进和发展。',
      'education': '教育是个人发展和社会进步的基石。优质的教育能够培养人才，传承知识和文化。现代教育越来越重视创新能力和实践技能的培养。'
    };
    
    // Look for partial matches
    for (const [key, text] of Object.entries(partialTemplates)) {
      if (topicLower.includes(key)) {
        const randomStart = randomElements[Math.floor(Math.random() * randomElements.length)];
        const randomEnd = randomConclusions[Math.floor(Math.random() * randomConclusions.length)];
        return `${randomStart}${topic}。${text}${randomEnd}。`;
      }
    }

    // Dynamic template for unknown topics with some variety
    const dynamicIntros = [
      `${topic}是一个非常有趣的话题`,
      `谈到${topic}，有很多值得讨论的内容`,
      `${topic}在现代生活中扮演着重要角色`,
      `关于${topic}，不同的人有不同的观点`
    ];
    
    const dynamicBody = [
      `这个领域包含了许多复杂的概念和实践。专家们对此进行了深入的研究和分析。`,
      `它涉及到理论知识和实际应用的结合。学习相关内容需要耐心和持续的努力。`,
      `这个主题与我们的日常生活密切相关。了解它有助于我们更好地适应现代社会。`,
      `这个概念在不断发展和变化。跟上最新的趋势和发展对我们很有益处。`
    ];
    
    const randomIntro = dynamicIntros[Math.floor(Math.random() * dynamicIntros.length)];
    const randomBody = dynamicBody[Math.floor(Math.random() * dynamicBody.length)];
    const randomEnd = randomConclusions[Math.floor(Math.random() * randomConclusions.length)];
    const randomConnector = randomConnectors[Math.floor(Math.random() * randomConnectors.length)];
    
    return `${randomIntro}。${randomBody}${randomConnector}，${randomEnd}。通过学习和实践，我们可以不断提高自己的理解和技能。`;
  };

  const handleGenerate = async () => {
    if (!topic.trim()) {
      alert('Please enter a topic first!');
      return;
    }

    setIsGenerating(true);
    try {
      const generatedText = await generateChineseText(topic.trim());
      onGeneratedText(generatedText);
      setLastGenerated(topic.trim());
      console.log(`Generated text for topic: "${topic.trim()}"`);
      setTopic(''); // Clear the input after successful generation
    } catch (error) {
      console.error('Error generating text:', error);
      alert('Error generating text. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const quickTopics = [
    'Investing', 'Technology', 'Travel', 'Food', 'Sports', 'Music',
    'Business', 'Education', 'Health', 'Environment', 'Art', 'Science'
  ];

  const handleQuickTopic = (quickTopic: string) => {
    setTopic(quickTopic);
  };

  return (
    <div className="topic-generator">
      <div className="generator-header">
        <button 
          className="generator-toggle"
          onClick={() => setIsExpanded(!isExpanded)}
          title="Generate Chinese text on any topic"
        >
          🎯 AI Topic Generator {isExpanded ? '▼' : '▶'}
        </button>
      </div>

      {isExpanded && (
        <div className="generator-content">
          <div className="topic-input-section">
            <label htmlFor="topic-input">Enter any topic:</label>
            <div className="input-group">
              <input
                id="topic-input"
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g., Investing, Golf, Bill Gates, Cooking..."
                className="topic-input"
                onKeyPress={(e) => e.key === 'Enter' && handleGenerate()}
              />
              <button 
                className="generate-button"
                onClick={handleGenerate}
                disabled={isGenerating || !topic.trim()}
              >
                {isGenerating ? 'Generating...' : 'Generate Chinese Text'}
              </button>
            </div>
          </div>

          <div className="quick-topics">
            <p>Quick topics:</p>
            <div className="quick-topic-buttons">
              {quickTopics.map((quickTopic) => (
                <button
                  key={quickTopic}
                  className="quick-topic-button"
                  onClick={() => handleQuickTopic(quickTopic)}
                >
                  {quickTopic}
                </button>
              ))}
            </div>
          </div>

          <div className="generator-info">
            <p>💡 The AI will generate a paragraph of Chinese text about your topic, perfect for language learning!</p>
            {lastGenerated && (
              <p className="last-generated">
                ✅ Last generated: "<strong>{lastGenerated}</strong>" 
                <br />
                <small>Try different topics to see varied content!</small>
              </p>
            )}
            <p className="debug-info">
              <small>
                🔧 API Status: {process.env.REACT_APP_OPENAI_API_KEY ? 
                  '✅ OpenAI API key configured - using real AI generation!' : 
                  '⚠️ No API key found - using fallback generation with random variations'
                }
                <br />
                💡 To enable real AI: Add your OpenAI API key to the .env file
              </small>
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TopicGenerator;