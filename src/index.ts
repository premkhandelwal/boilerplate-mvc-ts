import cors from 'cors'
import express, { Application, Response, Request } from 'express'
import session from 'express-session'
import passport from 'passport'
import Cookie from 'js-cookie'

const GoogleStrategy = require('passport-google-oauth20').Strategy

const app: Application = express()

require('dotenv').config()

const PORT = 8080

console.log(`${process.env.GOOGLE_CLIENT_ID}`)

app.use(express.json())
app.use(cors({ origin: 'http://localhost:3000', credentials: true }))

app.set('trust proxy', 1)

app.use(
  session({
    secret: 'secretcode',
    resave: false,
    saveUninitialized: false,
  }),
)

app.use(passport.initialize())
app.use(passport.session())

passport.serializeUser((user: any, done: any) => {
  // console.log("IN Serialize" +  )
  return done(null, user.displayName)
})

passport.deserializeUser((name: string, done: any) => {
  // console.log("IN DeSerialize" + user)

  return done(null, name)
})

passport.use(
  new GoogleStrategy(
    {
      clientID: `${process.env.GOOGLE_CLIENT_ID}`,
      clientSecret: `${process.env.GOOGLE_CLIENT_SECRET}`,
      callbackURL: 'http://localhost:8080/auth/google/callback',
    },
    function (_: any, __: any, profile: any, cb: any) {
      console.log(profile)
      cb(null, profile)
    },
  ),
)

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World')
})

app.get(
  '/auth/google',
  passport.authenticate('google', { scope: ['profile'] }),
  (req, res) => {
    console.log('Helloooji')
    res.status(200)
    // The request will be redirected to Google for authentication, so
    // this function will not be called.
  },
)

app.get(
  '/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login', session: true }),
  (req, res) => {
    res.redirect('http://localhost:3000/')
    // res.redirect('http://localhost:3000/', )
    // res. send(JSON.stringify(req.user))
    // Successful authentication, redirect home.
  },
)

app.get('/getuser', (req, res) => {
  console.log('Get User: ' + req.user)

  res.send(req.user)
})

function sleep(millis: number) {
  return new Promise(resolve => setTimeout(resolve, millis));
}

app.post('/auth/logout',  function (req:any, res:any, next:any){
  req.session.destroy(function (err:any) {
        console.log('logout callback called')
        if (err) {
          console.log('error', err)
          return next(err)
        }
        
    
      //   //removed the json response in the callback as for some reason the callback wont execute the code placed inside it, I can however confirm the session has been scrapped and the user logged out. I also removed the console log for "logout callback called" as it was not firing either.
      },
      (req:any, res:any) => {
        res.status(200);
      }
      )
},
(req:any, res:any, next:any)=>{
  req.logout(function (err:any){});
}
)
//   console.log('logout user', req.user)
//   delete req.session;
// res.clearCookie('connect.sid', {path: '/'});
// res.status(200)

//   // res.clearCookie('connect.sid', {path: '/'});
//   // req.session.destroy(function(err) {})

//   // req.session.reload(function (err) {

//   //   res.clearCookie('connect.sid', {path: '/'});
//   //   res.end()
//   // })
//   req.session.destroy(function (err:any) {
//     console.log('logout callback called')
//     if (err) {
//       console.log('error', err)
//       return next(err)
//     }

//   //   //removed the json response in the callback as for some reason the callback wont execute the code placed inside it, I can however confirm the session has been scrapped and the user logged out. I also removed the console log for "logout callback called" as it was not firing either.
//   })
  
//   /* req.logOut(req.user, async function (err) {
    
//     // window.open('http://localhost:3000/', '_self')
//     console.log('logout callback calmmmled')
   
    
    
//     console.log('logout callback called')
//   // res.redirect("http://localhost:3000/")

   
    
//     //removed the json response in the callback as for some reason the callback wont execute the code placed inside it, I can however confirm the session has been scrapped and the user logged out. I also removed the console log for "logout callback called" as it was not firing either.
//   })
//   res.clearCookie('connect.sid', {path: '/'}); */
//   /* req.session.reload(function (err) {
//     // res.end()
//     // window.open('http://localhost:3000/', '_self')
//     // res.redirect("http://localhost:3000/")
//   res.redirect("http://localhost:3000/")
//   res.end()
    
// // res.end()
    
    
//     if (err) {
//       console.log('error', err)
//       return next(err)
//     }
    
//     //removed the json response in the callback as for some reason the callback wont execute the code placed inside it, I can however confirm the session has been scrapped and the user logged out. I also removed the console log for "logout callback called" as it was not firing either.
//   }); */
//   // res.clearCookie('connect.sid', {path: '/'});
//   // // res.clearCookie('sid', {path: '/'});
//   // res.end()
//   // delete req.session

//   // next();
//   // res.send('done')
//   console.log('logout called')
// },
// (req, res) => {
// // delete req.session;
// req.session.destroy(function(err) {

//   res.clearCookie('connect.sid', {path: '/'});
// });
// res.status(200)
// }



app.listen(PORT, () => {
  console.log('Listening on port ' + PORT)
})
