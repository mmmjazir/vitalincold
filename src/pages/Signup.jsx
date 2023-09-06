import { useState } from "react";
import {useSignup} from '../hooks/useSignup'


const Signup = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [role, setRole] = useState('consumer')
    const {signup, isLoading, error} = useSignup()
    

    const handleSubmit = async (e)=>{
        e.preventDefault()
        await signup(role,email,password)
        
    }

    const handleRoleChange = (e) => {
      setRole(e.target.value);
    };

    return ( 
        <form className="signup" onSubmit={handleSubmit}>
            <h3>Sign up</h3>
            <label>User Role:</label>
              <select value={role} onChange={handleRoleChange}>
                <option value="consumer">Consumer</option>
                <option value="seller">Seller</option>
             </select>
    
            <label>Email:</label>
            <input type="email" value={email} 
              onChange={(e)=> setEmail(e.target.value)} />
            <label>Password:</label>
            <input type="password" value={password} onChange={(e)=> setPassword(e.target.value)} />
           
          <button disabled={isLoading} >Sign up</button>
          {error && <div className="error">{error}</div>  }
        </form>
     );
}
 


export default Signup;