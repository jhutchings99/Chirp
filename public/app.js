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
    posting: false,
    postMessage: '',
    embeddedSong: '',
    userId: '',
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

    getLoggedInUser: async function () {
      let response = await fetch(`${URL}/sessions`);

      let body = await response.json();

      if (response.status == 200) {
          console.log("Successful user retrieval");
          this.userId = body.id;
      } else {
          console.log("error GETTING /sessions", response.status, response);
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

    createChirp: async function () {
      let postBody = {
        message: this.postMessage,
        embeddedSong: this.embeddedSong,
    }

    let response = await fetch(URL + "/users/:_id/chirps", {
        method: "POST",
        body: JSON.stringify(postBody),
        headers: {
            "Content-Type" : "application/json"
        },
        credentials: "include"
    });

    if (response.status == 201) {
        // created successfully
        console.log("created station");
        this.postBody = "";
        this.embeddedSong = "";
        this.getChirps();
    } else {
        console.log("Error posting chirp:", response.status);
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
