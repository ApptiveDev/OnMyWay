import { useEffect, useRef, useState } from "react";
import RouteInputSection from "./RouteInputSection";
import { ROUTE_MODES, toSearchResults } from "../../hooks/useRouteSearch";
import { useToast } from "../../context/ToastContext";
import api from "../../api/api";

import iconHeart      from "@/assets/icon-heart.svg";
import iconQuiet      from "@/assets/iconquiet.svg";
import iconRoasting   from "@/assets/iconroasting.svg";
import imgPlace       from "@/assets/img-place.jpg";
import iconRoute    from "@/assets/icon-route.svg";
import iconLeisure  from "@/assets/icon-leisure.svg";
import iconDiscover from "@/assets/icon-discover.svg";
import { CATEGORY_ICON_MAP } from "./categoryIcons";

const ROUTE_MODE_META = {
  findOut: { icon: iconRoute,    iconBg: "rgba(212,149,74,0.09)",   desc: "가장 빠르고 효율적인 경로",    time: "약 20분", dist: "1.5 km" },
  slow:    { icon: iconLeisure,  iconBg: "rgba(123,196,160,0.09)",  desc: "걷기 좋은 골목과 공원을 따라", time: "약 30분", dist: "1.8 km" },
  right:   { icon: iconDiscover, iconBg: "rgba(167,139,218,0.09)",  desc: "새로운 취향을 만나는 우연",    time: "약 35분", dist: "2.1 km" },
};

const fmt = (t) => t?.slice(0, 5) ?? null;

// 두 좌표 사이 직선거리 (m, haversine)
function distanceMeters(lat1, lng1, lat2, lng2) {
  const R = 6371000;
  const toRad = (d) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

const fmtDistShort = (m) => (m >= 1000 ? `${(m / 1000).toFixed(1)}km` : `${Math.round(m)}m`);

function HoursLabel({ place }) {
  if (place.isOpen) {
    if (!place.closeTime) return <span className="text-[11px] text-[#6A8042]" style={{ fontFamily: "Pretendard" }}>영업 중</span>;
    return <span className="text-[11px] text-[#6A8042]" style={{ fontFamily: "Pretendard-Light" }}>영업 중 ({fmt(place.closeTime)}에 종료)</span>;
  }
  if (!place.openTime) return <span className="text-[11px] text-[#c82b2b]" style={{ fontFamily: "Pretendard" }}>영업 종료</span>;
  return <span className="text-[11px] text-[#c82b2b]" style={{ fontFamily: "Pretendard-Light" }}>영업 종료 ({fmt(place.openTime)}에 시작)</span>;
}

function SearchResultRow({ result, onClick }) {
  return (
    <button onClick={onClick} className="w-full flex items-center gap-[12px] px-[10px] py-[11px] rounded-[14px] text-left hover:bg-[#FFFBEC] transition-colors">
      <div className="w-[38px] h-[38px] rounded-[11px] bg-[#F4EEE3] flex items-center justify-center shrink-0 text-[#ED7A13]">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11z" stroke="currentColor" strokeWidth="1.7" />
          <circle cx="12" cy="10" r="2.4" stroke="currentColor" strokeWidth="1.7" />
        </svg>
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[15px] text-[#3E2722] truncate" style={{ fontFamily: "Pretendard-SemiBold" }}>{result.place_name}</div>
        <div className="text-[12.5px] text-[#9a8e84] truncate mt-[2px]">{result.road_address_name || result.address_name}</div>
      </div>
    </button>
  );
}

function PlaceSearchBar({ onSelect, userCoords }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const debounceRef = useRef(null);

  useEffect(() => {
    if (!query.trim()) { setResults([]); return; }
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setSearching(true);
      try {
        const res = await api.get("/places/search", {
          params: { query, lat: userCoords?.lat, lon: userCoords?.lng },
        });
        setResults(toSearchResults(res.data));
      } catch (e) {
        setResults([]);
      } finally {
        setSearching(false);
      }
    }, 350);
    return () => clearTimeout(debounceRef.current);
  }, [query]);

  return (
    <div className="flex-none px-[10px] pt-[5px]">
      <div className="h-[50px] rounded-[14px] bg-white shadow-[0_2px_10px_rgba(62,39,34,0.08)] flex items-center gap-[9px] px-[15px]">
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
          <circle cx="11" cy="11" r="7" stroke="#9a8e84" strokeWidth="1.8" />
          <path d="m20 20-3.4-3.4" stroke="#9a8e84" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="어떤 곳을 찾고 있나요?"
          className="flex-1 min-w-0 outline-none bg-transparent text-[14.5px] text-[#3E2722] placeholder:text-[#b3a892] placeholder:font-normal"
          style={{ fontFamily: "Pretendard-SemiBold" }}
        />
        {query && (
          <button type="button" onClick={() => setQuery("")} className="shrink-0">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M6 6l12 12M18 6L6 18" stroke="#8a7d5f" strokeWidth="2.4" strokeLinecap="round" /></svg>
          </button>
        )}
      </div>
      {query.trim() && (
        <div className="mt-[6px] max-h-[280px] overflow-y-auto bg-white rounded-[14px] shadow-[0_4px_14px_rgba(62,39,34,0.1)]">
          {searching && <div className="text-center text-[13.5px] text-[#8a7d5f] py-[16px]">검색 중...</div>}
          {!searching && results.length === 0 && <div className="text-center text-[13.5px] text-[#9a8e84] py-[16px]">검색 결과가 없어요</div>}
          {!searching && results.map(r => (
            <SearchResultRow key={r.id ?? r.place_name} result={r} onClick={() => onSelect(r)} />
          ))}
        </div>
      )}
    </div>
  );
}

