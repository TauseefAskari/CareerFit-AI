import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import { Input } from '../components/common/Input.jsx';
import { Button } from '../components/common/Button.jsx';
import { Alert } from '../components/common/Alert.jsx';
import { BrandMark } from '../components/common/BrandMark.jsx';
import { Mail, Lock, User as UserIcon, ArrowRight } from 'lucide-react';
import { validateEmail, validatePassword, validateName } from '../utils/validators.js';
import { scrollToHomeHeroIfCurrentPage } from '../utils/navigation.js';

/**
 * Authentication: Register Page
 */
export function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    const nameVal = validateName(name);
    const emailVal = validateEmail(email);
    const passVal = validatePassword(password);

    const newErrors = {};
    if (!nameVal.isValid) newErrors.name = nameVal.error;
    if (!emailVal.isValid) newErrors.email = emailVal.error;
    if (!passVal.isValid) newErrors.password = passVal.error;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      await register(name.trim(), email.trim(), password);
      navigate('/dashboard/analyze');
    } catch (err) {
      setErrors({
        general: err.message || 'Registration failed. Please verify your inputs and try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="cf-auth-page min-h-[calc(100vh-120px)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Card Header */}
        <div className="text-center mb-8 space-y-2">
          <Link
            to="/#home-hero"
            onClick={scrollToHomeHeroIfCurrentPage}
            className="inline-flex items-center gap-2 text-xl font-bold text-slate-900"
          >
            <BrandMark className="h-9 w-9" />
            <span>CareerFit AI</span>
          </Link>
          <h1 className="cf-page-title text-3xl tracking-tight text-slate-900">Create your account</h1>
          <p className="text-sm text-slate-500">
            Save resume analyses and revisit them as you prepare for a role.
          </p>
        </div>

        {/* Card Container */}
        <div className="cf-auth-form rounded-2xl p-6 sm:p-8 space-y-6">
          {errors.general && (
            <Alert type="error" onClose={() => setErrors((prev) => ({ ...prev, general: undefined }))}>
              {errors.general}
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <Input
              label="Full Name"
              type="text"
              id="register-name"
              placeholder="Alex Rivera"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
              }}
              error={errors.name}
              leftIcon={<UserIcon className="w-4 h-4" />}
              autoComplete="name"
              required
            />

            <Input
              label="Email Address"
              type="email"
              id="register-email"
              placeholder="you@company.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
              }}
              error={errors.email}
              leftIcon={<Mail className="w-4 h-4" />}
              autoComplete="email"
              required
            />

            <Input
              label="Password"
              type="password"
              id="register-password"
              placeholder="Minimum 6 characters"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
              }}
              error={errors.password}
              helperText="Must contain at least 6 characters."
              leftIcon={<Lock className="w-4 h-4" />}
              autoComplete="new-password"
              required
            />

            <Button
              type="submit"
              variant="primary"
              size="md"
              className="w-full mt-2"
              isLoading={isSubmitting}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Create Account
            </Button>
          </form>

          <div className="pt-2 text-center text-xs text-slate-500">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-indigo-600 hover:text-indigo-700 hover:underline">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
