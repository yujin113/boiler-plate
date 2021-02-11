const mongoose = require("mongoose"); // 모듈 가져오기

// 스키마 생성
const userSchema = mongoose.Schema({
  name: {
    type: String,
    maxlength: 50,
  },
  email: {
    type: String,
    trim: true, // 스페이스 없애주는 역할
    unique: true, // 똑같은 이메일은 쓰지 못함
  },
  password: {
    type: String,
    minlength: 5,
  },
  lastname: {
    type: String,
    maxlength: 50,
  },
  role: {
    type: Number,
    default: 0,
  },
  image: String, // object 사용하지 않고 이렇게 작성도 가능
  token: {
    // 유효성 관리
    type: String,
  },
  tokenExp: {
    // 토큰 사용할 수 있는 기간
    type: Number,
  },
});

// 스키마를 모델로 감싸기
const User = mongoose.model("User", userSchema); // (모델 이름, 스키마)
module.exports = { User }; // 모델을 다른 파일에서도 쓸 수 있게
