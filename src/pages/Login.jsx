import { useState } from "react";
import { Link } from "react-router-dom";

import {useLogin} from '../hooks/useLogin'


const Login = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const {login, isloading, error} = useLogin()
    


    const handleSubmit = async (e)=>{
        e.preventDefault()
        await login(email,password)
    }

    return ( 
        <form className="login" onSubmit={handleSubmit}>
            <h3>Login</h3>
            <label>Email:</label>
            <input type="email" value={email} 
              onChange={(e)=> setEmail(e.target.value)} />
            <label>Password:</label>
            <input type="password" value={password} onChange={(e)=> setPassword(e.target.value)} />
        
          <button disabled={isloading}>Login</button>
         {error && <div className="error">{error}</div> }
         <p>Don't have an account yet? <Link to="/signup">Sign up here</Link>.</p>
        </form>
      
     );
}
 


export default Login;