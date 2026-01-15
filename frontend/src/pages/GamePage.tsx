import React, { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import DepositModal from '../components/DepositModal';
import WithdrawModal from '../components/WithdrawModal';

const GamePage: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [isDepositModalOpen, setIsDepositModalOpen] = useState<boolean>(false);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState<boolean>(false);
  const {
    config,
    loading,
    error,
    recentGames,
    gameStats,
    currentBet,
    setBetAmount,
    setBetOption,
    setMultiplier,
    rollDice,
    resetBet,
    calculatePotentialWin,
    refreshGameData
  } = useGame();
  
  const [showDiceAnimation, setShowDiceAnimation] = useState(false);
  const [diceResult, setDiceResult] = useState<number | null>(null);
  const [winResult, setWinResult] = useState<boolean | null>(null);
  const [profitResult, setProfitResult] = useState<number | null>(null);
  useEffect(() => {
    if (user) {
      refreshGameData();
    }
  }, [user]);

  const handleBetAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const amount = parseFloat(e.target.value);
    setBetAmount(amount);
  };

  const handleBetOptionChange = (option: 'small' | 'large' | number) => {
    setBetOption(option);
  };

  const handleMultiplierChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const multiplier = parseFloat(e.target.value);
    setMultiplier(multiplier);
  };

  const handleRollDice = async () => {
    if (!user || !config || loading) return;

    try {
      setShowDiceAnimation(true);
      setDiceResult(null);
      setWinResult(null);
      setProfitResult(null);

      // Simulate dice rolling animation
      await new Promise(resolve => setTimeout(resolve, 1500));

      const result = await rollDice();
      
      setDiceResult(result.diceResult);
      setWinResult(result.win);
      setProfitResult(result.profit);

      // Refresh game data to get updated stats
      refreshGameData();

    } catch (err) {
      console.error('Roll dice failed:', err);
    } finally {
      setShowDiceAnimation(false);
    }
  };

  const handleBetIncrease = () => {
    setBetAmount(currentBet.amount * 2);
  };

  const handleBetDecrease = () => {
    setBetAmount(currentBet.amount / 2);
  };

  if (!config) {
    return <div className="game-page loading">{t('loading')}...</div>;
  }

  return (
    <div className="game-page">
      {/* Left Game Area */}
      <div className="left-game-area">
        {/* Account Balance */}
        <div className="account-balance">
          <h3>{t('account_balance')}</h3>
          <div className="balance-amount">{user?.balance.toFixed(2)} $WEDS</div>
        </div>

        {/* Betting Controls */}
        <div className="betting-controls">
          <div className="betting-section">
            <h4>{t('bet_amount')}</h4>
            <div className="bet-amount-control">
              <button 
                className="bet-adjust-btn"
                onClick={handleBetDecrease}
                disabled={loading}
              >
                - 1/2
              </button>
              <input
                type="number"
                className="bet-amount-input"
                value={currentBet.amount}
                onChange={handleBetAmountChange}
                min={config.limits.minBet}
                max={Math.min(config.limits.maxBet, user?.balance || config.limits.minBet)}
                step={0.1}
                disabled={loading}
              />
              <button 
                className="bet-adjust-btn"
                onClick={handleBetIncrease}
                disabled={loading}
              >
                + 2x
              </button>
            </div>
          </div>

          <div className="betting-section">
            <h4>{t('betting_options')}</h4>
            <div className="bet-options">
              <button
                className={`bet-option-btn ${currentBet.option === 'small' ? 'active' : ''}`}
                onClick={() => handleBetOptionChange('small')}
                disabled={loading}
              >
                {t('small')} (1-3)
              </button>
              <button
                className={`bet-option-btn ${currentBet.option === 'large' ? 'active' : ''}`}
                onClick={() => handleBetOptionChange('large')}
                disabled={loading}
              >
                {t('large')} (4-6)
              </button>
            </div>
          </div>

          <div className="betting-section">
            <h4>{t('multiplier')}</h4>
            <div className="multiplier-control">
              <button
                className={`multiplier-btn ${currentBet.multiplier === 1 ? 'active' : ''}`}
                onClick={() => setMultiplier(1)}
                disabled={loading}
              >
                1x
              </button>
              <button
                className={`multiplier-btn ${currentBet.multiplier === 2 ? 'active' : ''}`}
                onClick={() => setMultiplier(2)}
                disabled={loading}
              >
                2x
              </button>
              <button
                className={`multiplier-btn ${currentBet.multiplier === 5 ? 'active' : ''}`}
                onClick={() => setMultiplier(5)}
                disabled={loading}
              >
                5x
              </button>
              <button
                className={`multiplier-btn ${currentBet.multiplier === 10 ? 'active' : ''}`}
                onClick={() => setMultiplier(10)}
                disabled={loading}
              >
                10x
              </button>
              <button
                className={`multiplier-btn ${currentBet.multiplier === 100 ? 'active' : ''}`}
                onClick={() => setMultiplier(100)}
                disabled={loading}
              >
                100x
              </button>
            </div>
            <input
              type="range"
              className="multiplier-slider"
              value={currentBet.multiplier}
              onChange={handleMultiplierChange}
              min="1"
              max={config.limits.maxMultiplier}
              step="1"
              disabled={loading}
            />
            <div className="multiplier-value">{currentBet.multiplier}x</div>
          </div>

          <div className="betting-section">
            <h4>{t('odds')}</h4>
            <div className="odds-info">
              <div className="odds-value">
                {t('current_odds')}: 
                <span className="highlight">
                  {typeof currentBet.option === 'string' 
                    ? config.odds.smallLarge 
                    : config.odds.exactNumber}x
                </span>
              </div>
              <div className="potential-win">
                {t('potential_win')}: 
                <span className="highlight">
                  {calculatePotentialWin().toFixed(2)} $WEDS
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Game Actions */}
        <div className="game-actions">
          <button 
            className="roll-dice-btn"
            onClick={handleRollDice}
            disabled={loading || !user || currentBet.amount > (user.balance || 0)}
          >
            {showDiceAnimation ? t('rolling') : t('roll_dice')}
          </button>
          <button 
            className="reset-bet-btn"
            onClick={resetBet}
            disabled={loading}
          >
            {t('reset_bet')}
          </button>
        </div>

        {/* Result Display */}
        <div className="result-display">
          <div className={`dice-container ${showDiceAnimation ? 'rolling' : ''}`}>
            {diceResult !== null ? (
              <div className="dice-result">{diceResult}</div>
            ) : (
              <div className="dice-placeholder">{t('click_roll')}</div>
            )}
          </div>
          
          {winResult !== null && profitResult !== null && (
            <div className={`game-outcome ${winResult ? 'win' : 'loss'}`}>
              <div className="outcome-message">
                {winResult ? t('you_won') : t('you_lost')}
              </div>
              <div className="outcome-profit">
                {profitResult > 0 ? '+' : ''}{profitResult.toFixed(2)} $WEDS
              </div>
            </div>
          )}
        </div>

        {/* Recent Games */}
        <div className="recent-games">
          <h4>{t('recent_games')}</h4>
          <div className="games-table">
            <div className="games-header">
              <div className="header-item">{t('dice')}</div>
              <div className="header-item">{t('bet')}</div>
              <div className="header-item">{t('multiplier')}</div>
              <div className="header-item">{t('profit')}</div>
              <div className="header-item">{t('time')}</div>
            </div>
            <div className="games-body">
              {recentGames.map((game, index) => (
                <div key={index} className={`game-row ${game.win ? 'win' : 'loss'}`}>
                  <div className="game-item">{game.diceResult}</div>
                  <div className="game-item">
                    {game.betOption} ({game.betAmount.toFixed(2)} $WEDS)
                  </div>
                  <div className="game-item">{game.multiplier}x</div>
                  <div className={`game-item profit-amount`} data-profit={game.profit > 0 ? 'positive' : 'negative'}>
                    {game.profit > 0 ? '+' : ''}{game.profit.toFixed(2)} $WEDS
                  </div>
                  <div className="game-item">
                    {new Date(game.createdAt).toLocaleTimeString()}
                  </div>
                </div>
              ))}
              {recentGames.length === 0 && (
                <div className="no-games">{t('no_recent_games')}</div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Right Function Panel */}
      <div className="right-function-panel">
        {/* Deposit & Withdraw */}
        <div className="transaction-section">
          <h3>{t('transactions')}</h3>
          <div className="transaction-buttons">
            <button className="transaction-btn deposit-btn" onClick={() => setIsDepositModalOpen(true)}>
              {t('deposit')}
            </button>
            <button className="transaction-btn withdraw-btn" onClick={() => setIsWithdrawModalOpen(true)}>
              {t('withdraw')}
            </button>
          </div>
        </div>

        {/* Leaderboard */}
        <div className="leaderboard-section">
          <h3>{t('leaderboard')}</h3>
          <div className="leaderboard-tabs">
            <button className="leaderboard-tab active">24h</button>
            <button className="leaderboard-tab">All Time</button>
            <button className="leaderboard-tab">Win Streak</button>
          </div>
          <div className="leaderboard-content">
            {/* Mock leaderboard data - replace with real data from API */}
            <div className="leaderboard-row">
              <div className="rank">1</div>
              <div className="username">CryptoMaster</div>
              <div className="profit">+125.42 $WEDS</div>
            </div>
            <div className="leaderboard-row">
              <div className="rank">2</div>
              <div className="username">LuckyGamer</div>
              <div className="profit">+98.76 $WEDS</div>
            </div>
            <div className="leaderboard-row">
              <div className="rank">3</div>
              <div className="username">DiceKing</div>
              <div className="profit">+76.34 $WEDS</div>
            </div>
            <div className="leaderboard-row">
              <div className="rank">4</div>
              <div className="username">BigRoller</div>
              <div className="profit">+54.12 $WEDS</div>
            </div>
            <div className="leaderboard-row">
              <div className="rank">5</div>
              <div className="username">RiskTaker</div>
              <div className="profit">+42.89 $WEDS</div>
            </div>
          </div>
        </div>

        {/* Game Rules */}
        <div className="rules-section">
          <h3>{t('gameRules')}</h3>
          <div className="rules-content">
            <p>Endless Dice是一款简单刺激的在线掷骰子游戏：玩家使用$WEDS代币下注并选择1-100倍加倍，然后猜骰子大小（1-3为小、4-6为大，赔率1.95倍）或具体点数（赔率5.8倍），获胜可获得投注额×赔率×倍数的奖励。平台每日还会从1000 EDS奖池中按净盈利排名奖励前10名玩家，让游戏更具竞技性。
 解释：$WEDS是游戏中的积分，跟$EDS兑换比例为1:1，因为目前游戏没有对接endless钱包，所以采用积分充值的方式进行结算。</p>
          </div>
        </div>

        {/* User Stats */}
        {gameStats && (
          <div className="user-stats-section">
            <h3>{t('your_stats')}</h3>
            <div className="stats-grid">
              <div className="stat-item">
                <div className="stat-label">{t('total_bets')}</div>
                <div className="stat-value">{gameStats.totalBets}</div>
              </div>
              <div className="stat-item">
                <div className="stat-label">{t('total_wins')}</div>
                <div className="stat-value">{gameStats.totalWins}</div>
              </div>
              <div className="stat-item">
                <div className="stat-label">{t('win_rate')}</div>
                <div className="stat-value">{gameStats.winRate.toFixed(1)}%</div>
              </div>
              <div className="stat-item">
                <div className="stat-label">{t('total_profit')}</div>
                <div className="stat-value">
                  {gameStats.totalProfit > 0 ? '+' : ''}{gameStats.totalProfit.toFixed(2)} $WEDS
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {/* Deposit and Withdraw Modals */}
      <DepositModal
        isOpen={isDepositModalOpen}
        onClose={() => setIsDepositModalOpen(false)}
      />
      <WithdrawModal
        isOpen={isWithdrawModalOpen}
        onClose={() => setIsWithdrawModalOpen(false)}
      />
    </div>
  );
}

export default GamePage;
