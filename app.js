const express = require("express");
const bodyParser = require('body-parser');
const mongoose = require("mongoose");


const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set('view engine', 'ejs');

mongoose.connect("mongodb+srv://justomer:xdxdhgfdsA314@cluster0.fer3615.mongodb.net/simonGame?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true })
const skorsSchema={
  zorluk:{type:Number,max:4,min:2},
  derece:Number,
  name:{type:String,default:null}
}
const Skor=mongoose.model("Skor",skorsSchema);


var x
skorlar=[0,0,0]
var zirvedeki
var zirvedekiSkor
var zirvedekiZorluk


Skor.findOne({zorluk:2}).then(function(foundskor){
  skorlar[0]=foundskor.derece;
  Skor.findOne({zorluk:3}).then(function(foundskor){
    skorlar[1]=foundskor.derece;
    Skor.findOne({zorluk:4}).then(function(foundskor){
      skorlar[2]=foundskor.derece;
      console.log(skorlar);
      // Değişkenler doğru bir şekilde atandıktan sonra hizala() fonksiyonunu çağırın
    });
  });
});

app.get("/",function(req,res){
  res.render("giriş")
})

app.post("/xial", (req,res)=>{
x=req.body.basamak
res.send("ok")
console.log("oyun şu basamakta oynanıyor:"+String(x))
})





app.get("/oyun", function (req, res) {
  res.render("oyun", { ad: kullanici, zirve_isim: zirvedeki});
});
app.post('/', (req, res) => {
   const nickName = req.body.nickName;
  if (typeof nickName !== 'undefined') {
    kullanici=nickName
    console.log(nickName);
  }
  res.redirect("/oyun")
});
app.post("/isim",(req,res)=>{

  res.redirect("/")

})


app.post("/oyun", (req, res) => {
  console.log(req.body.skors)
  if(skorlar[x]<req.body.skors[x]){
    skorlar[x]=req.body.skors[x]
    girilecek=(parseInt(x) + 2)
    Skor.findOneAndReplace({ zorluk:girilecek },{ zorluk: girilecek ,derece: skorlar[x], name: kullanici },{new: true ,upsert: true})
  .then(function(oge) {
    console.log(oge);
    console.log()
  })
  .catch(function(err) {
    console.log(err);
  });
  }
  res.send(skorlar)
});

app.post("/zirvedeki",(req,res)=>{

  zirvedekiZorluk=parseInt( req.body.zorluk)+2
  var zirve=Skor.findOne({zorluk:zirvedekiZorluk}).then(function(oge){
    console.log(oge.derece)
    console.log(oge.name)
    res.send([oge.name,oge.derece])
    
  })

})



app.listen(process.env.PORT||3000, ()=> {
  console.log("Server has  started ");
});