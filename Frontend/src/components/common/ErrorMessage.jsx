import React from 'react';

const ErrorMessage = ({ message, onClose, showTips = false, autoDismiss = false, autoDismissDelay = 5000 }) => {
  if (!message) return null;

  // Auto-dismiss functionality
  React.useEffect(() => {
    if (autoDismiss && onClose && message) {
      const timer = setTimeout(() => {
        onClose();
      }, autoDismissDelay);

      return () => clearTimeout(timer);
    }
  }, [message, autoDismiss, autoDismissDelay, onClose]);

  // Helper function to get helpful tips based on error message
  const getTips = (errorMessage) => {
    if (errorMessage.includes('Username not found')) {
      return {
        icon: '💡',
        text: 'Make sure you\'re using the correct username. Usernames are case-sensitive.'
      };
    }
    if (errorMessage.includes('Incorrect password')) {
      return {
        icon: '🔑',
        text: 'Check your password carefully. Make sure Caps Lock is off and try typing it again.'
      };
    }
    if (errorMessage.includes('deactivated')) {
      return {
        icon: '📞',
        text: 'Contact your system administrator to reactivate your account.'
      };
    }
    if (errorMessage.includes('Network error') || errorMessage.includes('connection')) {
      return {
        icon: '🌐',
        text: 'Check your internet connection and try again.'
      };
    }
    return null;
  };

  const tips = showTips ? getTips(message) : null;

  return (
    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4 animate-fade-in relative">
      {autoDismiss && (
        <div className="absolute top-0 left-0 h-1 bg-red-500 rounded-t-lg animate-pulse"
             style={{
               width: '100%',
               animation: `shrink ${autoDismissDelay}ms linear forwards`
             }}>
        </div>
      )}
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <span className="font-medium">{message}</span>
          </div>
          {tips && (
            <div className="mt-3 p-3 bg-red-200 rounded-lg border border-red-300">
              <p className="text-sm text-red-800">
                <span className="mr-1">{tips.icon}</span>
                <strong>Tip:</strong> {tips.text}
              </p>
            </div>
          )}
          {autoDismiss && (
            <div className="mt-2">
              <p className="text-xs text-red-600 opacity-75">
                ⏱️ This message will auto-dismiss in {Math.ceil(autoDismissDelay / 1000)} seconds, or click ✕ to close now
              </p>
            </div>
          )}
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-red-700 hover:text-red-900 focus:outline-none ml-3 flex-shrink-0 transition-colors duration-200"
            title="Dismiss error message"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorMessage;
