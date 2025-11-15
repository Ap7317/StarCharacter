interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

export default function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] px-4">
      <div className="bg-red-900/50 border border-red-500 rounded-lg p-6 max-w-md w-full">
        <div className="flex items-center mb-4">
          <svg
            className="w-6 h-6 text-red-500 mr-2"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-lg font-bold text-red-500">Error</h3>
        </div>
        <p className="text-gray-300 mb-4">{message}</p>
        {onRetry && (
          <button onClick={onRetry} className="btn-primary w-full">
            Try Again
          </button>
        )}
      </div>
    </div>
  );
}
