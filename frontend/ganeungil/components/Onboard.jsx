import LoginButton from "../button/LoginButton";

// 이미지 에셋 (Figma MCP에서 가져온 URL, 7일 유효)
const imgHero = "https://www.figma.com/api/mcp/asset/df6c8293-bc25-40c9-a250-94e446dc1c9f";
const imgStory1 = "https://www.figma.com/api/mcp/asset/ab202676-f3c5-4a9b-82b3-02b546614c35";
const imgStory2 = "https://www.figma.com/api/mcp/asset/695aaa66-ab8c-4ec9-80e6-742a894ef9b9";
const imgStory3 = "https://www.figma.com/api/mcp/asset/d87e5318-112e-413f-a1b2-a953ae2bfd35";
const iconRoute = "https://www.figma.com/api/mcp/asset/2dccaee0-b8d0-460d-86e2-1886f9bb78b1";
const iconLeisure = "https://www.figma.com/api/mcp/asset/403f09fc-ddf2-46d0-9f0f-5613fe7e6f0e";
const iconDiscover = "https://www.figma.com/api/mcp/asset/50d33d17-ca98-4670-a6b5-fd59bf1f5022";
const iconViewAll = "https://www.figma.com/api/mcp/asset/9bb41780-20a0-47f0-98ad-0d9f7cca4ef3";
const iconNavFind = "https://www.figma.com/api/mcp/asset/862832a1-c102-4203-8f75-73a7537da68a";
const iconNavExplore = "https://www.figma.com/api/mcp/asset/cbde8c10-305f-4688-ae7e-3306ccca1a60";
const iconLogin = "https://www.figma.com/api/mcp/asset/56c2a05b-c139-4b23-960a-ddb6123de5a4";
const iconMenu = "https://www.figma.com/api/mcp/asset/a764294a-7a67-4bb2-8e4f-74c32ea7b7b9";

// 폰트: Google Fonts에서 Noto Serif KR 불러오기 (index.html에 추가 필요)
// <link href="https://fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@300;400;500;600&display=swap" rel="stylesheet" />

