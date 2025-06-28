// 아이디 유효성 검사
export const validateId = (id: string): string | undefined => {
  if (!id) return "아이디를 입력하지 않았습니다.";
  if (!/^[a-zA-Z0-9]{4,12}$/.test(id)) {
    return "아이디는 4~12자의 영문 또는 숫자여야 합니다.";
  }
};
