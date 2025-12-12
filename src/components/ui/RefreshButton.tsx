import clsx from 'clsx';

const RefreshButton = ({ onClick, className = '' }: { onClick: () => void, className?: string }) => {
  return (
    <button
      className={clsx(`
        absolute top-6 right-6 z-10 h-8 w-8 rounded-xl background-interactive
        ring-standard
        md:top-8 md:right-8
      `, className)}
      onClick={onClick}
      aria-label="Refresh"
    >
      <div className={`
        iconify h-full w-full text-standard material-symbols-light--refresh
      `}
      />
    </button>
  );
};

export default RefreshButton;
