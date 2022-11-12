const request = require('request');
const URL = `http://localhost:8080`;
const SEARCH_URL = `https://api.spotify.com/v1/search?`;
const client_id = `d3e8e97511ab4c18a73be0f3603ed003`;
const client_secret = `987b35771c224c58b800102416060691`;

var app = new Vue({
    el: '#app',
    data: {
        postList: [],
        postComments: [],
        post: {},
        home: true,
        type: "track",
        trackSearch: "",
        trackResult: {},
        authOptions: {
            url: 'https://accounts.spotify.com/api/token',
            headers: {
                'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
            },
            form: {
                grant_type: 'client_credentials'
            },
            json: true
        },

    },
    methods: {
        getPosts: async function () {
            let response = await fetch(`${URL}/chirp`, {
                method: 'GET',
                credentials: 'include',
            });
            let data = await response.json();
            this.postList = data;
            console.log(response.status);
            console.log(data);
        },

        getComments: async function (commentId) {
            let response = await fetch(`${URL}/chirp/comment/${commentId}`, {
                method: 'GET',
                credentials: 'include',
            });
            let data = await response.json();
            this.postComments = data;
            console.log(response.status);
            console.log(data);
        },

        getPost: async function (postId) {
            let response = await fetch(`${URL}/chirp/${postId}`, {
                method: 'GET',
                credentials: 'include',
            });
            let data = await response.json();
            this.post = data;
            console.log(response.status);
            console.log(data);
        },

        createPost: async function (post) {
            let response = await fetch(`${URL}/chirp`, {
                method: 'POST',
                body: JSON.stringify(post),
                headers: {
                    'content-type': 'application/json',
                },
                credentials: 'include',
            });
            let data = await response.json();
            console.log(response.status);
            console.log(data);
            if (response.status == 201) {
                this.getPosts();
            } else {
                console.log('Error creating post:', response.status);
            }
        },

        createComment: async function (comment) {
            let response = await fetch(`${URL}/comments`, {
                method: 'POST',
                body: JSON.stringify(comment),
                headers: {
                    'content-type': 'application/json',
                },
                credentials: 'include',
            });
            let data = await response.json();
            console.log(response.status);
            console.log(data);
            if (response.status == 201) {
                this.getComments();
            } else {
                console.log('Error creating post:', response.status);
            }
        },
        getSearch: async function () {
            let response = await fetch(`${SEARCH_URL}q=${this.trackSearch}&type=${this.type}`, {
                method: 'GET',
                headers: {
                    "Authorization": "Bearer BQDW2b348ePLOq2PFMz3R0hBoRu2OjMK3aivncP_mSAOatDNfhkp54834Hlo1VRfX34OPfdzuocdEHtRTr71CACO1Xfiy8SUutm8kEGSd6neUED_ckXJsR2sFSmUwO67l7rgoGD-cHcjUoaMSR__VYr9rieoXVSbiZCXtR1wmhoVJ7OjcVfTf5-TTtYbknPF3VeNH7PsG3JO"
                }

            });
            console.log(response);
            let data = await response.json();
            this.trackResult = data.tracks.items;
        },
        request.post(authOptions, function (error, response, body) {
            if (!error && response.statusCode === 200) {

                // use the access token to access the Spotify Web API
                var token = body.access_token;
                var options = {
                    url: 'https://api.spotify.com/v1/users/jmperezperez',
                    headers: {
                        'Authorization': 'Bearer ' + token
                    },
                    json: true
                };
                request.get(options, function (error, response, body) {
                    console.log(body);
                });
            }
        }),
    },
});
