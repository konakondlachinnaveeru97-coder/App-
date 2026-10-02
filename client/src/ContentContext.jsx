import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { getContent } from './api.js';

const ContentContext = createContext(null);

export function ContentProvider({ children }) {
  const [state, setState] = useState({ content: null, error: null, loading: true });

  const load = useCallback(() => {
    setState((s) => ({ ...s, loading: true, error: null }));
    getContent()
      .then((content) => {
        setState({ content, error: null, loading: false });
        if (content.brand?.name) document.title = content.brand.name;
      })
      .catch((error) => setState({ content: null, error, loading: false }));
  }, []);

  useEffect(load, [load]);

  return <ContentContext.Provider value={{ ...state, reload: load }}>{children}</ContentContext.Provider>;
}

export function useContent() {
  return useContext(ContentContext);
}
