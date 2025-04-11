run command  :npm run start
if node_modules was deleted then run command : npm  install



Notes : 
- Create a respositiry
- intialise the repository
- node_modules , package.json, package-lock.json
- install express
- create a server
- listen to a port 7777
- write request handlers for /test, /hello
- install nodemon and update scripts inside package.json
- what are dependencies
- what is the use of -g while npm insatll
- difference between caret and tilde(^ vs ~)

- Initialize git
- gitignore
- create a remote repo on github
- Push all code to remote origin
- Play with routes and route extension ex. /hello, /, hello/2, /xyz
- Order of the routes matter a lot 
- Install a Postamn app and make workspace/collection and test api call 
- we can make same APIS on different HTTP method
- write logic to handle GET, POST , PATCH, DELETE Api calls and test then on postman.
- app.get("/ab?c", (req,res)=>{}) : this line means b is optional route will accept both '/ac' and '/abc
- app.get("/ab+c", (req,res)=>{}) : this line means adding b any no of time,  route will accept both '/abc' , '/abbbbbbc
- app.get("/ab*cd", (req,res)=>{}) : this line means adding any char any no of times,  route will accept '/abcd' , '/abefghcd
- app.get("/a(bc)?d", (req,res)=>{}) : this line means bc is optional 
- app.get("/a/", (req,res)=>{}) : this line means a must me present, we can also append any char after a
/*fly$/ => start any of the char but fly must be at the end

http://localhost:7777/user/101 => 101 is req.params
http://localhost:7777/user?userId=102 => 102 is req.query

//app.get("/user/:userId", ()=>{}) : dynamic route accepts /user and /user/101 both

- Use of regex in routes

- if we dont send  res.send() then api must be hang and we can send only one response since tcp conn will closed after receiiving the response

- Multiple route Handlers - PLay with the code
- next()
- next function and errors along with res.send()
- app.use("/route" , rH, rH1, rH2, rH3);
- What is a Middleware? Why do we need it?
- How expressJs basically handles requests behind the scenes
- Difference app.use and app.all
- Write a dummy auth middleware for admin
- Write a dummy auth middleware for all user routes, except /user/login
- Error Handling using app.use("/, (err,req,res,next) => {})

- create a free cluster on MongoDb official website (Mongo Atlas)
- Install mongoose Library
- COnnect your Application to the Database connection-url devTinder
- call the connectDb function and connect to databse before starting application 7777
- create a user Schema and user Model
- Create POST /signup api to add data to database
- Push some socuments using API calls from postman
- Error Handling using try catch
- Js object vs JSON difference
- server cannot read json need middleware to convert into json in post req.body
- add the express.json middleware to your app
- Make your signup api dynamic to receive data from the end user
- User.findone with duplicate email ids which object returned
- API - Get user by email
- API - Feed API - Get /feed - get all the users from the database
- API - Get iser by ID
- Create a delete user API
- Difference between patch and put
- If i updata a field which is not present then monogodb ignore that field
- API update a user
- Explore the mongoose Documentation for Model methods
- WHat are options in a model.findOneAndUpdate method, explore more about it
- API update the user with email ID
- Explore Schematype options from the documentation
- Add required, unique, lowercase, min, minLength, trim
- Add Default
- Create a custom validate function for gender
- Improve  the DB Schema -PUT all appropriate validations on each field in Schema
- Add timestamps to the userSchema
- Add Api level validation on patch request and signup post API
- Data Sanitizing : Add Api validation for each field
- Install validator
- Explore Validator library function and Use validator function for password, email etc
- Never trust req.body


- Validate data in SignUP API
- Install bcrypt package
- Create PasswordHash using bcrypt.hash & save the user with encrypted password
- Create login APi
- Compare password and throw errors if email or password is invalid

- install cookie-parser
- just send a dummy cookie to user
- create a profile API and check if you get the cookie back 
- install jsonwebtoken
- In login API, after email and password validation, create a jwt token and send it to user in cookies
- Read the cookies inside your profile API and find the loggedin user.
- userAuth middleware
- Add the userauth middleware in profile AP and a new sendConnectionRequest API
- Set the expiry of JWT token and cookies to 7 days
- Create userSchema methoid to getJWT()
- create userScheme method to compare password(passwordInputByUser)

- Explore tinder APIs
- Create a list of all API you can think of Dev Tinder
- Group multiple routes under respective routers
- Read documentation for express.router
- Create routes folder for managing auth, profile, request routers
- Create authRouter, profileRouter, requestRouter
- Import these routers in app.js
- Create POST /logout API
- Create Patch /profile/edit
- Create Patch /profile/password API => forgot password API
- Make Sure validate all data in every POST, PATCH APIs

- create connection request Schema
- Send connection Request APIs
- Proper validation of Data
- Think about all corner cases
- $or query and $and queries
- Schema.pre("save") function
- in model unique : true means that they are indexed and querying will be faster
- why do we need index in DB
- What is the advantage and disaadvantages of creating ?
- Read article about compound index
- Always think about corner cases

- Write code with proper validation for POST /request/review/accepted/67f67ee13c6a0a2ddc2b6116
- Thought Process - POST vs GET
- Read about ref and populate
- Create GET /requests/received with all the checks
- create GET /user/connection
- Always compare 2 mongoDb id using equal function or convert it into string toString()

- Logic for GET /feed API
- Explore the $nin, $and, $ne and others
- Pagination  

/feed?page=1&limit=10 => 1-10   => skip(0)  & limit(10)
/feed?page=2&limit=10 => 11-20  => skip(10) & limit(10)
/feed?page=3&limit=10 => 21-30  => skip(20) & limit(10)

skip = (page- 1) * 10



























some imp code
app.get("/user", (req,res,next)=>{
    console.log("first route handler");
    // res.send("first route handle response");
    next();
},
(req,res)=>{
    console.log("second route handler");
    res.send("first route handle response");
})

app.post("/user", (req,res)=>{
    console.log("save data to the database");
    res.send("Data saved successfully");
})

app.delete("/user", (req,res)=>{
    res.send("Data delete successfully");
})

use match all the http method APi call to /hello
app.use("/hello",(req,res)=>{
    res.send("hello hello hello");
});

app.use("/test",(req,res)=>{
    res.send("hello from the test");
});

//sequences of route matter, place this route always at the end else it will override other route
app.use("/",(req,res)=>{
    res.send("hello from the dashboard");
});



When the database is successfuly connected then only listen for request becuz api may contain some database operation





Salaries : 
empid integer
salary float
monthYear YY-MM

second hightst avg salry of 3 month
resut :  empid salry


select AVG()  empid  , salry from salries where salary < (select Max(salary) from Salaries) LIMIT 3
