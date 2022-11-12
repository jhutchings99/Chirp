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
    currentUser: '',
    readingComments: false,
    newComment: '',
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
                embeddedSong: this.embeddedSong
            };
            let userid = await this.currentUser.id;
            console.log("userID:", userid);
            console.log("postBODY:", postBody);
            console.log("currentUSER:", this.currentUser);
            let response = await fetch(`${URL}/users/${userid}/chirps`, {
                method: "POST",
                body: JSON.stringify(postBody),
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include"
            });

            if (response.status == 201 || response.status == 200) {
                // created successfully
                console.log("created station");
                this.postBody = "";
                this.embeddedSong = "";
                this.getChirps();
            } else {
                console.log("Error posting chirp:", response.status);
            }
        },

        // createComment: async function (comment) {
        //     let response = await fetch(`${URL}/comments`, {
        //         method: 'POST',
        //         body: JSON.stringify(comment),
        //         headers: {
        //             'Content-Type': 'application/json',
        //         },
        //         credentials: 'include'
        //     });
        //     let data = await response.json();
        //     console.log(response.status);
        //     console.log(data);
        //     if (response.status == 201) {
        //         this.getComments();
        //     } else {
        //         console.log('Error creating post:', response.status);
        //     }
        // },

        addingLikes: async function (chirpid) {
            let userid = await this.currentUser.id;
            console.log(chirpid);
            console.log(this.currentUser.id);
            let response = await fetch(`http://localhost:8080/users/${userid}/chirps/${chirpid}/likes`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include"
            });
            if (response.status == 201) {
                console.log("like added");
                this.getChirps();
            }
            else if (response.status == 200){
                console.log("unlike pending....");
                this.removingLikes(chirpid,userid);
            }
            else {
                console.log("could not add like");
            }
        },
        removingLikes: async function(chirpid,userid){
            console.log("unliking.... stand by ....");
            let response = await fetch(`http://localhost:8080/users/${userid}/chirps/${chirpid}/likes`, {
                method: "DELETE",
                credentials: "include"
            });
            if (response.status == 200){
                console.log("deleted like!!!");
                this.getChirps();
            }else{
                console.log("failed to remove like");
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
            // check - was the login successfull
            if (response.status == 201) {
                // successfull login
                console.log("Welcome");

                // clear inputs
                this.loginUsername = "";
                this.loginPassword = "";
                let data = response.json();
                this.currentUser = data;

                // take the user to the home page
                this.page = 'main';
                this.loggedIn = true;
                window.location.reload();

            }
            else if (response.status == 400 || response.status == 401) {
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
        logoutUser: async function () {
            let response = await fetch(`${URL}/sessions`, {
                method: 'DELETE',
                credentials: 'include',
            });
            let data = await response.json();
            window.location.reload();
        },
        addCommentToChirp: async function (chirpid) {
          let userid = await this.currentUser.id;
          console.log(chirpid);
          console.log(this.currentUser.id);
          let newComment = {
            message: this.newComment,
          }
          let response = await fetch(`http://localhost:8080/users/${userid}/chirps/${chirpid}/comments`, {
              method: "POST",
              headers: {
                  "Content-Type": "application/json"
              },
              body: JSON.stringify(newComment),
              credentials: "include"
          });
          if (response.status == 200) {
              console.log("comment added");
              this.newComment = "";
              this.getChirps();
          }
          else {
              console.log("could not add comment");
          }
        },
    },
    created: function () {
        this.getChirps();
        this.getSession();
    }
});
