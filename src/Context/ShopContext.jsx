import React, {createContext, useEffect, useState} from "react";

export const ShopContext = createContext(null);

const getDefaultCart = ()=>{
    let cart = {};
    for(let index = 0; index < 300+1; index++){
        cart[index] = 0;
    }
    return cart;
}
const ShopContextProvider = (props) =>{
    const [cartItems, setCartItems] = useState(getDefaultCart());
    
    const [all_product, setAll_Product] = useState([]);

    useEffect(()=>{
        fetch('https://e-commerce-backend-ruby-eight.vercel.app/allproducts')
        .then((response)=>response.json())
        .then((data)=>setAll_Product(data))
        if(localStorage.getItem('auth-token')){
            fetch('https://e-commerce-backend-ruby-eight.vercel.app/getcart',{
                method: "POST",
                headers:{
                    Accept:'application/form-data',
                    'auth-token':`${localStorage.getItem('auth-token')}`,
                    'Content-Type':'application/json',
                },
                body:"",
            }).then((response)=>response.json())
            .then((data)=>setCartItems(data));
        }
    },[])

    const addtocart = (itemId)=>{
        setCartItems((prev)=>({...prev,[itemId]:prev[itemId]+1}))
        if(localStorage.getItem('auth-token')){
            fetch('https://e-commerce-backend-ruby-eight.vercel.app/addToCart',{
                method:'POST',
                headers:{
                    Accept:'application/form-data',
                    'auth-token':`${localStorage.getItem('auth-token')}`,
                    'Content-Type':'application/json',
                },
                body:JSON.stringify({"itemId":itemId})
            }).then((response)=> response.json())
            .then((data)=>console.log(data));
        }
    }
    const removefromcart = (itemId)=>{
        setCartItems((prev)=>({...prev,[itemId]:prev[itemId]-1}))
        if(localStorage.getItem('auth-token')){
            fetch('https://e-commerce-backend-ruby-eight.vercel.app/removefrom_cart',{
                method:'POST',
                headers:{
                    Accept:'application/form-data',
                    'auth-token':`${localStorage.getItem('auth-token')}`,
                    'Content-Type':'application/json',
                },
                body:JSON.stringify({"itemId":itemId})
            })
            .then((response)=> response.json())
            .then((data)=>console.log(data));
        }
    }

    const getTotalCartAmount = ()=>{ 
        let totalamount = 0;
        for(const item in cartItems)
        {
            
            if(cartItems[item]>0)
            {
                let itemInfo = all_product.find((product)=> product.id === Number(item));
                totalamount += itemInfo.new_price*cartItems[item];
            }
        }
        return totalamount;
    }
    const getTotalCartItems = () =>{
        let totalItem = 0;
        for(const item in cartItems)
        {
            if(cartItems[item]>0)
            {
                totalItem += cartItems[item];
            }
        }
        return totalItem;
    }
    const contextValue = {getTotalCartItems,getTotalCartAmount,all_product,cartItems,addtocart,removefromcart}
    return(
        <ShopContext.Provider value = {contextValue}>
            {props.children}
        </ShopContext.Provider>
    )
}
export default ShopContextProvider;


