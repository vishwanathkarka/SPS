const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');
const YAML = require('yamljs');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = YAML.load('./swagger.yaml');
const path = require('path')
const app = express();
const home = require("./routes/home")
var cors = require('cors')
const cookieSession = require("cookie-session");

require("./controllers/passport")
const passport = require('passport')


// Import all routes
const homeRoutes = require('./routes/home');
const userRoutes = require('./routes/user');
const Permission = require('./routes/permission');

app.use(
  cookieSession({
    maxAge: 3 * 24 * 60 * 60 * 1000,
    keys: [process.env.JWT_SECRET], // dotenv
  })
);

app.use(passport.session());
app.use(passport.initialize());

//Regular middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true}));
app.use(cors());
// Temp check
app.use(express.static(path.join(__dirname,'./student-permission/build')))
// app.set('view engine', 'ejs');


// Cookies and file middlewares
app.use(cookieParser());
app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: 'tmp/'
}));

//Swagger middleware
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


//Morgan middleware
app.use(morgan('tiny'))

app.use('/api/v1', homeRoutes);
app.use('/api/v1', userRoutes);
app.use('/api/v1',Permission);

// app.get('/signup', (req, res) => res.render('signup'));
app.get('/password/reset/:token', (req, res) => res.render('passwordReset', {token: req.params.token}));
app.set("view engine", "ejs");
app.use("/google",home );
// app.use(passport.initialize() );


app.use('*',(req,res)=> {
  res.sendFile(path.join(__dirname,"./student-permission/build/index.html"))
})

// Export app js
module.exports = app;