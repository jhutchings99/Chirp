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
    registerUsername: '',
    registerPassword: '',
    registerConfirmPassword: '',
    registerEmail: '',
    registerFirstName: '',
    registerLastName: '',
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
  
      // parse the body
      let body;
      try {
          body = response.json();
          console.log(body);
      } catch (error) {
          console.log("Response body was not json")
      }
  
      // check - was the login successfull
      if (response.status == 201) {
          // successfull login
          console.log("Welcome");
  
          // clear inputs
          this.loginUsername = "";
          this.loginPassword = "";
  
          // take the user to the home page
          this.page = 'main';
          this.loggedIn = true;
  
      }
      else if (response.status == 400 || response.status == 401){
          this.errorMessage = "Login Info was Incorrect.";
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
          console.log(data)

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

    createUser: async function () {
      if (this.registerPassword != this.registerConfirmPassword) {
        return;
      }
      let newUser = {
        username: this.registerUsername,
        password: this.registerPassword,
        email: this.registerEmail,
        firstName: this.registerFirstName,
        lastName: this.registerLastName,
      };

      let response = await fetch(`${URL}/users`, {
        method: 'POST',
        body: JSON.stringify(newUser),
        headers: {
          'content-type': 'application/json',
        },
        credentials: 'include',
      });
      let data = await response.json();
      console.log(response.status);
      console.log(data);
      if (response.status == 201) {
        this.page = 'login';
      } else {
        console.log('Error creating user:', response.status);
      }
    },

  },
  created: function () {
    this.getChirps();
    this.getSession();
  }

  // pageCookie: function (currentPage) {
  //   document.cookie = 'currentPage =' + currentPage;
  // },
  // endSession: function () {},
  // created: function () {
  //   this.getChirps();
  // },
});
