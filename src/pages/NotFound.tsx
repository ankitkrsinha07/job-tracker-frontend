import { Link } from 'react-router-dom'

function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center
                    min-h-screen text-center p-10">
      <h1 className="text-8xl font-bold text-gray-200 mb-4">404</h1>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        Page Not Found
      </h2>
      <p className="text-gray-500 mb-6">
        The page you are looking for does not exist.
      </p>
      <Link to="/"
        className="px-6 py-3 bg-blue-600 text-white rounded-lg
                   no-underline hover:bg-blue-700 transition-colors">
        Go Home
      </Link>
    </div>
  )
}

export default NotFound