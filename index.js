const express = require("express"); // express 모듈 가져온다
const app = express(); // function 이용해서 새로운 express 앱 만들기
const port = 5000; // 백서버로 두는 포트. 4000, 5000... 상관 무

const mongoose = require("mongoose");
mongoose
  .connect(
    "mongodb+srv://yujin:991103.@boilerplate.mbkue.mongodb.net/<dbname>?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    }
  )
  .then(() => console.log("MongoDB Connected..."))
  .catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("Hello World!");
}); // 루트 디렉토리에 Hello world 출력되게 해주는 것

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
}); // port 5000번 넣어서 이 앱을 실행하는 것
