'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import TwoFactorService from '@/lib/services/TwoFactorService';

interface TwoFactorManagementProps {
  onDisabled: () => void;
}

const TwoFactorManagement: React.FC<TwoFactorManagementProps> = ({ onDisabled }) => {
  const t = useTranslations();
  const [recoveryCodes, setRecoveryCodes] = useState<string[]>([]);
  const [showRecoveryCodes, setShowRecoveryCodes] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [showDisableConfirm, setShowDisableConfirm] = useState<boolean>(false);
  const [disableCode, setDisableCode] = useState<string>('');

  const handleViewRecoveryCodes = async () => {
    setIsLoading(true);
    setError('');

    try {
      const codes = await TwoFactorService.getRecoveryCodes();
      setRecoveryCodes(codes);
      setShowRecoveryCodes(true);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : t('account.twoFactor.error.fetchCodesFailed');
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegenerateRecoveryCodes = async () => {
    if (!window.confirm(t('account.twoFactor.manage.regenerateConfirm'))) {
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const codes = await TwoFactorService.regenerateRecoveryCodes();
      setRecoveryCodes(codes);
      setShowRecoveryCodes(true);
      setSuccess(t('account.twoFactor.manage.regenerateSuccess'));
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : t('account.twoFactor.error.regenerateFailed');
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleShowDisableConfirm = () => {
    setShowDisableConfirm(true);
    setDisableCode('');
    setError('');
  };

  const handleCancelDisable = () => {
    setShowDisableConfirm(false);
    setDisableCode('');
    setError('');
  };

  const handleDisable2FA = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!disableCode || disableCode.length !== 6) {
      setError(t('account.twoFactor.error.invalidCode'));
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await TwoFactorService.disableTwoFactor(disableCode);
      onDisabled();
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : t('account.twoFactor.error.disableFailed');
      setError(errorMessage);
      setIsLoading(false);
    }
  };

  const handleDownloadRecoveryCodes = () => {
    const text = recoveryCodes.join('\n');
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'recovery-codes.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopyRecoveryCodes = () => {
    navigator.clipboard.writeText(recoveryCodes.join('\n'));
    setSuccess(t('account.twoFactor.manage.copiedSuccess'));
  };

  return (
    <div className="p-4 rounded-[15px]" style={{ background: '#3a3646' }}>
      <h2 className="text-white text-2xl font-bold mb-4">
        {t('account.twoFactor.manage.title')}
      </h2>

      <div className="bg-green-500/10 border border-green-500 text-green-500 px-4 py-3 rounded mb-4">
        {t('account.twoFactor.manage.enabled')}
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-500/10 border border-green-500 text-green-500 px-4 py-3 rounded mb-4">
          {success}
        </div>
      )}

      <p className="text-white/70 mb-4">
        {t('account.twoFactor.manage.description')}
      </p>

      {/* Recovery Codes Section */}
      <div className="mb-4">
        <h3 className="text-white text-lg font-bold mb-3">
          {t('account.twoFactor.manage.recoveryCodes')}
        </h3>

        {!showRecoveryCodes ? (
          <button
            className="px-4 py-2 border border-pink-500 text-pink-500 rounded hover:bg-pink-500/10"
            onClick={handleViewRecoveryCodes}
            disabled={isLoading}
          >
            {isLoading
              ? t('account.twoFactor.manage.loading')
              : t('account.twoFactor.manage.viewCodes')
            }
          </button>
        ) : (
          <div>
            <div className="mb-3">
              <div className="p-3 bg-gray-700 border border-gray-600 rounded">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {recoveryCodes.map((code, index) => (
                    <code key={index} className="block text-white text-sm">
                      {code}
                    </code>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-2 mb-3">
              <button
                className="px-4 py-2 border border-pink-500 text-pink-500 rounded hover:bg-pink-500/10"
                onClick={handleDownloadRecoveryCodes}
              >
                {t('account.twoFactor.recovery.download')}
              </button>
              <button
                className="px-4 py-2 border border-pink-500 text-pink-500 rounded hover:bg-pink-500/10"
                onClick={handleCopyRecoveryCodes}
              >
                {t('account.twoFactor.recovery.copy')}
              </button>
              <button
                className="px-4 py-2 border border-pink-500 text-pink-500 rounded hover:bg-pink-500/10"
                onClick={() => setShowRecoveryCodes(false)}
              >
                {t('account.twoFactor.manage.hideCodes')}
              </button>
            </div>

            <button
              className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-500"
              onClick={handleRegenerateRecoveryCodes}
              disabled={isLoading}
            >
              {isLoading
                ? t('account.twoFactor.manage.regenerating')
                : t('account.twoFactor.manage.regenerate')
              }
            </button>
          </div>
        )}
      </div>

      {/* Disable 2FA */}
      <div className="pt-4 border-t border-gray-600">
        <h3 className="text-white text-lg font-bold mb-3">
          {t('account.twoFactor.manage.disableTitle')}
        </h3>
        <p className="text-white/70 mb-3">
          {t('account.twoFactor.manage.disableDescription')}
        </p>

        {!showDisableConfirm ? (
          <button
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-500"
            onClick={handleShowDisableConfirm}
            disabled={isLoading}
          >
            {t('account.twoFactor.manage.disable')}
          </button>
        ) : (
          <form onSubmit={handleDisable2FA} className="space-y-3">
            <div className="bg-yellow-500/10 border border-yellow-500 text-yellow-500 px-4 py-3 rounded">
              {t('account.twoFactor.manage.disableConfirm')}
            </div>

            <div>
              <label htmlFor="disableCode" className="block text-white mb-2">
                {t('account.twoFactor.confirmCode')}
              </label>
              <input
                type="text"
                id="disableCode"
                value={disableCode}
                onChange={(e) => setDisableCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded text-white focus:border-pink-500 focus:outline-none"
                placeholder="000000"
                maxLength={6}
                autoComplete="off"
                disabled={isLoading}
              />
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-500"
                disabled={isLoading || disableCode.length !== 6}
              >
                {isLoading
                  ? t('account.twoFactor.manage.disabling')
                  : t('account.twoFactor.manage.confirmDisable')
                }
              </button>
              <button
                type="button"
                className="px-4 py-2 border border-gray-500 text-gray-300 rounded hover:bg-gray-700"
                onClick={handleCancelDisable}
                disabled={isLoading}
              >
                {t('common.cancel')}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default TwoFactorManagement;
