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
        className="group ring-standard hover:ring-sky-400 cursor-pointer inline-flex h-6 w-11 items-center rounded-full bg-gray-200 transition data-checked:bg-gray-500"
      >
        <div className="flex-center size-4 translate-x-1 rounded-full bg-white transition group-data-checked:translate-x-6 group-data-checked:bg-gray-800">
          <span className={clsx('iconify', {
            'material-symbols-light--light-mode': theme === Theme.LIGHT,
            'material-symbols-light--dark-mode text-white': theme === Theme.DARK })}
          />
        </div>
      </Switch>
    </div>
  );
};
export default ThemeSwitch;