function PlaceRow({ place, onClick, onSave, destPicker }) {
  return (
    <div onClick={onClick} className="flex items-center gap-[12px] p-[11px_10px] rounded-[16px] cursor-pointer hover:bg-[#FFFBEC] transition-colors">
      <div className="w-[48px] h-[48px] rounded-[13px] overflow-hidden shrink-0 bg-[#F4EEE3]">
        <img src={place.imageURL || imgPlace} alt={place.name} className="object-cover w-full h-full" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-[6px]">
          <span className="text-[14.5px] text-[#3E2722] truncate" style={{ fontFamily: "Pretendard-Bold" }}>{place.name}</span>
          {CATEGORY_ICON_MAP[place.category] && <img src={CATEGORY_ICON_MAP[place.category]} alt={place.category} className="h-[13px] shrink-0" />}
        </div>
        <div className="text-[12px] text-[#9a8e84] mt-[2px] flex items-center gap-[6px]">
          {place.walkMin != null && <span>도보 {place.walkMin}분</span>}
          {place.isOpen != null && <HoursLabel place={place} />}
        </div>
      </div>
      {destPicker ? (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="shrink-0">
          <path d="M9 6l6 6-6 6" stroke="#c9bcae" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ) : (
        <button onClick={(e) => { e.stopPropagation(); onSave?.(); }} className="shrink-0 w-[20px] h-[20px] flex items-center justify-center">
          <img src={iconHeart} alt="저장" className="w-[15px] h-[13px]" />
        </button>
      )}
    </div>
  );
}

