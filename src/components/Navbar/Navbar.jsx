import { Link } from "react-router-dom";


import {useLogout} from '../../hooks/useLogout'
import { useAuthContext } from "../../hooks/useAuthContext"

const Navbar = () =>{

    const {logout} = useLogout()
    const {user,userRole} = useAuthContext()

    const handleClick =()=>{
        logout()
    }


    return(
        <header>
            <div className='container'>
                <Link to="/">
                    <h1>Vitalinc</h1>
                </Link>
            <nav>
                <div>
                    <Link to='/'>Home</Link>
                </div>
                
                      <div>
                        <Link to='/medicines'>Medicines</Link>
                    </div>
                
                
                {user && userRole == 'seller' && (
                 <div >
                   <Link to='/profile'>Profile</Link>
                </div>
                )
                }
                {user && (
                <div>    
                    <span>{user.email}</span>
                    <button onClick={handleClick}>Log out</button>
                </div>
                )
                }
                {!user && (
                <div>
                    <Link to="/login">Login</Link>
                    <Link to="/signup">Signup</Link>
                </div>
                )
                }
            </nav>

            </div>
        </header>
    )
}

export default Navbar;