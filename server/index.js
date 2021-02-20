const express = require("express"); // express 모듈 가져온다
const app = express(); // function 이용해서 새로운 express 앱 만들기
const port = 5000; // 백서버로 두는 포트. 4000, 5000... 상관 무
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const config = require("./config/key");
const { auth } = require("./middleware/auth");
const { User } = require("./models/User"); // 만들었던 model 가져오기

// bodyParser는 client에서 오는 정보를 서버에서 분석해서 가져올 수 있게 해줌
app.use(bodyParser.urlencoded({ extended: true })); // application/x-www-form-urlencoded 데이터를 분석해서 가져올 수 있게
app.use(bodyParser.json()); // application/json 타입으로 된 데이터를 분석해서 가져옴
app.use(cookieParser());

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

app.get("/", (req, res) => res.send("Hello World!!!!")); // 루트 디렉토리에 Hello world 출력되게 해주는 것

app.get("/api/hello", (req, res) => res.send("Hello world ~"));

// 회원 가입 위한 route
// 이름, 이메일, pw 등의 회원가입 정보들을 client에서 가져오면 database에 넣어준다
app.post("/api/users/register", (req, res) => {
  const user = new User(req.body); // req.body 안에는 json 형식으로 데이터가 들어있음, 들어있을 수 있게 해주는 건 bodyParser 덕
  user.save((err, userInfo) => {
    if (err) return res.json({ success: false, err }); // 저장할 때 에러 생기면 client에게 json 형식으로 에러 있다고 전달
    return res.status(200).json({ success: true }); // status(200)은 성공했다는 표시. 저장 성공 시 client에게 json 형식으로 정보 전달
  }); // mongoDB에서 오는 메소드. 정보들이 User 모델에 저장
});

app.post("/api/users/login", (req, res) => {
  // 요청된 이메일이 데이터베이스에 있는지 찾기
  User.findOne({ email: req.body.email }, (err, user) => {
    // user collection 안에 이메일 가진 유저 없다면
    if (!user) {
      return res.json({
        loginSuccess: false,
        message: "제공된 이메일에 해당하는 유저가 없습니다.",
      });
    }
    // 요청된 이메일이 데이터베이스에 있다면, 비밀번호가 맞는지 확인
    user.comparePassword(req.body.password, (err, isMatch) => {
      // 비밀번호 맞지 않다면
      if (!isMatch) {
        return res.json({
          loginSuccess: false,
          message: "비밀번호가 틀렸습니다.",
        });
      }
      // 비밀번호 맞다면 token 생성
      user.generateToken((err, user) => {
        if (err) return res.status(400).send(err);
        // 쿠키에 토큰 저장
        res.cookie("x_auth", user.token).status(200).json({
          loginSuccess: true,
          userId: user._id,
        }); // x_auth 이름으로 cookie 저장됨
      });
    });
  });
});

app.get("/api/users/auth", auth, (req, res) => {
  // 여기까지 미들웨어를 통과해 왔다는 건 Authentication이 True라는 말
  res.status(200).json({
    _id: req.user._id,
    isAdmin: req.user.role === 0 ? false : true,
    isAuth: true,
    email: req.user.email,
    name: req.user.name,
    lastname: req.user.lastname,
    role: req.user.role,
    image: req.user.image,
  });
});

app.get("/api/users/logout", auth, (req, res) => {
  User.findOneAndUpdate(
    { _id: req.user._id }, // auth 미들웨어에서 가져와서 찾는 것
    { token: "" }, // 토큰 지우기
    (err, user) => {
      if (err) return res.json({ success: false, err });
      return res.status(200).send({ success: true });
    }
  );
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
}); // port 5000번 넣어서 이 앱을 실행하는 것
