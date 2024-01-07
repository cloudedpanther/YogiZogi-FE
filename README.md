<p align='center'><img alt='logo' src='https://github.com/YOGIZOGI-Zerobase-2023/FE/assets/116236689/a508c41e-90d7-4cd5-868f-b760d519a916'></p>
<h1 align='center'>숙박시설을 검색하고 예약할 수 있는 숙박 이커머스, <br /> <a href='https://yogizogi.vercel.app/' color='red'>YogiZogi</a>입니다.</h1>

## ♦️ Contents

- [Introduce](#introduce)
- [Demo Video](#demo-video)
- [Feature](#feature)
- [API & Data Mocking](#api--data-mocking)
- [Tech Stacks](#tech-stacks)
- [Crew Info](#crew-info)
- [Deployment](#deployment)
- [Install & Run](#install--run)
  <br />

## 🎉 Introduce

숙박 이커머스 요기조기의 프론트엔드 서비스입니다. 본 서비스는 현재 백엔드 서버를 내리고 MSW를 이용해 API와 데이터를 목킹해서 사용하고 있습니다.

<br />

\*_본 레포지토리는 개인 포트폴리오를 위해 fork한 것입니다._
<br />
Original Repository: https://github.com/YOGIZOGI-Zerobase-2023/FE

<br />

## 🎞 Demo Video

[![yogizogi-demo](http://img.youtube.com/vi/GPzHwhCmJU4/0.jpg)](https://youtu.be/GPzHwhCmJU4)

<br />

## ✨ Feature

<strong>1. 숙소 검색</strong>

<img alt='search-demo' src='https://github.com/cloudedpanther/YogiZogi-FE/assets/76900250/2472ccb9-4e7a-41a4-bf65-ec565db7ea0e'>

- `키워드/현재 위치, 날짜, 인원` 정보를 입력하여 조건에 맞는 숙소를 검색할 수 있습니다.
- 숙소의 유형(호텔/모텔/펜션), 평점, 가격, 거리로 검색 결과를 필터링 할 수 있습니다.
- `지도로 보기`를 이용해 숙소의 위치를 확인할 수 있습니다
- 검색 결과가 무한 스크롤 방식으로 불러와집니다. 무한 스크롤은 아래와 같이 IntersectionObserver API를 이용해 구현되어 있습니다.

  ```ts
  // observer를 활용하기 위한 custom hook
  export const useIntersectionObserver = (callback: () => void) => {
    const observer = useRef(
      new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            unobserve();
            callback();
          });
        },
        { threshold: 0.3 }
      )
    );

    const target = useRef<HTMLDivElement>(null);

    const observe = useCallback(() => {
      if (!target.current) return;
      observer.current.observe(target.current);
    }, []);

    const unobserve = useCallback(() => {
      if (!target.current) return;

      observer.current.unobserve(target.current);
    }, []);

    const showTarget = useCallback(() => {
      if (!target.current) return;

      target.current.classList.remove('hidden');
      target.current.classList.add('flex', 'justify-center', 'items-center');
    }, []);

    const hideTarget = useCallback(() => {
      if (!target.current) return;

      target.current.classList.remove('flex', 'justify-center', 'items-center');
      target.current.classList.add('hidden');
    }, []);

    return { observe, unobserve, target, showTarget, hideTarget };
  };

  // hook 사용
  // callback이 setState를 다뤄야 하기 때문에 고정된 상태로 넘겨줘야 할 수가 없음
  // callback을 바로 작성하지 않고 state를 둔 후 해당 state가 true일때 작동하는 effect를 운영
  const [isCallbackRunning, setIsCallbackRunning] = useState(false);
  const { observe, target, showTarget, hideTarget } = useIntersectionObserver(
    () => {
      setIsCallbackRunning(true);
    }
  );

  // 데이터를 로드해오고 나면 다음 페이지를 위한 observing 시작
  useEffect(() => {
    if (isLoading) return;
    // => loading done

    // 모든 데이터를 받아왔을 경우 새로 API 호출하지 않고 observer target 숨김
    if (accommodationList.length === totalElements) {
      hideTarget();
      return;
    }

    observe();
    // observer ready
  }, [isLoading]);

  // callback을 대신하는 effect --> 실제 내용은 goToNextPage()에
  useEffect(() => {
    if (!isCallbackRunning) return;

    // observer intersecting... =>
    setIsCallbackRunning(false);
    goToNextPage();
    // search params set... => start loading
  }, [isCallbackRunning]);
  ```

<strong>2. 숙소 정보 열람</strong>

<img alt='info-demo' src='https://github.com/cloudedpanther/YogiZogi-FE/assets/76900250/c11d3451-ccfe-4e80-8419-14d6d58f5e79' />

- 검색한 결과에 일치하는 숙소의 편의시설, 객실 정보, 숙소 위치, 리뷰 등 상세 정보를 열람할 수 있습니다.

<strong>3. 숙소 및 객실 비교</strong>

<img alt='comparison-demo' src='https://github.com/cloudedpanther/YogiZogi-FE/assets/76900250/3bf1c2fb-3aab-443f-befe-21a4eaeaddd0' />

- 비교하고 싶은 숙소나 방을 비교함에 담고 비교하기 버튼을 누르면 3개월 가격 동향, 편의시설 등을 한 눈에 비교할 수 있습니다.

<strong>4. 로그인 및 회원가입</strong>

<img alt='email-demo' src='https://github.com/cloudedpanther/YogiZogi-FE/assets/76900250/7aab7704-3bca-4baa-ae38-e6c3aba7559f' />
<img alt='kakao-demo' src='https://github.com/cloudedpanther/YogiZogi-FE/assets/76900250/60f7c4ed-dfe0-4f0e-8330-75e9b38b6aff' />

- `ID: test@test.com`, `pw:test1234`로 로그인 가능합니다.

<strong>5. 숙소 예약</strong>

<img alt='reservation-demo' src='https://github.com/cloudedpanther/YogiZogi-FE/assets/76900250/8dd075ad-4787-4b38-89a1-975177195983' />

- 선택한 객실을 예약할 수 있습니다.

<strong>6. 숙소 리뷰 작성 및 확인</strong>

<img alt='review-demo' src='https://github.com/cloudedpanther/YogiZogi-FE/assets/76900250/5c116756-0510-4065-9461-ef3fdda17382' />

- 예약 확인 페이지에서 예약한 숙소 내역을 확인할 수 있습니다.
- 예약 내역은 기간별로 필터링 할 수 있습니다.
- 숙소에 대한 리뷰와 함께 `서비스/가격/시설`에 대한 별점을 남길 수 있습니다.

<br />

## 🛒 API & Data Mocking

- 백엔드 API 개발 전 신속한 프론트엔드 개발을 위해 MSW를 도입하여 API 호출을 목킹했습니다.
- REST API를 바탕으로 호출에 대응하고 있습니다.
- 개발 및 배포 완료 후에는 요금 문제로 백엔드 서버를 내리게 되어 API 및 데이터 목킹을 기반으로 프론트엔드 서버를 운영중입니다.
  <br />

## 🔧 Tech Stacks

![yogizogi_tech_stack drawio (3)](https://github.com/YOGIZOGI-Zerobase-2023/FE/assets/116236689/8705ff4a-5526-4392-8eca-f172810ce776)

<br />

## 👩‍👧‍👦 Crew Info

|                                                                         고영준                                                                          |                                                                        김은정                                                                        |                                                                         박성은                                                                          |                                                                         왕석현                                                                          |                                                                         강민지                                                                          |
| :-----------------------------------------------------------------------------------------------------------------------------------------------------: | :--------------------------------------------------------------------------------------------------------------------------------------------------: | :-----------------------------------------------------------------------------------------------------------------------------------------------------: | :-----------------------------------------------------------------------------------------------------------------------------------------------------: | :-----------------------------------------------------------------------------------------------------------------------------------------------------: |
| <img src="https://user-images.githubusercontent.com/89354370/159485964-95cade06-01fa-4765-b0ea-5daae66db82b.png" alt="고영준" width=70px height=80px /> | <img src="https://github.com/YOGIZOGI-Zerobase-2023/FE/assets/116236689/0b9696da-b45f-48ee-a442-6b317c7926d6" alt="김은정" width=60px height=70px /> | <img src="https://user-images.githubusercontent.com/89354370/159486446-3e8bd873-bfaf-4c33-b211-08ac8eee9941.jpg" alt="박성은" width=82px height=92px /> | <img src="https://user-images.githubusercontent.com/89354370/159485282-568e61d9-c0da-4f71-914f-5a586f23ba4e.jpg" alt="왕석현" width=80px height=80px /> | <img src="https://user-images.githubusercontent.com/89354370/159486647-926d1dd2-5a52-4fc6-8944-3da6cb88748c.jpg" alt="강민지" width=80px height=80px /> |
|                                                                        Front-End                                                                        |                                                                      Front-End                                                                       |                                                                        Front-End                                                                        |                                                                        Back-End                                                                         |                                                                        Back-End                                                                         |
|                                                       [Github](https://github.com/cloudedpanther)                                                       |                                                         [Github](https://github.com/Ryomi-j)                                                         |                                                          [Github](https://github.com/bbung95)                                                           |                                                           [Github](https://github.com/wsh096)                                                           |                                                          [Github](https://github.com/pumkinni)                                                          |
|                                                      [Blog](https://blog.naver.com/cloudedpanther)                                                      |                                                         [Blog](https://premubo.tistory.com/)                                                         |                                                             [Blog](https://velog.io/@bbung)                                                             |                                                            [Blog](https://velog.io/@wsh096)                                                             |                                                          [Blog](https://pumkinni.tistory.com/)                                                          |

<br />

## 🚀 Deployment

YOGIZOGI: https://yogizogi.vercel.app/

<br />

## 🔨 Install & Run

```bash
git clone https://github.com/cloudedpanther/YogiZogi-FE.git
cd FE
npm i
npm run dev
```
