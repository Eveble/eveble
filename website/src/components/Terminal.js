import styled from 'styled-components';

const Code = styled.code`
  color: white !important;
  background: #121212;
  font-family: 'Ubuntu Mono', sans-serif;
  font-size: 16px;
  position: relative;
  &::before {
    content: '$';
    position: absolute;
    left: -13px;
    color: gray;
  }
`;

const Terminal = styled.div`
  background: var(--ifm-color-dark);
  display: flex;
  flex-direction: column;
  border-radius: 4px;
  background: #121212;
  padding: 50px 30px 30px 30px;
  width: 600px;
  max-width: 100%;
  position: relative;
  &::before {
    content: '• • •';
    color: var(--ifm-color-primary);
    font-size: 42px;
    position: absolute;
    left: 15px;
    top: -12px;
    letter-spacing: -3px;
  }
`;

export { Terminal, Code };
