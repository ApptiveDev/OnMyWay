import iconAll        from "@/assets/all.svg";
import iconWhiteAll   from "@/assets/whiteall.svg";
import iconSip        from "@/assets/sip.svg";
import iconOrgSip     from "@/assets/org_sip.svg";
import iconBite       from "@/assets/bite.svg";
import iconOrgBite    from "@/assets/org_bite.svg";
import iconFight      from "@/assets/fight.svg";
import iconOrgFight   from "@/assets/org_fight.svg";
import iconSee        from "@/assets/see.svg";
import iconOrgSee     from "@/assets/org_see.svg";
import iconMeal       from "@/assets/meal.svg";
import iconOrgMeal    from "@/assets/org_meal.svg";
import iconHeart      from "@/assets/icon-heart.svg";
import iconQuiet      from "@/assets/iconquiet.svg";
import iconRoasting   from "@/assets/iconroasting.svg";
import imgPlace       from "@/assets/img-place.jpg";

const CATEGORIES = [
  { label: "전체",  icon: iconWhiteAll, iconActive: iconAll      },
  { label: "한 잔", icon: iconSip,      iconActive: iconOrgSip   },
  { label: "한 입", icon: iconBite,     iconActive: iconOrgBite  },
  { label: "한 끼", icon: iconMeal,     iconActive: iconOrgMeal  },
  { label: "한 눈", icon: iconSee,      iconActive: iconOrgSee   },
  { label: "한 판", icon: iconFight,    iconActive: iconOrgFight },
];

const CATEGORY_ICON_MAP = {
  "한잔": iconOrgSip,
  "한입": iconOrgBite,
  "한숨": iconAll,
  "한판": iconOrgFight,
  "한눈": iconOrgSee,
  "한끼": iconOrgMeal,
};

const fmt = (t) => t?.slice(0, 5) ?? null;

function HoursLabel({ place }) {
  if (place.isOpen) {
    if (!place.closeTime) return <span className="font-['MaruBuriOTF'] text-[11px] font-normal text-[#6A8042]">영업 중</span>;
    return <span className="font-['MaruBuriOTF'] text-[11px] font-light text-[#6A8042]">영업 중 ({fmt(place.closeTime)}에 종료)</span>;
  }
  if (!place.openTime) return <span className="font-['MaruBuriOTF'] text-[11px] font-normal text-[#c82b2b]">영업 종료</span>;
  return <span className="font-['MaruBuriOTF'] text-[11px] font-light text-[#c82b2b]">영업 종료 ({fmt(place.openTime)}에 시작)</span>;
}

export default function PlaceSearchPanel({
  locStatus,
  recs,
  activeCategory,
  selectedPlace,
  onCategoryChange,
  onPlaceSelect,
}) {
  const granted = locStatus === "granted";

  return (
    <>
      {/* ── 카테고리 필터 ── */}
      <div className="shrink-0 px-[24px] pt-[18px] pb-[14px]">
        <p className="text-[14px] font-normal text-[#3e2722] leading-[133.4%] tracking-[-0.4px] opacity-70 mb-[10px]">
          이 근처에서 <span>찾아보세요</span>
        </p>
        <div className="flex items-center gap-[7px] overflow-x-auto">
          {CATEGORIES.map(({ label, icon, iconActive }) => {
            const isActive = activeCategory === label;
            return (
              <button key={label} onClick={() => onCategoryChange(label)} className="shrink-0 group">
                <img
                  src={isActive ? iconActive : icon}
                  alt={label}
                  className={`w-[70px] h-[31px] ${!isActive ? "group-hover:hidden" : ""}`}
                />
                {!isActive && (
                  <img src={iconActive} alt={label} className="w-[70px] h-[31px] hidden group-hover:block" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── 흰 카드: 추천 장소 목록 ── */}
      <div className="flex-1 min-h-0 mx-[18px] mb-[18px] bg-[#fdfdfd] rounded-[20px] shadow-[0_14px_30px_rgba(62,39,34,0.1)] flex flex-col overflow-hidden">
        <div className="flex-1 min-h-0 overflow-y-auto pt-[12px]">
          {!granted ? (
            <div className="flex items-center justify-center h-full px-[24px] text-center">
              <p className="text-[14px] font-light text-[#8b7e6a]">위치 권한을 허용하면 근처 장소를 추천해드려요</p>
            </div>
          ) : (
            <div className="flex flex-col p-[10px] gap-[15px] fade-in">
              {recs.map(place => (
                <div
                  key={place.id}
                  className="w-full"
                  onClick={() => onPlaceSelect(selectedPlace?.id === place.id ? null : place)}
                >
                  <div className={`bg-[#fdfdfd] border-[1.5px] flex items-start px-[16px] pt-[14px] pb-[16px] rounded-[20px] w-full cursor-pointer transition-all ${
                    selectedPlace?.id === place.id
                      ? "border-[rgba(200,135,58,0.5)] shadow-sm"
                      : "border-[rgba(175,175,175,0.5)] hover:shadow-sm"
                  }`}>

                    <div className="flex gap-[14px] items-start flex-1 min-w-0">
                      <div className="w-[64px] h-[64px] rounded-[13px] overflow-hidden shrink-0">
                        <img src={place.imageURL || imgPlace} alt={place.name} className="object-cover w-full h-full" />
                      </div>

                      <div className="flex flex-col items-start flex-1 min-w-0">
                        <div className="flex flex-col gap-[7px] items-start w-full">
                          <div className="flex items-center">
                            <p className="font-['Pretendard'] font-semibold text-[#3e2722] text-[14px] whitespace-nowrap shrink-0">{place.name}</p>
                            {CATEGORY_ICON_MAP[place.category] && (
                              <img
                                src={CATEGORY_ICON_MAP[place.category]}
                                alt={place.category}
                                className="w-[37px] h-[16px] shrink-0 ml-[12px]"
                              />
                            )}
                          </div>
                          <div className="flex items-center gap-[12px]">
                            <p className="font-['MaruBuriOTF'] font-light text-[#3e2722] text-[11px] whitespace-nowrap">도보 {place.walkMin}분</p>
                            <HoursLabel place={place} />
                          </div>
                          <p className="font-['MaruBuriOTF'] font-light text-[#3e2722] text-[12px] leading-[1.334] line-clamp-2 whitespace-pre-line">
                            {place.desc || "골목 안 작은 로스터리,\n신선한 원두가 기다립니다"}
                          </p>
                          <div className="flex items-center gap-[8px] mt-[3px]">
                            <img src={iconQuiet} alt="quiet" className="h-[16px] w-auto" />
                            <img src={iconRoasting} alt="roasting" className="h-[16px] w-auto" />
                          </div>
                        </div>
                      </div>
                    </div>

                    <button
                      className="shrink-0 w-[19px] h-[19px] flex items-center justify-center ml-2"
                      onClick={e => e.stopPropagation()}
                    >
                      <img src={iconHeart} alt="저장" className="w-[15.74px] h-[13.7px]" />
                    </button>

                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
