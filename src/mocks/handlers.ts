import { http } from 'msw'
import {
    bookListResolver,
    cancelBookResolver,
    detailsResolver,
    loginResolver,
    newBookResolver,
    newReviewResolver,
    reviewListResolver,
    searchResultResolver,
    signUpResolver,
} from './resolvers'

export const handlers = [
    http.post('/api/user/sign-up', signUpResolver),
    http.post('api/user/login', loginResolver),
    http.get('/api/user/:userId/mybook', bookListResolver),
    http.delete('/api/user/:userId/mybook/:bookId', cancelBookResolver),

    http.get('/api/accommodation/search', searchResultResolver),
    http.get('/api/accommodation/:accommodationId', detailsResolver),
    http.get('/api/accommodation/:accommodationId/review', reviewListResolver),
    http.post('/api/accommodation/:accommodationId/review', newReviewResolver),
    http.post('/api/accommodation/:accommodationId/book', newBookResolver),
]
