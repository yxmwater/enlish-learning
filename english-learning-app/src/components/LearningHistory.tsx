import React, { useState, useEffect } from 'react';
import { DatabaseManager, LearningRecord, ScoreStandard } from '../utils/database';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import './LearningHistory.css';

interface LearningHistoryProps {
  userId: string;
}

export const LearningHistory: React.FC<LearningHistoryProps> = ({ userId }) => {
  const [records, setRecords] = useState<LearningRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadRecords();
  }, [userId]);

  const loadRecords = async () => {
    try {
      setLoading(true);
      const data = await DatabaseManager.getLearningRecords(userId);
      setRecords(data);
      setError(null);
    } catch (err) {
      setError('加载学习记录失败');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number): string => {
    if (score >= ScoreStandard.EXCELLENT.min) return '#4CAF50';
    if (score >= ScoreStandard.GOOD.min) return '#2196F3';
    if (score >= ScoreStandard.FAIR.min) return '#FFC107';
    return '#F44336';
  };

  const formatDate = (date: Date): string => {
    return new Date(date).toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const chartData = records.map(record => ({
    date: formatDate(record.timestamp),
    分数: record.score,
    正确率: (record.correctCount / record.wordCount) * 100
  }));

  if (loading) return <div className="loading">加载中...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="learning-history">
      <h2>学习记录</h2>
      
      {/* 图表展示 */}
      <div className="chart-container">
        <BarChart width={800} height={300} data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="分数" fill="#8884d8" />
          <Bar dataKey="正确率" fill="#82ca9d" />
        </BarChart>
      </div>

      {/* 记录列表 */}
      <div className="records-list">
        {records.map((record, index) => (
          <div 
            key={record.id || index} 
            className="record-card"
            style={{ borderLeftColor: getScoreColor(record.score) }}
          >
            <div className="record-header">
              <span className="game-type">
                {record.gameType === 'match' ? '单词消消乐' : '拼写游戏'}
              </span>
              <span className="timestamp">{formatDate(record.timestamp)}</span>
            </div>
            
            <div className="record-stats">
              <div className="stat-item">
                <span className="label">得分</span>
                <span className="value" style={{ color: getScoreColor(record.score) }}>
                  {record.score}
                </span>
              </div>
              <div className="stat-item">
                <span className="label">正确率</span>
                <span className="value">
                  {Math.round((record.correctCount / record.wordCount) * 100)}%
                </span>
              </div>
              <div className="stat-item">
                <span className="label">用时</span>
                <span className="value">{Math.round(record.timeSpent / 60)}分钟</span>
              </div>
            </div>

            <div className="record-evaluation">
              <p>{record.evaluation}</p>
            </div>
          </div>
        ))}
      </div>

      {records.length === 0 && (
        <div className="no-records">
          <p>还没有学习记录，开始学习吧！</p>
        </div>
      )}
    </div>
  );
}; 