export const picUrlList = Array.from({ length: 31 }, (_, listIndex) => {
    return Array.from({ length: 50 }, (_, index) => {
        const picData = {
            id: listIndex * 1000 + index,
            url: '//image.goodchoice.kr/resize_370x220/adimg_new/49914/329560/874943ee5c604e46a4f529d8ecc1558d.jpg',
        }
        return picData
    })
})
