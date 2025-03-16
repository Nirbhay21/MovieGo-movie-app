import React from 'react'
import LogoIcon from '../assets/icons/LogoIcon'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import UserIcon from '../assets/icons/UserIcon';
import { IoIosSearch } from "react-icons/io";
import { useState } from 'react';
import { useEffect } from 'react';
import { navigation } from '../config/navigation';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const formattedSearchQuery = new URLSearchParams(location.search).get("q") || "";
  const [searchInput, setSearchInput] = useState(formattedSearchQuery);

  const handleSubmit = (event) => {
    event.preventDefault();
  }

  useEffect(() => {
    if (searchInput) {
      navigate(`/search?q=${searchInput}`);
    } else {
      navigate(location.pathname);
    }
  }, [searchInput, navigate, location.pathname]);

  return (
    <header className='fixed left-0 right-0 top-0 z-50 h-16 bg-black/50'>
      <div className='container mx-auto flex h-full items-center px-4 sm:px-2'>
        <Link className='flex items-center space-x-2' to="/" aria-label="MovieGo Home">
          <LogoIcon className="h-8 w-8" aria-hidden="true" />
          <h1 className='to from-gradient-primary to-gradient-secondary bg-gradient-to-br bg-clip-text text-[1.75rem] font-bold text-transparent'>MovieGo</h1>
        </Link>

        <nav className='ml-6 hidden items-center space-x-2 lg:flex' aria-label="Main Navigation">
          {navigation.map((nav) => (
            <NavLink key={nav.label} to={nav.href} className={({ isActive }) => `px-2 font-semibold hover:text-neutral-50 ${(isActive) ? "text-white" : ""}`}>{nav.label}</NavLink>
          ))}
        </nav>

        <div className='ml-auto flex items-center space-x-4'>
          <form className='flex items-center' onSubmit={handleSubmit}>
            <label className="sr-only" htmlFor="search">Search movies and shows</label>
            <input
              id="search"
              type="search"
              placeholder='search here...'
              className='hidden border-none bg-transparent px-3 py-1 outline-none lg:block'
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
            />
            <button type="submit" className='text-2xl text-white' aria-label="Search">
              <IoIosSearch aria-hidden="true" />
            </button>
          </form>
          <button className='h-8 w-8 cursor-pointer transition-transform active:scale-75' aria-label="User menu">
            <UserIcon aria-hidden="true" />
          </button>
        </div>
      </div>
    </header>
  )
}

export default Header