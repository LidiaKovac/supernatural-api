export const paginate = (arr, pag, size=10) => {
    //pag. 1 start= 0 end= 10
    //pag. 2 start = 10 end = 20
    //pag. 3 start=20 end=30
    return arr.slice((pag - 1) * size, pag*size)
}