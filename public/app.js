const URL = `http://localhost:8080`;
var client_id = 'd3e8e97511ab4c18a73be0f3603ed003'; // Your client id
var client_secret = '987b35771c224c58b800102416060691'; // Your secret
var redirect_uri = 'http://localhost:8888'; // Your redirect uri

var app = new Vue({
    el: '#app',
    data: {
        postList: [],
        postComments: [],
        post: {},
        home: true,
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

    },
});
