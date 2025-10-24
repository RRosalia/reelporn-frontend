'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import TwoFactorService from '@/lib/services/TwoFactorService';
import { ValidationException } from '@/lib/api/exceptions';

interface TwoFactorSetupProps {
  onSetupComplete: () => void;
  onCancel: () => void;
}

type SetupStep = 'initial' | 'scan' | 'confirm' | 'recovery';

const TwoFactorSetup: React.FC<TwoFactorSetupProps> = ({ onSetupComplete, onCancel }) => {
  const t = useTranslations();
  const [step, setStep] = useState<SetupStep>('initial');
  const [qrCode, setQrCode] = useState<string>('');
  const [secretKey, setSecretKey] = useState<string>('');
  const [verificationCode, setVerificationCode] = useState<string>('');
  const [recoveryCodes, setRecoveryCodes] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [showSecretKey, setShowSecretKey] = useState<boolean>(false);

  const handleEnable2FA = async () => {
    setIsLoading(true);
    setError('');

    try {
      // Enable 2FA and get QR code + secret in one call
      const { qrCode, secret } = await TwoFactorService.enableTwoFactor();

      setQrCode(qrCode);
      setSecretKey(secret);
      setStep('scan');
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : t('account.twoFactor.error.enableFailed');
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Confirm 2FA and get recovery codes in one call
      const codes = await TwoFactorService.confirmTwoFactor(verificationCode);
      setRecoveryCodes(codes);
      setStep('recovery');
    } catch (err: unknown) {
      if (err instanceof ValidationException) {
        setError(err.errors.code?.[0] || t('account.twoFactor.error.invalidCode'));
      } else {
        const errorMessage = err instanceof Error ? err.message : t('account.twoFactor.error.verifyFailed');
        setError(errorMessage);
      }
    } finally {
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
  };

  const renderInitialStep = () => (
    <div>
      <h4 className="text-white text-2xl font-bold mb-3">
        {t('account.twoFactor.setup.title')}
      </h4>
      <p className="text-white/70 mb-4">
        {t('account.twoFactor.setup.description')}
      </p>
      {error && (
        <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      <div className="flex gap-2">
        <button
          className="px-4 py-3 text-white font-bold rounded"
          style={{ background: '#c2338a' }}
          onClick={handleEnable2FA}
          disabled={isLoading}
        >
          {isLoading
            ? t('account.twoFactor.setup.enabling')
            : t('account.twoFactor.setup.enable')
          }
        </button>
        <button
          className="px-4 py-3 bg-gray-600 text-white font-bold rounded hover:bg-gray-500"
          onClick={onCancel}
        >
          {t('account.twoFactor.setup.cancel')}
        </button>
      </div>
    </div>
  );

  const renderScanStep = () => (
    <div>
      <h4 className="text-white text-2xl font-bold mb-3">
        {t('account.twoFactor.scan.title')}
      </h4>
      <p className="text-white/70 mb-3">
        {t('account.twoFactor.scan.instruction')}
      </p>

      <div className="mb-4 text-center">
        <div
          className="inline-block p-3 bg-white border border-gray-300 rounded"
          dangerouslySetInnerHTML={{ __html: qrCode }}
        />
      </div>

      <div className="mb-4">
        <button
          className="text-sm text-blue-400 hover:text-blue-300"
          onClick={() => setShowSecretKey(!showSecretKey)}
        >
          {showSecretKey
            ? t('account.twoFactor.scan.hideSecret')
            : t('account.twoFactor.scan.showSecret')
          }
        </button>
        {showSecretKey && (
          <div className="mt-2">
            <code className="block p-2 bg-gray-700 border border-gray-600 rounded text-white text-sm">
              {secretKey}
            </code>
          </div>
        )}
      </div>

      <p className="text-white/70 mb-3">
        {t('account.twoFactor.scan.enterCode')}
      </p>

      <form onSubmit={handleConfirm}>
        <div className="mb-3">
          <input
            type="text"
            className="w-full px-4 py-3 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-pink-500"
            placeholder="000000"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
            maxLength={6}
            pattern="\d{6}"
            required
          />
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="flex gap-2">
          <button
            type="submit"
            className="px-4 py-3 text-white font-bold rounded disabled:opacity-60"
            style={{ background: '#c2338a' }}
            disabled={isLoading || verificationCode.length !== 6}
          >
            {isLoading
              ? t('account.twoFactor.scan.verifying')
              : t('account.twoFactor.scan.verify')
            }
          </button>
          <button
            type="button"
            className="px-4 py-3 bg-gray-600 text-white font-bold rounded hover:bg-gray-500"
            onClick={onCancel}
          >
            {t('account.twoFactor.setup.cancel')}
          </button>
        </div>
      </form>
    </div>
  );

  const renderRecoveryStep = () => (
    <div>
      <h4 className="text-white text-2xl font-bold mb-3">
        {t('account.twoFactor.recovery.title')}
      </h4>
      <div className="bg-yellow-500/10 border border-yellow-500 text-yellow-500 px-4 py-3 rounded mb-4">
        <strong>{t('account.twoFactor.recovery.important')}:</strong>{' '}
        {t('account.twoFactor.recovery.warning')}
      </div>

      <div className="mb-4">
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
      </div>

      <button
        className="w-full px-4 py-3 bg-green-600 text-white font-bold rounded hover:bg-green-500"
        onClick={onSetupComplete}
      >
        {t('account.twoFactor.recovery.continue')}
      </button>
    </div>
  );

  return (
    <div className="p-4 rounded-[15px]" style={{ background: '#3a3646' }}>
      {step === 'initial' && renderInitialStep()}
      {step === 'scan' && renderScanStep()}
      {step === 'recovery' && renderRecoveryStep()}
    </div>
  );
};

export default TwoFactorSetup;
