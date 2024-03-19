// import { Link, useNavigate } from "react-router-dom";
// import { signOut } from "firebase/auth";
// import { auth } from "../../firebase/firebaseApp";
// import { Button } from "./ui/button";

// const Navbar = () => {
//     const navigate = useNavigate();

//     const signOutUser = async () => {
//         // sign out firebase
//         await signOut(auth);
//         navigate("/");

//     }
//     return (
//         <>
//         <nav className="flex items-center justify-between bg-gradient-to-tr from-emerald-300 to-indigo-200 p-4">
//             <Link to="/" className="text-gray-800 font-bold">Home</Link>
//             <Link to="/about" className="text-gray-800">About</Link>
//             <Link to="/contact" className="text-gray-800">Contact</Link>
//              
//         </nav>
//         </>
//     )
// }
// export default Navbar;
// import { useState } from 'react';
// import { Link, useNavigate } from "react-router-dom";
// import { signOut } from "firebase/auth";
// import { auth } from "../../firebase/firebaseApp";
// import { Button } from "./ui/button";

// const Navbar = () => {
//     const navigate = useNavigate();
//     const [isOpen, setIsOpen] = useState(false);

//     const signOutUser = async () => {
//         await signOut(auth);
//         navigate("/");
//     }

//     return (
//         <nav className="bg-gradient-to-tr from-emerald-300 to-indigo-200 p-4 grid grid-cols-2 md:grid-cols-4 gap-4">
//             <Link to="/" className="text-gray-800 font-bold col-span-2 md:col-span-1">Home</Link>
//             <Link to="/about" className="text-gray-800 col-span-2 md:col-span-1">About</Link>
//             <Link to="/contact" className="text-gray-800 col-span-2 md:col-span-1">Contact</Link>
//             <Button variant="destructive" onClick={signOutUser} className="ml-4 col-span-2 md:col-span-1">Sign Out</Button>
//             <button onClick={() => setIsOpen(!isOpen)} className="md:hidden">
//                 {isOpen ? 'Close' : 'Menu'}
//             </button>
//             {isOpen && (
//                 <div className="md:hidden">
//                     <Link to="/" className="text-gray-800 font-bold">Home</Link>
//                     <Link to="/about" className="text-gray-800">About</Link>
//                     <Link to="/contact" className="text-gray-800">Contact</Link>
//                     <Button variant="destructive" onClick={signOutUser} className="ml-4">Sign Out</Button>
//                 </div>
//             )}
//         </nav>
//     )
// }

// export default Navbar;

import { useState } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase/firebaseApp";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";
import { CircleUserRoundIcon } from "lucide-react";

const people = ["Blogs", "Design", "Pricing", "About"];
const listItems = people.map((person) => (
  <li className="px-3 py-2 cursor-pointer rounded hover:bg-sky-100">
    {person}
  </li>
));
export default function Navbar() {
  
  const [isOpen, setIsOpen] = useState(false);
  const toggleNavbar = () => {
    setIsOpen(!isOpen);
  };
  const navigate = useNavigate();

      const signOutUser = async () => {
        await signOut(auth);
        navigate("/");
    }
  return (
    <div className="bg-gradient-to-tr from-emerald-300 to-indigo-200 relative m-auto p-3 flex justify-between items-center">
      <h1 className="ml-20 font-xl font-bold text-sky-800 text-3xl">LMS</h1>
      <nav className={isOpen ? ("flex") : ("mr-28 hidden md:flex")}>
        <ul className="flex z-10 items-center bg-gradient-to-tr from-emerald-300 to-indigo-200 absolute md:relative flex-col md:flex-row w-full shadow md:shadow-none text-center top-12 left-0 md:top-0 md:flex">
            {/* {listItems} */}
            <CircleUserRoundIcon size={20} className="mr-2" />
            <li>
              <span className="font-semibold">{auth.currentUser?.email}</span>
            </li>
            <li className="md:hidden">
                    <Button variant="destructive" onClick={signOutUser} className="mb-2">Sign Out</Button>
                </li>
                </ul>
                <Button variant="destructive" onClick={signOutUser} className="ml-4 hidden md:block">Sign Out</Button>
        
      </nav>
      <div className="md:hidden bg-gradient-to-tr from-emerald-300 to-indigo-200">
        <button className="flex justify-center items-center" onClick={toggleNavbar}>
          <svg
            viewBox="0 0 24 24"
            width="24"
            height="24"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            strokeLinejoin="round"
            strokeLinecap="round"
            className={isOpen ? ("hidden") : ("flex")}
          >
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
          <svg
            viewBox="0 0 24 24"
            width="24"
            height="24"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            // stroke-linecap="round"
            strokeLinecap="round"
            // stroke-linejoin="round"
            strokeLinejoin="round"
            className={isOpen ? ("flex") : ("hidden")}
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
    </div>
  );
}
// export default Navbar;