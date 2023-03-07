import React from 'react';
import { getIsLoggedIn } from '@elrondnetwork/dapp-core';
import { dAppName, uniqueContractAddress } from 'config';
import { Navbar as BsNavbar, NavItem, Nav } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { ReactComponent as ElrondLogo } from 'assets/img/elrond.svg';
import { ReactComponent as Union } from 'assets/img/Union.svg';
import { routeNames } from 'routes';
import logo from '../../../assets/img/logo.png';
import Account from './Account';

const Navbar = () => {
  const navigate = useNavigate();
  const loggedIn = getIsLoggedIn();

  //same as presentation dApp
  const isMobile = window.innerWidth < 769;

  const handleRedirectToHome = () => {
    const route = uniqueContractAddress
      ? '/multisig/' + uniqueContractAddress
      : routeNames.home;
    navigate(route);
  };

  const isOnUnlockPage = window.location.pathname.includes(routeNames.unlock);
  return (
    <BsNavbar className='bg-white px-4 py-3'>
      <div className='container'>
        <NavItem
          onClick={handleRedirectToHome}
          className='d-flex align-items-center nav-logo'
        >
          <img
            id='site-logo'
            src={logo}
            width={isMobile ? '100px' : '150px'}
            alt='xCoffeeDAO'
          />
          <span className='dapp-name'>{dAppName}</span>
        </NavItem>

        <Nav className='ml-auto'>
          {loggedIn ? (
            <div
              className='d-flex align-items-center logged-in'
              style={{ minWidth: 0 }}
            >
              <Account />
              {/* <Settings /> */}
            </div>
          ) : (
            !isOnUnlockPage && (
              <div className='connect-btns '>
                <Link
                  to={routeNames.unlock}
                  className='btn primary'
                  data-testid='loginBtn'
                >
                  <Union />
                  <span className='name'>Connect now</span>
                </Link>
              </div>
            )
          )}
        </Nav>
      </div>
    </BsNavbar>
  );
};

export default Navbar;