// 장소검색 전용 카드 (큰 썸네일 + 카테고리 배지 + 저장 아이콘 오버레이)
function SearchPlaceCard({ place, onClick, onSave, distM }) {
  const [hashtags, setHashtags] = useState([]);

  useEffect(() => {
    if (place.id == null) return;
    let cancelled = false;
    api.get(`/api/place/${place.id}`)
      .then(res => { if (!cancelled) setHashtags(res.data?.hashtags ?? []); })
      .catch(() => { if (!cancelled) setHashtags([]); });
    return () => { cancelled = true; };
  }, [place.id]);

  return (
    <div onClick={onClick} className="flex items-start gap-[14px] p-[13px] rounded-[16px] cursor-pointer hover:bg-[#FFFBEC] transition-colors">
      <div className="relative w-[84px] h-[84px] rounded-[14px] overflow-hidden shrink-0 bg-[#F4EEE3]">
        <img src={place.imageURL || imgPlace} alt={place.name} className="object-cover w-full h-full" />
        <button
          onClick={(e) => { e.stopPropagation(); onSave?.(); }}
          className="absolute left-[8px] top-[8px] w-[24px] h-[24px] rounded-full bg-white/85 flex items-center justify-center"
        >
          <img src={iconHeart} alt="저장" className="w-[13px] h-[11px]" />
        </button>
      </div>
      <div className="flex-1 min-w-0 pt-[2px]">
        <div className="flex items-center gap-[7px] mb-[4px]">
          <span className="text-[15px] text-[#3E2722] truncate" style={{ fontFamily: "Pretendard-Bold" }}>{place.name}</span>
          {place.category && (
            <span className="shrink-0 text-[11px] text-white bg-[#ED7A13] rounded-[10px] px-[8px] py-[2px]" style={{ fontFamily: "Pretendard-Bold" }}>
              {place.category}
            </span>
          )}
        </div>
        <div className="text-[12.5px] text-[#6a5d52] flex flex-wrap items-center gap-x-[6px] gap-y-[2px]" style={{ fontFamily: "Pretendard-Light" }}>
          {place.walkMin != null && <span className="whitespace-nowrap">도보 {place.walkMin}분</span>}
          {distM != null && <span className="whitespace-nowrap">· {fmtDistShort(distM)}</span>}
          <span className="whitespace-nowrap">{place.isOpen != null && <HoursLabel place={place} />}</span>
        </div>
        {place.desc && (
          <div className="text-[12.5px] text-[#5a4d42] truncate mt-[3px]" style={{ fontFamily: "Pretendard-Light" }}>{place.desc}</div>
        )}
        {hashtags.length > 0 && (
          <div className="flex flex-wrap gap-[5px] mt-[5px]">
            {hashtags.map(tag => (
              <span key={tag} className="text-[11px] text-[#5a4d42] bg-[#FFF2B9] rounded-[10px] px-[8px] py-[2px]" style={{ fontFamily: "Pretendard-Light" }}>#{tag}</span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function EmptyFlowScreen({ title, desc, icon }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-[13px] text-center px-[30px]">
      <div className="w-[74px] h-[74px] rounded-full bg-[#FFF3D6] flex items-center justify-center">
        {icon === "heart" ? (
          <svg width="34" height="34" viewBox="0 0 24 24" fill="none"><path d="M7 4.5h10v15l-5-4-5 4z" stroke="#D9A86E" strokeWidth="1.7" strokeLinejoin="round" /></svg>
        ) : (
          <svg width="34" height="34" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="8.5" stroke="#D9A86E" strokeWidth="1.7" /><path d="M12 7.5V12l3 2" stroke="#D9A86E" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>
        )}
      </div>
      <div className="font-bold text-[17px] text-[#3E2722]" style={{ fontFamily: "MaruBuriOTF" }}>{title}</div>
      {desc && <div className="text-[13.5px] text-[#9a8e84] leading-[1.5] whitespace-pre-line" style={{ fontFamily: "Pretendard" }}>{desc}</div>}
    </div>
  );
}

function EditSuggestion({ place, onBack, onSubmit }) {
  const [intro, setIntro] = useState(place.desc || "");

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <div className="flex-none flex items-center gap-[11px] p-[16px_18px_10px] shadow-[0_1px_0_rgba(62,39,34,0.06)]">
        <button onClick={onBack} className="w-[34px] h-[34px] rounded-[10px] bg-[#F4EEE3] flex items-center justify-center active:scale-[0.93]">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M15 6l-6 6 6 6" stroke="#3E2722" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
        <div>
          <div className="text-[16px] text-[#3E2722]" style={{ fontFamily: "Pretendard-Bold" }}>정보 수정 제안</div>
          <div className="text-[12.5px] text-[#9a8e84] mt-[1px]">{place.name}</div>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-[18px]">
        <div className="text-[13px] text-[#8a7d5f] mb-[8px]" style={{ fontFamily: "Pretendard" }}>한줄 소개</div>
        <textarea
          value={intro}
          onChange={e => setIntro(e.target.value)}
          placeholder="이 장소를 한 줄로 소개해 주세요"
          className="w-full min-h-[84px] resize-none border-[1.5px] border-[#EADFC8] rounded-[13px] p-[13px_14px] text-[15px] text-[#3E2722] leading-[1.6] outline-none bg-[#FFFDF8] focus:border-[#ED7A13]"
          style={{ fontFamily: "Pretendard" }}
        />
        <button onClick={() => onSubmit(intro)} className="w-full mt-[22px] h-[52px] rounded-[15px] bg-[#ED7A13] text-white flex items-center justify-center gap-[8px] text-[15.5px] shadow-[0_6px_16px_rgba(237,122,19,0.3)]" style={{ fontFamily: "Pretendard-SemiBold" }}>
          수정 제안하기
        </button>
        <div className="text-[12px] text-[#b3a892] text-center mt-[11px] leading-[1.5]" style={{ fontFamily: "Pretendard" }}>
          제안은 검토 후 반영돼요.<br />다른 분들의 길을 더 풍성하게 만들어요.
        </div>
      </div>
    </div>
  );
}

export default function Sidebar20({
  flow, step, setStep, placeFrom,
  locStatus, recs,
  selectedPlace, onPlaceSelect,
  userCoords,
  pinLabel, onConfirmPin,
  destText, setDestText, destFocused,
  deptText, setDeptText, deptFocused,
  searchResults, deptSearchResults,
  selectedResult, customDeptCoords,
  isSearching, selectedMode,
  destInputRef, deptInputRef,
  isSearchMode, showResults, showDeptResults, routeStats,
  handleDestFocus, handleDeptFocus, handleCancel,
  handleDestSubmit, handleDeptSubmit,
  handleDeptResultClick, handleDeptClear,
  handleResultClick, handleModeChange, handleExplore,
}) {
  const showToast = useToast();
  const notReady = () => showToast("준비 중인 기능이에요");

  // 장소 상세/수정제안 화면(step === "place" | "edit")용 해시태그·블로그 — selectedPlace가 바뀔 때마다 새로 조회
  const [placeHashtags, setPlaceHashtags] = useState([]);
  const [placeBlogs, setPlaceBlogs] = useState([]);
  useEffect(() => {
    if ((step !== "place" && step !== "edit") || selectedPlace?.id == null) { setPlaceHashtags([]); setPlaceBlogs([]); return; }
    let cancelled = false;
    api.get(`/api/place/${selectedPlace.id}`)
      .then(res => {
        if (cancelled) return;
        setPlaceHashtags(res.data?.hashtags ?? []);
        setPlaceBlogs(res.data?.blogDTOS ?? []);
      })
      .catch(() => { if (!cancelled) { setPlaceHashtags([]); setPlaceBlogs([]); } });
    return () => { cancelled = true; };
  }, [step, selectedPlace?.id]);

  // 장소 상세 화면 주소 — 백엔드 API에 address가 없어서, 카카오맵 SDK로 좌표를 직접 역지오코딩한다
  const [placeAddress, setPlaceAddress] = useState("");
  useEffect(() => {
    if (step !== "place" || selectedPlace?.lat == null || selectedPlace?.lng == null) { setPlaceAddress(""); return; }
    if (!window.kakao?.maps?.services) return;
    const geocoder = new window.kakao.maps.services.Geocoder();
    geocoder.coord2Address(selectedPlace.lng, selectedPlace.lat, (result, status) => {
      if (status === window.kakao.maps.services.Status.OK && result[0]) {
        const addr = result[0].road_address?.address_name || result[0].address?.address_name;
        setPlaceAddress(addr || "");
      } else {
        setPlaceAddress("");
      }
    });
  }, [step, selectedPlace?.lat, selectedPlace?.lng]);

  const fmtDist = (m) => m >= 1000 ? `${(m / 1000).toFixed(1)} km` : `${m} m`;
  const fmtTime = (s) => `약 ${Math.round(s / 60)}분`;

  const granted = locStatus === "granted" || locStatus === "denied";
  const deptLabel = deptText || (locStatus === "granted" ? "현재 위치" : "부산대학교 정문");

  const goRoutes = (result) => { handleResultClick(result); setStep("routes"); };
  const goInputFresh = () => { handleCancel(); setStep("input"); };
  const goExplore = () => { handleExplore(); setStep("nearby"); };
  const backFromPlace = () => setStep(placeFrom || "nearby");

  // input 단계 추천 목록에서 목적지 바로 선택 (검색 결과와 동일한 형태로 변환해 재사용)
  const chooseDestFromRec = (place) => {
    if (place.lat == null || place.lng == null) { notReady(); return; }
    goRoutes({ place_name: place.name, x: String(place.lng), y: String(place.lat) });
  };

  // ── place 단계 (flow 무관, 최우선) ──
  if (step === "place" && selectedPlace) {
    const p = selectedPlace;
    return (
      <div className="flex flex-col flex-1 min-h-0">
        <div className="flex-none relative h-[152px] overflow-hidden">
          <img src={p.imageURL || imgPlace} alt={p.name} className="absolute inset-0 object-cover w-full h-full" />
          <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(62,39,34,0) 35%, rgba(62,39,34,.55))" }} />
          <button onClick={backFromPlace} className="absolute left-[14px] top-[14px] w-[34px] h-[34px] rounded-full bg-white/90 flex items-center justify-center shadow-[0_2px_8px_rgba(62,39,34,0.2)] active:scale-[0.92]">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M15 6l-6 6 6 6" stroke="#3E2722" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
          <div className="absolute left-[18px] bottom-[13px] text-white">
            <div className="font-bold text-[21px]" style={{ fontFamily: "MaruBuriOTF" }}>{p.name}</div>
            <div className="text-[13px] opacity-90 mt-[3px]" style={{ fontFamily: "Pretendard-Medium" }}>{p.category}{p.walkMin != null ? ` · 도보 ${p.walkMin}분` : ""}</div>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-[18px]">
          <div className="text-[12.5px] text-[#9a8e84] mb-[7px]" style={{ fontFamily: "Pretendard" }}>한줄 소개</div>
          <div className="text-[16px] text-[#3E2722] leading-[1.6]" style={{ fontFamily: "Pretendard" }}>{p.desc || "아직 소개가 등록되지 않았어요."}</div>
          {p.isOpen != null && <div className="mt-[10px]"><HoursLabel place={p} /></div>}
          {placeHashtags.length > 0 && (
            <div className="flex flex-wrap gap-[7px] mt-[14px]">
              {placeHashtags.map(tag => (
                <span key={tag} className="text-[12.5px] text-[#b07a2e] bg-[#FFF3D6] rounded-[20px] px-[12px] py-[5px]" style={{ fontFamily: "Pretendard-SemiBold" }}>#{tag}</span>
              ))}
            </div>
          )}
          {placeBlogs.length > 0 && (
            <div className="mt-[16px] pt-[14px] border-t border-[rgba(62,39,34,0.08)]">
              <div className="text-[12.5px] text-[#9a8e84] mb-[8px]" style={{ fontFamily: "Pretendard" }}>관련 블로그</div>
              <div className="flex flex-col gap-[8px]">
                {placeBlogs.map((blog, i) => (
                  <a
                    key={i}
                    href={blog.description}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[13px] text-[#3E2722] underline decoration-[#e0d4bc] underline-offset-2 truncate"
                    style={{ fontFamily: "Pretendard-Light" }}
                  >
                    {blog.title?.replace(/<\/?b>/g, "")}
                  </a>
                ))}
              </div>
            </div>
          )}
          {(placeAddress || (p.openTime && p.closeTime)) && (
            <div className="mt-[16px] pt-[14px] border-t border-[rgba(62,39,34,0.08)] flex flex-col gap-[10px]">
              {placeAddress && (
                <div className="flex items-start gap-[8px]">
                  <span className="text-[12.5px] text-[#9a8e84] shrink-0" style={{ fontFamily: "Pretendard" }}>위치</span>
                  <span className="text-[13.5px] text-[#3E2722]" style={{ fontFamily: "Pretendard-Light" }}>{placeAddress}</span>
                </div>
              )}
              {p.openTime && p.closeTime && (
                <div className="flex items-start gap-[8px]">
                  <span className="text-[12.5px] text-[#9a8e84] shrink-0" style={{ fontFamily: "Pretendard" }}>영업시간</span>
                  <span className="text-[13.5px] text-[#3E2722]" style={{ fontFamily: "Pretendard-Light" }}>매일 {fmt(p.openTime)} - {fmt(p.closeTime)}</span>
                </div>
              )}
            </div>
          )}
          <div className="flex gap-[9px] mt-[20px]">
            <button onClick={notReady} className="flex-1 h-[46px] rounded-[13px] bg-[#FFF3D6] text-[#ED7A13] flex items-center justify-center gap-[7px] text-[14px]" style={{ fontFamily: "Pretendard-SemiBold" }}>
              <img src={iconHeart} alt="" className="w-[15px] h-[13px]" />저장
            </button>
            <button onClick={notReady} className="flex-1 h-[46px] rounded-[13px] bg-[#ED7A13] text-white flex items-center justify-center gap-[7px] text-[14px] shadow-[0_4px_12px_rgba(237,122,19,0.28)]" style={{ fontFamily: "Pretendard-SemiBold" }}>
              경로에 추가
            </button>
          </div>
          <button onClick={() => setStep("edit")} className="w-full mt-[10px] h-[44px] rounded-[13px] border-[1.5px] border-[#F2D49A] bg-[#FFFDF2] text-[#b07a2e] flex items-center justify-center gap-[7px] text-[13.5px]" style={{ fontFamily: "Pretendard-SemiBold" }}>
            정보 수정 제안
          </button>
        </div>
      </div>
    );
  }

  // ── edit 단계 ──
  if (step === "edit" && selectedPlace) {
    return (
      <EditSuggestion
        place={selectedPlace}
        onBack={() => setStep("place")}
        onSubmit={(intro) => {
          api.post(`/api/update/${selectedPlace.id}`, { id: selectedPlace.id, catchPhrase: intro })
            .then(() => showToast("수정 제안을 보냈어요"))
            .catch(() => showToast("제안 전송에 실패했어요"));
          setStep("place");
        }}
      />
    );
  }

  // ── 저장 / 최근 흐름 (스텁) ──
  if (flow === "saved") {
    return <EmptyFlowScreen title="아직 저장한 장소가 없어요" desc={"마음에 드는 곳을 저장해 두면\n여기에 모여요"} icon="heart" />;
  }
  if (flow === "recent") {
    return <EmptyFlowScreen title="최근 본 곳이 없어요" desc="" icon="clock" />;
  }

  // ── 장소검색 흐름 ──
  if (flow === "search") {
    const handleSearchPlaceSelect = (result) => {
      onPlaceSelect({
        id: result.id ?? result.place_name,
        name: result.place_name,
        category: result.category ?? "",
        walkMin: null,
        lat: result.y != null ? parseFloat(result.y) : null,
        lng: result.x != null ? parseFloat(result.x) : null,
        isOpen: null,
        imageURL: null,
        desc: result.road_address_name || result.address_name || "",
        tags: [],
      }, "nearby");
    };
    // 거리순 정렬 (현재 위치 기준)
    const sortedRecs = userCoords
      ? [...recs].sort((a, b) => {
          const da = (a.lat != null && a.lng != null) ? distanceMeters(userCoords.lat, userCoords.lng, a.lat, a.lng) : Infinity;
          const db = (b.lat != null && b.lng != null) ? distanceMeters(userCoords.lat, userCoords.lng, b.lat, b.lng) : Infinity;
          return da - db;
        })
      : recs;

    return (
      <div className="flex-1 flex flex-col min-h-0 p-[18px_18px_0]">
        <div className="flex-none bg-[#FFEDA1] rounded-[20px] p-[18px]">
          <PlaceSearchBar onSelect={handleSearchPlaceSelect} userCoords={userCoords} />
          <div className="mt-[10px] inline-flex items-center gap-[6px] bg-[#3E2722] rounded-[16px] px-[13px] py-[6px]">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11z" stroke="#FFEDA1" strokeWidth="2" /><circle cx="12" cy="10" r="2.4" stroke="#FFEDA1" strokeWidth="2" /></svg>
            <span className="text-[13px] text-[#FFEDA1]" style={{ fontFamily: "Pretendard-Bold" }}>내 주변 250m</span>
          </div>
        </div>
        <div className="flex-1 flex flex-col min-h-0 bg-[#FDFDFD] rounded-[20px] shadow-[0_14px_30px_rgba(62,39,34,0.1)] mt-[13px] overflow-hidden">
          <div className="flex-none flex items-center justify-between p-[16px_16px_10px]">
            <span className="text-[14.5px] text-[#3E2722]" style={{ fontFamily: "Pretendard-Bold" }}>내 주변 {recs.length}곳의 가는길</span>
            <span className="text-[12.5px] text-[#9a8e84]" style={{ fontFamily: "Pretendard" }}>거리순</span>
          </div>
          <div className="flex-1 overflow-y-auto px-[6px] pb-[10px]">
            {!granted && <div className="text-center text-[13.5px] text-[#9a8e84] pt-[40px]">위치 확인 중…</div>}
            {granted && recs.length === 0 && <div className="text-center text-[13.5px] text-[#9a8e84] pt-[40px]">주변 장소를 찾지 못했어요</div>}
            {granted && sortedRecs.map(place => (
              <SearchPlaceCard
                key={place.id}
                place={place}
                distM={userCoords && place.lat != null && place.lng != null ? distanceMeters(userCoords.lat, userCoords.lng, place.lat, place.lng) : null}
                onClick={() => onPlaceSelect(place, "nearby")}
                onSave={notReady}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ── 길찾기 흐름: pin ──
  if (step === "pin") {
    return (
      <div className="flex-1 flex flex-col min-h-0 p-[18px]">
        <div className="flex-none bg-[#FFEDA1] rounded-[20px] p-[18px]">
          <div className="flex gap-[11px]">
            <div className="flex flex-col items-center pt-[15px]">
              <div className="w-[12px] h-[12px] rounded-full border-[3px] border-[#ED7A13]" />
              <div className="w-[2px] h-[26px]" style={{ background: "repeating-linear-gradient(#c9a86a 0 3px, transparent 3px 6px)" }} />
              <div className="w-[13px] h-[13px] rounded-[50%_50%_50%_2px] rotate-[-45deg] bg-[#3E2722]" />
            </div>
            <div className="flex-1 flex flex-col gap-[9px] min-w-0">
              <div className="h-[46px] rounded-[13px] bg-[#FFFDF2] flex items-center gap-[9px] px-[14px] shadow-[inset_0_0_0_1px_rgba(62,39,34,0.06)]">
                <div className="w-[13px] h-[13px] rounded-full bg-[#6A8042] shrink-0" />
                <span className="text-[14.5px] text-[#3E2722] truncate" style={{ fontFamily: "Pretendard-SemiBold" }}>{deptLabel}</span>
              </div>
              <div className="h-[46px] rounded-[13px] bg-[#FFF7E0] border-2 border-[#ED7A13] flex items-center gap-[9px] px-[14px]">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="shrink-0"><path d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11z" stroke="#ED7A13" strokeWidth="1.8" /></svg>
                <span className="flex-1 text-[14px] text-[#b8843f] truncate" style={{ fontFamily: "Pretendard" }}>{pinLabel || "지도에서 위치 지정 중…"}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex-1 flex flex-col bg-[#FDFDFD] rounded-[20px] shadow-[0_14px_30px_rgba(62,39,34,0.1)] mt-[13px] p-[20px]">
          <div className="flex items-center gap-[11px] mb-[14px]">
            <div className="w-[36px] h-[36px] rounded-[11px] bg-[#FFF3D6] flex items-center justify-center shrink-0">
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none"><path d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11z" stroke="#ED7A13" strokeWidth="1.8" /><circle cx="12" cy="10" r="2.4" stroke="#ED7A13" strokeWidth="1.8" /></svg>
            </div>
            <div>
              <div className="text-[15px] text-[#3E2722]" style={{ fontFamily: "Pretendard-Bold" }}>핀을 옮겨 도착지 지정</div>
              <div className="text-[12.5px] text-[#9a8e84] mt-[2px]" style={{ fontFamily: "Pretendard" }}>지도를 움직이면 가운데 핀이 도착지가 돼요</div>
            </div>
          </div>
          <button onClick={() => setStep("input")} className="mt-auto self-start text-[12.5px] text-[#b07a52]" style={{ fontFamily: "Pretendard-SemiBold" }}>‹ 취소</button>
          <button
            onClick={onConfirmPin}
            disabled={!pinLabel}
            className="h-[52px] rounded-[15px] flex items-center justify-center text-[16px] text-white mt-[12px]"
            style={{ background: pinLabel ? "#ED7A13" : "#e6c98a", boxShadow: pinLabel ? "0 6px 16px rgba(237,122,19,0.3)" : "none", fontFamily: "Pretendard-SemiBold" }}
          >
            이 위치로 도착지 설정
          </button>
        </div>
      </div>
    );
  }

  // ── 길찾기 흐름: routes ──
  if (step === "routes" && selectedResult) {
    return (
      <div className="flex-1 flex flex-col min-h-0 p-[18px_18px_0]">
        <div className="flex-none bg-[#FFEDA1] rounded-[20px] p-[16px_18px]">
          <div className="flex items-center gap-[11px]">
            <div className="flex flex-col items-center gap-[3px]">
              <div className="w-[11px] h-[11px] rounded-full border-[3px] border-[#ED7A13]" />
              <div className="w-[2px] h-[18px]" style={{ background: "repeating-linear-gradient(#c9a86a 0 3px, transparent 3px 6px)" }} />
              <div className="w-[12px] h-[12px] rounded-[50%_50%_50%_2px] rotate-[-45deg] bg-[#3E2722]" />
            </div>
            <div className="flex-1 min-w-0 flex flex-col gap-[7px]">
              <div className="text-[14.5px] text-[#6a5d52] truncate" style={{ fontFamily: "Pretendard" }}>{deptLabel}</div>
              <div className="text-[15.5px] text-[#3E2722] truncate" style={{ fontFamily: "Pretendard-SemiBold" }}>{destText}</div>
            </div>
            <button onClick={goInputFresh} className="shrink-0 text-[12.5px] text-[#b07a52]" style={{ fontFamily: "Pretendard-SemiBold" }}>변경</button>
          </div>
        </div>
        <div className="flex-1 flex flex-col min-h-0 bg-[#FDFDFD] rounded-[20px] shadow-[0_14px_30px_rgba(62,39,34,0.1)] mt-[13px] overflow-hidden p-[16px]">
          <div className="flex-none text-[14px] text-[#8a7d5f] pb-[12px]" style={{ fontFamily: "Pretendard" }}>어떤 길로 걸어볼까요?</div>
          <div className="flex-1 overflow-y-auto">
            {ROUTE_MODES.map((mode) => {
              const isActive = selectedMode === mode.id;
              const meta = ROUTE_MODE_META[mode.id];
              const stats = routeStats[mode.id];
              return (
                <button
                  key={mode.id}
                  onClick={() => handleModeChange(mode.id)}
                  className={`relative flex items-center gap-[13px] p-[14px_15px] rounded-[17px] mb-[10px] text-left w-full transition-shadow ${
                    isActive ? "bg-[#FFFBEC] shadow-[inset_0_0_0_2px_#ED7A13]" : "bg-white shadow-[inset_0_0_0_1.5px_rgba(62,39,34,0.1)] hover:shadow-md"
                  }`}
                >
                  <div className="w-[44px] h-[44px] rounded-[13px] flex items-center justify-center shrink-0" style={{ background: meta.iconBg }}>
                    <img src={meta.icon} alt="" className="w-[24px] h-[24px]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-[16.5px] text-[#3E2722] block" style={{ fontFamily: "Pretendard-Bold" }}>{mode.label}</span>
                    <div className="text-[12.5px] text-[#6a5d52] mt-[3px]" style={{ fontFamily: "Pretendard" }}>{meta.desc}</div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-[16px] text-[#3E2722]" style={{ fontFamily: "Pretendard-Bold" }}>{stats ? fmtTime(stats.time) : meta.time}</div>
                    <div className="text-[12px] text-[#9a8e84] mt-[2px]">{stats ? fmtDist(stats.distance) : meta.dist}</div>
                  </div>
                </button>
              );
            })}
          </div>
          <button onClick={goExplore} className="flex-none h-[52px] rounded-[15px] bg-[#ED7A13] text-white flex items-center justify-center text-[16px] shadow-[0_6px_16px_rgba(237,122,19,0.3)] mt-[12px]" style={{ fontFamily: "Pretendard-SemiBold" }}>
            탐색하기
          </button>
        </div>
      </div>
    );
  }

  // ── 길찾기 흐름: nearby (탐색 후) ──
  if (step === "nearby" && selectedResult) {
    return (
      <div className="flex-1 flex flex-col min-h-0 p-[18px_18px_0]">
        <div className="flex-none bg-[#FFEDA1] rounded-[20px] p-[16px_18px]">
          <div className="flex items-center gap-[11px]">
            <div className="flex-1 min-w-0 flex flex-col gap-[6px]">
              <div className="text-[14px] text-[#6a5d52] truncate" style={{ fontFamily: "Pretendard" }}>{deptLabel}</div>
              <div className="text-[15px] text-[#3E2722] truncate" style={{ fontFamily: "Pretendard-SemiBold" }}>{destText}</div>
            </div>
            <button onClick={() => setStep("routes")} className="shrink-0 text-[12.5px] text-[#b07a52]" style={{ fontFamily: "Pretendard-SemiBold" }}>경로 다시 선택 ›</button>
          </div>
        </div>
        <div className="flex-1 flex flex-col min-h-0 bg-[#FDFDFD] rounded-[20px] shadow-[0_14px_30px_rgba(62,39,34,0.1)] mt-[13px] overflow-hidden">
          <div className="flex-none flex items-center gap-[9px] p-[14px_16px_10px]">
            <div className="w-[8px] h-[8px] rounded-full bg-[#ED7A13]" />
            <span className="text-[14.5px] text-[#3E2722]" style={{ fontFamily: "Pretendard-Bold" }}>가는길에 들를 곳</span>
          </div>
          <div className="flex-1 overflow-y-auto px-[8px] pb-[8px]">
            {recs.length === 0 && <div className="text-center text-[13.5px] text-[#9a8e84] pt-[30px]">추천 장소를 준비하고 있어요</div>}
            {recs.map(place => (
              <PlaceRow key={place.id} place={place} onClick={() => onPlaceSelect(place, "nearby")} onSave={notReady} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ── 길찾기 흐름: input (기본) ──
  return (
    <div className="flex-1 flex flex-col min-h-0 p-[18px_18px_0]">
      <div className="flex-none bg-[#FFEDA1] rounded-[20px] p-[18px]">
        <RouteInputSection
          locStatus={locStatus}
          destText={destText} setDestText={setDestText} destFocused={destFocused}
          deptText={deptText} setDeptText={setDeptText} deptFocused={deptFocused}
          customDeptCoords={customDeptCoords}
          destInputRef={destInputRef} deptInputRef={deptInputRef}
          handleDestFocus={handleDestFocus} handleDeptFocus={handleDeptFocus} handleCancel={handleCancel}
          handleDestSubmit={handleDestSubmit} handleDeptSubmit={handleDeptSubmit}
          handleDeptClear={handleDeptClear}
        />
      </div>
      <div className="flex-1 flex flex-col min-h-0 bg-[#FDFDFD] rounded-[20px] shadow-[0_14px_30px_rgba(62,39,34,0.1)] mt-[13px] overflow-hidden pt-[16px]">
        {isSearchMode ? (
          <div className="flex-1 overflow-y-auto px-[8px]">
            {isSearching && <div className="text-center text-[14px] text-[#8a7d5f] py-[20px]">검색 중...</div>}
            {!isSearching && destFocused && showResults && searchResults.map(r => (
              <SearchResultRow key={r.id} result={r} onClick={() => handleResultClick(r)} />
            ))}
            {!isSearching && deptFocused && showDeptResults && deptSearchResults.map(r => (
              <SearchResultRow key={r.id} result={r} onClick={() => handleDeptResultClick(r)} />
            ))}
            {!isSearching && ((destFocused && !showResults && destText) || (deptFocused && !showDeptResults && deptText)) && (
              <div className="text-center text-[13.5px] text-[#9a8e84] py-[30px]" style={{ fontFamily: "Pretendard" }}>검색 결과가 없어요</div>
            )}
          </div>
        ) : (
          <>
            <button
              onClick={() => setStep("pin")}
              className="flex-none flex items-center gap-[12px] mx-[12px] mb-[12px] p-[9px_13px_9px_9px] rounded-[15px] bg-[#FFF7E0] border-[1.5px] border-[#F2D49A] cursor-pointer hover:shadow-[0_4px_12px_rgba(237,122,19,0.16)] transition-shadow"
            >
              <div className="w-[46px] h-[46px] rounded-[12px] bg-[#FFEDA1] flex items-center justify-center shrink-0">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11z" stroke="#ED7A13" strokeWidth="1.8" /></svg>
              </div>
              <div className="flex-1 text-[15px] text-[#3E2722] text-left" style={{ fontFamily: "Pretendard-SemiBold" }}>지도에서 위치 지정</div>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M9 6l6 6-6 6" stroke="#ED7A13" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </button>
            <div className="flex-none px-[12px] pb-[8px] text-[13.5px] text-[#8a7d5f]" style={{ fontFamily: "Pretendard" }}>가는길에 잠시 들러 보세요</div>
            <div className="flex-1 overflow-y-auto px-[4px]">
              {!granted && <div className="text-center text-[13.5px] text-[#9a8e84] pt-[30px]">위치 확인 중…</div>}
              {granted && recs.map(place => (
                <PlaceRow key={place.id} place={place} onClick={() => chooseDestFromRec(place)} onSave={notReady} destPicker />
              ))}
            </div>
          </>
        )}
        <button
          onClick={() => selectedResult && setStep("routes")}
          disabled={!selectedResult}
          className="flex-none h-[52px] rounded-[15px] flex items-center justify-center text-[16px] text-white mx-[12px] mt-[10px] mb-[14px]"
          style={{ background: selectedResult ? "#ED7A13" : "#E6C98A", boxShadow: selectedResult ? "0 6px 16px rgba(237,122,19,0.3)" : "none", fontFamily: "Pretendard-SemiBold" }}
        >
          길찾기
        </button>
      </div>
    </div>
  );
}
