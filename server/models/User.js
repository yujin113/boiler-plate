const mongoose = require("mongoose"); // 모듈 가져오기
const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require("jsonwebtoken");

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

userSchema.pre("save", function (next) {
  var user = this; // 위에 만든 userSchema 가져옴

  if (user.isModified("password")) {
    // 비밀번호 암호화 시킨다
    bcrypt.genSalt(saltRounds, function (err, salt) {
      if (err) return next(err); // next() 하면 user.save로 들어감
      bcrypt.hash(user.password, salt, function (err, hash) {
        // hash는 암호화된 비밀번호
        if (err) return next(err);
        user.password = hash; // plain pw를 암호화된 pw로 교체
        next();
      });
    });
  } else {
    // 비밀번호 말고 다른 것 바꿀 때
    next();
  }
}); // user 모델에 user 정보 저장하기 전에 function 실행

// 비밀번호 맞는지 확인하는 메소드
userSchema.methods.comparePassword = function (plainPassword, cb) {
  // 암호화 한 후에 db에 있는 비밀번호와 같은지 확인
  bcrypt.compare(plainPassword, this.password, function (err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

// 토큰 만드는 메소드
userSchema.methods.generateToken = function (cb) {
  var user = this;
  // jsonwebtoken 이용해서 token을 생성
  var token = jwt.sign(user._id.toHexString(), "secretToken"); // token 생성
  user.token = token; // userSchema의 token 필드에 넣어줌
  user.save(function (err, user) {
    // 저장
    if (err) return cb(err);
    cb(null, user);
  });
};

userSchema.statics.findByToken = function (token, cb) {
  var user = this;

  // 토큰을 decode할 때는 verify 사용
  jwt.verify(token, "secretToken", function (err, decoded) {
    // decode 된 건 user id
    // 유저 아이디 사용해서 유저 찾은 후 client에서 가져온 토큰과 DB에 보관된 토큰이 일치하는지 확인
    user.findOne({ _id: decoded, token: token }, function (err, user) {
      if (err) return cb(err);
      cb(null, user); // 에러 없다면 user 정보 전달
    });
  });
};

// 스키마를 모델로 감싸기
const User = mongoose.model("User", userSchema); // (모델 이름, 스키마)
module.exports = { User }; // 모델을 다른 파일에서도 쓸 수 있게
