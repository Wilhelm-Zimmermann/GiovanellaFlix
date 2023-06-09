import { useState } from "react";
import { BiLogInCircle } from "react-icons/bi";
import { CiCirclePlus } from "react-icons/ci";
import { AiFillCloseCircle } from "react-icons/ai";
import { FaUser } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export function NotAuthProfile(){
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const navigate = useNavigate();

    const toggleIsOpen = () => {
        setIsOpen(!isOpen);
    }

    const loginPage = () => {
        navigate("/users/login")
    }

    const signUpPage = () => {
        navigate("/users/create");
    }

    return(
        <>
        <div onClick={toggleIsOpen} className="w-full h-full flex items-center justify-center relative">
            <div>
                <FaUser className="text-gray-50 h-8 w-8 "/>
            </div>
            {
                isOpen && (
                    <>
                    <div className="py-1 px-2 w-52 h-40 flex items-center justify-start flex-wrap z-10 absolute top-2 left-0 md:-left-12 bg-gray-700 -translate-x-16">
                        <button className="self-center justify-self-start py-2 md:self-end"><AiFillCloseCircle className="text-3xl text-red-500"/></button>
                        {/* Login button */}
                        <div onClick={loginPage} className="flex w-full py-3 justify-start px-3 items-center gap-x-1 hover:bg-gray-300 transition-colors">
                            <button>
                                <BiLogInCircle className="text-2xl text-green-500"/>
                            </button>
                            <span className="text-white text-xl">Login</span>
                        </div>

                        {/* Sign Up button */}
                        <div onClick={signUpPage} className="flex w-full py-3 items-center gap-x-1 justify-start px-3 hover:bg-gray-300 transition-colors">
                            <button className="flex items-center gap-x-1 text-white bg-gray text-xl">
                                <CiCirclePlus className="text-2xl text-blue-500"/>
                            </button>
                            <span className="text-white text-xl">Create Account</span>
                        </div>
                    </div>
                    </>
                )
            }
        </div>
        </>
    )
}