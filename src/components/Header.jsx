import LogoIcon from '../assets/icons/LogoIcon'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import UserIcon from '../assets/icons/UserIcon';
import { IoIosSearch } from "react-icons/io";
import { useState, useCallback, useMemo } from 'react';
import { debounce } from 'lodash';
import { navigation } from '../config/navigation';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const formattedSearchQuery = new URLSearchParams(location.search).get("q") || "";
  const [searchInput, setSearchInput] = useState(formattedSearchQuery);

  const debouncedNavigate = useMemo(() => {
    return debounce((value) => {
      if (value) {
        navigate(`/search?q=${value}`);
      } else {
        navigate(location.pathname);
      }
    }, 300);
  }, [navigate, location.pathname]);

  const handleSubmit = useCallback((event) => {
    event.preventDefault();
    debouncedNavigate(searchInput);
  }, [debouncedNavigate, searchInput]);

  const handleSearchChange = useCallback((event) => {
    const value = event.target.value;
    setSearchInput(value);
    debouncedNavigate(value);
  }, [debouncedNavigate]);

  return (
    <header className='h-15 fixed left-0 right-0 top-0 z-50 bg-black/50 sm:h-16' role="banner">
      <div className='container mx-auto flex h-full items-center px-4 sm:px-2'>
        <Link
          className='flex items-center space-x-2 focus:outline-none'
          to="/"
          aria-label="MovieGo Home"
>
          <LogoIcon className="h-6 w-6 scale-y-110 sm:h-8 sm:w-8" aria-hidden="true" />
          <h1 className='to from-gradient-primary to-gradient-secondary bg-gradient-to-br bg-clip-text text-2xl font-bold text-transparent sm:text-[1.75rem]'>MovieGo</h1>
        </Link>

        <nav
          className='ml-6 hidden items-center space-x-2 lg:flex'
          aria-label="Main Navigation"
          role="navigation"
        >
          {navigation.map((nav) => (
            <NavLink
              key={nav.label}
              to={nav.href}
              className={({ isActive }) =>
                `px-2 font-semibold hover:text-neutral-50 focus:outline-none ${isActive ? "text-white" : "text-gray-300"}`
              }
            >
              {nav.label}
            </NavLink>
          ))}
        </nav>

        <div className='ml-auto flex items-center space-x-4'>
          <form
            className='flex items-center'
            onSubmit={handleSubmit}
            role="search"
            aria-label="Search movies and shows"
          >
            <label className="sr-only" htmlFor="search">Search movies and shows</label>
            <input
              id="search"
              type="search"
              placeholder='Search movies and shows'
              className='hidden appearance-none rounded-sm border-none bg-transparent px-3 py-1 outline-none focus:outline-none lg:block'
              value={searchInput}
              onChange={handleSearchChange}
              aria-expanded={searchInput.length > 0}
            />
            <button
              type="submit"
              className='rounded-sm p-1 text-2xl text-white focus:outline-none'
              aria-label="Submit search"
            >
              <IoIosSearch aria-hidden="true" />
            </button>
          </form>
          <button
            className='h-7 w-7 cursor-pointer rounded-sm transition-transform focus:outline-none active:scale-75 sm:h-8 sm:w-8'
            aria-label="Open user menu"
            aria-expanded="false"
          >
            <UserIcon aria-hidden="true" />
          </button>
        </div>
      </div>
    </header>
  )
}

export default Header