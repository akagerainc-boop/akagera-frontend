import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, ChevronDown, Search, LayoutDashboard, LogIn } from 'lucide-react';
import { useSite } from './SiteContext';
import { useAuth } from '../context/AuthContext';
import SearchBar from './SearchBar';

export default function Navbar() {
  const { nav, settings } = useSite();
  const { user } = useAuth();
  const [openMenu, setOpenMenu] = useState(null);
  const [drawer, setDrawer] = useState(false);
  const [drawerGroup, setDrawerGroup] = useState(null);
  const [search, setSearch] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => { setOpenMenu(null); setDrawer(false); }, [location.pathname]);
  useEffect(() => {
    document.body.style.overflow = drawer || search ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [drawer, search]);

  const header = nav.header || [];
  const brand = settings?.brand?.name || 'Akagera Inc';

  return (
    <>
      <nav className="nav" onMouseLeave={() => setOpenMenu(null)}>
        <div className="container">
          <div className="nav__inner">
            <Link to="/" className="nav__brand" aria-label={brand}>
              <img src="/assets/inc.png" alt="" onError={(e) => { e.target.style.display = 'none'; }} />
              <span>Akagera<b>Inc</b></span>
            </Link>

            <div className="nav__links">
              {header.map((item) => (
                <div key={item.label} onMouseEnter={() => setOpenMenu(item.children?.length ? item.label : null)}>
                  {item.children?.length ? (
                    <button
                      className="nav__link"
                      aria-expanded={openMenu === item.label}
                      onClick={() => navigate(item.url)}
                    >
                      {item.label} <ChevronDown size={15} />
                    </button>
                  ) : (
                    <Link to={item.url} className="nav__link">{item.label}</Link>
                  )}
                </div>
              ))}
            </div>

            <div className="nav__spacer" />

            <div className="nav__cta">
              <button className="nav__link" onClick={() => setSearch(true)} aria-label="Search"><Search size={18} /></button>
              {user ? (
                <Link to={user.role === 'admin' || user.role === 'super_admin' ? '/admin' : '/dashboard'} className="btn btn--secondary btn--sm">
                  <LayoutDashboard size={15} /> {user.role?.includes('admin') ? 'Admin' : 'Dashboard'}
                </Link>
              ) : (
                <Link to="/login" className="btn btn--ghost btn--sm"><LogIn size={15} /> Sign in</Link>
              )}
              <Link to="/contact?intent=project" className="btn btn--primary btn--sm">Get Started</Link>
            </div>

            <button className="nav__burger" onClick={() => setDrawer(true)} aria-label="Open menu">
              <Menu size={24} />
            </button>
          </div>
        </div>

        {/* mega menu */}
        {header.map((item) => (
          item.children?.length > 0 && (
            <div key={item.label} className={`mega ${openMenu === item.label ? 'open' : ''}`} onMouseEnter={() => setOpenMenu(item.label)}>
              <div className="container">
                <div className="mega__grid">
                  {item.children.map((c) => (
                    <Link key={c.label + c.url} to={c.url} className="mega__item">{c.label}</Link>
                  ))}
                </div>
              </div>
            </div>
          )
        ))}
      </nav>

      {/* mobile drawer */}
      <div className={`drawer-scrim ${drawer ? 'open' : ''}`} style={{ display: drawer ? 'block' : 'none' }} onClick={() => setDrawer(false)} />
      <aside className={`drawer ${drawer ? 'open' : ''}`} aria-hidden={!drawer}>
        <div className="drawer__head">
          <span className="nav__brand"><span>Akagera<b>Inc</b></span></span>
          <button className="btn btn--ghost btn--sm" onClick={() => setDrawer(false)} aria-label="Close menu"><X size={22} /></button>
        </div>
        <div className="drawer__body">
          <button className="drawer__group" style={{ width: '100%' }} onClick={() => { setDrawer(false); setSearch(true); }}>
            <span style={{ display: 'flex', gap: 10, padding: '14px 12px', fontWeight: 700 }}><Search size={18} /> Search</span>
          </button>
          {header.map((item) => (
            <div className="drawer__group" key={item.label}>
              {item.children?.length ? (
                <>
                  <button onClick={() => setDrawerGroup(drawerGroup === item.label ? null : item.label)} aria-expanded={drawerGroup === item.label}>
                    {item.label} <ChevronDown size={16} style={{ transform: drawerGroup === item.label ? 'rotate(180deg)' : 'none', transition: '.2s' }} />
                  </button>
                  {drawerGroup === item.label && (
                    <div className="drawer__sub">
                      <Link to={item.url}>All {item.label}</Link>
                      {item.children.map((c) => <Link key={c.label + c.url} to={c.url}>{c.label}</Link>)}
                    </div>
                  )}
                </>
              ) : (
                <button onClick={() => navigate(item.url)}>{item.label}</button>
              )}
            </div>
          ))}
          <div className="stack mt-3" style={{ padding: '0 12px' }}>
            {user ? (
              <Link to={user.role?.includes('admin') ? '/admin' : '/dashboard'} className="btn btn--secondary btn--block">
                {user.role?.includes('admin') ? 'Admin dashboard' : 'My dashboard'}
              </Link>
            ) : (
              <Link to="/login" className="btn btn--secondary btn--block">Sign in</Link>
            )}
            <Link to="/contact?intent=project" className="btn btn--primary btn--block">Get Started</Link>
          </div>
        </div>
      </aside>

      {search && <SearchBar onClose={() => setSearch(false)} />}
    </>
  );
}
