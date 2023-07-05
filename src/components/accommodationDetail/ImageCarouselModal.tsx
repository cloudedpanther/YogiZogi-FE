import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { Carousel } from 'react-responsive-carousel';
import './ImageCarouselModal.css';
import { IPicUrlList } from 'api/accommodationDetail';

export interface IImageCarouselModal {
  imgList: IPicUrlList[];
  alt: string;
  selectedImg: number;
}

/**
 * @param imgList: IPicUrlList[];
 * @param alt: string;
 * @param selectedImg: number
 */

export const ImageCarouselModal: React.FC<IImageCarouselModal> = ({
  imgList,
  alt,
  selectedImg
}) => {
  return (
    <>
      <input type="checkbox" id="reservationModal" className="modal-toggle" />
      <div className="modal">
        <div className="modal-box w-11/12 max-w-4xl">
          <Carousel
            selectedItem={selectedImg}
            showThumbs={imgList.length === 1 ? false : true}
          >
            {imgList.map((el, idx) => {
              return (
                <figure key={idx}>
                  <img src={el.url} alt={`${alt}-${idx}`} />
                </figure>
              );
            })}
          </Carousel>
        </div>
        <label className="modal-backdrop" htmlFor="reservationModal">
          Close
        </label>
      </div>
    </>
  );
};
