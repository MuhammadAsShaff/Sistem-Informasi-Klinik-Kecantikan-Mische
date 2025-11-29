// src/components/Navbar/NavbarLinks.jsx
import React from 'react';
import { ChevronDown } from 'lucide-react';
import { NAV_LINKS } from './constants'; // Import data

const NavbarLinks = () => {
  return (
    <nav className="hidden md:flex items-center gap-8">
      {NAV_LINKS.map((link, index) => (
        <a
          key={index}
          href={link.href}
          className={`
            text-base font-medium flex items-center gap-1 transition-all duration-200
            ${link.active 
              ? 'text-gray-900 border-b-2 border-[#7bc043] pb-1' 
              : 'text-gray-800 hover:text-[#7bc043]'
            }
          `}
        >
          {link.label}
          {link.hasDropdown && (
            <ChevronDown size={16} className="text-[#7bc043] stroke-[3]" />
          )}
        </a>
      ))}
    </nav>
  );
};

export default NavbarLinks;