import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { transactionApi } from '../services/api';
import type { DepositRequest } from '../types';

const DepositPage: React.FC = () => {
  const { t } = useTranslation();
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [amount, setAmount] = useState<string>('');
  const [txHash, setTxHash] = useState<string>('');

  const handleTxHashChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTxHash(e.target.value);
  };
  
  // Fixed blockchain address
  const FIXED_BLOCKCHAIN_ADDRESS = 'AK78MTUYzZFWHJU9nRf6fY1eVmYyZ5yN5Ecxfk3CZZRf';

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const depositAmount = parseFloat(amount);
      if (isNaN(depositAmount) || depositAmount <= 0) {
        throw new Error(t('invalid_amount') as string);
      }

      const depositRequest: DepositRequest = {
        amount: depositAmount,
        blockchainAddress: FIXED_BLOCKCHAIN_ADDRESS,
        txHash: txHash
      };

      await transactionApi.submitDeposit(depositRequest);
      setSuccess(t('deposit_request_submitted') as string);
      
      // Reset form
      setAmount('');
      setTxHash('');

      // Refresh user data
      if (user) {
        // Update balance optimistically (will be updated from server on next refresh)
        updateUser({
          ...user,
          balance: user.balance + depositAmount
        });
      }
    } catch (err: any) {
      console.error('Deposit failed:', err);
      setError(err.response?.data?.message || err.message || t('deposit_failed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="deposit-page">
      <div className="transaction-container">
        <h2>{t('deposit')}</h2>
        
        {user && (
          <div className="current-balance">
            <div className="balance-label">{t('current_balance')}:</div>
            <div className="balance-value">{user.balance.toFixed(2)} $WEDS</div>
          </div>
        )}

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {success && (
          <div className="success-message">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="transaction-form">
          <div className="form-group">
            <label htmlFor="amount">{t('amount_eth')}</label>
            <input
              type="number"
              id="amount"
              value={amount}
              onChange={handleAmountChange}
              placeholder={t('enter_deposit_amount')}
              step="0.1"
              min="0.1"
              disabled={loading}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="address">{t('payment_address')}</label>
            <input
              type="text"
              id="address"
              value={FIXED_BLOCKCHAIN_ADDRESS}
              placeholder="0x..."
              disabled={true}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="txHash">{t('transaction_hash')}</label>
            <input
              type="text"
              id="txHash"
              value={txHash}
              onChange={handleTxHashChange}
              placeholder={t('enter_transaction_hash')}
              disabled={loading}
              required
            />
          </div>

          <div className="form-actions">
            <button 
              type="submit" 
              className="submit-btn"
              disabled={loading}
            >
              {loading ? t('submitting') : t('submit_deposit')}
            </button>
          </div>
        </form>

        <div className="transaction-info">
          <h3>{t('deposit_instructions')}</h3>
          <ul>
            <li>{t('deposit_instruction_1')}</li>
            <li>{t('deposit_instruction_2')}</li>
            <li>{t('deposit_instruction_3')}</li>
            <li>{t('deposit_instruction_4')}</li>
            <li>{t('deposit_instruction_5')}</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DepositPage;
