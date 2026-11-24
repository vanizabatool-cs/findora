import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify"
import axios from 'axios'
import { useNavigate, Link } from "react-router-dom"
import { UserContext } from "../context/UserProvider";
import { API_URL } from "../utils/api";

// NEW: design components (put them next to this file, or fix the import paths)
import AuthLayout from "./AuthLayout";
import Field from "./Field";
import { UserIcon, LockIcon, ArrowIcon } from "./Icons";

function LoginPage(){
    const navigate=useNavigate();
    const {user,setUser}=useContext(UserContext);

    useEffect(() => {
    if (user) {
        navigate(user.role === "admin" ? "/admin" : "/home", { replace: true });
    }
}, [user, navigate]);


    const[formData,setFormData]=useState({
        username:"",
        password:""
    });
    const [loading, setLoading] = useState(false); // NEW: disables the button while logging in

    const onChange=(e)=>{
        // removed console.log(e.target.value): it printed the password in the console
        setFormData((prevData)=>({
            ...prevData,
            [e.target.name]:e.target.value
        }))
    }

    const handleSubmit=async(e)=>{
        e.preventDefault();
        setLoading(true);
        try{
            let response=await axios.post(`${API_URL}/user/login`,formData,{
                withCredentials:true
            })
            toast.success(response.data.message)
            setUser(response.data.user);
            return navigate(response.data.user.role === "admin" ? "/admin" : "/home");
        }catch(err){
              toast.error(
            err.response?.data?.message || err.message
            );
        }finally{
            setLoading(false);
        }
    }

    return(
        <AuthLayout
            title="Welcome back"
            subtitle="Sign in to see what's been found around campus."
            footer={<>Not signed in? <Link className="link" to="/signup">Sign up here</Link></>}
        >
            <form onSubmit={handleSubmit}>
                <Field
                    id="username" name="username" label="Username" icon={<UserIcon />}
                    placeholder="Enter your username" autoComplete="username" required
                    value={formData.username} onChange={onChange}
                />
                <Field
                    id="password" name="password" label="Password" type="password" icon={<LockIcon />}
                    placeholder="Enter your password" autoComplete="current-password" required
                    value={formData.password} onChange={onChange}
                />

                <button className="btn" type="submit" disabled={loading}>
                    {loading ? "Signing in..." : <>Sign in <ArrowIcon /></>}
                </button>
            </form>
        </AuthLayout>
    )
}

export default LoginPage;