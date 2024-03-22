import React from 'react';
import Navbar from './Navbar';
import Banner from './Banner';

// renderar övergripande layout för webbplatsen som tar emot children (innehåll som ska renderas inuti layouten)
// samt setTheme för övergripande visuellt tema på webbplatsen

const Layout = ({ children, setTheme }) => {
  return (
    <>
      <Navbar setTheme={setTheme} />
      <Banner></Banner>
      <div>{children}</div>
    </>
  );
};

export default Layout;