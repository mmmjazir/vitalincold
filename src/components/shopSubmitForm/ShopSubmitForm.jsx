import { useState } from "react";
import { useShopContext } from "../../hooks/useShopContext";
import { useAuthContext } from "../../hooks/useAuthContext";

const ShopSubmitForm = ({setIsLoading}) => {
   const {dispatch} = useShopContext()
   const {user,userRole} = useAuthContext()

   const[shopname, setShopName] = useState('')
   const[address, setAddress] = useState('')
   const[error, setError] = useState(null)
   const [successMessage, setSuccessMessage] = useState(null)
   const [emptyFields, setEmptyFields] = useState([])

   const showSuccessMessage = (message) => {
      setSuccessMessage(message);
      setIsLoading(true)
      setTimeout(() => {
        setSuccessMessage('');
        setIsLoading(false)
      }, 3000);
    };
   const handleSubmit = async (e)=>{
      e.preventDefault()
       if(!user ){
         setError('You must be logged in')
         return
       }
       if(userRole !== 'seller'){
         setError('You must have to be a seller to do this action')
       }
  
       const shop = {shopname,address}

       const response = await fetch('http://localhost:4000/api/shops',{
         method:'POST',
         headers:{
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.token}`
         },
         body: JSON.stringify(shop)
     })
     const json = await response.json()

     if(!response.ok){
        setError(json.error) 
        setEmptyFields(json.emptyFields || [] )
     }
     if(response.ok){
      setShopName('')
      setAddress('')
      setEmptyFields([])
      setError(null)
      showSuccessMessage('Shop Added successfully')
      dispatch({type:'CREATE_SHOP',payload:json})
     }

      }
     

    return ( 
        <form className="create" onSubmit={handleSubmit} >
            <h3>Add a New Shop</h3>

            <label>Shop Name:</label>
            <input 
               type="text"
               onChange={(e)=>{
                  setShopName(e.target.value)
               }}
               value={shopname}   
               className={emptyFields.includes('shopname') ? 'error' : ''}
            />
            <label>Shop Address:</label>
            <input 
                type="text" 
                value={address} 
                onChange={(e)=>{
                   setAddress(e.target.value)    
            }} 
            className={emptyFields.includes('address') ? 'error' : ''}
            />

            <button>Add Shop</button>
            {successMessage &&  <div className="success">{successMessage}</div> }
            {error && <div className="error">{error}</div> }
         </form>
     );
}
 
export default ShopSubmitForm;