const URL = `http://localhost:8080`;

var app = new Vue({
  el: '#app',
  data: {
    postList: [],
    trendingPosts: [],
    postComments: [],
    allChirps: [],
    home: true,
    chirps: [],
    page: 'login',
    posting: false,
    postMessage: '',
    embeddedSong: '',
    userId: '',
    loggedIn: false,
    loginUsername: '',
    loginPassword: '',
    currentUser: '',
  },
  methods: {
    getChirps: async function () {
      let response = await fetch(`${URL}/chirps`);
      let body = await response.json();

      if (response.status == 200) {
        console.log('Successful chrips retrieval');
        this.allChirps = body;
      } else {
        console.log('error GETTING /chirps', response.status, response);
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

    createChirp: async function (user) {
      let postBody = {
        message: this.postMessage,
        embeddedSong: this.embeddedSong,
    }

    let response = await fetch(URL + `/users/${user._id}/chirps`, {
        method: "POST",
        body: JSON.stringify(postBody),
        headers: {
            "Content-Type" : "application/json"
        },
        credentials: "include"
    });

    if (response.status == 201) {
        // created successfully
        console.log("created chirp");
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

    loginUser: async function () {
      // attempt to login
      let loginCredentials = {
          username: this.loginUsername,
          password: this.loginPassword
      };
  
      let response = await fetch('http://localhost:8080/sessions', {
          method: "POST",
          body: JSON.stringify(loginCredentials),
          headers: {
              "Content-Type": "application/json"
          },
          credentials: "include"
      });
      
      // check - was the login successfull
      if (response.status == 201) {
        let data = await response.json();
        // successfull login
        console.log("Welcome");
        this.currentUser = data;
        
        // clear inputs
        this.loginUsername = "";
        this.loginPassword = "";

        // take the user to the home page
        this.page = 'main';
        this.loggedIn = true;
      }
      else if (response.status == 400 || response.status == 401){
        console.log("Invalid username or password");
      }
    },

    getSession: async function () {
      let response = await fetch(`${URL}/sessions`, {
          method: "GET",
          credentials: "include"
      });

      // Check if logged in
      if (response.status == 200) {
          // logged in
          let data = await response.json();
          this.currentUser = data;
          this.page = 'main';
          this.loggedIn = 'true';
      } else if (response.status == 401) {
          // not logged in
          let data = await response.json();
          this.loggedIn = false;
      } else {
          console.log("error GETTING /session", response.status, response);
      }
    },
  },
  created: function () {
    this.getChirps();
    this.getSession();
  }
});
