// Figma: node 3001:247 "Group 79"
// 492 × 1091px 고정 패널, 내부 모든 요소 absolute 위치값 그대로 보존

import iconAll         from "@/assets/icon-all.svg";
import iconAllActive   from "@/assets/icon-all-active.svg";
import iconDrink       from "@/assets/icon-drink.svg";
import iconDrinkActive from "@/assets/icon-drink-active.svg";
import iconFood        from "@/assets/icon-food.svg";
import iconFoodActive  from "@/assets/icon-food-active.svg";
import iconShop        from "@/assets/icon-shop.svg";
import iconShopActive  from "@/assets/icon-shop-active.svg";
import iconView        from "@/assets/icon-view.svg";
import iconViewActive  from "@/assets/icon-view-active.svg";
import iconHeart       from "@/assets/icon-heart.svg";
import iconSearch      from "@/assets/header_search.svg";
import imgPlace        from "@/assets/img-place.jpg";

// Figma CDN (7일 유효) — 로컬 파일로 교체 필요
const imgGpsConnector = "https://www.figma.com/api/mcp/asset/6d4cd4c3-da12-4f63-9c57-240627db3647";

const TABS = [
  { label: "전체",  icon: iconAll,   iconActive: iconAllActive,   active: true },
  { label: "한 잔", icon: iconDrink, iconActive: iconDrinkActive               },
  { label: "한 입", icon: iconFood,  iconActive: iconFoodActive                },
  { label: "한 끼", icon: iconFood,  iconActive: iconFoodActive                },
  { label: "한 눈", icon: iconView,  iconActive: iconViewActive                },
  { label: "한 판", icon: iconShop,  iconActive: iconShopActive                },
];

const CATEGORY_BADGE_ICON = {
  "한 잔": iconDrinkActive,
  "한 입": iconFoodActive,
  "한 끼": iconFoodActive,
  "한 눈": iconViewActive,
  "한 판": iconShopActive,
};

const PLACEHOLDER_PLACE = {
  name: "가는길 카페",
  category: "한 잔",
  walkMin: 5,
  isOpen: true,
  closeTime: "00:00",
  desc: "골목 안 작은 로스터리.\n매일 아침 직접 볶은 원두가 기다립니다.",
  tags: ["#로스팅", "#조용한"],
};

