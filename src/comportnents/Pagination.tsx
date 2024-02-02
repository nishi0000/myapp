import { FC } from "react";
import styled from "styled-components";
import { HashLink } from "react-router-hash-link";
import {
    PageState,
    pageBack,
    pageFirst,
    pageLast,
    pageNext,
  } from "../features/Page";
import { useDispatch, useSelector } from "react-redux";

export const Pagination = (array:any,cutNumber:number) => {
    const newArr = [];
    for(let i =0; i < Math.floor(array.length); i+=cutNumber){// Math.floorは整数を返す
        newArr.push(array.slice(i,i+cutNumber));
    }
    return newArr;
}

type PageProps = {
    arrayData:any[];
    url:string;
};

export const PageControl: FC<PageProps> = ({ url,arrayData }) => {
    const page = useSelector((state: PageState) => state.page.page);
    const dispatch = useDispatch();
    
  const onClickNextPage = () => {
    // ページネーション用関数　次へ進む
    if (arrayData && arrayData.length - 1 > page) {
      console.log(arrayData.length);
      dispatch(pageNext());
    } else {
    }
  };

  const onClickBackPage = () => {
    // ページネーション用関数　前へ戻る
    if (arrayData && page > 0 && arrayData.length + 1 > page) {
      console.log(arrayData.length);
      dispatch(pageBack());
    } else {
    }
  };

  const onClickFirstPage = () => {
    // ページネーション用関数　最初に戻る
    if(arrayData){
    dispatch(pageFirst());
}
  };

  const onClickLastPage = () => {
    // ページネーション用関数　最後に進む
    if(arrayData){
    dispatch(pageLast({ lastpage: arrayData.length - 1 }));
}
  };

return (
    arrayData.length > 0 ? (    <SPaginationcontainer>
        {page === 0 || <SPagination to={`${url}`} onClick={onClickFirstPage}>最初に戻る</SPagination>}
        {page === 0 || <SPagination to={`${url}`} onClick={onClickBackPage}>前へ</SPagination>}
        {page === arrayData.length - 1 || <SPagination to={`${url}`} onClick={onClickNextPage}>次へ</SPagination>}
        {page === arrayData.length - 1 || <SPagination to={`${url}`} onClick={onClickLastPage}>最後に進む</SPagination>}
        </SPaginationcontainer>):(<></>)


    )
}


const SPagination = styled(HashLink)`
  color: black;
  text-decoration: none;
  margin: 32px 4px;
  display:block;
  &:hover {
    text-decoration: underline;
  }
`;

const SPaginationcontainer = styled.div`
display: flex;
justify-content: center;
`;
