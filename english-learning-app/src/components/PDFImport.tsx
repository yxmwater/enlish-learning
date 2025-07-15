import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { FileText, Upload, AlertCircle, CheckCircle, Eye, Download, BookOpen, Image, Camera } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { TextbookData } from '../types';
import { PDFFileProcessor, PDFParseResult } from '../utils/pdfParser';
import { OCRProcessor, OCRResult, isImageFile, isSupportedFile } from '../utils/ocrProcessor';
import './PDFImport.css';

interface PDFImportProps {
  onTextbookParsed: (textbook: TextbookData) => void;
}

export const PDFImport: React.FC<PDFImportProps> = ({ onTextbookParsed }) => {
  const [pdfText, setPdfText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [parseResult, setParseResult] = useState<PDFParseResult | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [validationResult, setValidationResult] = useState<{
    isValid: boolean;
    issues: string[];
    suggestions: string[];
  } | null>(null);
  
  // OCR相关状态
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [ocrResult, setOcrResult] = useState<OCRResult | null>(null);
  const [ocrProgress, setOcrProgress] = useState(0);
  const [ocrStatus, setOcrStatus] = useState('');
  const [processingMode, setProcessingMode] = useState<'text' | 'ocr'>('text');

  const handleTextChange = (text: string) => {
    setPdfText(text);
    setParseResult(null);
    setValidationResult(null);
    
    if (text.length > 50) {
      // 实时验证
      const validation = PDFFileProcessor.validatePDFText(text);
      setValidationResult(validation);
    }
  };

  const handleProcessPDF = async () => {
    if (!pdfText.trim()) {
      alert('请先粘贴PDF文本内容');
      return;
    }

    setIsProcessing(true);
    
    try {
      const result = await PDFFileProcessor.processPDFText(pdfText);
      setParseResult(result);
      
      if (result.success && result.textbook) {
        // 自动显示预览
        setShowPreview(true);
      }
    } catch (error) {
      setParseResult({
        success: false,
        error: `处理失败: ${error}`,
        rawText: pdfText
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleImportTextbook = () => {
    if (parseResult?.success && parseResult.textbook) {
      onTextbookParsed(parseResult.textbook);
      // 清空状态
      setPdfText('');
      setParseResult(null);
      setShowPreview(false);
    }
  };

  // 文件上传处理
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const supportedFiles = acceptedFiles.filter(isSupportedFile);
    setUploadedFiles(supportedFiles);
    setOcrResult(null);
    setOcrProgress(0);
    setOcrStatus('');
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.bmp'],
      'application/pdf': ['.pdf']
    },
    multiple: true
  });

  // OCR处理
  const handleOCRProcess = async () => {
    if (uploadedFiles.length === 0) {
      alert('请先上传图片文件');
      return;
    }

    setIsProcessing(true);
    setOcrResult(null);
    setOcrProgress(0);
    setOcrStatus('');

    try {
      const imageFiles = uploadedFiles.filter(isImageFile);
      
      if (imageFiles.length === 0) {
        throw new Error('没有找到支持的图片文件');
      }

      const result = await OCRProcessor.processMultipleImages(imageFiles, {
        onProgress: (progress) => {
          setOcrProgress(progress);
        },
        onStatus: (status) => {
          setOcrStatus(status);
        }
      });

      setOcrResult(result);
      
      if (result.success && result.text) {
        // 将OCR结果填入文本框
        setPdfText(result.text);
        setProcessingMode('text');
      }
    } catch (error) {
      setOcrResult({
        success: false,
        error: `OCR处理失败: ${error}`
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCopyExample = () => {
    const exampleText = `北京版小学英语三年级上册

Unit 1 Hello!
Lesson 1 Nice to meet you
hello - 你好 [həˈloʊ]
hi - 嗨 [haɪ]
good - 好的 [ɡʊd]
morning - 早晨 [ˈmɔːrnɪŋ]
nice - 美好的 [naɪs]
meet - 遇见 [miːt]

Lesson 2 What's your name?
name - 名字 [neɪm]
my - 我的 [maɪ]
your - 你的 [jʊr]
I - 我 [aɪ]
you - 你 [juː]

Unit 2 Colours
Lesson 1 Red and blue
red - 红色 [red]
blue - 蓝色 [bluː]
yellow - 黄色 [ˈjeloʊ]
green - 绿色 [ɡriːn]
colour - 颜色 [ˈkʌlər]

Lesson 2 What colour is it?
what - 什么 [wʌt]
is - 是 [ɪz]
it - 它 [ɪt]
black - 黑色 [blæk]
white - 白色 [waɪt]`;

    navigator.clipboard.writeText(exampleText).then(() => {
      alert('示例文本已复制到剪贴板');
    });
  };

  const getTotalWords = () => {
    if (!parseResult?.textbook) return 0;
    return parseResult.textbook.units.reduce((total, unit) => {
      return total + unit.lessons.reduce((lessonTotal, lesson) => {
        return lessonTotal + lesson.words.length;
      }, 0);
    }, 0);
  };

  return (
    <div className="pdf-import">
      <div className="pdf-import-header">
        <FileText size={32} className="pdf-icon" />
        <div className="pdf-title">
          <h2>PDF教材导入</h2>
          <p>从PDF教材中提取章节化的词汇内容</p>
        </div>
      </div>

      {/* 处理模式选择 */}
      <div className="processing-mode-selector">
        <button 
          className={`mode-btn ${processingMode === 'text' ? 'active' : ''}`}
          onClick={() => setProcessingMode('text')}
        >
          <FileText size={16} />
          文本粘贴
        </button>
        <button 
          className={`mode-btn ${processingMode === 'ocr' ? 'active' : ''}`}
          onClick={() => setProcessingMode('ocr')}
        >
          <Camera size={16} />
          图片识别
        </button>
      </div>

      {/* 使用说明 */}
      <div className="usage-instructions">
        <h3>使用步骤：</h3>
        {processingMode === 'text' ? (
          <ol>
            <li>打开PDF文件 <code>/Users/yangximei/Documents/英语教材/北京版小学英语三上电子课本.pdf</code></li>
            <li>选择并复制PDF中的文本内容（Cmd+A → Cmd+C）</li>
            <li>粘贴到下方文本框中</li>
            <li>点击"解析PDF内容"进行处理</li>
            <li>预览提取的章节和单词</li>
            <li>确认无误后导入到教材库</li>
          </ol>
        ) : (
          <ol>
            <li>将PDF教材转换为图片（可以截图或导出为图片）</li>
            <li>拖拽图片到下方区域，或点击选择文件</li>
            <li>支持多张图片批量处理</li>
            <li>点击"开始OCR识别"进行文字识别</li>
            <li>识别完成后会自动填入文本框</li>
            <li>检查识别结果，然后解析PDF内容</li>
          </ol>
        )}
        
        <button className="copy-example-btn" onClick={handleCopyExample}>
          <FileText size={14} />
          复制示例格式
        </button>
      </div>

      {/* OCR上传区域 */}
      {processingMode === 'ocr' && (
        <div className="ocr-section">
          <h3>上传图片文件：</h3>
          <div {...getRootProps()} className={`dropzone ${isDragActive ? 'active' : ''}`}>
            <input {...getInputProps()} />
            <div className="dropzone-content">
              <Image size={48} />
              <p>
                {isDragActive 
                  ? '拖拽文件到这里...' 
                  : '拖拽图片到这里，或点击选择文件'
                }
              </p>
              <p className="file-types">支持: PNG, JPG, JPEG, GIF, BMP</p>
            </div>
          </div>
          
          {uploadedFiles.length > 0 && (
            <div className="uploaded-files">
              <h4>已上传文件：</h4>
              <ul>
                {uploadedFiles.map((file, index) => (
                  <li key={index} className="file-item">
                    <Image size={16} />
                    <span>{file.name}</span>
                    <span className="file-size">({(file.size / 1024).toFixed(1)} KB)</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          <div className="ocr-actions">
            <button
              className="ocr-btn"
              onClick={handleOCRProcess}
              disabled={isProcessing || uploadedFiles.length === 0}
            >
              {isProcessing ? '识别中...' : '开始OCR识别'}
            </button>
          </div>
          
          {/* OCR进度 */}
          {isProcessing && (
            <div className="ocr-progress">
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${ocrProgress}%` }}
                />
              </div>
              <p className="progress-text">
                {ocrStatus} ({ocrProgress.toFixed(1)}%)
              </p>
            </div>
          )}
          
          {/* OCR结果 */}
          {ocrResult && (
            <div className={`ocr-result ${ocrResult.success ? 'success' : 'error'}`}>
              {ocrResult.success ? (
                <div>
                  <div className="result-header">
                    <CheckCircle size={20} />
                    <span>识别成功！置信度: {(ocrResult.confidence || 0).toFixed(1)}%</span>
                  </div>
                  <p>识别的文本已自动填入下方文本框，请检查并继续处理。</p>
                </div>
              ) : (
                <div>
                  <div className="result-header">
                    <AlertCircle size={20} />
                    <span>识别失败</span>
                  </div>
                  <p>{ocrResult.error}</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* 文本输入区域 */}
      <div className="text-input-section">
        <div className="section-header">
          <h3>
            {processingMode === 'ocr' ? 'OCR识别结果' : '粘贴PDF文本内容'}
          </h3>
          <div className="text-stats">
            {pdfText.length > 0 && (
              <span>{pdfText.length} 字符</span>
            )}
          </div>
        </div>

        <textarea
          className="pdf-text-input"
          value={pdfText}
          onChange={(e) => handleTextChange(e.target.value)}
          placeholder="请粘贴PDF文本内容，包含Unit、Lesson和单词信息..."
          rows={15}
        />

        {/* 实时验证反馈 */}
        {validationResult && (
          <div className={`validation-feedback ${validationResult.isValid ? 'valid' : 'invalid'}`}>
            {validationResult.isValid ? (
              <div className="validation-success">
                <CheckCircle size={16} />
                <span>文本格式验证通过</span>
              </div>
            ) : (
              <div className="validation-issues">
                <AlertCircle size={16} />
                <div>
                  <div className="issues">
                    <strong>发现问题：</strong>
                    <ul>
                      {validationResult.issues.map((issue, index) => (
                        <li key={index}>{issue}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="suggestions">
                    <strong>建议：</strong>
                    <ul>
                      {validationResult.suggestions.map((suggestion, index) => (
                        <li key={index}>{suggestion}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        <button 
          className="process-btn"
          onClick={handleProcessPDF}
          disabled={!pdfText.trim() || isProcessing}
        >
          {isProcessing ? (
            <>
              <div className="spinner" />
              处理中...
            </>
          ) : (
            <>
              <Upload size={16} />
              解析PDF内容
            </>
          )}
        </button>
      </div>

      {/* 解析结果 */}
      {parseResult && (
        <div className="parse-result">
          {parseResult.success ? (
            <div className="success-result">
              <div className="result-header">
                <CheckCircle size={20} className="success-icon" />
                <h3>解析成功！</h3>
                <button 
                  className="preview-btn"
                  onClick={() => setShowPreview(!showPreview)}
                >
                  <Eye size={16} />
                  {showPreview ? '隐藏预览' : '显示预览'}
                </button>
              </div>

              <div className="result-summary">
                <div className="summary-item">
                  <span className="label">教材名称:</span>
                  <span className="value">{parseResult.textbook?.info.name}</span>
                </div>
                <div className="summary-item">
                  <span className="label">单元数量:</span>
                  <span className="value">{parseResult.textbook?.units.length}</span>
                </div>
                <div className="summary-item">
                  <span className="label">总词汇量:</span>
                  <span className="value">{getTotalWords()}</span>
                </div>
              </div>

              <button 
                className="import-textbook-btn"
                onClick={handleImportTextbook}
              >
                <Download size={16} />
                导入到教材库
              </button>
            </div>
          ) : (
            <div className="error-result">
              <AlertCircle size={20} className="error-icon" />
              <h3>解析失败</h3>
              <p>{parseResult.error}</p>
              
              {parseResult.rawText && (
                <details className="raw-text-details">
                  <summary>查看原始文本</summary>
                  <pre className="raw-text">{parseResult.rawText.substring(0, 1000)}...</pre>
                </details>
              )}
            </div>
          )}
        </div>
      )}

      {/* 预览区域 */}
      {showPreview && parseResult?.success && parseResult.textbook && (
        <motion.div
          className="preview-section"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="preview-header">
            <BookOpen size={20} />
            <h3>教材预览</h3>
          </div>

          <div className="textbook-preview">
            <div className="textbook-info">
              <h4>{parseResult.textbook.info.name}</h4>
              <p>{parseResult.textbook.info.description}</p>
            </div>

            <div className="units-preview">
              {parseResult.textbook.units.map((unit, unitIndex) => (
                <div key={unit.id} className="unit-preview">
                  <h5 className="unit-title">{unit.name}</h5>
                  <div className="lessons-preview">
                    {unit.lessons.map((lesson, lessonIndex) => (
                      <div key={lesson.id} className="lesson-preview">
                        <h6 className="lesson-title">{lesson.name}</h6>
                        <div className="words-preview">
                          {lesson.words.slice(0, 5).map((word, wordIndex) => (
                            <div key={word.id} className="word-preview">
                              <span className="word-english">{word.english}</span>
                              <span className="word-chinese">{word.chinese}</span>
                              {word.pronunciation && (
                                <span className="word-pronunciation">[{word.pronunciation}]</span>
                              )}
                            </div>
                          ))}
                          {lesson.words.length > 5 && (
                            <div className="more-words">
                              还有 {lesson.words.length - 5} 个单词...
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* 格式说明 */}
      <div className="format-guide">
        <h4>PDF文本格式要求：</h4>
        <div className="format-examples">
          <div className="format-item">
            <strong>单元标题：</strong>
            <code>Unit 1 Hello!</code> 或 <code>Unit 1: Hello!</code>
          </div>
          <div className="format-item">
            <strong>课程标题：</strong>
            <code>Lesson 1 Nice to meet you</code>
          </div>
          <div className="format-item">
            <strong>单词格式：</strong>
            <code>hello - 你好 [həˈloʊ]</code>
          </div>
        </div>
      </div>
    </div>
  );
}; 