import { useState, useEffect, createContext } from "react";


export const CartContext = createContext();


export const CartProvider = ({children})=>{
    const [cartItems, setCartItems] = useState(()=>{
        const saved = localStorage.getItem("cart");
        return saved ? JSON.parse(saved) :[];
    });


    useEffect(()=>{
        localStorage.setItem("cart", JSON.stringify(cartItems));
    },[cartItems,]);

    const addToCart = (product, qty=1,total_price,isPackage,extra_options=[],allergies=[],selectedMeal="",weeks="")=>{
        setCartItems((prev)=>{
            const existing = prev.find((item)=> item.slug === product.slug);

            if (!existing){
                return [...prev, {...product,qty,extra_options,allergies,selectedMeal,weeks,total_price,isPackage}];
            };

            return prev
        });
    };

    const removeFromCart = (productId)=> {
        setCartItems((prev)=> prev.filter((item)=> item.slug !== productId));
    }


    const existProductInCart = (productId)=> {
        return cartItems.find((item) => item.slug === productId);
    };


    const totalPrice = ()=>{
        let price = 0
        cartItems.map((item)=>{price += Number(item.total_price) })

        return price;
    }

    const clearCart = ()=> setCartItems([]);

    console.log(cartItems)


    return <>
        <CartContext.Provider value={{cartItems, addToCart, existProductInCart, removeFromCart, clearCart, totalPrice}} >
            {children}
        </CartContext.Provider>
    </>

}