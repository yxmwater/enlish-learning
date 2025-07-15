import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Globe, Download, AlertCircle, CheckCircle, Copy, Loader } from 'lucide-react';
import { Word } from '../types';
import { VocabularyParser, predefinedSources } from '../utils/contentFetcher';
import './WebContentImport.css';

interface WebContentImportProps {
  onWordsImported: (words: Word[]) => void;
}

export const WebContentImport: React.FC<WebContentImportProps> = ({ onWordsImported }) => {

  const [customUrl, setCustomUrl] = useState('');
  const [textContent, setTextContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [previewWords, setPreviewWords] = useState<Word[]>([]);
  const [importMode, setImportMode] = useState<'url' | 'text'>('text');

  const handleUrlImport = async () => {
    if (!customUrl.trim()) {
      setError('请输入有效的URL');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // 由于CORS限制，这里提供一个提示给用户
      setError('由于浏览器安全限制，无法直接访问外部网站。请复制网页内容到文本框中。');
      
      // 这里是示例代码，实际需要后端支持或CORS代理
      // const content = await ContentFetcher.fetchContent(customUrl);
      // const words = VocabularyParser.extractWordsFromHTML(content, 'custom-url');
      // setPreviewWords(words);
      // setSuccess(`成功提取 ${words.length} 个单词`);
    } catch (err) {
      setError('获取网页内容失败，请检查URL是否正确或网络连接');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTextImport = () => {
    if (!textContent.trim()) {
      setError('请输入要解析的文本内容');
      return;
    }

    setError(null);
    setSuccess(null);

    try {
      const words = VocabularyParser.extractWordsFromText(textContent, 'manual-text');
      setPreviewWords(words);
      
      if (words.length > 0) {
        setSuccess(`成功提取 ${words.length} 个单词`);
      } else {
        setError('未能从文本中提取到单词，请检查格式是否正确');
      }
    } catch (err) {
      setError('解析文本内容失败，请检查格式');
    }
  };

  const handleImportWords = () => {
    if (previewWords.length > 0) {
      onWordsImported(previewWords);
      setSuccess(`已导入 ${previewWords.length} 个单词到学习列表`);
      // 清空预览
      setPreviewWords([]);
      setTextContent('');
      setCustomUrl('');
    }
  };

  const handleCopyExample = () => {
    const exampleText = `apple - 苹果 [ˈæpl]
book - 书 [bʊk]
cat - 猫 [kæt]
dog - 狗 [dɔːɡ]
eat - 吃 [iːt]
friend - 朋友 [frend]
good - 好的 [ɡʊd]
happy - 快乐的 [ˈhæpi]
ice - 冰 [aɪs]
jump - 跳 [dʒʌmp]`;
    
    navigator.clipboard.writeText(exampleText).then(() => {
      setSuccess('示例文本已复制到剪贴板');
    });
  };

  return (
    <div className="web-content-import">
      <div className="import-header">
        <Globe size={32} className="import-icon" />
        <div className="import-title">
          <h2>网络内容导入</h2>
          <p>从网页或文本中提取词汇内容</p>
        </div>
      </div>

      {/* 导入模式选择 */}
      <div className="import-mode-selector">
        <button 
          className={`mode-btn ${importMode === 'text' ? 'active' : ''}`}
          onClick={() => setImportMode('text')}
        >
          文本导入
        </button>
        <button 
          className={`mode-btn ${importMode === 'url' ? 'active' : ''}`}
          onClick={() => setImportMode('url')}
        >
          网址导入
        </button>
      </div>

      {/* 文本导入模式 */}
      {importMode === 'text' && (
        <motion.div
          className="text-import-section"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="section-header">
            <h3>粘贴文本内容</h3>
            <button className="copy-example-btn" onClick={handleCopyExample}>
              <Copy size={14} />
              复制示例格式
            </button>
          </div>
          
          <div className="format-tips">
            <h4>支持的格式：</h4>
            <ul>
              <li><code>apple - 苹果 [ˈæpl]</code></li>
              <li><code>apple 苹果 /ˈæpl/</code></li>
              <li><code>apple: 苹果 (ˈæpl)</code></li>
              <li><code>apple，苹果，ˈæpl</code></li>
              <li><code>apple 苹果</code></li>
            </ul>
          </div>

          <textarea
            className="text-input"
            value={textContent}
            onChange={(e) => setTextContent(e.target.value)}
            placeholder="请粘贴包含单词的文本内容..."
            rows={10}
          />

          <button 
            className="import-btn"
            onClick={handleTextImport}
            disabled={!textContent.trim()}
          >
            <Download size={16} />
            解析文本
          </button>
        </motion.div>
      )}

      {/* URL导入模式 */}
      {importMode === 'url' && (
        <motion.div
          className="url-import-section"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="url-input-group">
            <input
              type="url"
              className="url-input"
              value={customUrl}
              onChange={(e) => setCustomUrl(e.target.value)}
              placeholder="请输入网页URL（如：https://example.com）"
            />
            <button 
              className="fetch-btn"
              onClick={handleUrlImport}
              disabled={!customUrl.trim() || isLoading}
            >
              {isLoading ? <Loader size={16} className="spinning" /> : <Download size={16} />}
              获取内容
            </button>
          </div>

          <div className="cors-notice">
            <AlertCircle size={16} />
            <span>
              由于浏览器安全限制，建议先复制网页内容到"文本导入"模式中进行解析
            </span>
          </div>

          <div className="predefined-sources">
            <h4>常用教材资源：</h4>
            <div className="source-buttons">
              {predefinedSources.map((source) => (
                <button
                  key={source.id}
                  className="source-btn"
                  onClick={() => setCustomUrl(source.url)}
                >
                  {source.name}
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* 状态消息 */}
      {error && (
        <div className="status-message error">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="status-message success">
          <CheckCircle size={16} />
          <span>{success}</span>
        </div>
      )}

      {/* 预览区域 */}
      {previewWords.length > 0 && (
        <motion.div
          className="preview-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="preview-header">
            <h3>预览提取的单词 ({previewWords.length}个)</h3>
            <button className="import-words-btn" onClick={handleImportWords}>
              <Download size={16} />
              导入到学习列表
            </button>
          </div>

          <div className="words-preview">
            {previewWords.slice(0, 10).map((word, index) => (
              <div key={index} className="word-preview-item">
                <span className="word-english">{word.english}</span>
                <span className="word-chinese">{word.chinese}</span>
                {word.pronunciation && (
                  <span className="word-pronunciation">[{word.pronunciation}]</span>
                )}
              </div>
            ))}
            {previewWords.length > 10 && (
              <div className="more-words">
                还有 {previewWords.length - 10} 个单词...
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* 使用说明 */}
      <div className="usage-guide">
        <h4>使用说明：</h4>
        <ol>
          <li>从微信公众号、网页或其他来源复制包含单词的文本</li>
          <li>粘贴到文本框中，系统会自动识别单词格式</li>
          <li>预览提取的单词，确认无误后点击导入</li>
          <li>导入的单词会添加到当前学习列表中</li>
        </ol>
      </div>
    </div>
  );
}; 