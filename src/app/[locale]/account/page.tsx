'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import ProtectedRoute from '@/lib/components/ProtectedRoute';

import AccountService from '@/lib/services/AccountService';
import AuthService from '@/lib/services/AuthService';
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
