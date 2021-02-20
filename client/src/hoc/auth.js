import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { auth } from "../_actions/user_action";

export default function (SpecificComponent, option, adminRoute = null) {
  // option의 종류 : null, true, false
  function AuthenticationCheck(props) {
    // 백엔드에 request 날려서 유저의 상태 정보 가져오기
    const dispatch = useDispatch();
    useEffect(() => {
      // redux 사용
      dispatch(auth()).then((response) => {
        // 백엔드에서 처리된 정보들은 모두 response에 들어있음
        // 로그인 한 유저는 로그인 페이지에 들어가지 못하게, 일반 유저는 어드민 페이지에 들어가지 못하게 막아야 함
        if (!response.payload.isAuth) {
          // false이면 로그인하지 않은 상태
          if (option) {
            // option이 true면 로그인 한 유저만 출입 가능한 페이지
            props.history.push("/login");
          }
        } else {
          // 로그인 한 상태
          if (adminRoute && !response.payload.isAdmin) {
            // adminRoute는 관리자만 들어갈 수 있는 페이지. isAdmin이 false인 유저는 들어갈 수 없음
            props.history.push("/");
          } else {
            if (option === false) {
              props.history.push("/");
            }
          }
        }
      });
    }, []);
    return <SpecificComponent />;
  }

  return AuthenticationCheck;
}
