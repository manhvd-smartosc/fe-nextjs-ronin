import { TabList } from '@chakra-ui/react';
import styled from '@emotion/styled';

const StyledTabList = styled(TabList)`
  width: 80%;
  display: flex;
  justify-content: space-evenly;
  margin-top: 20px;
  padding: 0;
  color: #8a8986;
  font-size: 16px;
  font-weight: 400;
  line-height: 22px;

  .chakra-tabs__tab {
    width: 150px;
    padding: 1px 0px;
    margin: 0;
    border: none;
    background-color: transparent;
    cursor: pointer;
  }
`;

export { StyledTabList };
