import {Routes,Route} from 'react-router-dom'
import './App.css'
import Loader from './components/Loader'
import { ToastContainer,Bounce } from 'react-toastify'
import { lazy, Suspense, useContext, useEffect, useState } from 'react'
import ProtectedRoute from './utils/ProtectedRoute'
const SignupPage=lazy(()=>import('./Pages/SignupPage'));
const Error=lazy(()=>import("./Pages/Error"));
const LoginPage=lazy(()=>import("./Pages/LoginPage"));
const HomePage=lazy(()=>import("./Pages/HomePage"));
const AdminDashboard=lazy(()=>import("./Pages/AdminDashboard"));
const FoundItems=lazy(()=>import("./Pages/FoundItems"));
const MyReports=lazy(()=>import("./Pages/MyReports"));
const ItemDetails=lazy(()=>import("./Pages/ItemDetails"));
import ExploreReports from "./components/ExploreReports"
import { UserContext } from './context/UserProvider'
import Navbar from './components/Navbar'

function App() {
  const[showLoader,setShowLoader]=useState(
    !sessionStorage.getItem("findoraLoaded")
  );

  const{user,handleLogout,loading:authLoading,authError,getUser}=useContext(UserContext);

  useEffect(()=>{
    if(!showLoader) return;
    const timer=setTimeout(()=>{
      sessionStorage.setItem("findoraLoaded","true");
      setShowLoader(false);
    },2500);

    return ()=>{
      clearTimeout(timer);
    }
  },[showLoader])

  if(showLoader || authLoading) return <Loader/>;
  if(authError && !user) return (
    <main role="alert">
      <p>{authError}</p>
      <button type="button" onClick={getUser}>Try again</button>
    </main>
  );

  return (
    <>
    {user&&<Navbar user={user} onLogout={handleLogout}/>}
    <Suspense fallback={<Loader/>}>
    <Routes>
    <Route path='/' element={<LoginPage/>}/>
    <Route path='/signup' element={<SignupPage/>}/>
    <Route path="/home" element={
      <ProtectedRoute>
      <HomePage/> 
      </ProtectedRoute>
    }/>
    <Route path="/admin" element={
      <ProtectedRoute>
        <AdminDashboard/>
      </ProtectedRoute>
    }/>

    <Route
  path="/explore-reports"
  element={
    <ProtectedRoute>
      <ExploreReports />
    </ProtectedRoute>
  }
/>

    <Route path="/found" element={
      <ProtectedRoute>
        <FoundItems/>
      </ProtectedRoute>
    }/>

    <Route path="/my-reports" element={
      <ProtectedRoute>
        <MyReports/>
      </ProtectedRoute>
    }/>

    <Route path="/items/:id" element={
      <ProtectedRoute>
        <ItemDetails/>
      </ProtectedRoute>
    }/>

    <Route path='*' element={<Error/>}/>
    </Routes>
    </Suspense>
    
  
  
  {/* Loader */}
    <ToastContainer
    position="top-right"
    autoClose={5000}
    hideProgressBar={false}
    newestOnTop={false}
    closeOnClick={false}
    rtl={false}
    pauseOnFocusLoss
    draggable
    pauseOnHover
    theme="light"
    transition={Bounce}
/>
    </>
  )
}

export default App
