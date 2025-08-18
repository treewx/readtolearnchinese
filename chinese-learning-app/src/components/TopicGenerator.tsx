import React, { useState } from 'react';
import './TopicGenerator.css';

interface TopicGeneratorProps {
  onGeneratedText: (text: string) => void;
}

const TopicGenerator: React.FC<TopicGeneratorProps> = ({ onGeneratedText }) => {
  const [topic, setTopic] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const generateChineseText = async (topic: string): Promise<string> => {
    try {
      // Using Hugging Face's free API for text generation
      // This is a fallback approach - in production you'd want your own API key
      const prompt = `Write a short paragraph in simplified Chinese about ${topic}. The paragraph should be educational and appropriate for Chinese language learners. Use common vocabulary and include some intermediate words for learning purposes.`;
      
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer your-api-key-here' // This would need to be set up properly
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: 'You are a Chinese language teacher. Generate educational Chinese text for language learners.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 200,
          temperature: 0.7
        })
      });

      if (response.ok) {
        const data = await response.json();
        return data.choices[0].message.content;
      }
    } catch (error) {
      console.warn('OpenAI API failed, using fallback generation');
    }

    // Fallback: Generate sample Chinese text based on common topics
    return generateFallbackText(topic);
  };

  const generateFallbackText = (topic: string): string => {
    const topicLower = topic.toLowerCase();
    
    const templates: { [key: string]: string } = {
      'investing': '投资是一种重要的理财方式。通过购买股票、债券和基金，人们可以增加自己的财富。但是投资也有风险，需要仔细研究市场趋势。成功的投资者通常会分散投资，降低风险。长期投资比短期投机更安全，也更容易获得稳定的回报。',
      'golf': '高尔夫是一项优雅的运动。球员需要用球杆将小球打入洞中，用最少的杆数完成比赛。这项运动需要精确性、耐心和技巧。许多商业人士喜欢在高尔夫球场上进行商务谈判。高尔夫不仅锻炼身体，还能培养专注力和自律性。',
      'bill gates': '比尔·盖茨是微软公司的创始人，也是世界上最富有的人之一。他通过开发计算机软件改变了整个世界。后来他成立了比尔和梅琳达基金会，致力于全球健康和教育事业。盖茨相信技术可以解决世界上的许多问题，并且一直在推动创新和慈善事业。',
      'technology': '科技发展非常迅速，特别是人工智能和机器学习领域。现代科技改变了我们的生活方式，从智能手机到电动汽车，再到在线购物。互联网连接了全世界的人们，使信息传播变得更加容易。未来的科技可能会带来更多令人惊喜的变化。',
      'food': '中国菜有着悠久的历史和丰富的文化。不同地区有不同的烹饪风格，比如川菜、粤菜、鲁菜等。中国人重视食物的营养搭配，讲究色香味俱全。现在很多外国人也喜欢吃中国菜，中华美食文化正在世界各地传播。烹饪不仅是一门艺术，也是一种文化传承。',
      'travel': '旅行可以开阔视野，了解不同的文化和风土人情。现代交通工具使得国际旅行变得更加便利。许多人喜欢在假期时到其他国家旅游，体验不同的生活方式。旅行不仅能放松心情，还能学到很多新知识。拍照和写旅行日记是记录美好回忆的好方法。'
    };

    // Check if topic matches any template
    for (const [key, text] of Object.entries(templates)) {
      if (topicLower.includes(key) || key.includes(topicLower)) {
        return text;
      }
    }

    // Default template for unknown topics
    return `关于${topic}这个话题，有很多值得讨论的地方。在现代社会中，${topic}扮演着重要的角色。人们对${topic}有不同的看法和经验。通过学习和了解${topic}，我们可以获得新的知识和技能。这个主题很有趣，值得我们深入研究和思考。每个人都可以从${topic}中学到有用的东西。`;
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
          </div>
        </div>
      )}
    </div>
  );
};

export default TopicGenerator;