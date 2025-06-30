import styled from "styled-components";

export const LoginStyled = styled.div`
  &.login_center {
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    .login_wrap {
      padding: 0 10px;
      max-width: 548px;
      width: 100%;
      height: 621.5px;
      margin: 0 auto;
      .login_box {
        max-width: 508px;
        width: 100%;
        height: 541.5px;
        margin: 0 auto;

        .login_title {
          font-size: 24px;
          font-weight: bold;
          text-align: center;
          margin: 50px 0 10px 0;
        }

        .login_form {
          display: flex;
          flex-direction: column;
          .login_label {
            font-size: 18px;
            font-weight: 500;
            margin-top: 35px;
            margin-bottom: 10px;
          }
          .login_pw_box {
            color: ${({ theme }) => theme.colors.gray4Color};
            position: relative;
            .login_see {
              position: absolute;
              top: 15px;
              right: 15px;
              font-size: 15px;
              cursor: pointer;
            }
          }
          .login_input {
            width: 100%;
            height: 52px;
            border: 1px solid ${({ theme }) => theme.colors.gray2Color};
            border-radius: 12px;
            font-size: 15px;
            padding: 17px 50px 15px 15px;

            overflow: hidden;
            white-space: nowrap;
          }

          .login_login_btn {
            margin-top: 40px;
            height: 52px;
            border-radius: 12px;
            border: 1px solid ${({ theme }) => theme.colors.mainColor};
            background-color: ${({ theme }) => theme.colors.mainColor};
            color: white;
            &:hover {
              cursor: pointer;
            }
          }

          .login_error_message {
            font-size: 13px;
            margin: 5px 8px 0 8px;
            color: rgb(246, 35, 35);
          }
        }
      }
    }
  }
`;
