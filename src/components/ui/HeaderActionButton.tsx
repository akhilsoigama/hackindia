import React from 'react';
import { getHeaderActionClass } from './headerActionButton.utils';

interface HeaderActionButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isDark: boolean;
}

const HeaderActionButton = ({ isDark, className = '', type, ...props }: HeaderActionButtonProps) => {

  return (
    <button
      type={type ?? 'button'}
      className={getHeaderActionClass(isDark, className)}
      {...props}
    />
  );
};

export default HeaderActionButton;
