import { RouteObject, Outlet } from 'react-router-dom';

import {
    Layout,
    auth,
    home,
    node,
    user,
    NotFound
} from '@/page';

const routes: RouteObject[] = [
    {
        path: '/auth',
        element: <Outlet />,
        children: [
            {
                path: 'signIn',
                element: <auth.SignIn />
            },
        ]
    },
    {
        path: '/',
        element: <Layout />,
        children: [{
            path: '',
            element: <home.Home />
        }, {
            path: 'node',
            element: <Outlet />,
            children: [
                {
                    path: '',
                    element: <node.List />
                },
            ]
        }, {
            path: 'user',
            element: <Outlet />,
            children: [
                {
                    path: '',
                    element: <user.List />
                },{
                    path: 'profile',
                    element: <user.Profile />
                },
            ]
        }]
    }, {
        path: '*',
        element: <NotFound />
    }
];

export default routes;