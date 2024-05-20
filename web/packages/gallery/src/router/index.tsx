import { RouteObject, Outlet } from 'react-router-dom';

import {
    Layout,
    home,
    creation,
    wordart,
    NotFound
} from '@/page';

const routes: RouteObject[] = [
    {
        path: '/',
        element: <Layout />,
        children: [{
            path: '',
            element: <home.List />,
            children: [
                {
                    path: '',
                    element: <creation.List />
                },
            ]
        }, {
            path: 'creation',
            element: <Outlet />,
            children: [
                {
                    path: '',
                    element: <creation.List />
                },
            ]
        }, {
            path: 'wordart',
            element: <Outlet />,
            children: [
                {
                    path: '',
                    element: <wordart.List />
                },
            ]
        }]
    }, {
        path: '*',
        element: <NotFound />
    }
];

export default routes;