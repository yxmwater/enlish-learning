import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText } from 'lucide-react';
import { motion } from 'framer-motion';
import { parseFile } from '../utils/fileParser';
import { Word } from '../types';
import './FileUpload.css';

interface FileUploadProps {
  onWordsLoaded: (words: Word[]) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onWordsLoaded }) => {
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      try {
        const words = await parseFile(file);
        if (words.length > 0) {
          onWordsLoaded(words);
        } else {
          alert('No valid words found in the file');
        }
      } catch (error) {
        alert(`Error parsing file: ${error}`);
      }
    }
  }, [onWordsLoaded]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/plain': ['.txt'],
      'application/json': ['.json'],
      'text/csv': ['.csv']
    },
    multiple: false
  });

  return (
    <div {...getRootProps()}>
      <motion.div
        className={`file-upload ${isDragActive ? 'active' : ''}`}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
      <input {...getInputProps()} />
      <div className="upload-content">
        <motion.div
          animate={isDragActive ? { scale: 1.1 } : { scale: 1 }}
          transition={{ duration: 0.2 }}
        >
          {isDragActive ? (
            <FileText size={48} className="upload-icon" />
          ) : (
            <Upload size={48} className="upload-icon" />
          )}
        </motion.div>
        <h3 className="upload-title">
          {isDragActive ? '释放文件' : '上传文件'}
        </h3>
        <p className="upload-description">
          拖拽文件到此处或点击选择文件
        </p>
        <p className="upload-formats">
          支持格式: .txt, .json, .csv
        </p>
      </div>
      </motion.div>
    </div>
  );
};