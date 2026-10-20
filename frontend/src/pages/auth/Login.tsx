import { FormEvent, useState } from 'react';
import { Link } from 'react-router-dom';
import CustomInput from '@/components/inputs/CustomInputs';
import SubmitButton from '@/components/button/SubmitButton';
import { signInDemo, signInWithCredentials, signInWithGoogle } from '@/utils/authService';
import useDocumentTitle from '@/hooks/document/useDocTitle';
import { FcGoogle } from 'react-icons/fc';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useDocumentTitle('Itrack Money | Login');

  const handleLogin = async () => {
    setError('');
    setIsSubmitting(true);

    try {
      await signInWithCredentials(email, password);
      window.location.href = '/';
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : 'Unable to sign in. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void handleLogin();
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-white px-4 py-10 text-dark dark:bg-dark dark:text-white">
      <section className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-semibold">Welcome back</h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">Sign in to your account</p>
        </div>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div>
           
            <CustomInput
              id="login-email"
              value={email}
              type="email"
              required
              placeholder="Enter your email address"
              className="my-1 rounded-lg border border-gray-300 bg-white dark:border-gray-600 dark:!bg-light-dark"
              onChange={setEmail}
            />
          </div>

          <div>
            <div className="relative mt-1">
              <CustomInput
                id="login-password"
                value={password}
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="Enter your password"
                className="my-0 rounded-lg border border-gray-300 bg-white pr-20 dark:border-gray-600 dark:!bg-light-dark"
                onChange={setPassword}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-3 my-auto h-fit text-sm font-medium text-gray-600 hover:text-dark dark:text-gray-300 dark:hover:text-white"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                aria-pressed={showPassword}
                onClick={() => setShowPassword((visible) => !visible)}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
            <div className="mt-2 text-right">
              <Link
                to="/forgot-password"
                className="text-sm text-blue-600 hover:underline dark:text-blue-400"
              >
                Forgot password?
              </Link>
            </div>
          </div>

          {error && <p className="text-sm text-red-600 dark:text-red-400" role="alert">{error}</p>}

          <SubmitButton
            title="Sign in"
            onClick={() => undefined}
            disabled={isSubmitting}
            spinner={isSubmitting}
            className="rounded-lg hover:bg-blue-600"
          />
        </form>

        <div className="my-6 flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
          <span className="h-px flex-1 bg-gray-200 dark:bg-gray-700" />
          <span>OR</span>
          <span className="h-px flex-1 bg-gray-200 dark:bg-gray-700" />
        </div>

        <div className="flex flex-col gap-3">
          <button
            type="button"
            className="cursor-pointer flex w-full items-center justify-center gap-3 rounded-lg border border-gray-300 px-4 py-2.5 font-medium hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-medium-dark"
            onClick={() => void signInWithGoogle()}
          >
            <FcGoogle size={22} />
            <span>Sign in with Google</span>
          </button>
          <button
            type="button"
            className="cursor-pointer w-full rounded-lg border border-gray-300 px-4 py-2.5 font-medium hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-medium-dark"
            onClick={() => void signInDemo()}
          >
            Try Demo Account
          </button>
        </div>

        <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-300">
          Don&apos;t have an account?{' '}
          <Link className="font-medium text-blue-600 hover:underline dark:text-blue-400" to="/signup">
            Sign up
          </Link>
        </p>
      </section>
    </main>
  );
}
