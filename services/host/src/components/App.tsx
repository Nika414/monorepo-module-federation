import { Link, Outlet } from 'react-router-dom';
import styles from './App.module.scss';
import { shopRoutes, adminRoutes } from '@packages/shared/src/index';

const App = () => {
  return (
    <>
      <div className={styles.app}>
        MAIN APP
        <Link to={adminRoutes.about}>about</Link>
        <Link to={shopRoutes.shop}>shop</Link>
      </div>
      <Outlet />
    </>
  );
};

export default App;