export default function Onboard() {
  return (
    <div
      className="min-h-screen bg-[#faf6f0] text-[#2c2417]"
      style={{ fontFamily: "'Noto Serif KR', serif" }}
    >
      {/* ── 네비게이션 바 ── */}
      <header className="sticky top-0 z-50 bg-[rgba(250,246,240,0.85)] backdrop-blur-sm border-b border-[rgba(44,36,23,0.06)]">
        <div className="max-w-[1101px] mx-auto px-10 h-14 flex items-center justify-between">
          {/* 로고 */}
          <a
            href="#"
            className="text-[#c8873a] font-semibold text-xl tracking-[0.1em]"
          >
            가는길
          </a>

          {/* 가운데 내비게이션 */}
          <nav className="flex items-center gap-5">
            <a
              href="#"
              className="px-4 py-1.5 rounded-full text-[#8b7e6a] text-sm hover:text-[#2c2417] transition-colors"
            >
              길찾기
            </a>
            <a
              href="#"
              className="text-[#8b7e6a] text-sm hover:text-[#2c2417] transition-colors"
            >
              둘러보기
            </a>
          </nav>

          {/* 우측 버튼 */}
          <div className="flex items-center gap-2">
            <LoginButton />
            <button className="w-10 h-10 rounded-full bg-[rgba(240,232,218,0.5)] flex items-center justify-center hover:bg-[rgba(240,232,218,0.8)] transition-colors">
              <img src={iconMenu} alt="메뉴" className="w-[18px] h-[18px]" />
            </button>
          </div>
        </div>
      </header>

      {/* ── 히어로 섹션 ── */}
      <section className="relative h-[656px] overflow-hidden">
        {/* 배경 이미지 */}
        <img
          src={imgHero}
          alt="골목길 배경"
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* 그라디언트 오버레이 */}
        <div className="absolute inset-0 bg-gradient-to-t from-[rgba(0,0,0,0.7)] via-[rgba(0,0,0,0.25)] to-[rgba(0,0,0,0)]" />

        {/* 콘텐츠 */}
        <div className="relative h-full max-w-[1101px] mx-auto px-10 flex flex-col justify-end pb-16 pl-14">
          {/* 헤드라인 */}
          <h1
            className="text-[51.2px] font-light leading-[1.25] tracking-[-0.025em] text-white mb-6"
          >
            길을 걷는 것이
            <br />
            <span className="text-[#e8c36a] font-medium">취향</span>
            <span className="font-light">이 되는 순간</span>
          </h1>

          {/* 서브 카피 */}
          <p className="text-[15.2px] font-light text-[rgba(255,255,255,0.55)] mb-7 leading-relaxed">
            단순히 지나가는 공간이 아닌, 새로운 취향을 만나는 통로로.
          </p>

          {/* CTA 버튼 */}
          <div className="flex gap-3 w-[384px]">
            <button className="flex-1 h-[54px] rounded-full bg-[#e8c36a] text-[#2c2417] font-medium text-base flex items-center justify-center gap-2 hover:bg-[#d4a94f] transition-colors">
              <img src={iconNavFind} alt="" className="w-[17px] h-[17px]" />
              길찾기
            </button>
            <button className="flex-1 h-[54px] rounded-full bg-[rgba(255,255,255,0.1)] border border-[rgba(255,255,255,0.2)] text-white font-medium text-base flex items-center justify-center gap-2 hover:bg-[rgba(255,255,255,0.2)] transition-colors">
              <img src={iconNavExplore} alt="" className="w-[17px] h-[17px]" />
              탐색하기
            </button>
          </div>
        </div>
      </section>

      {/* ── 길 선택 섹션 ── */}
      <section className="max-w-[1101px] mx-auto px-10 py-16">
        {/* 섹션 헤더 */}
        <div className="mb-10">
          <h2 className="text-[28.8px] font-light text-[#2c2417] leading-[1.375] mb-3">
            당신에게 맞는{" "}
            <span className="font-medium text-[#c8873a]">길</span>
            을 선택하세요
          </h2>
          <p className="text-sm font-light text-[#8b7e6a] leading-relaxed">
            바쁜 출근길부터 여유로운 주말 산책까지, 상황에 따라 다른 길을 제안합니다.
          </p>
        </div>

        {/* 카드 3개 */}
        <div className="grid grid-cols-3 gap-5">
          {/* 바른 길 */}
          <div className="bg-white border border-[rgba(44,36,23,0.1)] rounded-2xl p-6 hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-full bg-[rgba(212,149,74,0.09)] flex items-center justify-center mb-8">
              <img src={iconRoute} alt="" className="w-5 h-5" />
            </div>
            <h3 className="text-[16.8px] font-medium text-[#2c2417] mb-2">바른 길</h3>
            <p className="text-[13.6px] font-light text-[#8b7e6a]">가장 빠르고 효율적인 경로</p>
          </div>

          {/* 여유로운 길 */}
          <div className="bg-white border border-[rgba(44,36,23,0.1)] rounded-2xl p-6 hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-full bg-[rgba(123,196,160,0.09)] flex items-center justify-center mb-8">
              <img src={iconLeisure} alt="" className="w-5 h-5" />
            </div>
            <h3 className="text-[16.8px] font-medium text-[#2c2417] mb-2">여유로운 길</h3>
            <p className="text-[13.6px] font-light text-[#8b7e6a]">걷기 좋은 골목과 공원을 따라</p>
          </div>

          {/* 발견하는 길 */}
          <div className="bg-white border border-[rgba(44,36,23,0.1)] rounded-2xl p-6 hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-full bg-[rgba(167,139,218,0.09)] flex items-center justify-center mb-8">
              <img src={iconDiscover} alt="" className="w-5 h-5" />
            </div>
            <h3 className="text-[16.8px] font-medium text-[#2c2417] mb-2">발견하는 길</h3>
            <p className="text-[13.6px] font-light text-[#8b7e6a]">새로운 취향을 만나는 우연</p>
          </div>
        </div>
      </section>

      {/* ── 자연스러운 발견 섹션 ── */}
      <section className="max-w-[1101px] mx-auto px-10 py-16 bg-[rgba(245,230,200,0.2)]">
        {/* 헤더 */}
        <h2 className="text-[28.8px] font-light text-[#2c2417] leading-[1.375] mb-12">
          일부러 돌아가지 않아도 되는
          <br />
          <span className="font-medium text-[#c8873a]">자연스러운 발견</span>
        </h2>

        {/* 피처 그리드 */}
        <div className="grid grid-cols-2 gap-x-16 gap-y-9">
          {[
            {
              title: "경로 기반 추천",
              desc: "이동 경로에서 도보 5분 이내의 장소만 추천합니다.",
            },
            {
              title: "걷기 좋은 길",
              desc: "골목길, 공원, 하천 주변의 산책로를 우선합니다.",
            },
            {
              title: "취향 큐레이션",
              desc: "당신의 관심사에 맞는 장소를 발견합니다.",
            },
            {
              title: "로컬 스토리",
              desc: "동네 주민이 만든 이야기가 담긴 코스입니다.",
            },
          ].map((item) => (
            <div key={item.title} className="flex gap-4">
              <div className="w-1.5 rounded-full bg-[rgba(200,135,58,0.25)] shrink-0" />
              <div>
                <h4 className="text-[15.2px] font-medium text-[#2c2417] mb-1">
                  {item.title}
                </h4>
                <p className="text-[13.6px] font-light text-[#8b7e6a] leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 동네 사람들의 이야기 섹션 ── */}
      <section className="max-w-[1101px] mx-auto px-10 py-16">
        {/* 섹션 헤더 */}
        <div className="flex items-end justify-between mb-10">
          <h2 className="text-[28.8px] font-light text-[#2c2417]">
            동네 사람들의{" "}
            <span className="font-medium text-[#c8873a]">이야기</span>
          </h2>
          <button className="flex items-center gap-1 text-[#c8873a] text-[13.6px] font-medium hover:opacity-75 transition-opacity">
            모두 보기
            <img src={iconViewAll} alt="" className="w-[15px] h-[15px]" />
          </button>
        </div>

        {/* 사진 그리드 */}
        <div className="grid grid-cols-[3fr_2fr] gap-5">
          {/* 큰 카드 (왼쪽) */}
          <div className="relative overflow-hidden rounded-2xl h-[404px] group cursor-pointer">
            <img
              src={imgStory1}
              alt="망원동의 숨은 골목 산책"
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[rgba(0,0,0,0.5)] to-transparent" />
            <div className="absolute bottom-4 left-4 right-4">
              <div className="flex gap-1.5 mb-2">
                {["골목길", "카페", "벽화"].map((tag) => (
                  <span
                    key={tag}
                    className="bg-[rgba(255,255,255,0.8)] text-[#2c2417] text-[10.88px] px-2 py-0.5 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <h3 className="text-[18.4px] font-medium text-white mb-1.5">
                망원동의 숨은 골목 산책
              </h3>
              <p className="text-[12.48px] font-light text-[rgba(255,255,255,0.6)]">
                동네주민 하늘 · 2.3km · 약 35분
              </p>
            </div>
          </div>

          {/* 오른쪽 세로 두 카드 */}
          <div className="flex flex-col gap-5">
            {/* 성수동 카드 */}
            <div className="relative overflow-hidden rounded-2xl flex-1 group cursor-pointer">
              <img
                src={imgStory2}
                alt="성수동 오후의 여유"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[rgba(0,0,0,0.5)] to-transparent" />
              <div className="absolute bottom-3 left-3 right-3">
                <h3 className="text-[15.2px] font-medium text-white mb-1">
                  성수동 오후의 여유
                </h3>
                <p className="text-[11.52px] font-light text-[rgba(255,255,255,0.6)]">
                  커피러버 은지 · 1.8km
                </p>
              </div>
            </div>

            {/* 한강 카드 */}
            <div className="relative overflow-hidden rounded-2xl flex-1 group cursor-pointer">
              <img
                src={imgStory3}
                alt="한강 선유도 새벽 산책"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[rgba(0,0,0,0.5)] to-transparent" />
              <div className="absolute bottom-3 left-3 right-3">
                <h3 className="text-[15.2px] font-medium text-white mb-1">
                  한강 선유도 새벽 산책
                </h3>
                <p className="text-[11.52px] font-light text-[rgba(255,255,255,0.6)]">
                  아침형 인간 준서 · 3.1km
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 푸터 ── */}
      <footer className="border-t border-[rgba(44,36,23,0.1)]">
        <div className="max-w-[1101px] mx-auto px-10 py-12 flex items-center justify-between">
          <span className="text-[#c8873a] font-semibold text-[18.4px] tracking-[0.12em]">
            가는길
          </span>
          <div className="flex items-center gap-5 text-[12.48px] font-light text-[#8b7e6a]">
            <a href="#" className="hover:text-[#2c2417] transition-colors">이용약관</a>
            <a href="#" className="hover:text-[#2c2417] transition-colors">개인정보처리방침</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
