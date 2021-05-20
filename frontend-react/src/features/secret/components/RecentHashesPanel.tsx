import { useState } from 'react';
import styled from 'styled-components';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { fetchSecretAsync } from '../secretSlice';

const StyledRecentHashesPanel = styled.section`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 8px;

  > h2 {
    font-size: 3rem;
    margin: 0 auto;
  }

  > input {
    width: 90%;
    font-size: 20px;
    margin: 16px auto 6px auto;
  }

  > button {
    padding: 8px;
    min-width: 50%;
    margin: 6px auto;
    font-size: 18px;
    cursor: pointer;
    background-color: #3498db;
    color: white;
    border: 1px solid grey;
    border-radius: 4px;

    &:hover {
      background-color: #58b2ee;
    }
  }

  > hr {
    width: 90%;
    margin: 6px auto;
  }

  > ul {
    height: 75%;
    width: 100%;
    overflow-x: hidden;
    overflow-y: auto;

    > li {
      padding: 8px;
      list-style: none;
      font-size: 2rem;
      text-overflow: ellipsis;
      overflow: hidden;
      cursor: pointer;

      &:hover {
        background-color: lightgray;
      }
    }
  }
`;

const RecentHashesPanel: React.FC = () => {
  const dispatch = useAppDispatch();
  const recentHashes = useAppSelector((state) => state.secret.recentHashes);

  const [hashToFetch, setHashToFetch] = useState('');

  return (
    <StyledRecentHashesPanel>
      <h2>Get secret by hash</h2>
      <input
        value={hashToFetch}
        onChange={(e) => setHashToFetch(e.target.value)}
      />
      <button onClick={() => dispatch(fetchSecretAsync(hashToFetch))}>
        Get Secret
      </button>
      <hr />
      <h2>Recent hashes</h2>
      <ul>
        {recentHashes.map((hash, index) => (
          <li
            data-tip={hash}
            data-place="right"
            data-delay-show="600"
            onClick={() => setHashToFetch(hash)}
            key={index}
          >
            {hash}
          </li>
        ))}
      </ul>
    </StyledRecentHashesPanel>
  );
};

export default RecentHashesPanel;
