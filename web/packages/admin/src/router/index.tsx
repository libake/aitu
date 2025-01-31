import { RouteObject, Outlet } from 'react-router-dom';

import {
    Layout,
    auth,
    category,
    feedback,
    home,
    node,
    task,
    template,
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
            path: 'feedback',
            element: <Outlet />,
            children: [
                {
                    path: '',
                    element: <feedback.List />
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
            path: 'template',
            element: <Outlet />,
            children: [
                {
                    path: '',
                    element: <template.List />
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