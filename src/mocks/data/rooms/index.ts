import { convenienceList } from '../accommodations/convenience'
import { picUrlList } from '../accommodations/picUrl'
import { defaultPeopleList } from './defaultPeople'
import { maxPeopleList } from './maxPeople'
import { priceList } from './price'
import { roomNameList } from './roomName'

export interface IPicUrlList {
    id: number
    url: string
}

export interface IRoomData {
    id: number
    roomName: string
    checkInTime: number
    checkOutTime: number
    defaultPeople: number
    maxPeople: number
    conveniences: string
    pictureUrlList: IPicUrlList[]
    price: number
}

export const getRoomData = (accommodationIndex: number, dateTerm: number) =>
    Array.from({ length: 31 }, (_, index) => {
        const data: IRoomData = {
            id: index,
            roomName: roomNameList[index],
            checkInTime: 14,
            checkOutTime: 10,
            defaultPeople: defaultPeopleList[index],
            maxPeople: maxPeopleList[index],
            conveniences: convenienceList[accommodationIndex].join(', '),
            pictureUrlList: picUrlList[accommodationIndex],
            price: priceList[accommodationIndex][index] * dateTerm,
        }
        return data
    })
