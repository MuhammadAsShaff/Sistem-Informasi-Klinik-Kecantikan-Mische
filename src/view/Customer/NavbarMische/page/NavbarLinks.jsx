import React from 'react';
import { ChevronDown } from 'lucide-react';
import { NavLink } from 'react-router-dom';

/**
 * Komponen UI murni untuk daftar link navigasi desktop.
 * Data link diterima dari props — tidak ada logic / import constants di sini.
 *
 * @param {{ links: Array }} props
 */
const NavbarLinks = ({ links = [] }) => {
  return (
    <nav className="flex items-center gap-3 sm:gap-6 md:gap-10 lg:gap-14 xl:gap-20">
      {links.map((link) => (
        <div key={link.href} className="relative group">
          <NavLink
            to={link.href}
            className={({ isActive }) =>
              [
                'inline-flex items-center gap-1 whitespace-nowrap border-b-[4px] border-transparent py-2 text-[14px] font-medium transition-colors duration-200 sm:text-base md:text-lg lg:text-[22px] xl:text-[26px]',
                isActive
                  ? 'border-[#8CC461] text-gray-900'
                  : 'text-gray-900 hover:text-[#8CC461]',
              ].join(' ')
            }
          >
            {link.label}
            {link.hasDropdown && (
              <ChevronDown size={16} className="text-[#8CC461] stroke-[3] lg:h-5 lg:w-5 xl:h-6 xl:w-6 transition-transform group-hover:rotate-180" />
            )}
          </NavLink>

          {/* DROPDOWN MENU */}
          {link.subItems && (
            <div className="absolute left-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
              <div className="bg-white border border-gray-100 shadow-2xl rounded-2xl py-4 min-w-[200px] overflow-hidden">
                {link.subItems.map((sub) => (
                  <NavLink
                    key={sub.href}
                    to={sub.href}
                    className="block px-8 py-3 text-gray-700 hover:bg-[#8CC461]/10 hover:text-[#8CC461] font-medium transition-all"
                  >
                    {sub.label}
                  </NavLink>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </nav>
  );
};

export default NavbarLinks;
