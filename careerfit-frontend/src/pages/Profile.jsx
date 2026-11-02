import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import { Button } from '../components/common/Button.jsx';
import { Alert } from '../components/common/Alert.jsx';
import { profileService } from '../services/profileService.js';
import { Camera, LogOut, Save, Trash2 } from 'lucide-react';

const MAX_AVATAR_SIZE_BYTES = 5 * 1024 * 1024;
const ALLOWED_AVATAR_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);

export function Profile() {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  const avatarInputRef = useRef(null);

  const [error, setError] = useState(null);
  const [notice, setNotice] = useState(null);
  const [name, setName] = useState(user?.name || '');
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isSavingAvatar, setIsSavingAvatar] = useState(false);

  const handleProfileSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setNotice(null);

    const cleanName = name.trim();
    if (!cleanName) {
      setError('Enter your name before saving.');
      return;
    }

    setIsSavingProfile(true);
    try {
      const result = await profileService.updateProfile({ name: cleanName });
      updateUser(result.user);
      setName(result.user.name);
      setNotice({
        type: 'success',
        message: 'Changes saved.',
      });
    } catch (err) {
      setError(err.message || 'Profile could not be updated.');
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleAvatarSelection = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setError(null);
    setNotice(null);

    if (!ALLOWED_AVATAR_TYPES.has(file.type)) {
      setError('Choose a JPEG, PNG, or WebP image.');
      event.target.value = '';
      return;
    }

    if (file.size > MAX_AVATAR_SIZE_BYTES) {
      setError('Profile pictures must be 5 MB or smaller.');
      event.target.value = '';
      return;
    }

    setIsSavingAvatar(true);
    try {
      const result = await profileService.uploadAvatar(file);
      updateUser(result.user);
      setNotice({
        type: result.warning ? 'warning' : 'success',
        message: result.warning || result.message || 'Profile picture updated.',
      });
    } catch (err) {
      setError(err.message || 'Profile picture upload failed.');
    } finally {
      setIsSavingAvatar(false);
      event.target.value = '';
    }
  };

  const handleRemoveAvatar = async () => {
    setError(null);
    setNotice(null);
    setIsSavingAvatar(true);

    try {
      const result = await profileService.removeAvatar();
      updateUser(result.user);
      setNotice({
        type: result.warning ? 'warning' : 'success',
        message: result.warning || result.message || 'Profile picture removed.',
      });
    } catch (err) {
      setError(err.message || 'Profile picture could not be removed.');
    } finally {
      setIsSavingAvatar(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (err) {
      setError(err.message || 'Logout failed.');
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="cf-page-title text-3xl sm:text-4xl text-slate-900">
          User Profile
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Update your profile details and profile picture.
        </p>
      </div>

      {error && (
        <Alert type="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      )}
      {notice && (
        <Alert type={notice.type} onClose={() => setNotice(null)}>
          {notice.message}
        </Alert>
      )}

      {/* Profile Overview Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 md:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-slate-100">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-indigo-100 text-indigo-700 font-bold text-xl flex items-center justify-center overflow-hidden border-2 border-indigo-200 shrink-0">
              {user?.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt={`Profile picture for ${user.name || 'user'}`}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <span>{user?.name ? user.name.charAt(0).toUpperCase() : 'U'}</span>
              )}
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">{user?.name || 'User'}</h2>
              <p className="text-xs text-slate-500">{user?.email}</p>
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            leftIcon={<LogOut className="w-3.5 h-3.5 text-rose-600" />}
            className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 border-rose-200"
          >
            Sign Out
          </Button>
        </div>

        <div className="flex flex-wrap items-center gap-2 border-b border-slate-100 pb-6 sm:pl-20">
          <input
            ref={avatarInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={handleAvatarSelection}
            aria-label="Choose profile picture"
          />
          <Button
            variant="outline"
            size="sm"
            disabled={isSavingAvatar}
            isLoading={isSavingAvatar}
            onClick={() => avatarInputRef.current?.click()}
            leftIcon={!isSavingAvatar && <Camera className="w-3.5 h-3.5" />}
          >
            {user?.avatarUrl ? 'Change photo' : 'Upload photo'}
          </Button>
          {user?.avatarUrl && (
            <Button
              variant="ghost"
              size="sm"
              disabled={isSavingAvatar}
              onClick={handleRemoveAvatar}
              leftIcon={<Trash2 className="w-3.5 h-3.5" />}
              className="text-rose-700 hover:text-rose-800 hover:bg-rose-50"
            >
              Remove
            </Button>
          )}
          <span className="text-xs text-slate-500">JPEG, PNG, or WebP · up to 5 MB</span>
        </div>

        <form onSubmit={handleProfileSubmit} className="space-y-4">
          <h3 className="text-sm font-bold text-slate-900">Account details</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Full name</span>
              <input
                type="text"
                name="name"
                autoComplete="name"
                maxLength={100}
                required
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
              />
            </label>
            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Email address</span>
              <input
                type="email"
                name="email"
                autoComplete="email"
                readOnly
                value={user?.email || ''}
                aria-describedby="email-readonly-note"
                className="mt-2 w-full cursor-not-allowed rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-600"
              />
              <span id="email-readonly-note" className="mt-1 block text-xs text-slate-500">
                Email address cannot be changed here.
              </span>
            </label>
          </div>
          <div className="flex justify-end pt-1">
            <Button
              type="submit"
              variant="primary"
              isLoading={isSavingProfile}
              disabled={isSavingAvatar}
              leftIcon={!isSavingProfile && <Save className="w-3.5 h-3.5" />}
            >
              Save changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
