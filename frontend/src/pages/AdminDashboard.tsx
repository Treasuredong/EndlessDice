import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { adminApi } from '../services/api';

interface DepositRequest {
  _id: string;
  userId: string;
  username: string;
  type: 'deposit' | 'withdraw';
  amount: number;
  blockchainAddress: string;
  txHash: string;
  status: 'pending' | 'completed' | 'rejected';
  createdAt: string;
  updatedAt: string;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

const AdminDashboard: React.FC = () => {
  const { t } = useTranslation();
  const [deposits, setDeposits] = useState<DepositRequest[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 1
  });
  const [processingDeposit, setProcessingDeposit] = useState<string | null>(null);
  const [depositData, setDepositData] = useState<{
    [key: string]: {
      rejectionReason: string;
      adminAmount: string;
    }
  }>({});

  // Fetch pending deposits
  const fetchPendingDeposits = async (page: number = 1, limit: number = 20) => {
    try {
      setLoading(true);
      setError(null);
      const data = await adminApi.getPendingDeposits(page, limit);
      setDeposits(data.deposits);
      setPagination(data.pagination);
    } catch (err) {
      setError(t('failed_to_load_deposits') as string);
      console.error('Failed to fetch pending deposits:', err);
    } finally {
      setLoading(false);
    }
  };

  // Get deposit data for specific transaction
  const getDepositData = (transactionId: string) => {
    return depositData[transactionId] || { rejectionReason: '', adminAmount: '' };
  };

  // Update deposit data for specific transaction
  const updateDepositData = (transactionId: string, updates: Partial<{ rejectionReason: string; adminAmount: string }>) => {
    setDepositData(prev => ({
      ...prev,
      [transactionId]: {
        ...getDepositData(transactionId),
        ...updates
      }
    }));
  };

  // Process deposit
  const handleProcessDeposit = async (transactionId: string, action: 'confirm' | 'reject') => {
    try {
      setProcessingDeposit(transactionId);
      setError(null);
      setSuccess(null);

      const { rejectionReason, adminAmount } = getDepositData(transactionId);

      await adminApi.processDeposit(
        transactionId, 
        action, 
        action === 'reject' ? rejectionReason : undefined,
        // txHash is no longer needed as it's already in the deposit data
        undefined,
        action === 'confirm' ? parseFloat(adminAmount) : undefined
      );

      setSuccess(t('deposit_processed_successfully') as string);
      fetchPendingDeposits(pagination.page, pagination.limit);
      
      // Reset form for this transaction
      updateDepositData(transactionId, { rejectionReason: '', adminAmount: '' });
    } catch (err) {
      setError(t('failed_to_process_deposit') as string);
      console.error('Failed to process deposit:', err);
    } finally {
      setProcessingDeposit(null);
    }
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    fetchPendingDeposits(page, pagination.limit);
  };

  // Initial fetch
  useEffect(() => {
    fetchPendingDeposits();
  }, []);

  return (
    <div className="admin-dashboard">
      <h1>{t('admin_dashboard')}</h1>
      <h2>{t('pending_deposit_requests')}</h2>

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

      {loading ? (
        <div className="loading">{t('loading')}</div>
      ) : (
        <div className="admin-container">
          <table className="deposit-table">
            <thead>
              <tr>
                <th>{t('transaction_id')}</th>
                <th>{t('username')}</th>
                <th>{t('amount')}</th>
                <th>{t('transaction_hash')}</th>
                <th>{t('created_at')}</th>
                <th>{t('status')}</th>
                <th>{t('actions')}</th>
              </tr>
            </thead>
            <tbody>
              {deposits.map((deposit) => (
                <tr key={deposit._id}>
                  <td>{deposit._id}</td>
                  <td>{deposit.username}</td>
                  <td>{deposit.amount} EDS</td>
                  <td>{deposit.txHash}</td>
                  <td>{new Date(deposit.createdAt).toLocaleString()}</td>
                  <td>
                    <span className={`status ${deposit.status}`}>
                      {t(deposit.status)}
                    </span>
                  </td>
                  <td>
                    {deposit.status === 'pending' && (
                      <div className="action-buttons">
                        <div className="form-group">
                          <input
                            type="number"
                            placeholder={t('enter_amount')}
                            value={getDepositData(deposit._id).adminAmount}
                            onChange={(e) => updateDepositData(deposit._id, { adminAmount: e.target.value })}
                            className="amount-input"
                            step="0.1"
                            min="0.1"
                          />
                        </div>
                        <button
                          onClick={() => handleProcessDeposit(deposit._id, 'confirm')}
                          className="btn confirm-btn"
                          disabled={processingDeposit === deposit._id || !getDepositData(deposit._id).adminAmount}
                        >
                          {t('confirm')}
                        </button>
                        <div className="form-group">
                          <input
                            type="text"
                            placeholder={t('rejection_reason')}
                            value={getDepositData(deposit._id).rejectionReason}
                            onChange={(e) => updateDepositData(deposit._id, { rejectionReason: e.target.value })}
                            className="reason-input"
                          />
                        </div>
                        <button
                          onClick={() => handleProcessDeposit(deposit._id, 'reject')}
                          className="btn reject-btn"
                          disabled={processingDeposit === deposit._id || !getDepositData(deposit._id).rejectionReason}
                        >
                          {t('reject')}
                        </button>
                      </div>
                    )}
                    {deposit.status !== 'pending' && (
                      <span className="processed">{t('processed')}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="pagination">
            <button
              onClick={() => handlePageChange(Math.max(1, pagination.page - 1))}
              disabled={pagination.page === 1}
            >
              {t('previous')}
            </button>
            <span>
              {t('page')} {pagination.page} {t('of')} {pagination.totalPages}
            </span>
            <button
              onClick={() => handlePageChange(Math.min(pagination.totalPages, pagination.page + 1))}
              disabled={pagination.page === pagination.totalPages}
            >
              {t('next')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
