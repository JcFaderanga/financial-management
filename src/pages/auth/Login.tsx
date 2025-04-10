import { signInWithGoogle } from '@/utils/authService';
import useDocumentTitle from '@/hooks/document/useDocTitle';
export default function App() {
  
  useDocumentTitle('Sign In')
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-2xl font-bold mb-4">Login to Your App</h1>
        <button
          onClick={signInWithGoogle}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          Sign in with Google
        </button>
      </div>
    );
 
}
