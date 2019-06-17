// import axios from "axios"

// // Mock out all top level functions, such as get, put, delete and post:
// jest.mock("axios")

// axios.get.mockImplementation(url => {
//     if (url === 'www.example.com') {
//         return Promise.resolve({ data: {...} })
//     } else {

//     }
// })

'use strict';
module.exports = {
  get: (url) => {
    let data = {}

    if (url.includes('tenants')) {
        data = {
            _embedded: {_items: [
                {
                    "id":1,
                    "subdomain":"tenant1",
                    "domain_name":"sourcefabric.org",
                    "name":"TENANT1",
                    "code":"tenant1",
                    "organization":{
                        "id":1,
                        "name":"test",
                        "code":"0gjdk8"
                    },
                    "created_at":"2017-06-30T09:36:00+00:00",
                    "updated_at":"2019-04-16T19:45:19+00:00",
                    "enabled":true,
                    "theme_name":"swp\/daily-theme",
                    "amp_enabled":true,
                    "output_channel":null,
                    "articles_count":140,
                    "fbia_enabled":false,
                    "paywall_enabled":false
                },
                {
                    "id":2,
                    "subdomain":"tenant2",
                    "domain_name":"sourcefabric.org",
                    "name":"TENANT2",
                    "code":"tenant2",
                    "organization":{
                        "id":1,
                        "name":"test",
                        "code":"0gjdk8"
                    },
                    "created_at":"2017-06-30T09:36:00+00:00",
                    "updated_at":"2019-04-16T19:45:19+00:00",
                    "enabled":true,
                    "theme_name":"swp\/daily-theme",
                    "amp_enabled":true,
                    "output_channel":null,
                    "articles_count":140,
                    "fbia_enabled":false,
                    "paywall_enabled":false
                }
            ]}
        }
    }

    if (url.includes('content/routes')) {
        data = {
            _embedded: {_items: [
                {
                    id: 1,
                    name: 'route1'
                },
                {
                    id: 2,
                    name: 'route2'
                },
            ]}
        }
    }

    if (url.includes('content/lists')) {
        data = {
            _embedded: {_items: [
                {
                    id: 1,
                    name: 'content list 1',
                    type: 'manual'
                },
                {
                    id: 2,
                    name: 'content list 2',
                    type: 'manual'
                },
            ]}
        }
    }


    console.log("\x1b[44m\x1b[37m%s\x1b[0m", "API URL: " + url)
    return Promise.resolve({data: data})
  },

  post: (url) => {
    let data = {}

    if (url.includes('organization/articles/related')) {
        data = {
            related_article_items: [
                {tenants: [], title: 'test related 1'},
                {tenants:
                    [
                        {
                            "code": "eif0ca"
                        }
                    ],
                    title: 'test related 2'
                }
            ]
        }
    }

    if (url.includes('auth/superdesk')) {
        data = {
            token: { api_key: 'asdfasdf'}
        }
    }




    console.log("\x1b[44m\x1b[37m%s\x1b[0m", "API URL: " + url)
    return Promise.resolve({data: data})
  }
};

