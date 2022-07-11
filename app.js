require('dotenv').config()
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const _ = require('lodash')


//** Vatiables */
const app = express();
const PORT = process.env.PORT || 5001;



//** Connect Mongodb */
mongoose.connect(process.env.DB_URI,
  { useNewUrlParser: true, useUnifiedTopology: true });

//** Mongoose schema */
const itemSchema = new mongoose.Schema({ name: 'String' });
//* Create Collections */
const Item = mongoose.model('Item', itemSchema);
//* Create item */
const item1 = new Item({
  name: 'Welcome to your to do list'
});
const item2 = new Item({
  name: 'this is my item list'
});
const item3 = new Item({
  name: '<-- checkedBoxTo Delete'
});
const defaulItem = [item1, item2, item3];


//** Mongoose schema */
const listSchema = new mongoose.Schema({
  name: 'String',
  items: [itemSchema],
});
//* Create Collections */
const List = mongoose.model('List', listSchema);

//** insert all items */
// Item.insertMany([item1, item2, item3], (err) =>
//   err ?
//   console.error(err) :
//     console.log('Succefully added items'));

//** Delete all duplicate items */
// Item.deleteMany({ name: "this is my item list"},()=>console.log('Succefully Deleted '));


//** Middleware for Express */
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
//** View engine EJS */
app.set('view engine', 'ejs');




//** Navigation */
//* Route homepage */
app.get('/', (req, res) => {
  Item.find({}, (err, foundItems) => {

    foundItems.length === 0 ?

      Item.insertMany([item1, item2, item3], (err) => err ?
        console.error(err) : console.log('Succefully added items')) ||
      res.redirect('/') :

      err ? console.error(err) : res.render('list', { listTitle: 'Today', newItem: foundItems });
  });
});
let workItems = [];
//* Route Work */
app.get('/work', (req, res) => res.render('list', { listTitle: 'workList', newItem: workItems }));

//* Route detele */
app.get('/delete', (req, res) => res.redirect('/'));

//* Route about */
app.get('/about', (req, res) => res.render('about'));

//* Route customList */
app.get('/:customName', (req, res) => {
  const customName = _.capitalize(req.params.customName);

  List.findOne({ name: customName }, (err, foundList) => {
    const list = new List({
      name: customName,
      item: defaulItem,
    });
    !err ? !foundList ? list.save() && res.redirect('/' + customName) :
      res.render('list', { listTitle: foundList.name, newItem: foundList.items }) : '';
  });

});


//* post Add req
app.post('/', (req, res) => {
  const itemName = req.body.newItem;    //** Select my input query */
  const listName = req.body.list;      //** Select my input query */

  const item = new Item({
    name: itemName
  });

  listName === 'Today' ?
    item.save() && res.redirect('/') :
    List.findOne({ name: listName }, (err, foundList) => {
      foundList.items.push(item);
      foundList.save()
      res.redirect('/' + listName);
    });


});
//* post Delete req */
app.post('/delete', (req, res) => {
  const checkItemId = req.body.checkbox;    //** Select my input query */
  const listName = req.body.listName;      //** Select my input query */

  listName === 'Today' ?
    Item.findByIdAndRemove(checkItemId, (err) => err ? console.error(err) : res.redirect('/')) :
    List.findOneAndUpdate({name:listName}, {$pull:{items: {_id: checkItemId} }}, (err,foundList)=> !err ? res.redirect('/' + listName):'');
});



PORT == null || PORT == '' ? PORT = 3000 : '';
app.listen(PORT, () => console.log(`Server Running On Port ${PORT}`)); //** Server on PORT */