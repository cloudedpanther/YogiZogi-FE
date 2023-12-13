interface IReviewData {
    id: string
    nickname: string
    rating: number
    description: string
}

export interface IStoragedReviews {
    [key: string]: IReviewData[]
}

export const DEFAULT_REVIEWS = [
    {
        id: '30',
        nickName: '안지홍',
        rating: 10,
        description: '너무 좋아요!',
    },
    {
        id: '29',
        nickName: '윤병희',
        rating: 8,
        description: '나름 마음에 들었어요. 다음에도 또 이용할 지도?',
    },
    {
        id: '28',
        nickName: '견명훈',
        rating: 7,
        description: '추천할 만 합니다.',
    },
    {
        id: '27',
        nickName: '신누리',
        rating: 9,
        description: '굿굿 이만한 숙소 없습니다.',
    },
    {
        id: '26',
        nickName: '도정숙',
        rating: 8,
        description: '좋아요!',
    },
    {
        id: '25',
        nickName: '제갈준성',
        rating: 10,
        description: '너무 좋아요!',
    },
    {
        id: '24',
        nickName: '홍영신',
        rating: 8,
        description: '나름 마음에 들었어요. 다음에도 또 이용할 지도?',
    },
    {
        id: '23',
        nickName: '연경후',
        rating: 7,
        description: '추천할 만 합니다.',
    },
    {
        id: '22',
        nickName: '방두용',
        rating: 9,
        description: '굿굿 이만한 숙소 없습니다.',
    },
    {
        id: '21',
        nickName: '유연경',
        rating: 8,
        description: '좋아요!',
    },
    {
        id: '20',
        nickName: '노준영',
        rating: 10,
        description: '너무 좋아요!',
    },
    {
        id: '19',
        nickName: '송철',
        rating: 8,
        description: '나름 마음에 들었어요. 다음에도 또 이용할 지도?',
    },
    {
        id: '18',
        nickName: '권주희',
        rating: 7,
        description: '추천할 만 합니다.',
    },
    {
        id: '17',
        nickName: '김진후',
        rating: 9,
        description: '굿굿 이만한 숙소 없습니다.',
    },
    {
        id: '16',
        nickName: '정현희',
        rating: 8,
        description: '좋아요!',
    },
    {
        id: '15',
        nickName: '김길순',
        rating: 10,
        description: '너무 좋아요!',
    },
    {
        id: '14',
        nickName: '한순자',
        rating: 8,
        description: '나름 마음에 들었어요. 다음에도 또 이용할 지도?',
    },
    {
        id: '13',
        nickName: '장지상',
        rating: 7,
        description: '추천할 만 합니다.',
    },
    {
        id: '12',
        nickName: '박미연',
        rating: 9,
        description: '굿굿 이만한 숙소 없습니다.',
    },
    {
        id: '11',
        nickName: '이상미',
        rating: 8,
        description: '좋아요!',
    },
    {
        id: '10',
        nickName: '계금숙',
        rating: 10,
        description:
            '서비스 저는 좋았어요. 프론트에서 신경 써줘서 방도 더 좋은 방으로 변경할 수 있었습니다.',
    },
    {
        id: '9',
        nickName: '마승철',
        rating: 8,
        description: '가족여행 시에 무난하게 이용하기 좋습니다.',
    },
    {
        id: '8',
        nickName: '임지민',
        rating: 9,
        description: '이 가격대에 베스트 선택지가 아닐까 싶네요.',
    },
    {
        id: '7',
        nickName: '홍길여',
        rating: 5,
        description: '그냥 그랬어요.',
    },
    {
        id: '6',
        nickName: '차겨울',
        rating: 9,
        description: '이용하는 동안 편하고 좋았습니다. 조식이 맛있어요.',
    },
    {
        id: '5',
        nickName: '홍길동',
        rating: 10,
        description: '숙소가 예쁘고 가격도 합리적이에요.',
    },
    {
        id: '4',
        nickName: '이길도',
        rating: 8,
        description: '전체적으로 깔끔한 느낌에 위생상태가 마음에 듭니다.',
    },
    {
        id: '3',
        nickName: '편판선',
        rating: 7,
        description: '제공되는 편의시설이 다양해서 좋아요.',
    },
    {
        id: '2',
        nickName: '판편숙',
        rating: 9,
        description:
            '조식도 맛있고 방이 분위기 있어요. 주변 교통도 잘 돼있어서 관광하시기에 딱 좋다고 생각합니다.',
    },
    {
        id: '1',
        nickName: '염희상',
        rating: 3,
        description:
            '갑자기 수도에 문제가 생겨서 세 시간 가량 온수가 나오지 않았었는데 이에 대해 따로 안내도 없었고 보상이고 뭐고 없었네요. 그렇다고 숙소가 꼭 마음에 드는 것도 아니었습니다.',
    },
]
