import { useUserStore } from "@/store/login";
import {
    useNavigate,
    useLocation,
    Outlet
} from "react-router-dom";
import {
    useEffect
} from "react";



const RequireAuth = () => {
    const {isLogin, hydrate} = useUserStore();
    const navigate = useNavigate();
    const pathname = useLocation();
    useEffect(() => {
        (async () => {
            if (!isLogin) {
                const token = localStorage.getItem("token");
                if (token) {
                    const ret = await hydrate();
                    if (ret && ret.success) return;
                }
                navigate('/login', { state: { from: pathname.pathname } });
            }
        })();
    }, [isLogin, pathname.pathname]);
    return <Outlet />
}

export default RequireAuth;