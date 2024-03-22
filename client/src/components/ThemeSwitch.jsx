import React from 'react';
import { Switch } from '@mui/material';

const ThemeSwitch = ({ darkMode, toggleDarkMode }) => {
  return <Switch checked={darkMode} onChange={toggleDarkMode} />;
};

export default ThemeSwitch;
