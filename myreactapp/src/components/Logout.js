import { useAuth } from "../context/AuthContext";
function Logout() {

const { logout,user } = useAuth();


if (!user) return null;

return (


<button onClick={logout}>

Logout

</button>



);



}

export default Logout;
