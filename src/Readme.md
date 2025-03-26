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

