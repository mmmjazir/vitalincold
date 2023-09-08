import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import {useAuthContext} from './hooks/useAuthContext'

//pages and components
import Home from './pages/Home';
import Navbar from './components/Navbar/Navbar'
import Signup from './pages/Signup';
import Login from './pages/Login'
import Profile from './pages/Profile';
import Medicine from './pages/medicines/Medicine';
import Medicines from './pages/medicines/Medicines'

function App() {
  const {user,userRole} = useAuthContext()

  return (
    <div className="App">
     <BrowserRouter>
       <Navbar/>
       <div className="pages">
          <Routes>
          
             <Route path='/' element={<Home/>} />

             <Route path='/medicines' element={ <Medicines/> } />

             <Route path="/medicines/:id" element={<Medicine/>} />

             <Route path='/profile' element={user && userRole == 'seller' ? <Profile/> : <Navigate to='/' /> } />
         
            <Route path='/signup' element={!user ? <Signup/> : <Navigate to='/medicines' /> } />
         
            <Route path='/login' element={!user ? <Login/> : <Navigate  to='/medicines' /> } />
          </Routes>

       </div>
     </BrowserRouter>
    </div>
  );
}

export default App;
