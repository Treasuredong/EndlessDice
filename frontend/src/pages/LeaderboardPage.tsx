import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { leaderboardApi } from '../services/api';
import type { LeaderboardEntry } from '../types';

const LeaderboardPage: React.FC = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'24h' | 'all-time' | 'winning-streak'>('24h');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);

  const fetchLeaderboardData = async () => {
    setLoading(true);
    setError(null);

    try {
      let data;
      switch (activeTab) {
        case '24h':
          data = await leaderboardApi.get24Hour(100);
          break;
        case 'all-time':
          data = await leaderboardApi.getAllTime(100);
          break;
        case 'winning-streak':
          data = await leaderboardApi.getWinningStreak(100);
          break;
        default:
          data = await leaderboardApi.get24Hour(100);
      }

      setLeaderboardData(data.leaderboard || []);
    } catch (err: any) {
      console.error('Failed to fetch leaderboard:', err);
      setError(err.response?.data?.message || t('failed_to_load_leaderboard') as string);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboardData();
  }, [activeTab]);

  const handleTabChange = (tab: '24h' | 'all-time' | 'winning-streak') => {
    setActiveTab(tab);
  };

  const renderLeaderboardRow = (entry: LeaderboardEntry, index: number) => {
    const rank = index + 1;
    let highlightClass = '';
    let inlineStyle: React.CSSProperties = {};

    if (rank === 1) {
      highlightClass = 'gold';
      inlineStyle = {
        backgroundColor: 'rgba(255, 215, 0, 0.5)',
        borderLeft: '3px solid #ffd700',
        borderRadius: '5px'
      };
    } else if (rank === 2) {
      highlightClass = 'silver';
      inlineStyle = {
        backgroundColor: 'rgba(192, 192, 192, 0.5)',
        borderLeft: '3px solid #c0c0c0',
        borderRadius: '5px'
      };
    } else if (rank === 3) {
      highlightClass = 'bronze';
      inlineStyle = {
        backgroundColor: 'rgba(205, 127, 50, 0.5)',
        borderLeft: '3px solid #cd7f32',
        borderRadius: '5px'
      };
    }

    return (
      <div key={entry.userId || index} className={`leaderboard-row ${highlightClass}`} style={inlineStyle}>
        <div className="rank">{rank}</div>
        <div className="username">{entry.username}</div>
        {activeTab === 'winning-streak' ? (
          <div className="streak">{entry.maxWinningStreak || 0}</div>
        ) : (
          <div className="profit">
            {entry.totalProfit !== undefined ? (
              `${entry.totalProfit > 0 ? '+' : ''}${entry.totalProfit.toFixed(2)} $WEDS`
            ) : entry.profit24h !== undefined ? (
              `${entry.profit24h > 0 ? '+' : ''}${entry.profit24h.toFixed(2)} $WEDS`
            ) : (
              '-'
            )}
          </div>
        )}
        <div className="bets">{entry.totalBets}</div>
        <div className="win-rate">{entry.winRate.toFixed(1)}%</div>
        <div className="balance">{entry.balance.toFixed(2)} $WEDS</div>
      </div>
    );
  };

  return (
    <div className="leaderboard-page">
      <h2>{t('leaderboard')}</h2>
      
      {/* Tab Navigation */}
      <div className="leaderboard-tabs">
        <button
          className={`tab ${activeTab === '24h' ? 'active' : ''}`}
          onClick={() => handleTabChange('24h')}
        >
          {t('24h_leaderboard')}
        </button>
        <button
          className={`tab ${activeTab === 'all-time' ? 'active' : ''}`}
          onClick={() => handleTabChange('all-time')}
        >
          {t('all_time_leaderboard')}
        </button>
        <button
          className={`tab ${activeTab === 'winning-streak' ? 'active' : ''}`}
          onClick={() => handleTabChange('winning-streak')}
        >
          {t('winning_streak_leaderboard')}
        </button>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="loading">
          {t('loading')}...
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {/* Leaderboard Table */}
      {!loading && !error && (
        <div className="leaderboard-container">
          <div className="leaderboard-header">
            <div className="header-item">{t('rank')}</div>
            <div className="header-item">{t('username')}</div>
            <div className="header-item">
              {activeTab === 'winning-streak' ? t('streak') : t('profit')}
            </div>
            <div className="header-item">{t('total_bets')}</div>
            <div className="header-item">{t('win_rate')}</div>
            <div className="header-item">{t('balance')}</div>
          </div>

          <div className="leaderboard-body">
            {leaderboardData.length > 0 ? (
              leaderboardData.map((entry, index) => renderLeaderboardRow(entry, index))
            ) : (
              <div className="empty-message">
                {t('no_leaderboard_data')}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LeaderboardPage;
