export const getQueryStrData = () => {
  const url =
    window.location.hash.match(/\/accommodation\/(\d+)/) || '';
  const accommodationId = url[1];

  const urlParams = new URLSearchParams(
    '?' + window.location.hash.split('?')[1]
  );

  const {
    checkindate: checkInDate,
    checkoutdate: checkOutDate,
    people: people
  } = Object.fromEntries(urlParams.entries());

  return {
    accommodationId: accommodationId || '', 
    checkInDate: checkInDate || '',
    checkOutDate: checkOutDate || '',
    people: people || '',
  };
};
