import React from 'react'
import { Outlet, Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore.js';

const AdminRoute = () => {

    const {authStore, isCheckingAuth} = useAuthStore();

    if (isCheckingAuth) {
        return <div className='flex items-center justify-center h-screen'><Loader className='size-10 animate-spin' /></div>
    }

    if(!authStore || authStore.role !== 'ADMIN') {
        return <Navigate to='/' />
    }

  return (
    <Outlet />
  )
}

export default AdminRoute