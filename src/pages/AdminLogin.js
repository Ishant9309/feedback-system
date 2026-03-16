import React, { useState } from "react";
import { auth } from "../firebase/config";
import {
signInWithEmailAndPassword,
setPersistence,
browserSessionPersistence
} from "firebase/auth";

import { useNavigate } from "react-router-dom";

function AdminLogin(){

const [email,setEmail] = useState("");
const [password,setPassword] = useState("");
const [showPassword,setShowPassword] = useState(false);

const navigate = useNavigate();

const login = async () => {

if(!email || !password){
alert("Please enter email and password");
return;
}

try{

await setPersistence(auth, browserSessionPersistence);

await signInWithEmailAndPassword(auth,email,password);

navigate("/admin");

}catch(error){

alert("Invalid Email or Password");

}

};

return(

<div className="min-h-[80vh] flex items-center justify-center px-4">

<div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md">

<h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
Admin Login
</h2>

<input
type="email"
placeholder="Admin Email"
value={email}
onChange={(e)=>setEmail(e.target.value)}
className="w-full border rounded-lg p-2 mb-4 focus:ring-2 focus:ring-blue-400"
/>

<div className="relative mb-6">

<input
type={showPassword ? "text" : "password"}
placeholder="Password"
value={password}
onChange={(e)=>setPassword(e.target.value)}
className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-400"
/>

<span
onClick={()=>setShowPassword(!showPassword)}
className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-lg"
>

{showPassword ? "🙈" : "👁"}

</span>

</div>

<button
onClick={login}
className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition mb-3"
>

Login

</button>

<button
onClick={()=>navigate("/")}
className="w-full bg-gray-300 py-2 rounded-lg hover:bg-gray-400 transition"
>

Back to Home

</button>

</div>

</div>

)

}

export default AdminLogin;