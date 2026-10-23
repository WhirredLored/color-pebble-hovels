import { useState } from "react";
import { NavLink } from "react-router";

import { BUSINESS_NAME } from "~/utils/business-contact-info";

const NAV_ITEMS = [
  { to: "/", label: "Home", end: true },
  { to: "/services", label: "Services", end: false },
  { to: "/projects", label: "Projects", end: false },
  { to: "/process", label: "Process", end: false },
  { to: "/contact", label: "Contact", end: false },
];

function navLinkClass({ isActive }: { isActive: boolean }) {
  return isActive
    ? "text-navy underline underline-offset-4"
    : "text-body hover:text-navy hover:underline hover:underline-offset-4";
}

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="border-b border-rule bg-bg">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-5">
        <NavLink to="/" className="font-serif text-lg leading-tight text-ink sm:text-xl">
          {BUSINESS_NAME}
        </NavLink>

        <nav aria-label="Main" className="hidden sm:block">
          <ul className="flex items-center gap-6 text-sm">
            {NAV_ITEMS.map((item) => (
              <li key={item.to}>
                <NavLink to={item.to} end={item.end} className={navLinkClass}>
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-expanded={menuOpen}
          aria-controls="mobile-nav"
          className="rounded-[3px] border border-rule px-3 py-1.5 text-sm text-ink hover:border-navy sm:hidden"
        >
          {menuOpen ? "Close" : "Menu"}
        </button>
      </div>

      {menuOpen && (
        <nav
          id="mobile-nav"
          aria-label="Main"
          className="border-t border-rule sm:hidden"
        >
          <ul className="mx-auto max-w-5xl px-4 py-2 text-sm">
            {NAV_ITEMS.map((item) => (
              <li key={item.to} className="border-b border-rule last:border-b-0">
                <NavLink
                  to={item.to}
                  end={item.end}
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) =>
                    `block py-3 ${isActive ? "text-navy" : "text-body"}`
                  }
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
