import { useUserStore } from "@/store/login";
import {
    useNavigate,
    useLocation
} from "react-router-dom";
import {
    useEffect
} from "react";



const RequireAuth = ({children}) => {
    const {isLogin} = useUserStore();
    const navigate = useNavigate();
    const pathname = useLocation();
    useEffect(() => {
        if(!isLogin){
            navigate('/login', { state: { from: pathname.pathname } });
        }
    }, [isLogin]);
    return (
        <div>
            {children}
        </div>
    )
}

export default RequireAuth;