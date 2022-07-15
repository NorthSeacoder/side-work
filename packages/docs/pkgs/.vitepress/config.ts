import {defineConfig} from 'vitepress';

export default defineConfig({
    title: 'SideWork',
    description: 'side-work',
    titleTemplate: false,
    themeConfig: {
        logo: '/icon.svg',
        socialLinks: [{icon: 'github', link: 'https://github.com/NorthSeacoder'}],
        nav: [
            {
                text: '项目',
                items: [
                    {
                        text: 'npm 包',
                        items: [
                            {text: '@nsea/cz', link: '/packages/nsea/cz/'},
                            {text: '@nsea/cl', link: '/packages/nsea/cl/'}
                        ]
                    },
                    {
                        text: 'vscode扩展',
                        items: [{text: 'franky', link: '/packages/franky/'}]
                    },
                    {
                        text: '小项目',
                        items: [{text: 'RaeAdmin', link: '/packages/rae-admin/'}]
                    }
                ]
            },
            {
                text: '文档',
                items: [
                    {
                        items: [
                            {text: 'vscode', link: '/translate/vscode/'},
                            {text: 'appwrite', link: '/translate/appwrite/'},
                            {text: '文章', link: '/translate/articles/'}
                        ]
                    }
                ]
            }
        ],
        sidebar: {
            '/translate/appwrite/': [
                {
                    text: 'API',
                    items: [{text: 'Databases API', link: '/translate/appwrite/api/databases'}]
                },
                {
                    text: 'Advanced',
                    items: [
                        {text: 'Pagination', link: '/translate/appwrite/advanced/pagination'},
                        {text: 'Permissions', link: '/translate/appwrite/advanced/permissions'}
                    ]
                }
                // {
                //   text: '文章',
                //   items: [
                //     // This shows `/guide/index.md` page.
                //     { text: 'CSS类', link: '/translate/articles/css' }, // /guide/index.md
                //   ]
                // }
            ],
            '/translate/articles/': [
                {
                    text: 'CSS类',
                    items: [
                        // This shows `/guide/index.md` page.
                        {text: 'CSS调试指南', link: '/translate/articles/css/guide-debugging-css'} // /guide/index.md
                    ]
                }
                // {
                //   text: '文章',
                //   items: [
                //     // This shows `/guide/index.md` page.
                //     { text: 'CSS类', link: '/translate/articles/css' }, // /guide/index.md
                //   ]
                // }
            ]
        }
    }
});
