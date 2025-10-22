'use client';

import React from 'react';
import { useTranslations } from 'next-intl';

interface LoginDialogProps {
    isOpen: boolean;
    onClose: () => void;
}

function LoginDialog({ isOpen, onClose }: LoginDialogProps) {
    const t = useTranslations();

    if (!isOpen) return null;

    const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div className="reveal-overlay" style={{ display: 'block' }} onClick={handleOverlayClick}>
            <div className="reveal" style={{ display: 'block' }} data-reveal="">
                <button className="close-button" onClick={onClose}>
                    <span aria-hidden="true">&times;</span>
                </button>

                <div className="login-form p-6">
                    <h4 className="text-center mb-6">{t('login.title')}</h4>
                    <form method="post">
                        <div className="input-group mb-4">
                            <span className="input-group-label px-3 py-2">
                                <i className="fa fa-user"></i>
                            </span>
                            <input
                                className="input-group-field px-3 py-2"
                                type="text"
                                placeholder={t('login.username')}
                            />
                        </div>
                        <div className="input-group mb-4">
                            <span className="input-group-label px-3 py-2">
                                <i className="fa fa-lock"></i>
                            </span>
                            <input
                                className="input-group-field px-3 py-2"
                                type="password"
                                placeholder={t('login.password')}
                            />
                        </div>
                        <div className="checkbox mb-4">
                            <input id="remember" type="checkbox" name="remember" value="remember" />
                            <label className="customLabel ml-2" htmlFor="remember">
                                {t('login.rememberMe')}
                            </label>
                        </div>
                        <input
                            type="submit"
                            name="submit"
                            value={t('login.submit')}
                            className="w-full px-4 py-2 mb-4"
                        />
                    </form>
                    <p className="text-center mt-4">
                        {t('login.noAccount')}{' '}
                        <a className="newaccount" href="/signup">
                            {t('login.createAccount')}
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default LoginDialog;
