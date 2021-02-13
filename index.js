const express = require("express"); // express 모듈 가져온다
const app = express(); // function 이용해서 새로운 express 앱 만들기
const port = 5000; // 백서버로 두는 포트. 4000, 5000... 상관 무
const bodyParser = require("body-parser");
const config = require("./config/key");
const { User } = require("./models/User"); // 만들었던 model 가져오기

// bodyParser는 client에서 오는 정보를 서버에서 분석해서 가져올 수 있게 해줌
app.use(bodyParser.urlencoded({ extended: true })); // application/x-www-form-urlencoded 데이터를 분석해서 가져올 수 있게
app.use(bodyParser.json()); // application/json 타입으로 된 데이터를 분석해서 가져옴

const mongoose = require("mongoose");
mongoose
  .connect(config.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log("MongoDB Connected..."))
  .catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("Hello World!!!!");
}); // 루트 디렉토리에 Hello world 출력되게 해주는 것

// 회원 가입 위한 route
// 이름, 이메일, pw 등의 회원가입 정보들을 client에서 가져오면 database에 넣어준다
app.post("/register", (req, res) => {
  const user = new User(req.body); // req.body 안에는 json 형식으로 데이터가 들어있음, 들어있을 수 있게 해주는 건 bodyParser 덕
  user.save((err, userInfo) => {
    if (err) return res.json({ success: false, err }); // 저장할 때 에러 생기면 client에게 json 형식으로 에러 있다고 전달
    return res.status(200).json({ success: true }); // status(200)은 성공했다는 표시. 저장 성공 시 client에게 json 형식으로 정보 전달
  }); // mongoDB에서 오는 메소드. 정보들이 User 모델에 저장
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
}); // port 5000번 넣어서 이 앱을 실행하는 것
