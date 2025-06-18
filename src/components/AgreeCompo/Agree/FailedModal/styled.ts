// styled.ts
import styled from "styled-components";

export const FailedModatStyled = styled.div`
  &.FailedModal-wrap {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.5); /* 어두운 반투명 배경 */
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;

    .FailedModal-container {
      background: #fff;
      padding: 32px;
      border-radius: 12px;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
      min-width: 320px;
      max-width: 400px;
      display: flex;
      flex-direction: column;
      gap: 16px;

      .FailedModal-title {
        font-size: 18px;
        font-weight: bold;
        margin-bottom: 8px;
        text-align: center;
      }

      .ant-select {
        width: 100%;
      }

      .ant-btn {
        width: 100%;
        background-color: #ff4d4f;
        color: white;
        font-weight: 600;
      }
    }
  }
`;
