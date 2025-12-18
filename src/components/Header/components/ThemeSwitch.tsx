'use client';

import { Switch } from '@headlessui/react';
import { Theme, useTheme } from '@/contexts/ThemeContext';
import clsx from 'clsx';

const ThemeSwitch = () => {
  const { toggleTheme, theme } = useTheme();

  return (
    <div className="flex items-center gap-2">
      <Switch
        checked={theme === Theme.DARK}
        onChange={toggleTheme}
        className={`
          group inline-flex h-6 w-11 cursor-pointer items-center rounded-full
          bg-gray-300 shadow-inner ring-standard transition-all
          hover:ring-2 hover:ring-indigo-400
          data-checked:bg-gray-700
        `}
      >
        <div
          className={`
            flex-center size-5 translate-x-0.5 rounded-full bg-white shadow-md
            transition-transform
            group-data-checked:translate-x-5 group-data-checked:bg-gray-900
          `}
        >
          <span
            className={clsx('iconify text-base', {
              'text-amber-500 material-symbols-light--light-mode': theme === Theme.LIGHT,
              'text-indigo-400 material-symbols-light--dark-mode': theme === Theme.DARK,
            })}
          />
        </div>
      </Switch>
    </div>
  );
};
export default ThemeSwitch;
