import { MoreVertical, ChevronLast, ChevronFirst } from "lucide-react"
import { createContext, useContext, useEffect, useState } from "react"
import { Link } from "react-router-dom";
import { auth } from "../../firebase/firebaseApp";
import { getNameByUID } from "../../firebase/db_fun";
import { Console } from "console";
import { set } from "zod";

interface SidebarContextType {
    expanded: boolean;
}

const SidebarContext = createContext<SidebarContextType>({ expanded: false });

export default function Sidebar({ children }: { children: React.ReactNode }) {
    const [expanded, setExpanded] = useState(true)
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState<any>();
    const [userName, setUserName] = useState<any>();
    const [uid, setUid] = useState<string | null>(null);
    
    // Update uid when auth.currentUser changes
    useEffect(() => {
      setUid(auth.currentUser?.uid || null);
      setUser(auth.currentUser);
  }, [auth.currentUser]);

  // Fetch user data when uid changes

    useEffect(() => {
        const getUserName = async () => {
            setLoading(true);
            if (!uid) return "No user ID";
            const userData = await getNameByUID(uid);
            console.log(userData);
            setUserName(userData);
            setLoading(false);
        }

        if (uid) {
            getUserName();
        }
    }, [uid]);

    // console.log(userName);
    return (
        <aside className="flex h-screen" >
            <nav className="h-full flex flex-col bg-white border-r shadow-sm">
                <div className="p-4 pb-2 flex justify-between items-center">
                    <img
                        src="https://img.logoipsum.com/256.svg"
                        className={`overflow-hidden transition-all ${
                            expanded ? "w-32" : "w-0"
                        }`}
                        alt=""
                    />
                    <button
                        onClick={() => setExpanded((curr) => !curr)}
                        className="p-1.5 rounded-lg bg-gray-50 hover:bg-gray-100"
                    >
                        {expanded ? <ChevronFirst /> : <ChevronLast />}
                    </button>
                </div>
                <SidebarContext.Provider value={{ expanded }}>
                    <ul className="flex-1 px-3">{children}</ul>
                </SidebarContext.Provider>

                <div className="border-t flex p-3 items-end ">
    {userName && userName.length > 0 ? (
        <>
            <span className="flex w-10 h-10 rounded-md bg-violet-400 justify-center items-center font-bold">
                {userName[0].firstName.charAt(0).toUpperCase() + userName[0].lastName.charAt(0).toUpperCase()}
            </span>
            <div
                className={`
                    flex justify-between items-center
                    overflow-hidden transition-all ${expanded ? "w-52 ml-3" : "w-0"}
                `}
            >
                <div className="leading-4">
                    <h4 className="font-semibold">{userName[0].firstName + " " + userName[0].lastName }</h4>
                    <span className="text-xs text-gray-600">{user?.email}</span>
                </div>
            </div>
        </>
    ) : (
        <div>Loading...</div>
    )}
</div>
            </nav>
        </aside>
    )
}

export function SidebarItem({ icon, text, active, alert, url }: { icon: any, text: any, active: any, alert: any, url:any }) {
  const { expanded } = useContext(SidebarContext)
  
  return (
    <li
      className={`
        relative flex items-center py-2 px-3 my-4
        font-medium rounded-md cursor-pointer
        transition-colors group
        ${
          active
            ? "bg-gradient-to-tr from-emerald-200 to-indigo-100 text-indigo-800"
            : "hover:bg-indigo-50 text-gray-600"
        }
    `}
    >
      {icon}
      <span
        className={`overflow-hidden transition-all ${
          expanded ? "w-52 ml-3" : "w-0"
        }`}
      >
        {text}
      </span>
      {alert && (
        <div
          className={`absolute right-2 w-2 h-2 rounded bg-indigo-400 ${
            expanded ? "" : "top-2"
          }`}
        />
      )}

      {!expanded && (
        <div
          className={`
          absolute left-full rounded-md px-2 py-1 ml-6
          bg-indigo-100 text-indigo-800 text-sm
          invisible opacity-20 -translate-x-3 transition-all
          group-hover:visible group-hover:opacity-100 group-hover:translate-x-0
      `}
        >
          {text}
        </div>
      )}
      <Link to={url} className="absolute inset-0"></Link>


    </li>
  )
}