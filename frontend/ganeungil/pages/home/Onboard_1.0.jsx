import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

// 헤더 에셋
import LOGO_ICON  from "@/assets/header-logo.svg";
import iconSearch from "@/assets/header-search.svg";
import iconMenu   from "@/assets/header-menu.svg";

// 홈 페이지 전용 에셋 (Figma node 1411:463)
import heroBg            from "@/assets/home/hero-bg.jpg";
import map1               from "@/assets/map-1.png";
import map2               from "@/assets/map-2.png";
import backVector         from "@/assets/back-vector.svg";
import faqChevron        from "@/assets/home/faq-chevron.svg";
import cardIconRoute     from "@/assets/home/card-icon-route.svg";
import cardIconLeisure   from "@/assets/home/card-icon-leisure.svg";
import cardIconDiscover  from "@/assets/home/card-icon-discover.svg";

const NAV_ITEMS = [
  { label: "길찾기",  path: "/find-route" },
  { label: "둘러보기", path: "/explore"    },
  { label: "간직하기", path: "/discover"   },
];

const PATH_CARDS = [
  { title: "바른 길",    desc: "가장 빠르고 효율적인 경로",     icon: cardIconRoute,    iconBg: "rgba(237,122,19,0.2)"  },
  { title: "발견하는 길", desc: "걷기 좋은 골목과 숨겨진 명소들", icon: cardIconDiscover, iconBg: "rgba(106,128,66,0.2)"  },
  { title: "여유로운 길", desc: "새로운 취향을 만나는 우연",     icon: cardIconLeisure,  iconBg: "rgba(255,237,161,0.2)" },
];

const TESTIMONIALS = [
  { quote: "매일 다니던 길에 빵집이 있는 줄 처음 알았어요.\n5분 더 걸었더니 단골이 한 곳 늘었어요.", name: "김기영", place: "장전동" },
  { quote: "매일 다니던 길에 빵집이 있는 줄 처음 알았어요.\n5분 더 걸었더니 단골이 한 곳 늘었어요.", name: "김기영", place: "장전동" },
  { quote: "매일 다니던 길에 빵집이 있는 줄 처음 알았어요.\n5분 더 걸었더니 단골이 한 곳 늘었어요.", name: "김기영", place: "장전동" },
  { quote: "매일 다니던 길에 빵집이 있는 줄 처음 알았어요.\n5분 더 걸었더니 단골이 한 곳 늘었어요.", name: "김기영", place: "장전동" },
];

const FAQS = [
  {
    q: "Q1. 가는길은 어떤 서비스인가요?",
    a: [
      "가는길은 출발지에서 도착지까지의 경로 위에서, 평소 지나치기 쉬웠던 장소들을 발견할 수 있도록 돕는 경로 기반 장소 발견 서비스예요.",
      "세 가지 경로 타입(가는길, 여유로운길, 발견하는길)을 통해 원하는 만큼의 우회를 선택할 수 있어요.",
    ],
  },
  {
    q: "Q2. 가는길은 기존 지도 서비스와 어떤 차별점이 있나요?",
    a: [
      "기존 지도 서비스가 '가장 빠른 길'을 우선한다면, 가는길은 '경로 위의 발견'을 우선해요.",
      "길을 찾는 게 아니라, 길 위에서 만날 수 있는 것들을 찾아드려요.",
    ],
  },
  {
    q: "Q3. 어떤 곳을 추천해주나요?",
    a: [
      "카페, 식당, 작은 공원, 동네 가게 등 경로에서 살짝 벗어나면 만날 수 있는 장소들을 추천해드려요.",
      "곧 더 많은 카테고리로 확장될 예정이에요.",
    ],
  },
  {
    q: "Q4. 지금은 어느 지역에서 사용할 수 있나요?",
    a: [
      "현재는 부산광역시 금정구 부곡동, 구서동, 장전동, 온천동, 그리고 명륜동까지 5개 지역 중심으로 운영중이예요.",
      "점진적으로 부산 전역으로 지원할 계획입니다.",
    ],
  },
];

