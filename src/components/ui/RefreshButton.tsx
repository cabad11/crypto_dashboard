import clsx from 'clsx';

const RefreshButton = ({ onClick, className = '' }: { onClick: () => void, className?: string }) => {
  return (
    <button
      className={clsx('ring-standard absolute right-6 top-6 md:right-8 md:top-8 z-10 rounded-xl w-8 h-8 background-interactive', className)}
      onClick={onClick}
      aria-label="Refresh"
    >
      <div className="iconify material-symbols-light--refresh w-full h-full text-standard" />
    </button>
  );
};

export default RefreshButton;
