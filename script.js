const express = require('express') // 1. import express library
const Joi = require('joi') // 2. import joi

const app = express(); // 3. create express application on the app variable
app.use(express.json()); // 4. used the json file ( connected to data)

// 6. give data to the server
const customers = [
  {title: 'George', id: 1},
  {title: 'Josh', id: 2},
  {title: 'Tyler', id: 3},
  {title: 'Alice', id: 4},
  {title: 'Candice', id: 5}
]

// READ (get) request handlers
// 7. display the message when the URL consist of '/'
// req = request; client side
// res = response; server side
app.get('/',(req, res) => {
  res.send('Welcome to Leonor REST API!');
});

// 8. display list of customers when URL consists of api customers
app.get('/api/customers',(req, res)=> {
  res.send(customers);
});

// 9. get information of a specific customer when you mention the id
app.get('/api/customers/:id', (req, res)=> {
  // need to find the id
  const customer = customers.find(c=> c.id === parseInt(req.params.id));
  // if there is no valid customer id, display an error to the user
  if (!customer) res.status(404).send('<h2 style="font-family: Malgun Gothic; color:darkred;">Ooops...Cant find what you are looking for!</h2>');
  res.send(customer);
});

// CREATE (post) request handlers (used to create data)
// 10. create new customer info
// NOT WORKING
app.post('/api/customers', (req, res)=> {
  // 11. validate customer
  const { error } = validateCustomer(req.body);
  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  }
  // 13. increment customer id
  const customer = {
    id: customers.length + 1,
    title: req.body.title
  };
  // 14. save in data
  customers.push(customer);
  // 15. show the customer to the user
  res.send(customer);
});


// UPDATE (PUT) request handlers
// NOT WORKING
app.put('/api/customers/:id', (req,res) => {
  const customer = customers.find(c=> c.id === parseInt(req.params.id));
  if (!customer) res.status(404).send('<h2 style="font-family:Malgun Gothic; color:darkred;">Not found!</h2>');

  const { error } = validateCustomer(req.body);
  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  }

  customer.title = req.body.title;
  res.send(customer);
});

// DELETE request handlers
app.delete('/api/customers/:id', (req, res)=> {
  const customer = customers.find(c=>c.id === parseInt(req.params.id));
  if (!customer) res.status(404).send('<h2 style="font-family:Malgun Gothic; color:darkred;">Not found!</h2>');

  const index = customers.indexOf(customer);
  // remove from customers the index of customer
  customers.splice(index,1);
  res.send(customer);
});


// 12. validate information
function validateCustomer(customer) {
  const schema = {
    // minimum  characters
    title: Joi.string().min(3).required()
  };
  return Joi.validate(customer, schema);
}

// 5. port environment variable
// client sends request to the server, initially the server needs to be valid
// make sure the server is running
const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Listening on port ${port}..`));

