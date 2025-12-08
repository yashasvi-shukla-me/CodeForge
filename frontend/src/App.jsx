import { Routes, Route, Navigate } from 'react-router-dom';

import { Toaster } from 'react-hot-toast';
import HomePage from './page/HomePage.jsx';
import LoginPage from './page/LoginPage.jsx';
import SignUpPage from './page/SignUpPage.jsx';
import { useAuthStore } from './store/useAuthStore.js';
import { use } from 'react';

function App() {

  const {authUser, checkAuth, isCheckingAuth} = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);


  return (
    <div className='flex flex-col items-center justify-start'>
    <Toaster />
    <Routes>
      <Route 
      path='/'
      element={authUser ? <HomePage /> : <Navigate to='/login' /> }
      />
      <Route
      path='/login'
      element={!authUser ? <LoginPage/> : <Navigate to='/' />}
      />
      <Route 
      path='/signup'
      element={!authUser ? <SignUpPage /> : <Navigate to='/' />}
      />
    </Routes>
    </div>
  )
}

export default App;