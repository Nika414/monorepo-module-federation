import { Link, Outlet } from 'react-router-dom';
import styles from './App.module.scss';

const App = () => {
  return (
    <>
      <div className={styles.app}>
        ADMIN MODULE
      </div>
      <Outlet />
    </>
  );
};

export default App;
