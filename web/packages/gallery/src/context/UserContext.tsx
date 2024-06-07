import { createContext, useReducer, ReactNode, useEffect } from "react";

import { dao, srv } from "@/core";

export const UserContext = createContext({
    state: new dao.User(),
    dispatch: (obj: any) => {}
});

function reducer(state: dao.User, action: {type: string, payload: dao.User}) {
    switch(action.type) {
        case 'login': 
            return action.payload;
        case 'logout': 
            localStorage.clear();
            return new dao.User();
        default: 
            throw Error('Unknow action: ');
    }
}

export function UserProvider(props: { children: ReactNode}) {
    const [state, dispatch] = useReducer(reducer, new dao.User());

    const getUser = async () => {
        let res = await srv.User.info();
        if (res.code == 1000) {
            dispatch({
                type: 'login',
                payload: res.data,
            });
        }
    }

    useEffect(() => {
        let token = localStorage.getItem('token');
        if (!!token) {
            getUser();
        }
    }, []);

    return (
        <UserContext.Provider value={{state, dispatch}}>
            {props.children}
        </UserContext.Provider>
    )
}