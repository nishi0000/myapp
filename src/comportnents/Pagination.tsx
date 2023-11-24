
export const Pagination = (array:any,cutNumber:any) => {
    const newArr = [];
    for(let i =0; i < Math.floor(array.length); i+=cutNumber){
        newArr.push(array.slice(i,i+cutNumber));
    }
    return newArr;
}



