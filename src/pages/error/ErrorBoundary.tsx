import { useRouteError, isRouteErrorResponse, Link, useNavigate } from 'react-router-dom';

const ErrorBoundary = () => {
  const error = useRouteError();
  const navigate = useNavigate();

  const handleGoHome = () => navigate('/');
  const handleGoBack = () => navigate(-1);
  
  if (isRouteErrorResponse(error)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="text-red-500 mb-6">
          </div>
          <h1 className="text-4xl font-bold mb-4 text-gray-800">Error {error.status}</h1>
          <p className="text-xl mb-4 text-gray-600">{error.statusText}</p>
          {error.data?.message && (
            <p className="mb-6 text-gray-500">{error.data.message}</p>
          )}
          <div className="space-y-3">
            <button 
              onClick={handleGoHome}
              className="block w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              Back to Home
            </button>
            <button 
              onClick={handleGoBack}
              className="block w-full px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="text-red-500 mb-6">
        </div>
        <h1 className="text-4xl font-bold mb-4 text-gray-800">Oops!</h1>
        <p className="text-xl mb-6 text-gray-600">Something unexpected went wrong</p>
        <div className="space-y-3">
          <button 
            onClick={handleGoHome}
            className="block w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Back to Home
          </button>
          <button 
            onClick={handleGoBack}
            className="block w-full px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorBoundary; 