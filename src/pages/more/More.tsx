import { FormEvent, useState } from 'react'
import CustomInput from '@/components/inputs/CustomInputs'
import SubmitButton from '@/components/button/SubmitButton'
import useDocumentTitle from '@/hooks/document/useDocTitle'
import supabase from '@/lib/supabase'
import { signOut } from '@/utils/authService'
import { LuEye, LuEyeOff, LuLogOut } from 'react-icons/lu'

const More = () => {
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    useDocumentTitle('More | Finance Management')

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setError('')
        setSuccess('')
        setIsSubmitting(true)

        try {
            const { error: updateError } = await supabase.auth.updateUser({
                password,
            })

            if (updateError) throw updateError

            setPassword('')
            setSuccess('Your password has been updated.')
        } catch (updateError) {
            setError(
                updateError instanceof Error
                    ? updateError.message
                    : 'Unable to update your password.'
            )
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <main className="flex flex-col gap-6 p-4">
            {/* Password */}
            <section className="rounded-xl bg-slate-100 p-4 dark:bg-light-dark">
                <h2 className=" text-lg font-semibold text-dark dark:text-white">
                    New Password
                </h2>

                <form
                    className="flex flex-col gap-3"
                    onSubmit={handleSubmit}
                >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
                        <div className="min-w-0 flex-1">
                            <div className="relative mt-1">
                                <CustomInput
                                    id="more-password"
                                    value={password}
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    autoComplete="new-password"
                                    placeholder="Enter your password"
                                    className=" h-10 rounded-lg border border-gray-300 bg-white pr-12 dark:text-white dark:border-gray-600 dark:!bg-light-dark"
                                    onChange={setPassword}
                                />

                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-3 flex items-center text-gray-600 hover:text-dark dark:text-gray-300 dark:hover:text-white"
                                    aria-label={
                                        showPassword
                                            ? 'Hide password'
                                            : 'Show password'
                                    }
                                    aria-pressed={showPassword}
                                    onClick={() =>
                                        setShowPassword((visible) => !visible)
                                    }
                                >
                                    {showPassword ? (
                                        <LuEyeOff aria-hidden="true" />
                                    ) : (
                                        <LuEye aria-hidden="true" />
                                    )}
                                </button>
                            </div>
                        </div>

                        <SubmitButton
                            title="Update password"
                            onClick={() => undefined}
                            disabled={isSubmitting}
                            spinner={isSubmitting}
                            className="my-2 h-10 rounded-lg hover:bg-blue-600 sm:w-auto sm:flex-none"
                        />
                    </div>

                    {error && (
                        <p
                            className="text-sm text-red-600 dark:text-red-400"
                            role="alert"
                        >
                            {error}
                        </p>
                    )}

                    {success && (
                        <p
                            className="text-sm text-green-700 dark:text-green-400"
                            role="status"
                        >
                            {success}
                        </p>
                    )}
                </form>
            </section>

            {/* Sign Out */}
            <section className="rounded-xl bg-slate-100 p-4 dark:bg-light-dark">
                <button
                    type="button"
                    onClick={() => signOut()}
                    className="flex h-14 w-full items-center justify-between rounded-xl px-4 text-left transition-colors hover:bg-slate-200 dark:hover:bg-slate-700"
                >
                    <strong className="text-dark dark:text-white">
                        Sign Out
                    </strong>

                    <LuLogOut className="text-2xl text-dark dark:text-white" />
                </button>
            </section>
        </main>
    )
}

export default More