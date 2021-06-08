const express= require("express");
const bodyparser=require("body-parser");
const mongoose=require("mongoose");
const app=express();
app.set('view engine','ejs');
app.use(bodyparser.urlencoded({extended:true}));
app.use(express.static("public"));
let workitem=[];
mongoose.connect("mongodb://localhost:27017/todolistDB",{useNewUrlParser:true});
 const itemsSchema ={
   name:String
 };
const Item = mongoose.model("Item",itemsSchema);

const item1 = new Item({
  name:"welcome to to-do-list !"
});
const item2 = new Item({
  name:"hit the + button to add new things"
})
const item3 = new Item({
name:"click on check box to delete the item"
})

const defautItem = [item1,item2,item3];


app.get("/",function(req,res){

  Item.find({},function(err,foundItems){
     if(foundItems.length===0){
       Item.insertMany(defautItem,function(err){
         if(err){
           console.log("error found");
         }else {
           console.log("success full ");
         }
       })
       res.redirect("/");
     }
      else {
          res.render("list",{ListTittle:"Today",newlistItem:foundItems});
      }
  })
});

app.post("/",function (req,res){
const itemName=req.body.newItem;
const item= new Item({
name:itemName
})
item.save();
res.redirect("/");
});


app.post("/delete",function(req,res){
  const checkitem=req.body.checkbox;
  Item.findByIdAndRemove(checkitem,function(err){
    if(!err){
      console.log("successfull done");
      res.redirect("/");
    }
  })
})



app.get("/work",function(req,res){
  res.render("list",{ListTittle:"workitem",newlistItem:workitem});

});
app.post("/work",function(req,res){
  let item=req.body.newItem;
  workitem.push(item);
  res.redirect("/work");
})

app.listen("3000",function(req,res){
    console.log("server is running");
})