function MiniMapSquare({ label, caption, bgImage }) {
  return (
    <div className="flex flex-col items-center gap-[16px]">
      <p className="self-start font-['MaruBuriOTF'] font-semibold text-[22.5px] leading-[52.5px] text-[#3e2722]">{label}</p>
      <div
        className="relative w-[256.5px] h-[256.5px] overflow-hidden shrink-0 shadow-[0px_5px_10px_0px_rgba(0,0,0,0.12)]"
        style={{ background: `lightgray url(${bgImage}) 0px 0px / 100% 108.027% no-repeat` }}
      >
        <img
          src={bgImage}
          alt=""
          className="absolute object-cover w-full"
          style={{ top: "-8%", height: "116%" }}
        />
      </div>
      <p className="font-['MaruBuriOTF'] font-semibold text-[22.5px] leading-[67.22px] text-[#3e2722] whitespace-nowrap">{caption}</p>
    </div>
  );
}

export default function OnboardNew() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [openFaq, setOpenFaq] = useState(0);

  return (
    <div
      className="relative w-[1440px] mx-auto overflow-hidden bg-[#fdfdfd] text-[#2c2417]"
      style={{ fontFamily: "'Noto Serif KR', serif" }}
    >
      {/* ── 히어로 섹션 ── */}
      <section className="relative h-[34vw] overflow-hidden">
        <img
          src={imgHero}
          alt="골목길 배경"
          className="absolute inset-0 object-cover w-full h-full"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[rgba(0,0,0,0.7)] via-[rgba(0,0,0,0.25)] to-transparent" />

        <div className="relative h-full px-[113px] flex flex-col justify-center gap-[18px] max-w-[700px]">
          <h1 className="text-white text-[36px] font-semibold font-['MaruBuriOTF'] leading-[40.5px]">
            목적지보다
            <br />
            <span className="text-[#ed7a13]">가는길</span>이 더 궁금한 사람에게
          </h1>
          <p className="text-white text-[15px] font-light font-['MaruBuriOTF'] leading-[24px]">
            단순히 지나가는 공간이 아닌, 새로운 취향을 만나는 통로로.
            <br />
            가는길에 들를 만한 곳을 추천합니다.
          </p>

          <div className="flex gap-3 w-[20vw]">
            <FindRouteButton />
            <ExploreButton />
          </div>
        </div>
      </section>

      {/* ── 가장 빠른 길이, 동네를 좁게 만들어요 ── */}
      <section className="relative px-[113px] py-[100px] grid grid-cols-2 gap-x-[60px] items-center">
        <div className="relative flex flex-col gap-[19px]">
          <h2 className="font-['MaruBuriOTF'] font-semibold text-[36px] leading-[42px] text-[#2c2417]">
            가장 빠른 <span className="text-[#ed7a13]">길</span>이,
            <br />
            동네를 좁게 만들어요
          </h2>
          <p className="font-['MaruBuriOTF'] font-light text-[15px] leading-[22px] text-[#3e2722]">
            지도는 늘 1분이라도 빠른 길을 권해요.
            <br />
            그래서 우리는 늘 같은 골목, 같은 풍경 위에 있어요.
            <br />그 5분이 동네를 한 칸씩 지웁니다.
          </p>
        </div>

        <div className="relative flex items-start justify-left gap-[64px]">
          <MiniMapSquare label="before" caption="목적지까지 가는 방법만" bgImage={map1} />
          <MiniMapSquare label="after" caption="가는길에 무엇이 있는지" bgImage={map2} />
        </div>
      </section>

      {/* ── 당신에게 맞는 길을 선택하세요 ── */}
      <section className="px-[113px] py-[80px]">
        <div className="mb-[40px]">
          <h2 className="font-['MaruBuriOTF'] font-semibold text-[36px] leading-[46px] text-[#2c2417] mb-[8px]">
            당신에게 맞는 <span className="text-[#ed7a13]">길</span>을 선택하세요
          </h2>
          <p className="font-['Noto_Serif_KR'] font-light text-[15px] text-[#3e2722]">
            바쁜 출근길부터 여유로운 주말 산책까지, 상황에 따라 다른 길을 제안합니다.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-[20px]">
          {PATH_CARDS.map((card) => (
            <div
              key={card.title}
              className="flex flex-col gap-[29px] bg-[#fdfdfd] border border-[#afafaf] rounded-[23px] px-[29px] py-[48px] shadow-[0px_5px_3px_0px_rgba(0,0,0,0.05)]"
            >
              <div
                className="w-[54px] h-[54px] rounded-full flex items-center justify-center"
                style={{ backgroundColor: card.iconBg }}
              >
                <img src={card.icon} alt="" className="w-[27px] h-[27px]" />
              </div>
              <div className="flex flex-col gap-[10px]">
                <p className="font-['Pretendard'] text-[18px] tracking-[-0.5px] text-[#3e2722]">{card.desc}</p>
                <p className="font-['Pretendard-Bold'] text-[24px] tracking-[-0.65px] text-[#3e2722]">{card.title}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 동네 사람들의 이야기 섹션 ── */}
      <section className="max-w-[1101px] mx-auto px-10 py-16">
        <h2 className="text-[28.8px] font-light text-[#2c2417] mb-10">
          동네 사람들의{" "}
          <span className="font-medium text-[#c8873a]">이야기</span>
        </h2>

        <div className="grid grid-cols-[3fr_2fr] gap-5">
          {/* 큰 카드 (왼쪽) */}
          <div className="relative overflow-hidden rounded-2xl h-[21vw] group cursor-pointer">
            <img
              src={imgStory1}
              alt="망원동의 숨은 골목 산책"
              className="absolute inset-0 object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[rgba(0,0,0,0.5)] to-transparent" />
            <div className="absolute bottom-4 left-4 right-4">
              <div className="flex gap-1.5 mb-2">
                {["골목길", "카페", "벽화"].map((tag) => (
                  <span key={tag} className="bg-[rgba(255,255,255,0.8)] text-[#2c2417] text-[10.88px] px-2 py-0.5 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 자주 묻는 질문을 모아봤어요 ── */}
      <section className="px-[113px] py-[80px] grid grid-cols-[448px_1fr] gap-x-[60px]">
        <div className="flex flex-col gap-[18px]">
          <h2 className="font-['MaruBuriOTF'] font-semibold text-[36px] leading-[40px] text-[#3e2722]">
            자주 묻는 질문을 모아봤어요
          </h2>
          <p className="font-['MaruBuriOTF'] font-light text-[15px] leading-[22px] text-[#3e2722]">
            가는길을 처음 만나는 분들의 자주 묻는 질문을 모아봤어요.
            <br />더 궁금하신 부분이 있다면 이메일을 보내주세요.
          </p>
        </div>

        <div className="flex flex-col gap-[27px]">
          {FAQS.map((faq, i) => {
            const open = openFaq === i;
            return (
              <div key={faq.q} className="flex flex-col gap-[20px]">
                <button
                  onClick={() => setOpenFaq(open ? -1 : i)}
                  className="flex items-center justify-between w-full text-left"
                >
                  <p className="font-['MaruBuriOTF'] font-bold text-[22px] text-[#3e2722]">{faq.q}</p>
                  <img
                    src={faqChevron}
                    alt=""
                    className="w-[14px] h-[26px] shrink-0 transition-transform duration-200"
                    style={{ transform: open ? "rotate(-90deg)" : "rotate(90deg)" }}
                  />
                </button>
                <div className="w-full h-px bg-black/20" />
                {open && (
                  <div className="font-['MaruBuriOTF'] text-[16px] leading-[28px] text-black -mt-[6px] pb-[6px]">
                    {faq.a.map((line, li) => (
                      <p key={li}>{line}</p>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ── 푸터 ── */}
      <footer className="w-full h-[90px] bg-[#FFFBEC] flex items-center justify-between px-[113px]">
        <button onClick={() => navigate("/")} className="w-[141px] h-[25px]">
          <img src={LOGO_ICON} alt="가는길" className="w-full h-full" />
        </button>
        <div className="flex items-center gap-[22px] font-['Pretendard'] text-[15px] text-[#3e2722]">
          <span>이용약관</span>
          <span>개인정보처리방침</span>
          <span>문의</span>
        </div>
      </footer>
      </div>
    </div>
  );
}
