import { BsGithub } from 'react-icons/bs';
import { Link } from 'react-router-dom';
import { SiNaver, SiTistory } from 'react-icons/si';
import { SiVelog } from 'react-icons/si';

const channels = [
  {
    name: 'YogiZogi',
    github: 'https://github.com/orgs/YOGIZOGI-Zerobase-2023/repositories'
  },
  {
    name: '고영준',
    blog: 'https://blog.naver.com/cloudedpanther',
    github: 'https://github.com/cloudedpanther'
  },
  {
    name: '김은정',
    blog: 'https://premubo.tistory.com/',
    github: 'https://github.com/Ryomi-j'
  },
  {
    name: '박성은',
    blog: 'https://velog.io/@bbung',
    github: 'https://github.com/bbung95'
  },
  {
    name: '왕석현',
    blog: 'https://velog.io/@wsh096',
    github: 'https://github.com/wsh096'
  },
  {
    name: '강민지',
    blog: 'https://pumkinni.tistory.com/',
    github: 'https://github.com/pumkinni'
  }
];

const Footer = () => {
  return (
    <footer
      className="absolute bottom-0 flex justify-center items-center w-full min-h-20 h-20 md:h-12 md:min-h-12 bg-base-100"
      style={{
        boxShadow:
          '0 -1px 3px 0px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        minWidth: '375px'
      }}
    >
      <div className="w-full h-full max-w-5xl flex flex-col md:flex-row justify-center md:justify-between items-center px-4">
        <div className="flex items-center justify-center w-full h-full">
          {channels.map((channel) => {
            return (
              <div
                key={channel.name}
                className="flex w-full justify-center items-center gap-2"
              >
                <div className="tooltip" data-tip={`${channel.name} Github`}>
                  <Link to={channel.github}>
                    <BsGithub className="w-5 h-5 " />
                  </Link>
                </div>
                {channel.blog && (
                  <div className="tooltip" data-tip={`${channel.name} Blog`}>
                    <Link to={channel.blog}>
                      {channel.blog.includes('tistory') ? (
                        <SiTistory className="w-4 h-4" />
                      ) : channel.blog.includes('naver') ? (
                        <SiNaver className="w-4 h-4 text-[#03c75a]" />
                      ) : (
                        <SiVelog className="w-5 h-5 text-[#12B886]" />
                      )}
                    </Link>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
