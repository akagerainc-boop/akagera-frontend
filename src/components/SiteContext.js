import React, { createContext, useContext, useEffect, useState } from 'react';
import { contentAPI } from '../api';
import { DEFAULT_NAV, DEFAULT_SETTINGS } from '../siteDefaults';

const SiteContext = createContext(null);

export function SiteProvider({ children }) {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [nav, setNav] = useState(DEFAULT_NAV);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let alive = true;
    Promise.allSettled([contentAPI.settings(), contentAPI.navigation()]).then(([s, n]) => {
      if (!alive) return;
      if (s.status === 'fulfilled' && s.value?.data) setSettings({ ...DEFAULT_SETTINGS, ...s.value.data });
      if (n.status === 'fulfilled' && n.value?.data) setNav({ ...DEFAULT_NAV, ...n.value.data });
      setLoaded(true);
    });
    return () => { alive = false; };
  }, []);

  return <SiteContext.Provider value={{ settings, nav, loaded }}>{children}</SiteContext.Provider>;
}

export const useSite = () => useContext(SiteContext) || { settings: DEFAULT_SETTINGS, nav: DEFAULT_NAV, loaded: false };
