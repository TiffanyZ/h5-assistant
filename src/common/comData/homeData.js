const topList = ["1", "2", "3"];
// const recommendList = [
//     [['test1', 'test2', 'test3', 'test4', 'test5', 'test6', 'test7', 'test8'],'猜你想问'],
//     [['test1', 'test2', 'test3', 'test4', 'test5', 'test6', 'test7', 'test8'],'猜你想问2'],
//     [['test1', 'test2', 'test3', 'test4', 'test5', 'test6', 'test7', 'test8'],'猜你想问3']
// ];
const recommendList = [
    {
        name: '猜你想问',
        arr: ['test1', 'test2', 'test3', 'test4', 'test5', 'test6', 'test7', 'test8']
    },
    {
        name: '猜你想问2',
        arr: ['test1', 'test2', 'test3', 'test4', 'test5', 'test6', 'test7', 'test8']
    },
    {
        name: '猜你想问3',
        arr: ['test1', 'test2', 'test3', 'test4', 'test5', 'test6', 'test7', 'test8']
    },
    {
        name: '猜你想问4',
        arr: ['test1', 'test2', 'test3', 'test4', 'test5', 'test6', 'test7', 'test8']
    }
];
const swiperOptions = {
    slidesPerView: "auto",
    spaceBetween: 13,
    slidesOffsetBefore: 13,
    slidesOffsetAfter: 13,
    normalizeSlideIndex: false,
    pagination: {
        el: ".swiper-pagination", //与slot="pagination"处 class 一致
        clickable: true //轮播按钮支持点击
    },
    on: {
        slideChangeTransitionEnd: function () {}
    }
}
export {
    topList,
    recommendList,
    swiperOptions
}