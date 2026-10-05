import { FormEvent, useState } from 'react';
import { Link } from 'react-router-dom';
import CustomInput from '@/components/inputs/CustomInputs';
import SubmitButton from '@/components/button/SubmitButton';
import useDocumentTitle from '@/hooks/document/useDocTitle';
import { signUpWithCredentials } from '@/utils/authService';

export default function SignUp() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useDocumentTitle('Itrack Money | Sign Up');

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError('');
        setSuccess('');

        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        setIsSubmitting(true);

        try {
            const hasSession = await signUpWithCredentials(email, password);

            if (hasSession) {
                window.location.href = '/';
                return;
            }

            setSuccess('Your account was created. Check your email to confirm your address.');
        } catch (signupError) {
            setError(signupError instanceof Error ? signupError.message : 'Unable to create your account. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <main className="flex min-h-screen items-center justify-center bg-white px-4 py-10 text-dark dark:bg-dark dark:text-white">
            <section className="w-full max-w-md">
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-semibold">Sign Up</h1>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">Create your account</p>
                </div>

                <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                    <div>
                        <label className="block text-sm font-medium" htmlFor="signup-email">Username</label>
                        <CustomInput
                            id="signup-email"
                            value={email}
                            type="email"
                            required
                            placeholder="Enter your email address"
                            autoComplete="email"
                            className="my-1 rounded-lg border border-gray-300 bg-white dark:border-gray-600 dark:!bg-light-dark"
                            onChange={setEmail}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium" htmlFor="signup-password">Password</label>
                        <div className="relative mt-1">
                            <CustomInput
                                id="signup-password"
                                value={password}
                                type={showPassword ? 'text' : 'password'}
                                required
                                placeholder="Enter your password"
                                autoComplete="new-password"
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
                    </div>

                    <div>
                        <label className="block text-sm font-medium" htmlFor="signup-confirm-password">Confirm password</label>
                        <div className="relative mt-1">
                            <CustomInput
                                id="signup-confirm-password"
                                value={confirmPassword}
                                type={showPassword ? 'text' : 'password'}
                                required
                                placeholder="Confirm your password"
                                autoComplete="new-password"
                                className="my-0 rounded-lg border border-gray-300 bg-white pr-20 dark:border-gray-600 dark:!bg-light-dark"
                                onChange={setConfirmPassword}
                            />
                            <button
                                type="button"
                                className="absolute inset-y-0 right-3 my-auto h-fit text-sm font-medium text-gray-600 hover:text-dark dark:text-gray-300 dark:hover:text-white"
                                aria-label={showPassword ? 'Hide passwords' : 'Show passwords'}
                                aria-pressed={showPassword}
                                onClick={() => setShowPassword((visible) => !visible)}
                            >
                                {showPassword ? 'Hide' : 'Show'}
                            </button>
                        </div>
                    </div>

                    {error && <p className="text-sm text-red-600 dark:text-red-400" role="alert">{error}</p>}
                    {success && <p className="text-sm text-green-700 dark:text-green-400" role="status">{success}</p>}

                    <SubmitButton
                        title="Create account"
                        onClick={() => undefined}
                        disabled={isSubmitting}
                        spinner={isSubmitting}
                        className="rounded-lg hover:bg-blue-600"
                    />
                </form>

                <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-300">
                    Already have an account?{' '}
                    <Link className="font-medium text-blue-600 hover:underline dark:text-blue-400" to="/login">
                        Sign in
                    </Link>
                </p>
            </section>
        </main>
    );
}