import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import NProgress from "nprogress";

NProgress.configure({ showSpinner: false });

const NProgressHandler = () => {
  const location = useLocation();

  useEffect(() => {
    NProgress.start();
    const timer = setTimeout(() => {
      NProgress.done();
    }, 100);

    return () => {
      clearTimeout(timer);
    };
  }, [location.pathname]);

  return null;
};

export default NProgressHandler;
