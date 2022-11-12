const URL = `http://localhost:8080`;

var app = new Vue({
  el: '#app',
  data: {
    postList: [],
    postComments: [],
    allChirps: [],
    home: true,
    chirps: [],
    page: 'login',
  },
  methods: {
    getChirps: async function () {
      let response = await fetch(`${URL}/chirps`);

      let body = await response.json();

      if (response.status == 200) {
          console.log("Successful chrips retrieval");
          this.allChirps = body;
      } else {
          console.log("error GETTING /chirps", response.status, response);
      }
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

    getChirp: async function (postId) {
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
  created: function () {
    this.getChirps();
  }
});
