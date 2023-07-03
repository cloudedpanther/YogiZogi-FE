import { IComparisonItem } from './Comparison';
import { DraggableAccommodationList } from './DraggableAccommodationList';

interface IComparisonModal {
  data: IComparisonItem[];
  modalState: boolean;
  handleModal: React.Dispatch<React.SetStateAction<boolean>>;
}

export const ComparisonModal = ({
  data,
  modalState,
  handleModal
}: IComparisonModal) => {
  return (
    <>
      <input
        type="checkbox"
        id="comparisonModal"
        className="modal-toggle"
        checked={modalState}
        onChange={() => handleModal(!modalState)}
      />
      <div className="modal">
        <div className="modal-box md:w-[600px] max-w-full h-fit overflow-hidden">
          <div className="overflow-x-auto">
            <h2 className="mb-3 text-2xl font-semibold text-center">
              한 눈에 비교하기
            </h2>
            <div className="flex w-full">
              <DraggableAccommodationList data={data} />
            </div>
          </div>
          <div className="modal-action">
            <button
              className="btn btn-outline btn-sm text-sm text-white bg-red-500 hover:bg-red-600 border-none"
              onClick={() => handleModal(false)}
            >
              닫기
            </button>
          </div>
        </div>
        <label className="modal-backdrop" htmlFor="comparisonModal">
          Close
        </label>
      </div>
    </>
  );
};
