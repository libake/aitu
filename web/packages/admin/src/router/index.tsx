import { RouteObject, Outlet } from 'react-router-dom';

import {
    Layout,
    auth,
    category,
    home,
    node,
    task,
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
            path: 'task',
            element: <Outlet />,
            children: [
                {
                    path: '',
                    element: <task.List />
                },
            ]
        }, {
            path: 'category',
            element: <Outlet />,
            children: [
                {
                    path: '',
                    element: <category.List />
                },
            ]
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