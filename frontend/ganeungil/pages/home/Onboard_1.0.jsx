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

        <div className="relative h-full max-w-[1101px] mx-auto px-14 flex flex-col justify-end pb-16">
          <h1
            className="text-[51.2px] font-light leading-[1.25] tracking-[-0.025em] text-white mb-6"
            style={{ fontFamily: "MaruBuriOTF" }}
          >
            길을 걷는 것이
            <br />
            <span className="text-[#ed7a13]">가는길</span>이 더 궁금한 사람에게
          </h1>

          <p
            className="text-[15.2px] text-[rgba(255,255,255,0.55)] mb-7 leading-relaxed"
            style={{ fontFamily: "Pretendard-Light" }}
          >
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

      {/* ── 길 선택 섹션 ── */}
      <section className="max-w-[1101px] mx-auto px-10 py-16">
        <div className="mb-10">
          <h2
            className="text-[28.8px] font-light text-[#2c2417] leading-[1.375] mb-3"
            style={{ fontFamily: "MaruBuriOTF" }}
          >
            당신에게 맞는{" "}
            <span className="font-medium text-[#c8873a]">길</span>
            을 선택하세요
          </h2>
          <p
            className="text-sm text-[#8b7e6a] leading-relaxed"
            style={{ fontFamily: "Pretendard-Light" }}
          >
            바쁜 출근길부터 여유로운 주말 산책까지, 상황에 따라 다른 길을 제안합니다.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-5">
          <div className="bg-white border border-[rgba(44,36,23,0.1)] rounded-2xl p-6 hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-full bg-[rgba(212,149,74,0.09)] flex items-center justify-center mb-8">
              <img src={iconRoute} alt="" className="w-5 h-5" />
            </div>
            <h3
              className="text-[16.8px] text-[#2c2417] mb-2"
              style={{ fontFamily: "Pretendard-Medium" }}
            >바른 길</h3>
            <p
              className="text-[13.6px] text-[#8b7e6a]"
              style={{ fontFamily: "Pretendard-Light" }}
            >가장 빠르고 효율적인 경로</p>
          </div>

          <div className="bg-white border border-[rgba(44,36,23,0.1)] rounded-2xl p-6 hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-full bg-[rgba(123,196,160,0.09)] flex items-center justify-center mb-8">
              <img src={iconLeisure} alt="" className="w-5 h-5" />
            </div>
            <h3
              className="text-[16.8px] text-[#2c2417] mb-2"
              style={{ fontFamily: "Pretendard-Medium" }}
            >여유로운 길</h3>
            <p
              className="text-[13.6px] text-[#8b7e6a]"
              style={{ fontFamily: "Pretendard-Light" }}
            >걷기 좋은 골목과 공원을 따라</p>
          </div>

          <div className="bg-white border border-[rgba(44,36,23,0.1)] rounded-2xl p-6 hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-full bg-[rgba(167,139,218,0.09)] flex items-center justify-center mb-8">
              <img src={iconDiscover} alt="" className="w-5 h-5" />
            </div>
            <h3
              className="text-[16.8px] text-[#2c2417] mb-2"
              style={{ fontFamily: "Pretendard-Medium" }}
            >발견하는 길</h3>
            <p
              className="text-[13.6px] text-[#8b7e6a]"
              style={{ fontFamily: "Pretendard-Light" }}
            >새로운 취향을 만나는 우연</p>
          </div>
        </div>
      </section>

      {/* ── 자연스러운 발견 섹션 ── */}
      <section className="max-w-[1101px] mx-auto px-10 py-16 bg-[rgba(245,230,200,0.2)]">
        <h2
          className="text-[28.8px] font-light text-[#2c2417] leading-[1.375] mb-12"
          style={{ fontFamily: "MaruBuriOTF" }}
        >
          일부러 돌아가지 않아도 되는
          <br />
          <span className="font-medium text-[#c8873a]">자연스러운 발견</span>
        </h2>

        <div className="grid grid-cols-2 gap-x-16 gap-y-9">
          {[
            { title: "경로 기반 추천", desc: "이동 경로에서 도보 5분 이내의 장소만 추천합니다." },
            { title: "걷기 좋은 길", desc: "골목길, 공원, 하천 주변의 산책로를 우선합니다." },
            { title: "취향 큐레이션", desc: "당신의 관심사에 맞는 장소를 발견합니다." },
            { title: "로컬 스토리", desc: "동네 주민이 만든 이야기가 담긴 코스입니다." },
          ].map((item) => (
            <div key={item.title} className="flex gap-4">
              <div className="w-1.5 rounded-full bg-[rgba(200,135,58,0.25)] shrink-0" />
              <div>
                <h4
                  className="text-[15.2px] text-[#2c2417] mb-1"
                  style={{ fontFamily: "Pretendard-Medium" }}
                >{item.title}</h4>
                <p
                  className="text-[13.6px] text-[#8b7e6a] leading-relaxed"
                  style={{ fontFamily: "Pretendard-Light" }}
                >{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 동네 사람들의 이야기 섹션 ── */}
      <section className="max-w-[1101px] mx-auto px-10 py-16">
        <h2
          className="text-[28.8px] font-light text-[#2c2417] mb-10"
          style={{ fontFamily: "MaruBuriOTF" }}
        >
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
              <h3
                className="text-[18.4px] text-white mb-1.5"
                style={{ fontFamily: "Pretendard-Medium" }}
              >망원동의 숨은 골목 산책</h3>
              <p
                className="text-[12.48px] text-[rgba(255,255,255,0.6)]"
                style={{ fontFamily: "Pretendard-Light" }}
              >동네주민 하늘 · 2.3km · 약 35분</p>
            </div>
          </div>
        </div>
      </section>

          {/* 오른쪽 카드 */}
          <div className="relative overflow-hidden rounded-2xl group cursor-pointer">
            <img
              src={imgStory2}
              alt="성수동 오후의 여유"
              className="absolute inset-0 object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[rgba(0,0,0,0.5)] to-transparent" />
            <div className="absolute bottom-3 left-3 right-3">
              <h3
                className="text-[15.2px] text-white mb-1"
                style={{ fontFamily: "Pretendard-Medium" }}
              >성수동 오후의 여유</h3>
              <p
                className="text-[11.52px] text-[rgba(255,255,255,0.6)]"
                style={{ fontFamily: "Pretendard-Light" }}
              >커피러버 은지 · 1.8km</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 푸터 ── */}
      <footer className="border-t border-[rgba(44,36,23,0.1)]">
        <div className="max-w-[1101px] mx-auto px-10 py-12 flex items-center justify-between">
          <span
            className="text-[#c8873a] text-[18.4px] tracking-[2.2px]"
            style={{ fontFamily: "Pretendard-SemiBold" }}
          >가는길</span>
          <div
            className="flex items-center gap-5 text-[12.48px] text-[#8b7e6a]"
            style={{ fontFamily: "Pretendard-Light" }}
          >
            <a href="#" className="hover:text-[#2c2417] transition-colors">이용약관</a>
            <a href="#" className="hover:text-[#2c2417] transition-colors">개인정보처리방침</a>
          </div>
        </div>
      </footer>
      </div>
    </div>
  );
}
