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
      const { error: updateError } = await supabase.auth.updateUser({ password })
      if (updateError) throw updateError

      setPassword('')
      setSuccess('Your password has been updated.')
    } catch (updateError) {
      setError(updateError instanceof Error ? updateError.message : 'Unable to update your password.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="">
        <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <div className="min-w-0 flex-1">
              <label className="block text-sm font-medium" htmlFor="more-password">Password</label>
              <div className="relative mt-1">
                <CustomInput
                  id="more-password"
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
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  aria-pressed={showPassword}
                  onClick={() => setShowPassword((visible) => !visible)}
                >
                  {showPassword ? <LuEyeOff aria-hidden="true" /> : <LuEye aria-hidden="true" />}
                </button>
              </div>
            </div>

            <SubmitButton
              title="Update password"
              onClick={() => undefined}
              disabled={isSubmitting}
              spinner={isSubmitting}
              className="rounded-lg hover:bg-blue-600 sm:w-auto sm:flex-none"
            />
          </div>

          {error && <p className="text-sm text-red-600 dark:text-red-400" role="alert">{error}</p>}
          {success && <p className="text-sm text-green-700 dark:text-green-400" role="status">{success}</p>}
        </form>

        <div className='p-4'>
        <div className='flex items-center justify-between h-14 px-4 my-2 bg-slate-100 dark:bg-light-dark rounded-xl'>
        <strong className='dark:text-white text-dark '>Sign Out</strong>
            <div onClick={() => signOut()} className='flex text-2xl dark:text-white cursor-pointer'>
                <LuLogOut/>
            </div>
        </div>
        </div>
    </main>
  )
}

export default More


