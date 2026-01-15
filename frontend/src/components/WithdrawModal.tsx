import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { transactionApi } from '../services/api';
import type { WithdrawRequest } from '../types';
import Modal from './Modal';

interface WithdrawModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const WithdrawModal: React.FC<WithdrawModalProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [amount, setAmount] = useState<string>('');
  const [blockchainAddress, setBlockchainAddress] = useState<string>('');
  

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(e.target.value);
  };

  const handleBlockchainAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBlockchainAddress(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const withdrawAmount = parseFloat(amount);
      if (isNaN(withdrawAmount) || withdrawAmount <= 0) {
        throw new Error(t('invalid_amount') as string);
      }

      if (withdrawAmount > (user.balance || 0)) {
        throw new Error(t('insufficient_balance') as string);
      }

      if (!blockchainAddress.trim()) {
        throw new Error(t('invalid_address') as string);
      }

      const withdrawRequest: WithdrawRequest = {
        amount: withdrawAmount,
        blockchainAddress: blockchainAddress.trim()
      };

      await transactionApi.submitWithdraw(withdrawRequest);
      setSuccess(t('withdraw_request_submitted') as string);
      
      // Reset form
      setAmount('');
      setBlockchainAddress('');

      // Refresh user data
      if (user) {
        // Update balance optimistically (will be updated from server on next refresh)
        updateUser({
          ...user,
          balance: user.balance - withdrawAmount
        });
      }
    } catch (err: any) {
      console.error('Withdraw failed:', err);
      setError(err.response?.data?.message || err.message || t('withdraw_failed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t('withdraw')}>
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
            placeholder={t('enter_withdraw_amount')}
            step="0.1"
            min="0.1"
            max={user?.balance || 0}
            disabled={loading}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="address">{t('receiving_address')}</label>
          <input
            type="text"
            id="address"
            value={blockchainAddress}
            onChange={handleBlockchainAddressChange}
            placeholder={t('enter_endless_address')}
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
            {loading ? t('submitting') : t('submit_withdraw')}
          </button>
        </div>
      </form>

      <div className="transaction-info">
        <h3>{t('withdraw_instructions')}</h3>
        <ul>
            <li>{t('withdraw_instruction_1')}</li>
            <li>{t('withdraw_instruction_2')}</li>
            <li>{t('withdraw_instruction_3')}</li>
            <li>{t('withdraw_instruction_4')}</li>
            <li>{t('withdraw_instruction_5')}</li>
          </ul>
      </div>
    </Modal>
  );
};

export default WithdrawModal;