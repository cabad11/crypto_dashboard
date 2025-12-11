const ErrorMessage = ({ message, refetch }: { message: string, refetch: () => void }) => {
  return (
    <div className="bg-red-50 dark:bg-red-900/20 rounded-3xl p-6 text-center">
      <p className="text-red-600 dark:text-red-400 font-medium">
        {message}
      </p>
      <button onClick={() => refetch()} className="mt-3 text-sm underline cursor-pointer">
        Try again
      </button>
    </div>
  );
};

export default ErrorMessage;
