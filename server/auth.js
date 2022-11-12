const passport = require("passport");
const LocalStrategy = require("passport-local");
const { User } = require("../persist/posts");
const bcrypt = require("bcrypt");

passport.use(new LocalStrategy(async (username, password, done) => {
    let user;
    try {
        user = await User.findOne({username: username});
        if (!user) {
            return done(null, false);
        }
        const verifiedPassword = await bcrypt.compare(password, user.password);
        if (!verifiedPassword) {
            return done(null, false);
        } else {
            return done(null, user);
        }
    } catch (err) {
        return done(err);
    }
}));

const setUpAuth = function (app) {
    app.use(passport.initialize());
    app.use(passport.authenticate("session"));

    passport.serializeUser(function (user, callback) {
        callback(null, {id: user._id, username: user.username, password: user.password});
    });

    passport.deserializeUser(function (user, callback){
        return callback(null, user);
    });

    app.post("/sessions", passport.authenticate("local"), (req,res) => {
        res.status(201).json({message: "Successfully Authenticated", id: req.user.id});
    });

    app.get("/sessions", (req, res) => {
        if (!req.user) {
            res.status(401).json({message: "Unauthorized"});
            return
        }
        res.status(200).json({message: "Authorized", id: req.user.id, email: req.user.username, password: req.user.password});
    });

    app.delete('/sessions', function(req, res){
        req.logout(function(err) {
          if (err) { return next(err); }
          res.redirect('/');
        });
      });
    }

module.exports = setUpAuth