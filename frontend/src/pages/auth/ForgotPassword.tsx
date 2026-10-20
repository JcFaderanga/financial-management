import { FormEvent, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { LuEye, LuEyeOff } from 'react-icons/lu';
import CustomInput from '@/components/inputs/CustomInputs';
import SubmitButton from '@/components/button/SubmitButton';
import useDocumentTitle from '@/hooks/document/useDocTitle';
import supabase from '@/lib/supabase';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isRecovery, setIsRecovery] = useState(false);
  const [passwordUpdated, setPasswordUpdated] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useDocumentTitle('Itrack Money | Forgot Password');

    useEffect(() => {
        const handleRecovery = () => {
            setIsRecovery(true);
            setError('');
            setSuccess('');
        };

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((event) => {
            if (event === 'PASSWORD_RECOVERY') {
                handleRecovery();
            }
        });

        return () => {
            subscription.unsubscribe();
        };
    }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    if (isRecovery && password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsSubmitting(true);

    try {
      if (isRecovery) {
        const { error: updateError } = await supabase.auth.updateUser({ password });
        if (updateError) throw updateError;

        setPassword('');
        setConfirmPassword('');
        setPasswordUpdated(true);
        setSuccess('Your password has been updated. You can now sign in with your new password.');
      } else {
        const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/forgot-password`,
        });
        if (resetError) throw resetError;

        setSuccess('If an account exists for that email, a password reset link has been sent.');
      }
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Unable to process your request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-white px-4 py-10 text-dark dark:bg-dark dark:text-white">
      <section className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-semibold">{isRecovery ? 'Create a new password' : 'Forgot password?'}</h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
            {isRecovery ? 'Choose a new password for your account.' : 'Enter your email and we will send you a password reset link.'}
          </p>
        </div>

        {!passwordUpdated && <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          {!isRecovery ? (
            <div>
              <label className="block text-sm font-medium" htmlFor="forgot-email">Username</label>
              <CustomInput
                id="forgot-email"
                value={email}
                type="email"
                required
                autoComplete="email"
                placeholder="Enter your email address"
                className="my-1 rounded-lg border border-gray-300 bg-white dark:border-gray-600 dark:!bg-light-dark"
                onChange={setEmail}
              />
            </div>
          ) : (
            <>
              <div>
                <label className="block text-sm font-medium" htmlFor="forgot-password">Password</label>
                <div className="relative mt-1">
                  <CustomInput
                    id="forgot-password"
                    value={password}
                    type={showPassword ? 'text' : 'password'}
                    required
                    autoComplete="new-password"
                    placeholder="Enter your password"
                    className="my-0 rounded-lg border border-gray-300 bg-white pr-12 dark:border-gray-600 dark:!bg-light-dark"
                    onChange={setPassword}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-3 my-auto flex h-fit items-center text-gray-600 hover:text-dark dark:text-gray-300 dark:hover:text-white"
                    aria-label={showPassword ? 'Hide passwords' : 'Show passwords'}
                    aria-pressed={showPassword}
                    onClick={() => setShowPassword((visible) => !visible)}
                  >
                    {showPassword ? <LuEyeOff aria-hidden="true" /> : <LuEye aria-hidden="true" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium" htmlFor="forgot-confirm-password">Verify password</label>
                <CustomInput
                  id="forgot-confirm-password"
                  value={confirmPassword}
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="new-password"
                  placeholder="Re-enter your password"
                  className="my-1 rounded-lg border border-gray-300 bg-white dark:border-gray-600 dark:!bg-light-dark"
                  onChange={setConfirmPassword}
                />
              </div>
            </>
          )}

          {error && <p className="text-sm text-red-600 dark:text-red-400" role="alert">{error}</p>}
          {success && <p className="text-sm text-green-700 dark:text-green-400" role="status">{success}</p>}

          {!success || isRecovery ? (
            <SubmitButton
              title={isRecovery ? 'Update password' : 'Send reset link'}
              onClick={() => undefined}
              disabled={isSubmitting}
              spinner={isSubmitting}
              className="rounded-lg hover:bg-blue-600"
            />
          ) : null}
        </form>}

        {!passwordUpdated && (
          <Link className="mt-4 block text-center text-sm font-medium text-blue-600 hover:underline dark:text-blue-400" to="/login">
            Back to login
          </Link>
        )}

        {passwordUpdated && (
          <div className="flex flex-col gap-4 text-center">
            <p className="text-sm text-green-700 dark:text-green-400" role="status">{success}</p>
            <Link className="font-medium text-blue-600 hover:underline dark:text-blue-400" to="/login">
              Return to login
            </Link>
          </div>
        )}

        {success && !isRecovery && (
          <button
            type="button"
            className="mt-4 w-full text-center text-sm font-medium text-blue-600 hover:underline dark:text-blue-400"
            onClick={() => setSuccess('')}
          >
            Send another reset link
          </button>
        )}
      </section>
    </main>
  );
}