const express = require("express");
const app = express();
const { dirname } = require("path");
const { v4: uuidv4 } = require("uuid");

const fs = require("fs");
app.use(express.json())
//const fs = require("fs/promises")

// app.use("/abc",function(req,res,next){
//     console.log("app level middlewARE RAN")
// })
// middleware
// const logger = function(req,res,next){
//     console.log("this is a middleware")
//     res.json({page : "this is the about page"})
//     next()
// }
// const anotherM = function(req,res,next){
//     // req.abx = "hello world"
//     return next()
// }
// express.json() -middleware
app.post("/users", function (req, res) {
  console.log(req.body);
  res.send("received");
});

app.post("/newusers", function (req, res) {
  console.log(req.body);
  res.send("received");
});
// express.urlencoded() -middleware
// app.post("/users", express.urlencoded({extended : false}),function(req,res){
//     console.log(req.body)
//     res.send("received")
// })

//app.get("/users",function(req,res){
// const data = JSON.parse(fs.readFileSync(__dirname + "/db/users.json", "utf-8"))
// const data = await fs.readFile(__dirname + "/db/users.json", "utf-8")
// fs.readFile(__dirname + "/db/users.json", "utf-8")
// .then(d=> JSON.parse(d))
// .then(data=> res.json(data))
//return res.json(data)
//})

// app.get("/about", anotherM, logger, function(req,res){
//     // console.log(req.abx)
//     return res.send("hello world")
// })

//  req params
// app.post("/users/:id",express.json(), function(req,res){
//     console.log(req.params)
//     res.send("this users ID is " + req.params.id )
// })

app.post("/users/:id/:task", express.json(), function (req, res) {
  console.log(req.params);
  res.send("this users ID is " + req.params.id);
});

// @ get all todos
// respond back to client
app.get("/todos", function (req, res) {
  const jsonTodos = fs.readFileSync(__dirname + "/db/todos.json", "utf-8");
  const todos = JSON.parse(jsonTodos);
  return res.json(todos);
});

// using Async and await
// app.get("/todos", async function(req,res){
//         const jsonTodos = await fs.readFile(__dirname + "/db/todos.json", "utf-8")
//         const todos = JSON.parse(jsonTodos)
//         return res.json(todos)
//     })

//  @ add a new todo
// we are expecting json object : express.json()
app.post("/todos", express.json(), function (req, res) {
  const jsonTodos = fs.readFileSync(__dirname + "/db/todos.json", "utf-8");
  const todos = JSON.parse(jsonTodos);
  todos.push({ ...req.body, _id: uuidv4() });
  fs.writeFileSync(__dirname + "/db/todos.json", JSON.stringify(todos));
  return res.json({ message: "todo added!" });
});

// Async and await
// app.post("/todos",express.json(), async function(req,res){
//     const jsonTodos = await fs.readFile(__dirname + "/db/todos.json", "utf-8")
//     const todos = JSON.parse(jsonTodos)
//     todos.push({...req.body, _id : uuidv4()})
//     await fs.writeFile(__dirname + "/db/todos.json", JSON.stringify(todos))
//     return res.json({message : "todo added!"})
// })

// @ get one todo
app.get("/todos/:id", function (req, res) {
  const jsonTodos = fs.readFileSync(__dirname + "/db/todos.json", "utf-8");
  const todos = JSON.parse(jsonTodos);
  const todo = todos.filter((todo) => todo._id == req.params.id)[0];
  if (todo) return res.json(todo);
  return res.json({ message: "no todos found" });
});

// do with .then

app.get("/todos/:id", function (req, res) {
  fs.readFile(__dirname + "/db/todos.json", "utf-8")
    // const todos = JSON.parse(jsonTodos)
    .then((d) => {
      const todos = JSON.parse(d);
      const todo = todos.filter((todo) => todo._id == req.params.id)[0];
      if (todo) return res.json(todo);
      return res.json({ message: "no todos found" });
    });
});

// 9bfa9237-a13c-4b42-944e-bb6ed9dfd5d2
// 30085e58-23ae-4382-a743-1bcb526cb9e9

// app.delete('/todos/:id', (req, res)=>{
//     const jsonTodos = fs.readFileSync(__dirname + '/db/todos.json', 'utf-8');
//     const todos = JSON.parse(jsonTodos);
//     const newTodo = todos.filter((elem) => elem._id !== req.params.id)
//     fs.writeFileSync(__dirname + '/db/todos.json', JSON.stringify(newTodo))
//     res.json({message: 'Deleted!'})
// })

// app.patch('/todos/:id',  (req, res) => {
//     let id = req.params.id;
//   const jsonTodos =  fs.readFileSync(__dirname + "/db/todos.json", "utf-8");
//   const todos = JSON.parse(jsonTodos);
//   //console.log(todos)
//    ;
//   let todosUpdate = todos.find((item) => item._id === id);
//   let index = todos.indexOf(todosUpdate);
//   Object.assign(todosUpdate, req.body);

//   //todos[index] = todosUpdate;
//   //console.log(todos)
//    fs.writeFileSync(
//     __dirname + "/db/todos.json",
//     JSON.stringify(todos),
   
//   );
//   res.status(200).json(todosUpdate)
// });


app.patch("/todos/:id", (req, res) => {
  let id = req.params.id;
  const jsonTodos = fs.readFileSync(__dirname + "/db/todos.json", "utf-8");
  const todos = JSON.parse(jsonTodos);

  let todosUpdate = todos.find((item) => item._id === id);
  //let index = todos.indexOf(todosUpdate);
  Object.assign(todosUpdate, req.body);

  fs.writeFileSync(__dirname + "/db/todos.json", JSON.stringify(todos));

  res.status(200).json(todosUpdate);
});

app.listen(3000, console.log("app running on port 3000"));
