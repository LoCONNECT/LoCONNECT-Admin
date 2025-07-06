// 비밀번호 유효성 검사
export const validatePassword = (password: string): string | undefined => {
  if (!password) return "비밀번호를 입력하지 않았습니다.";
  if (
    !/^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=])[A-Za-z\d!@#$%^&*()_\-+=]{8,}$/.test(
      password
    )
  ) {
    return "비밀번호는 8자 이상이며, 영문자, 숫자, 특수문자를 포함해야 합니다.";
  }
};
