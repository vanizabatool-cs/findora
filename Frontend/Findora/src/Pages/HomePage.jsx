import { useContext } from "react";
import { UserContext } from "../context/UserProvider";
import Loader from "../components/Loader";
import { toast } from "react-toastify";
import axios from "axios";
import { Outlet, useNavigate } from "react-router-dom";
import Items from "../components/Items";
import HeroSection from "../components/HeroSection";
import Navbar from "../components/Navbar";
import ReportForm from "../components/ReportForm"

function HomePage(){
    const{loading}=useContext(UserContext);
    if(loading) return <Loader/>


    return( 
        <>
        <HeroSection/>
        <ReportForm/>
        </>
    )
}

export default HomePage;