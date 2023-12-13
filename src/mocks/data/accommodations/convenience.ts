const facilityList = [
    {
        facility: '수영장',
    },
    {
        facility: '족구장',
    },
    {
        facility: '세미나실',
    },
    {
        facility: '노래방',
    },
    {
        facility: '와이파이',
    },
    {
        facility: '픽업가능',
    },
    {
        facility: '전기밥솥',
    },
    {
        facility: 'BBQ',
    },
    {
        facility: '카페',
    },
    {
        facility: 'TV',
    },
    {
        facility: '욕실용품',
    },
    {
        facility: '에어컨',
    },
    {
        facility: '냉장고',
    },
    {
        facility: '객실샤워실',
    },
    {
        facility: '욕조',
    },
    {
        facility: '드라이기',
    },
    {
        facility: '금연',
    },
    {
        facility: '객실내취사',
    },
    {
        facility: '캠프파이어',
    },
]

export const convenienceList = Array.from({ length: 31 }, (_, index) => {
    const list = facilityList.filter((_, idx) => (idx + 1) % (index + 1) === 0)
    return list.length ? list : facilityList.slice(0, 10)
})