// ─── 서브 컴포넌트: 장소 카드 ───────────────────────────────────────────────
function PlaceCard({ place }) {
  const badgeIcon = CATEGORY_BADGE_ICON[place.category];

  return (
    <div
      className="bg-[#fdfdfd] border-[1.286px] border-[rgba(175,175,175,0.5)] border-solid rounded-[25.714px] flex items-start overflow-hidden"
      style={{ height: 127, paddingTop: 14, paddingBottom: 9, paddingLeft: 16, paddingRight: 16 }}
    >
      {/* 이미지 + 정보 영역 */}
      <div className="flex gap-[6px] items-start flex-1 min-w-0">
        {/* 장소 이미지 — 80.286 × 80.286 */}
        <div
          className="shrink-0 rounded-[10px] overflow-hidden bg-[#f5f0e8]"
          style={{ width: 80.286, height: 80.286 }}
        >
          <img src={place.imageURL || imgPlace} alt={place.name} className="object-cover w-full h-full" />
        </div>

        {/* 텍스트 정보 — 170.287px 고정 너비 */}
        <div className="flex flex-col gap-[10px] shrink-0" style={{ width: 170.287 }}>
          <div className="flex flex-col gap-[11px]">
            <div className="flex flex-col gap-[7px]">
              {/* 가게명 + 카테고리 배지 */}
              <div className="flex items-center justify-between">
                <p
                  className="text-[#3e2722] text-[12.857px] leading-[1.334] truncate"
                  style={{ fontFamily: "'Pretendard', sans-serif", fontWeight: 600 }}
                >
                  {place.name}
                </p>
                <div
                  className="bg-[#ed7a13] flex items-center justify-center gap-[3.675px] rounded-[14.293px] shrink-0"
                  style={{ height: 16.512, paddingLeft: 5, paddingRight: 5, paddingTop: 3.675, paddingBottom: 3.675 }}
                >
                  {badgeIcon && (
                    <img src={badgeIcon} alt="" style={{ width: 6.892, height: 6.892 }} />
                  )}
                  <span
                    className="text-white whitespace-nowrap"
                    style={{ fontSize: 6.43, fontFamily: "'Pretendard', sans-serif", fontWeight: 500 }}
                  >
                    {place.category}
                  </span>
                </div>
              </div>

              {/* 도보 + 영업시간 — grid (col1: 도보, col2: 영업시간) */}
              <div className="flex gap-[12px] items-center">
                <span
                  className="text-[#3e2722] text-[7.714px] leading-[1.334] whitespace-nowrap"
                  style={{ fontFamily: "'MaruBuriOTF', sans-serif", fontWeight: 300 }}
                >
                  내 위치로부터 도보 {place.walkMin}분
                </span>
                {place.isOpen ? (
                  <span
                    className="text-[#6a8042] text-[7.714px] leading-[1.334] whitespace-nowrap"
                    style={{ fontFamily: "'MaruBuriOTF', sans-serif", fontWeight: 300 }}
                  >
                    영업 중&nbsp;
                    {place.closeTime && `(${place.closeTime}에 종료)`}
                  </span>
                ) : (
                  <span
                    className="text-[#c82b2b] text-[7.714px] leading-[1.334] whitespace-nowrap"
                    style={{ fontFamily: "'MaruBuriOTF', sans-serif", fontWeight: 300 }}
                  >
                    영업 종료
                    {place.openTime && ` (${place.openTime}에 시작)`}
                  </span>
                )}
              </div>
            </div>

            {/* 설명 */}
            <p
              className="text-[#3e2722] text-[9px] leading-[1.334] whitespace-pre-line"
              style={{ fontFamily: "'MaruBuriOTF', sans-serif", fontWeight: 300 }}
            >
              {place.desc}
            </p>
          </div>

          {/* 태그 */}
          <div className="flex gap-[4px] items-center flex-wrap">
            {place.tags.map(tag => (
              <span
                key={tag}
                className="bg-[#fff2b9] text-[#3e2722] whitespace-nowrap"
                style={{
                  fontSize: 6.429,
                  paddingLeft: 6.429,
                  paddingRight: 6.429,
                  paddingTop: 3.857,
                  paddingBottom: 3.857,
                  borderRadius: 12.857,
                  fontFamily: "'MaruBuriOTF', sans-serif",
                  fontWeight: 300,
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* 하트 버튼 */}
      <button
        className="shrink-0 flex items-center justify-center"
        style={{ width: 19, height: 19, marginLeft: 12 }}
        onClick={e => e.stopPropagation()}
      >
        <img src={iconHeart} alt="저장" style={{ width: 13.705, height: 13.705 }} />
      </button>
    </div>
  );
}

// ─── 메인 컴포넌트: Group 79 ─────────────────────────────────────────────────
export default function Group79({ places }) {
  const cardPlaces = places?.length ? places : Array(4).fill(PLACEHOLDER_PLACE);

  return (
    <div className="relative" style={{ width: 492, height: 1091 }}>

      {/* ① 흰색 카드 배경 */}
      <div
        className="absolute bg-[#fdfdfd] rounded-[30px] shadow-[0px_4px_10px_0px_rgba(0,0,0,0.25)]"
        style={{ left: 0, top: 0, width: 492, height: 1091 }}
      />

      {/* ② 노란 헤더 영역 */}
      <div
        className="absolute bg-[#ffeda1] rounded-tl-[30px] rounded-tr-[30px]"
        style={{ left: 0, top: 0, width: 492, height: 359 }}
      />

      {/* ③ GPS 커넥터 (출발·도착 점 + 연결선) — (32, 72) 24×91 */}
      <div
        className="absolute overflow-hidden"
        style={{ left: 32, top: 72, width: 24, height: 91 }}
      >
        <img
          alt="GPS connector"
          className="absolute block"
          style={{ inset: "-1.1% -4.16%", width: "108.32%", height: "102.2%" }}
          src={imgGpsConnector}
        />
      </div>

      {/* ④ 검색박스 1 — 출발지 "부산대학교" (82, 49) 372×65 */}
      <div className="absolute" style={{ left: 82, top: 49, width: 372, height: 65 }}>
        <div
          className="absolute bg-[#fffbec] border-[#d9d9d9] border-[1.883px] border-solid flex items-center rounded-[37.669px]"
          style={{ inset: 0, paddingLeft: 37.669, paddingRight: 37.669 }}
        >
          <p
            className="text-[#3e2722] text-[20px] leading-[1.334] tracking-[-0.54px] whitespace-nowrap"
            style={{ fontFamily: "'Pretendard', sans-serif", fontWeight: 400 }}
          >
            부산대학교
          </p>
        </div>
        {/* 검색 아이콘 — (320.65, 19) within this group */}
        <div className="absolute" style={{ left: 320.65, top: 19, width: 25.5, height: 18.2 }}>
          <img alt="" className="block w-full h-full object-contain" src={iconSearch} />
        </div>
      </div>

      {/* ⑤ 검색박스 2 — 목적지 "어디로 가시나요?" (82, 119) 372×65 */}
      <div className="absolute" style={{ left: 82, top: 119, width: 372, height: 65 }}>
        <div
          className="absolute bg-[#fffbec] border-[#d9d9d9] border-[1.883px] border-solid flex items-center rounded-[37.669px]"
          style={{ inset: 0, paddingLeft: 37.669, paddingRight: 37.669 }}
        >
          <p
            className="text-[#afafaf] text-[20px] leading-[1.334] tracking-[-0.54px] whitespace-nowrap"
            style={{ fontFamily: "'Pretendard', sans-serif", fontWeight: 400 }}
          >
            어디로 가시나요?
          </p>
        </div>
        {/* 검색 아이콘 */}
        <div className="absolute" style={{ left: 320.65, top: 19, width: 22, height: 18.2 }}>
          <img alt="" className="block w-full h-full object-contain" src={iconSearch} />
        </div>
      </div>

      {/* ⑥ 구분선 — (34, 219) 423×1 */}
      <div
        className="absolute bg-[rgba(44,36,23,0.08)]"
        style={{ left: 34, top: 219, width: 423, height: 1 }}
      />

      {/* ⑦ "가는길에 잠시 들러 보세요" 텍스트 — (32, 244) */}
      <p
        className="absolute text-black text-[15px] leading-[1.334] tracking-[-0.405px] whitespace-nowrap"
        style={{
          left: 32,
          top: 244,
          fontFamily: "'MaruBuriOTF', sans-serif",
          fontWeight: 300,
        }}
      >
        가는길에 잠시 들러 보세요
      </p>

      {/* ⑧ 카테고리 탭 — (32, 279) 459.17×31.81 */}
      <div
        className="absolute flex items-center"
        style={{ left: 32, top: 279, gap: 7 }}
      >
        {TABS.map(({ label, icon, iconActive, active }) => (
          <div
            key={label}
            className="flex items-center justify-center cursor-pointer"
            style={{
              gap: 7.069,
              width: 70.695,
              height: 31.813,
              paddingLeft: 7.069,
              paddingRight: 7.069,
              borderRadius: active ? 75.338 : 35.347,
              background: active ? "#ed7a13" : "#fdfdfd",
            }}
          >
            <img
              alt=""
              src={active ? iconActive : icon}
              style={{ width: 13.255, height: active ? 12.372 : 13.255, flexShrink: 0 }}
            />
            <span
              className={`whitespace-nowrap ${active ? "text-white" : "text-[#3e2722]"}`}
              style={{
                fontSize: 12.372,
                lineHeight: 1.4,
                fontFamily: "'Pretendard', sans-serif",
                fontWeight: 500,
              }}
            >
              {label}
            </span>
          </div>
        ))}
      </div>

      {/* ⑨ 장소 카드 4개 — top: 376, 534, 692, 850 / left: 24, width: 440, height: 143 */}
      {cardPlaces.slice(0, 4).map((place, i) => {
        const topPositions = [376, 534, 692, 850];
        return (
          <div
            key={i}
            className="absolute"
            style={{ left: 24, top: topPositions[i], width: 440, height: 143, padding: 8 }}
          >
            <PlaceCard place={place} />
          </div>
        );
      })}

    </div>
  );
}
