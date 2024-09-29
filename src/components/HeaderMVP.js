import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';

const HeaderMVP = ({ user, onLogout }) => {
  const navigate = useNavigate();

  return (
    <header className='header'>
      <div
        className='logo-container'
        onClick={() => navigate('/')}
      >
        <img
          src={logo}
          alt='Project JoJo Logo'
          className='logo'
        />
      </div>

      <div className='button-container'>
        {user ? (
          <>
            {/* <span className='welcome-message'>
              Welcome, {user.email}
              {user.times_remaining !== undefined && (
                <>, you have {user.times_remaining} times remaining</>
              )}
            </span> */}
            <button
              onClick={onLogout}
              className='button logout-button'
            >
              Log Out
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => navigate('/join')}
              className='button join-button'
            >
              <b>Join Free</b>
            </button>
            <button
              onClick={() => navigate('/login')}
              className='button login-button'
            >
              <b>Log In</b>
            </button>
          </>
        )}
      </div>
    </header>
  );
};

export default HeaderMVP;
