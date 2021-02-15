const { User } = require("../models/User");

let auth = (req, res, next) => {
  // 인증 처리 하는 곳
  // client 쿠키에서 토큰을 가져오기
  let token = req.cookies.x_auth;
  // 토큰을 복호화한 후 유저 찾기
  User.findByToken(token, (err, user) => {
    if (err) throw err;
    if (!user) return res.json({ isAuth: false, error: true }); // user 없다면 client에 이렇게 전달
    // user 있다면
    req.token = token;
    req.user = user;
    next(); // middleware에서 다음으로 넘어갈 수 있게
  });
  // 유저 있으면 인증 성공
  // 유저 없으면 인증 실패
};

module.exports = { auth }; // 다른 파일에서도 쓸 수 있게
