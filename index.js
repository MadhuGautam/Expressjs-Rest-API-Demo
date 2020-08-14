//Joi is a class & first capital letter denote the classname in js
const Joi = require('joi');
const express = require('express');
const app = express();

//enable the express.json() to parsing the data in json on line number 23 
app.use(express.json());

const courses = [
{id:1, name:'course1' },
{id:2, name:'course2'},
{id:3, name:'course3'},
];
//return all courses http://localhost:3000/api/courses/
app.get('/api/courses', function (req, res) {
  res.send(courses);
});

//-------------------------------------------------Handling post request------------------------------------------

//handling http post request to create new course passing values to api thru postman
app.post('/api/courses', function (req, res) {
  //to validate input without joi
  // if(!req.body.name || req.body.name.length <3)
  // {
  //   //400 Bad request
  //   res.status(400).send("Name is required and should be minimum 3 characters.");
  //   return;
  // }

  //validate input with joi
  // const schema = {
  //   name: Joi.string().min(3).required()
  // };

  // const result = Joi.validate(req.body, schema); //validate() is not a joi function in above 13.1.0 version
  // console.log(result);
  // if(result.error){
  //   res.status(400).send(result.error.details[0].message);
  //   return;
  // }

  //validate the input value in concise way
  const { error } = validateCourse(req.body); // validateCourse return two properties - error or value, we use error
  if(error) return res.status(400).send(error.details[0].message);
    
  //add new courses in array
  const course = {
    id: courses.length + 1,
    name: req.body.name   // to get the name property from html body page
  };
  courses.push(course);
  res.send(course);
});
//to test it open postman in chrome

//-------------------------------------------------Handling get request------------------------------------------

//to return single course by id http://localhost:3000/api/courses/1

app.get('/api/courses/:id', function (req, res) {
  //find courses by id it return true or false http://localhost:3000/api/courses/10
  const course = courses.find(c =>c.id ===parseInt(req.params.id)); 
  if(!course) return res.status(404).send('The response with the given id was not found.');
  res.send(course);
});

app.get('/',(req,res)=>{
    res.send('Helloo Madhu');
});
/* the below request is not handled only the above is handled on the root page*/
app.get('/',(req,res)=>{
    res.send([1,2,3,4]);
});

app.get('/about',(req,res)=>{
    res.send('this is our about page content');
});

app.get('/users/:userId/books/:bookId', function (req, res) {
    res.send(req.params)
  });

  //http://localhost:3000/api/posts/2018/1
  app.get('/api/posts/:year/:month', function (req, res) {
    res.send(req.params)
  });
  app.get('/api/posts/:year', function (req, res) {
    res.send(req.params.year)
  });

  //http://localhost:3000/api/posts/2018/1/1?sortBy=name------ o/p sortBy:name
  app.get('/api/posts/:year/:month/:date', function (req, res) {
    res.send(req.query)
  });

  //-------------------------------------------------Handling put request------------------------------------------
  //to update data of given id
app.put('/api/courses/:id', function (req, res) {
  //find courses by id it return true or false http://localhost:3000/api/courses/10
  const course = courses.find(c =>c.id ===parseInt(req.params.id)); 
  if(!course) return res.status(404).send('The response with the given id was not found.');

  //validate the updated value
  const { error } = validateCourse(req.body); // validateCourse return two properties - error or value, we use error
  if(error) return res.status(400).send(error.details[0].message);
  
  //update the selected id name property
  course.name = req.body.name;

  //updated data return
  res.send(course);
});

function validateCourse(course){
    const schema={
      name: Joi.string().min(3).required()
    };

    return Joi.validate(course, schema);
}

//------------------------------------- handling delete request---------------------
app.delete('/api/courses/:id', function (req, res) {
  //find courses by id it return true or false http://localhost:3000/api/courses/10
  const course = courses.find(c =>c.id ===parseInt(req.params.id)); 
  if(!course) return res.status(404).send('The response with the given id was not found.');

  
  //delete  the selected id name property
  const index = courses.indexOf(course);
  courses.splice(index, 1); // index , no. of property to delete

  //updated data return
  res.send(course);
});


const port = process.env.PORT || 3000;
app.listen(port, ()=> console.log(`listening on port ${port}....`));