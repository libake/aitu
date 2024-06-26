import { createContext, useReducer, ReactNode } from "react";

import { dao } from "core";

export const TaskContext = createContext({
    state: new dao.Task(),
    dispatch: (obj: any) => {}
});

function reducer(state: dao.Task, action: {type: string, payload: any}) {
    switch(action.type) {
        case 'reuse': 
            state = action.payload;
            return state;
        case 'reset':
            state = new dao.Task();
            return state;
        default: 
            throw Error('Unknow action: ' + action.type);
    }
}

export function TaskProvider(props: { children: ReactNode}) {
    const [state, dispatch] = useReducer(reducer, new dao.Task());

    return (
        <TaskContext.Provider value={{state, dispatch}}>
            {props.children}
        </TaskContext.Provider>
    )
}