// OCR处理结果接口
export interface OCRResult {
  success: boolean;
  text?: string;
  confidence?: number;
  error?: string;
  progress?: number;
}

// OCR处理选项
export interface OCROptions {
  language?: string;
  onProgress?: (progress: number) => void;
  onStatus?: (status: string) => void;
}

// OCR处理器
export class OCRProcessor {
  // 识别图片中的文字
  static async recognizeImage(imageFile: File, options: OCROptions = {}): Promise<OCRResult> {
    try {
      const { onProgress, onStatus } = options;
      
      if (onStatus) {
        onStatus('正在加载OCR引擎...');
      }
      
      // 动态导入Tesseract.js
      const Tesseract = await import('tesseract.js');
      
      if (onStatus) {
        onStatus('正在识别文字...');
      }
      
      const result = await Tesseract.recognize(imageFile, 'chi_sim+eng', {
        logger: (m: any) => {
          if (m.status === 'recognizing text' && onProgress) {
            onProgress(m.progress * 100);
          }
          if (onStatus) {
            onStatus(m.status);
          }
        }
      });
      
      return {
        success: true,
        text: result.data.text,
        confidence: result.data.confidence
      };
    } catch (error) {
      return {
        success: false,
        error: `图片识别失败: ${error}`
      };
    }
  }

  // 处理多个图片文件
  static async processMultipleImages(imageFiles: File[], options: OCROptions = {}): Promise<OCRResult> {
    try {
      let allText = '';
      let totalConfidence = 0;
      
      for (let i = 0; i < imageFiles.length; i++) {
        const file = imageFiles[i];
        
        if (options.onStatus) {
          options.onStatus(`正在处理第 ${i + 1}/${imageFiles.length} 张图片...`);
        }
        
        const result = await this.recognizeImage(file, {
          ...options,
          onProgress: (progress) => {
            const totalProgress = ((i + progress / 100) / imageFiles.length) * 100;
            if (options.onProgress) {
              options.onProgress(totalProgress);
            }
          }
        });
        
        if (result.success && result.text) {
          allText += `\n=== 图片 ${i + 1} ===\n${result.text}\n`;
          totalConfidence += result.confidence || 0;
        }
      }
      
      return {
        success: true,
        text: allText,
        confidence: totalConfidence / imageFiles.length
      };
    } catch (error) {
      return {
        success: false,
        error: `批量处理失败: ${error}`
      };
    }
  }
}

// 图片预处理工具
export class ImagePreprocessor {
  // 调整图片对比度和亮度
  static async enhanceImage(imageFile: File): Promise<File> {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        
        if (ctx) {
          // 绘制原图
          ctx.drawImage(img, 0, 0);
          
          // 获取图像数据
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const data = imageData.data;
          
          // 增强对比度和亮度
          for (let i = 0; i < data.length; i += 4) {
            // 增加对比度
            data[i] = Math.min(255, Math.max(0, (data[i] - 128) * 1.2 + 128));     // R
            data[i + 1] = Math.min(255, Math.max(0, (data[i + 1] - 128) * 1.2 + 128)); // G
            data[i + 2] = Math.min(255, Math.max(0, (data[i + 2] - 128) * 1.2 + 128)); // B
          }
          
          // 应用处理后的图像数据
          ctx.putImageData(imageData, 0, 0);
          
          // 转换为Blob
          canvas.toBlob((blob) => {
            if (blob) {
              resolve(new File([blob], imageFile.name, { type: 'image/png' }));
            } else {
              resolve(imageFile);
            }
          }, 'image/png');
        } else {
          resolve(imageFile);
        }
      };
      
      img.src = URL.createObjectURL(imageFile);
    });
  }

  // 转换为灰度图
  static async convertToGrayscale(imageFile: File): Promise<File> {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const data = imageData.data;
          
          // 转换为灰度
          for (let i = 0; i < data.length; i += 4) {
            const gray = data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114;
            data[i] = gray;     // R
            data[i + 1] = gray; // G
            data[i + 2] = gray; // B
          }
          
          ctx.putImageData(imageData, 0, 0);
          
          canvas.toBlob((blob) => {
            if (blob) {
              resolve(new File([blob], imageFile.name, { type: 'image/png' }));
            } else {
              resolve(imageFile);
            }
          }, 'image/png');
        } else {
          resolve(imageFile);
        }
      };
      
      img.src = URL.createObjectURL(imageFile);
    });
  }
}

// 文件类型检查
export function isImageFile(file: File): boolean {
  return file.type.startsWith('image/');
}

export function isPDFFile(file: File): boolean {
  return file.type === 'application/pdf';
}

export function isSupportedFile(file: File): boolean {
  return isImageFile(file) || isPDFFile(file);
} 