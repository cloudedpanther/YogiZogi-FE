import { Link } from 'react-router-dom';
import InputBox from '../components/login/InputBox';
import useSignIn from '../hooks/useSignIn';
import SignLayout from '../components/login/SignLayout';

const SignIn = () => {
  const {
    signInData,
    isDisabled,
    handleChangeInput,
    handleSubmitSignIn,
    handleKakaoSignIn,
    handleChangeMaintain
  } = useSignIn();

  return (
    <SignLayout>
      <div className="absolute max-w-sm w-full pl-10 pr-10 top-1/2 left-16 -translate-y-1/2 max-lg:left-1/2 max-lg:-translate-x-1/2">
        <h1 className="text-3xl font-bold max-md:text-white">로그인</h1>
        <div className="divider m-0 pt-3 pb-4"></div>
        <div className="flex flex-col text-white">
          <InputBox
            title="이메일"
            name="email"
            type="text"
            placeholder="이메일을 입력해주세요."
            value={signInData.email}
            handleChange={handleChangeInput}
          />
          <InputBox
            title="비밀번호"
            name="password"
            type="password"
            placeholder="비밀번호를 입력해주세요."
            value={signInData.password}
            handleChange={handleChangeInput}
          />
          <div className="form-control pt-2">
            <label className="label cursor-pointer justify-start gap-2">
              <input
                type="checkbox"
                className="toggle"
                onChange={handleChangeMaintain}
              />
              <span className="label-text max-md:text-white">로그인 유지</span>
            </label>
          </div>
        </div>
        <div className="flex flex-col gap-4 pt-2">
          {isDisabled ? (
            <button
              className="btn btn-disabled max-md:text-gray-200"
              onClick={handleSubmitSignIn}
            >
              로그인
            </button>
          ) : (
            <button
              className="btn text-white bg-blue-700 hover:bg-blue-600 border-blue-700 hover:border-blue-600"
              onClick={handleSubmitSignIn}
            >
              로그인
            </button>
          )}
          <button
            className="btn gap-0 bg-yellow-300 hover:bg-yellow-300 border-yellow-300 hover:border-yellow-300"
            onClick={handleKakaoSignIn}
          >
            <img
              src="/assets/icons/kakaoicon.png"
              alt="카카오 로고"
              className="w-8 h-8"
            />
            카카오로 시작하기
          </button>
          <p className="text-gray-500 max-md:text-white text-sm text-center">
            계정이 없으신가요?{' '}
            <Link to="/signUp" className="text-blue-600">
              가입하기
            </Link>
          </p>
        </div>
      </div>
    </SignLayout>
  );
};
export default SignIn;
