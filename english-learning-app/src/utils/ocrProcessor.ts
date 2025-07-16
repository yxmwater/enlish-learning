import { createWorker } from 'tesseract.js';

export interface OCRResult {
  success: boolean;
  text?: string;
  confidence?: number;
  error?: string;
}

export interface OCROptions {
  onProgress?: (progress: number) => void;
  onStatus?: (status: string) => void;
}

export class OCRProcessor {
  // 处理单个图片
  static async processImage(file: File, options: OCROptions = {}): Promise<OCRResult> {
    try {
      const worker = await createWorker('chi_sim+eng', 1, {
        logger: (m: any) => {
          if (options.onProgress && m.progress) {
            options.onProgress(m.progress * 100);
          }
          if (options.onStatus && m.status) {
            options.onStatus(m.status);
          }
        }
      });
      
      const { data: { text, confidence } } = await worker.recognize(file);
      
      await worker.terminate();
      
      return {
        success: true,
        text: text.trim(),
        confidence
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error)
      };
    }
  }

  // 处理多个图片
  static async processMultipleImages(files: File[], options: OCROptions = {}): Promise<OCRResult> {
    try {
      let allText = '';
      let totalConfidence = 0;
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        if (options.onStatus) {
          options.onStatus(`处理图片 ${i + 1}/${files.length}: ${file.name}`);
        }
        
        const result = await this.processImage(file, {
          onProgress: (progress) => {
            const overallProgress = ((i / files.length) * 100) + (progress / files.length);
            if (options.onProgress) {
              options.onProgress(overallProgress);
            }
          },
          onStatus: options.onStatus
        });
        
        if (result.success && result.text) {
          allText += result.text + '\n';
          totalConfidence += result.confidence || 0;
        }
      }
      
      return {
        success: true,
        text: allText.trim(),
        confidence: totalConfidence / files.length
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error)
      };
    }
  }
}

// 工具函数
export const isImageFile = (file: File): boolean => {
  return file.type.startsWith('image/');
};

export const isSupportedFile = (file: File): boolean => {
  const supportedTypes = [
    'image/png',
    'image/jpeg',
    'image/jpg',
    'image/gif',
    'image/bmp',
    'application/pdf'
  ];
  return supportedTypes.includes(file.type);
}; 