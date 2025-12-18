import clsx from 'clsx';

const RefreshButton = ({ onClick, className = '' }: { onClick: () => void, className?: string }) => {
  return (
    <button
      className={clsx(`
        absolute top-6 right-6 z-10 h-8 w-8 cursor-pointer rounded-xl
        bg-neutral-50 ring-standard transition-all duration-200
        hover:bg-neutral-100
        md:top-8 md:right-8
        dark:bg-neutral-900
        hover:dark:bg-neutral-800
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
