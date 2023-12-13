import { priceList as minPriceList } from '../accommodations/price'

export const priceList = [...minPriceList].map((minPrice) =>
    Array.from({ length: 31 }, (_, index) => minPrice + 1000 * index)
)
