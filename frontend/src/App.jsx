import { Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import HomePage from './page/HomePage.jsx';
import LoginPage from './page/LoginPage.jsx';
import SignUpPage from './page/SignUpPage.jsx';
import { useAuthStore } from './store/useAuthStore.js';
import {Loader } from 'lucide-react';
import Layout from './layout/layout.jsx';

function App() {

  const {authUser, checkAuth, isCheckingAuth} = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if(isCheckingAuth && !authUser) {
    return (
      <div className='flex items-center justify-center h-screen'>
        <Loader className='size-10 animate-spin' />
      </div>
    )
  }


  return (
    <div className='flex flex-col items-center justify-start'>
    <Toaster />
    <Routes>

      <Route path="/" element={<Layout />}>
      <Route 
      index
      element={authUser ? <HomePage /> : <Navigate to='/login' /> }
      />

      </Route>

      <Route
      path='/login'
      element={!authUser ? <LoginPage/> : <Navigate to='/' />}
      />
      <Route 
      path='/signup'
      element={!authUser ? <SignUpPage /> : <Navigate to='/' />}
      />

      <Route element={<AdminRoute />}>
        <Route path="/add-problem" element={authUser ? <AddProblem/> : <Navigate to="/"/>}
        />
      </Route>
      <Route>

      </Route>
    </Routes>
    </div>
  )
}

export default App;