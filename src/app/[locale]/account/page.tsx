'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import ProtectedRoute from '@/lib/components/ProtectedRoute';

import AccountService from '@/lib/services/AccountService';
import AuthService from '@/lib/services/AuthService';
import TwoFactorService from '@/lib/services/TwoFactorService';
import {
    ValidationException,
    ApiException,
    NetworkException,
} from '@/lib/api/exceptions';

interface Profile {
    id: number;
    email: string;
    name: string | null;
    nickname: string | null;
    created_at: string;
    updated_at: string;
    email_verified_at: string | null;
}

function AccountPageContent() {
    const t = useTranslations();
    const params = useParams();
    const locale = (params?.locale as string) || 'en';

    // Profile state
    const [profile, setProfile] = useState<Profile | null>(null);
    const [isLoadingProfile, setIsLoadingProfile] = useState(true);

    // Edit profile state
    const [name, setName] = useState('');
    const [nickname, setNickname] = useState('');
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [profileError, setProfileError] = useState('');
    const [profileSuccess, setProfileSuccess] = useState('');

    // Change password state
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [passwordError, setPasswordError] = useState('');
    const [passwordSuccess, setPasswordSuccess] = useState('');

    // Two-factor authentication state
    const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
    const [isEnabling2FA, setIsEnabling2FA] = useState(false);
    const [qrCode, setQrCode] = useState('');
    const [secretKey, setSecretKey] = useState('');
    const [confirmationCode, setConfirmationCode] = useState('');
    const [isConfirming2FA, setIsConfirming2FA] = useState(false);
    const [recoveryCodes, setRecoveryCodes] = useState<string[]>([]);
    const [showRecoveryCodes, setShowRecoveryCodes] = useState(false);
    const [twoFactorError, setTwoFactorError] = useState('');
    const [twoFactorSuccess, setTwoFactorSuccess] = useState('');
    const [showDisableModal, setShowDisableModal] = useState(false);
    const [disableCode, setDisableCode] = useState('');
    const [isDisabling2FA, setIsDisabling2FA] = useState(false);

    // Load profile on mount
    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        try {
            setIsLoadingProfile(true);
            const data = await AccountService.getProfile();
            setProfile(data);
            setName(data.name || '');
            setNickname(data.nickname || '');
        } catch (error) {
            console.error('Failed to load profile:', error);
        } finally {
            setIsLoadingProfile(false);
        }
    };

    const handleProfileSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setProfileError('');
        setProfileSuccess('');
        setIsEditingProfile(true);

        try {
            const updatedProfile = await AccountService.updateProfile({
                name,
                nickname,
            });

            setProfile(updatedProfile);
            setProfileSuccess(t('account.profile.updateSuccess'));
        } catch (err) {
            if (err instanceof ValidationException) {
                // Handle nickname already taken
                if (err.errors.nickname) {
                    setProfileError(err.errors.nickname[0]);
                } else {
                    const firstError = Object.values(err.errors)[0]?.[0];
                    setProfileError(firstError || t('account.error.validationFailed'));
                }
            } else if (err instanceof ApiException) {
                // Handle nickname frequency change error
                if (err.response?.data?.reason === 'nickname_frequency_change') {
                    setProfileError(err.message);
                } else {
                    setProfileError(t('account.error.generic'));
                }
            } else if (err instanceof NetworkException) {
                setProfileError(t('account.error.network'));
            } else {
                setProfileError(t('account.error.generic'));
            }
        } finally {
            setIsEditingProfile(false);
        }
    };

    const handlePasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setPasswordError('');
        setPasswordSuccess('');

        // Client-side validation
        if (newPassword !== confirmPassword) {
            setPasswordError(t('account.password.mismatch'));
            return;
        }

        setIsChangingPassword(true);

        try {
            await AccountService.updatePassword(currentPassword, newPassword, confirmPassword);

            setPasswordSuccess(t('account.password.updateSuccess'));

            // Clear password fields
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (err) {
            if (err instanceof ValidationException) {
                // Handle wrong current password
                if (err.errors.current_password) {
                    setPasswordError(err.errors.current_password[0]);
                } else {
                    const firstError = Object.values(err.errors)[0]?.[0];
                    setPasswordError(firstError || t('account.error.validationFailed'));
                }
            } else if (err instanceof NetworkException) {
                setPasswordError(t('account.error.network'));
            } else {
                setPasswordError(t('account.error.generic'));
            }
        } finally {
            setIsChangingPassword(false);
        }
    };

    const handleEnable2FA = async () => {
        setTwoFactorError('');
        setTwoFactorSuccess('');
        setIsEnabling2FA(true);

        try {
            await TwoFactorService.enableTwoFactor();

            // Get QR code and secret key
            const [qr, secret] = await Promise.all([
                TwoFactorService.getQRCode(),
                TwoFactorService.getSecretKey(),
            ]);

            setQrCode(qr);
            setSecretKey(secret);
        } catch (err) {
            if (err instanceof NetworkException) {
                setTwoFactorError(t('account.error.network'));
            } else {
                setTwoFactorError(t('account.error.generic'));
            }
        } finally {
            setIsEnabling2FA(false);
        }
    };

    const handleConfirm2FA = async (e: React.FormEvent) => {
        e.preventDefault();
        setTwoFactorError('');
        setTwoFactorSuccess('');
        setIsConfirming2FA(true);

        try {
            await TwoFactorService.confirmTwoFactor(confirmationCode);

            // Get recovery codes
            const codes = await TwoFactorService.getRecoveryCodes();
            setRecoveryCodes(codes);
            setShowRecoveryCodes(true);
            setTwoFactorEnabled(true);
            setTwoFactorSuccess(t('account.twoFactor.enableSuccess'));

            // Clear the setup state
            setQrCode('');
            setSecretKey('');
            setConfirmationCode('');
        } catch (err) {
            if (err instanceof ValidationException) {
                setTwoFactorError(err.errors.code?.[0] || t('account.error.validationFailed'));
            } else if (err instanceof NetworkException) {
                setTwoFactorError(t('account.error.network'));
            } else {
                setTwoFactorError(t('account.error.generic'));
            }
        } finally {
            setIsConfirming2FA(false);
        }
    };

    const handleDisable2FA = async (e: React.FormEvent) => {
        e.preventDefault();
        setTwoFactorError('');
        setTwoFactorSuccess('');
        setIsDisabling2FA(true);

        try {
            await TwoFactorService.disableTwoFactor(disableCode);
            setTwoFactorEnabled(false);
            setRecoveryCodes([]);
            setShowRecoveryCodes(false);
            setShowDisableModal(false);
            setDisableCode('');
            setTwoFactorSuccess(t('account.twoFactor.disableSuccess'));
        } catch (err) {
            if (err instanceof ValidationException) {
                setTwoFactorError(err.errors.code?.[0] || t('account.error.validationFailed'));
            } else if (err instanceof NetworkException) {
                setTwoFactorError(t('account.error.network'));
            } else {
                setTwoFactorError(t('account.error.generic'));
            }
        } finally {
            setIsDisabling2FA(false);
        }
    };

    const handleShowRecoveryCodes = async () => {
        setTwoFactorError('');

        try {
            const codes = await TwoFactorService.getRecoveryCodes();
            setRecoveryCodes(codes);
            setShowRecoveryCodes(true);
        } catch (err) {
            if (err instanceof NetworkException) {
                setTwoFactorError(t('account.error.network'));
            } else {
                setTwoFactorError(t('account.error.generic'));
            }
        }
    };

    const handleRegenerateRecoveryCodes = async () => {
        if (!window.confirm(t('account.twoFactor.regenerateConfirm'))) {
            return;
        }

        setTwoFactorError('');
        setTwoFactorSuccess('');

        try {
            const codes = await TwoFactorService.regenerateRecoveryCodes();
            setRecoveryCodes(codes);
            setShowRecoveryCodes(true);
            setTwoFactorSuccess(t('account.twoFactor.regenerateSuccess'));
        } catch (err) {
            if (err instanceof NetworkException) {
                setTwoFactorError(t('account.error.network'));
            } else {
                setTwoFactorError(t('account.error.generic'));
            }
        }
    };

    const handleLogout = async () => {
        if (window.confirm(t('account.logout.confirm'))) {
            await AuthService.logout();
        }
    };

    if (isLoadingProfile) {
        return (
            <div className="py-10" style={{ background: '#2b2838' }}>
                <div className="container mx-auto px-4">
                    <div className="text-center text-white">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white inline-block" role="status">
                            <span className="sr-only">Loading...</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="py-10" style={{ background: '#2b2838' }}>
            <div className="container mx-auto px-4">
                <div className="flex flex-wrap">
                    <div className="w-full lg:w-8/12 mx-auto">
                        <h1 className="text-white mb-4" style={{ fontSize: '36px', fontWeight: 'bold' }}>
                            {t('account.title')}
                        </h1>

                        {/* Profile Information Card */}
                        <div className="mb-4 p-4 rounded-[15px]" style={{ background: '#3a3646' }}>
                            <h2 className="text-white mb-4 text-2xl">
                                {t('account.profile.title')}
                            </h2>

                            {profileSuccess && (
                                <div className="bg-green-500/10 border border-green-500 text-green-500 px-4 py-3 rounded mb-3" role="alert">
                                    {profileSuccess}
                                </div>
                            )}

                            {profileError && (
                                <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded mb-3" role="alert">
                                    {profileError}
                                </div>
                            )}

                            <form onSubmit={handleProfileSubmit}>
                                {/* Name */}
                                <div className="mb-3">
                                    <label className="text-white mb-2 block">
                                        {t('account.profile.name')}
                                    </label>
                                    <input
                                        type="text"
                                        className="w-full px-3 py-3 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-pink-500"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                        disabled={isEditingProfile}
                                    />
                                </div>

                                {/* Nickname */}
                                <div className="mb-3">
                                    <label className="text-white mb-2 block">
                                        {t('account.profile.nickname')}
                                    </label>
                                    <input
                                        type="text"
                                        className="w-full px-3 py-3 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-pink-500"
                                        value={nickname}
                                        onChange={(e) => setNickname(e.target.value)}
                                        required
                                        disabled={isEditingProfile}
                                    />
                                    <small className="text-white/50 block mt-1">
                                        {t('account.profile.nicknameHint')}
                                    </small>
                                </div>

                                {/* Email (read-only) */}
                                <div className="mb-3">
                                    <label className="text-white mb-2 block">
                                        {t('account.profile.email')}
                                    </label>
                                    <input
                                        type="email"
                                        className="w-full px-3 py-3 rounded text-white border border-gray-600"
                                        style={{ backgroundColor: '#2b2838' }}
                                        value={profile?.email || ''}
                                        disabled
                                    />
                                </div>

                                {/* Verification Status */}
                                {profile?.email_verified_at && (
                                    <div className="mb-3">
                                        <span className="inline-block px-3 py-1 bg-green-600 text-white rounded">
                                            {t('account.profile.emailVerified')}
                                        </span>
                                    </div>
                                )}

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    className="w-full py-3 text-white text-base font-bold rounded border-none disabled:opacity-60"
                                    disabled={isEditingProfile}
                                    style={{ background: '#c2338a' }}
                                >
                                    {isEditingProfile
                                        ? t('account.profile.updating')
                                        : t('account.profile.update')
                                    }
                                </button>
                            </form>
                        </div>

                        {/* Change Password Card */}
                        <div className="mb-4 p-4 rounded-[15px]" style={{ background: '#3a3646' }}>
                            <h2 className="text-white mb-4 text-2xl">
                                {t('account.password.title')}
                            </h2>

                            {passwordSuccess && (
                                <div className="bg-green-500/10 border border-green-500 text-green-500 px-4 py-3 rounded mb-3" role="alert">
                                    {passwordSuccess}
                                </div>
                            )}

                            {passwordError && (
                                <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded mb-3" role="alert">
                                    {passwordError}
                                </div>
                            )}

                            <form onSubmit={handlePasswordSubmit}>
                                {/* Current Password */}
                                <div className="mb-3">
                                    <label className="text-white mb-2 block">
                                        {t('account.password.current')}
                                    </label>
                                    <input
                                        type="password"
                                        className="w-full px-3 py-3 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-pink-500"
                                        value={currentPassword}
                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                        required
                                        disabled={isChangingPassword}
                                        autoComplete="current-password"
                                    />
                                </div>

                                {/* New Password */}
                                <div className="mb-3">
                                    <label className="text-white mb-2 block">
                                        {t('account.password.new')}
                                    </label>
                                    <input
                                        type="password"
                                        className="w-full px-3 py-3 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-pink-500"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        required
                                        minLength={8}
                                        disabled={isChangingPassword}
                                        autoComplete="new-password"
                                    />
                                </div>

                                {/* Confirm Password */}
                                <div className="mb-3">
                                    <label className="text-white mb-2 block">
                                        {t('account.password.confirm')}
                                    </label>
                                    <input
                                        type="password"
                                        className="w-full px-3 py-3 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-pink-500"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                        minLength={8}
                                        disabled={isChangingPassword}
                                        autoComplete="new-password"
                                    />
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    className="w-full py-3 text-white text-base font-bold rounded border-none disabled:opacity-60"
                                    disabled={isChangingPassword}
                                    style={{ background: '#c2338a' }}
                                >
                                    {isChangingPassword
                                        ? t('account.password.updating')
                                        : t('account.password.update')
                                    }
                                </button>
                            </form>
                        </div>

                        {/* Two-Factor Authentication Card */}
                        <div className="mb-4 p-4 rounded-[15px]" style={{ background: '#3a3646' }}>
                            <h2 className="text-white mb-4 text-2xl">
                                {t('account.twoFactor.title')}
                            </h2>

                            {twoFactorSuccess && (
                                <div className="bg-green-500/10 border border-green-500 text-green-500 px-4 py-3 rounded mb-3" role="alert">
                                    {twoFactorSuccess}
                                </div>
                            )}

                            {twoFactorError && (
                                <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded mb-3" role="alert">
                                    {twoFactorError}
                                </div>
                            )}

                            {!twoFactorEnabled && !qrCode && (
                                <div>
                                    <p className="text-white/50 mb-4">
                                        {t('account.twoFactor.description')}
                                    </p>
                                    <button
                                        onClick={handleEnable2FA}
                                        disabled={isEnabling2FA}
                                        className="px-6 py-3 text-white text-base font-bold rounded border-none disabled:opacity-60"
                                        style={{ background: '#c2338a' }}
                                    >
                                        {isEnabling2FA
                                            ? t('account.twoFactor.enabling')
                                            : t('account.twoFactor.enable')
                                        }
                                    </button>
                                </div>
                            )}

                            {qrCode && (
                                <div>
                                    <p className="text-white mb-3">
                                        {t('account.twoFactor.scanQR')}
                                    </p>
                                    <div
                                        className="bg-white p-4 rounded inline-block mb-4"
                                        dangerouslySetInnerHTML={{ __html: qrCode }}
                                    />
                                    <div className="mb-4">
                                        <label className="text-white mb-2 block">
                                            {t('account.twoFactor.secretKey')}
                                        </label>
                                        <input
                                            type="text"
                                            className="w-full px-3 py-3 rounded text-white border border-gray-600"
                                            style={{ backgroundColor: '#2b2838' }}
                                            value={secretKey}
                                            readOnly
                                        />
                                    </div>
                                    <form onSubmit={handleConfirm2FA}>
                                        <div className="mb-3">
                                            <label className="text-white mb-2 block">
                                                {t('account.twoFactor.confirmCode')}
                                            </label>
                                            <input
                                                type="text"
                                                className="w-full px-3 py-3 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-pink-500"
                                                value={confirmationCode}
                                                onChange={(e) => setConfirmationCode(e.target.value)}
                                                required
                                                maxLength={6}
                                                pattern="[0-9]{6}"
                                                disabled={isConfirming2FA}
                                                placeholder="123456"
                                            />
                                        </div>
                                        <button
                                            type="submit"
                                            className="w-full py-3 text-white text-base font-bold rounded border-none disabled:opacity-60"
                                            disabled={isConfirming2FA}
                                            style={{ background: '#c2338a' }}
                                        >
                                            {isConfirming2FA
                                                ? t('account.twoFactor.confirming')
                                                : t('account.twoFactor.confirm')
                                            }
                                        </button>
                                    </form>
                                </div>
                            )}

                            {twoFactorEnabled && (
                                <div>
                                    <div className="mb-4">
                                        <span className="inline-block px-3 py-1 bg-green-600 text-white rounded">
                                            {t('account.twoFactor.enabled')}
                                        </span>
                                    </div>

                                    {showRecoveryCodes && recoveryCodes.length > 0 && (
                                        <div className="mb-4 p-4 rounded bg-gray-700/50">
                                            <h3 className="text-white mb-2 font-bold">
                                                {t('account.twoFactor.recoveryCodes')}
                                            </h3>
                                            <p className="text-white/50 mb-3 text-sm">
                                                {t('account.twoFactor.recoveryCodesDescription')}
                                            </p>
                                            <div className="grid grid-cols-2 gap-2 mb-3">
                                                {recoveryCodes.map((code, index) => (
                                                    <div
                                                        key={index}
                                                        className="px-3 py-2 bg-gray-800 text-white rounded font-mono text-sm"
                                                    >
                                                        {code}
                                                    </div>
                                                ))}
                                            </div>
                                            <button
                                                onClick={() => setShowRecoveryCodes(false)}
                                                className="text-white/50 hover:text-white text-sm"
                                            >
                                                {t('account.twoFactor.hideRecoveryCodes')}
                                            </button>
                                        </div>
                                    )}

                                    <div className="flex flex-wrap gap-3">
                                        {!showRecoveryCodes && (
                                            <button
                                                onClick={handleShowRecoveryCodes}
                                                className="px-6 py-3 border-2 border-white text-white rounded hover:bg-white hover:text-gray-900 transition-colors"
                                            >
                                                {t('account.twoFactor.showRecoveryCodes')}
                                            </button>
                                        )}
                                        <button
                                            onClick={handleRegenerateRecoveryCodes}
                                            className="px-6 py-3 border-2 border-yellow-600 text-yellow-600 rounded hover:bg-yellow-600 hover:text-white transition-colors"
                                        >
                                            {t('account.twoFactor.regenerateRecoveryCodes')}
                                        </button>
                                        <button
                                            onClick={() => setShowDisableModal(true)}
                                            className="px-6 py-3 border-2 border-red-600 text-red-600 rounded hover:bg-red-600 hover:text-white transition-colors"
                                        >
                                            {t('account.twoFactor.disable')}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Logout Card */}
                        <div className="mb-4 p-4 rounded-[15px]" style={{ background: '#3a3646' }}>
                            <h2 className="text-white mb-3 text-2xl">
                                {t('account.logout.title')}
                            </h2>
                            <p className="text-white/50 mb-3">
                                {t('account.logout.description')}
                            </p>
                            <button
                                onClick={handleLogout}
                                className="px-6 py-3 border-2 border-red-600 text-red-600 rounded hover:bg-red-600 hover:text-white transition-colors"
                            >
                                {t('account.logout.button')}
                            </button>
                        </div>

                        {/* Account Info */}
                        {profile && (
                            <div className="mb-4 p-4 rounded-[15px]" style={{ background: '#3a3646' }}>
                                <h2 className="text-white mb-3 text-2xl">
                                    {t('account.info.title')}
                                </h2>
                                <div className="text-white/50">
                                    <p className="mb-2">
                                        <strong>{t('account.info.memberId')}:</strong>{' '}
                                        {profile.id}
                                    </p>
                                    <p className="mb-2">
                                        <strong>{t('account.info.memberSince')}:</strong>{' '}
                                        {new Date(profile.created_at).toLocaleDateString()}
                                    </p>
                                    <p className="mb-0">
                                        <strong>{t('account.info.lastUpdated')}:</strong>{' '}
                                        {new Date(profile.updated_at).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Disable 2FA Modal */}
                {showDisableModal && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <div className="w-full max-w-md p-6 rounded-[15px]" style={{ background: '#3a3646' }}>
                            <h3 className="text-white text-2xl mb-4">
                                {t('account.twoFactor.disableTitle')}
                            </h3>
                            <p className="text-white/70 mb-4">
                                {t('account.twoFactor.disableConfirm')}
                            </p>
                            <form onSubmit={handleDisable2FA}>
                                <div className="mb-4">
                                    <label className="text-white mb-2 block">
                                        {t('account.twoFactor.confirmCode')}
                                    </label>
                                    <input
                                        type="text"
                                        className="w-full px-3 py-3 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-pink-500"
                                        value={disableCode}
                                        onChange={(e) => setDisableCode(e.target.value)}
                                        required
                                        maxLength={6}
                                        pattern="[0-9]{6}"
                                        disabled={isDisabling2FA}
                                        placeholder="123456"
                                        autoFocus
                                    />
                                </div>
                                <div className="flex gap-3">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowDisableModal(false);
                                            setDisableCode('');
                                            setTwoFactorError('');
                                        }}
                                        disabled={isDisabling2FA}
                                        className="flex-1 px-6 py-3 border-2 border-white text-white rounded hover:bg-white hover:text-gray-900 transition-colors disabled:opacity-60"
                                    >
                                        {t('account.twoFactor.cancel')}
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isDisabling2FA}
                                        className="flex-1 px-6 py-3 text-white rounded border-none disabled:opacity-60"
                                        style={{ background: '#c2338a' }}
                                    >
                                        {isDisabling2FA
                                            ? t('account.twoFactor.disabling')
                                            : t('account.twoFactor.disable')
                                        }
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

function AccountPage() {
    return (
        <ProtectedRoute>
            <AccountPageContent />
        </ProtectedRoute>
    );
}

export default AccountPage;
