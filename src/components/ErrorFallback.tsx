import type { FallbackProps } from "react-error-boundary";

function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-64 p-10 text-center">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        Something went wrong
      </h2>
      <p className="text-red-400 text-sm mb-6 font-mono bg-red-50 px-3 py-2 rounded-lg">
        {(error as Error)?.message || "Unknown error"}
      </p>
      <button
        onClick={resetErrorBoundary}
        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer border-none font-medium"
      >
        Try Again
      </button>
    </div>
  );
}

export default ErrorFallback;
