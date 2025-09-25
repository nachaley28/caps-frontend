import { useAuth } from "../contexts/AuthContext";

/*

PROPS GUIDE:
    component: component that needs to be protected
    default_component: component provided if the required access level is not met. returns nothing if the required access level is not met.
    required_access_level: a list of access levels that is needed to show the component (range from 0-5, where 0 is admin)



*/


export default function ComponentProtector({ component, default_component = "", required_access_level = [] }) {
    const { account } = useAuth();

    const user_access_level = account?.access_level

    // return default_component if the user has no access
    if (!required_access_level.includes(user_access_level)) {
        return (
            default_component
        )
    }

    // return component if the user has access
    return (
        component
    )
}
