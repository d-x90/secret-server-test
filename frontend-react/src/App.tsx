import React from 'react';
import { ToastContainer } from 'react-toastify';
import ReactTooltip from 'react-tooltip';
import styled from 'styled-components';
import RecentHashesPanel from './features/secret/components/RecentHashesPanel';
import 'react-toastify/dist/ReactToastify.css';
import AddSecretForm from './features/secret/components/AddSecretForm';

const StyledApp = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;

  > .left-side-container {
    height: 100%;
    box-shadow: 1px 1px 8px 1px rgba(0, 0, 0, 0.5);
    flex: 0 0 320px;
    overflow: hidden;
    z-index: 9;
  }

  > .right-container {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: #ececec;
    height: 100%;

    > .form-container {
      width: 650px;
      height: 650px;
      background-color: white;
      box-shadow: 1px 1px 8px 1px rgba(0, 0, 0, 0.5);
    }
  }
`;

const App: React.FC = () => {
  return (
    <StyledApp>
      <div className="left-side-container">
        <RecentHashesPanel />
      </div>
      <div className="right-container">
        <div className="form-container">
          <AddSecretForm />
        </div>
      </div>
      <ToastContainer />
      <ReactTooltip />
    </StyledApp>
  );
};

export default App;
