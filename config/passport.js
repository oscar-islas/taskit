//Definimos la estrategia local con todas sus configuraciones
const passport = require("passport");
const bcrypt = require("bcryptjs");
const LocalStrategy = require("passport-local").Strategy;
const GoogleStrategy = require("passport-google-oauth2").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
const { Users } = require("../models");
const {
    newUser,
    checkUserExist,
    linkUserProvider,
    randPasswd,
} = require("../services/auth.service");
require("dotenv").config();

//Estrategia local
passport.use(
    new LocalStrategy(
        {
            usernameField: "email",
        },
        async (email, password, done) => {
            //Comprobar que exista el correo electronico en la DB
            try {
                let user = await Users.findOne({ where: { email } });
                //user va a estar definido si el correo se encuentra en la DB
                //user = null si el correo no se encuentra en la DB
                //Comprobar si la contraseña de la DB es igual a la que me envía el cliente
                if (user && bcrypt.compareSync(password, user.password)) {
                    //Vamos a enviar los datos del usuario al serializador
                    return done(null, user);
                }
                //Las credenciales del usuario son incorrectas / no existe el correo en la DB
                return done(null, false);
            } catch (error) {
                done(error);
            }
        }
    )
);

//Estrategia Google OAuth 2.0
passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENTID,
            clientSecret: process.env.GOOGLE_SECRET,
            callbackURL: process.env.GOOGLE_REDIRECT_URI,
        },
        (accessToken, refreshToken, profile, done) => {
            return done(null, profile);
        }
    )
);

//Estrategia Facebook
passport.use(
    new FacebookStrategy(
        {
            clientID: process.env.FB_CLIENTID,
            clientSecret: process.env.FB_SECRET,
            callbackURL: process.env.FB_REDIRECT_URI,
            profileFields: ['id', 'email', 'gender', 'link', 'locale', 'name', 'timezone', 'updated_time', 'verified']
        },
        (accessToken, refreshToken, profile, done) => {
            return done(null, profile);
        }
    )
);

//Serialización
passport.serializeUser(async (profile, done) => {
    //Google y Facebook
    console.log(profile);
    if (profile.provider) {
        //Vamos a obtener los datos del usuario a partir del ID
        let email = profile.email;

        //1. Comprobar si el correo obtenido ya está registrado en nuestro sistema
        //2. Si no existe... -> crear una cuenta con los datos que recibo del proveedor
        //3. Si existe... -> vincular la cuenta local con la cuenta del proveedor
        let user = await checkUserExist(email);
        let providerId = profile.id;
        
        let firstname = profile.provider === "google" ? profile.given_name : profile.displayName;
        let lastname = profile.provider === "google" ? profile.family_name : "null";

        let userObj = {
            firstname,
            lastname,
            email: profile.email,
            password: randPasswd(),
        };
        
        if (user) {
            let userId = user.id;
            //Ligamos la cuenta local con la del proveedor
            await linkUserProvider(providerId, userId, profile.provider);
            return done(null, user);
        } else {
            //Creamos la cuenta local para el proveedor
            let newUserObj = await newUser(userObj);
            let userId = newUserObj.id;
            //Ligamos la cuenta local con la del proveedor
            await linkUserProvider(providerId, userId, profile.provider);
            return done(null, newUserObj);
        }
    }

    //Firmar los datos del usuario
    return done(null, profile);
});

//Deserialización
passport.deserializeUser(async (profile, done) => {
    try {
        switch (profile.provider) {
            case "google":
                //Generado por google
                profile.firstname = profile.name.givenName;
                profile.lastname = profile.name.familyName;
                done(null, profile);
                break;
            case "facebook":
                profile.firstname = profile.displayName;
                profile.lastname = "";
                done(null, profile);
                break;
            default:
                let user = await Users.findByPk(profile.id, { plain: true });
                done(null, user); //request -> request.user
                break;
        }
    } catch (error) {
        done(error);
    }
});
