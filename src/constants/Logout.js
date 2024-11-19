import { Redirect } from "react-router-dom";
import useSession from "react-session-hook";

const Logout = async () => {
    const session = useSession();
    await session.removeSession();
    localStorage.clear();
    return (
        <Redirect to={window.location.pathname && "/login"} />
    )
};


export default Logout