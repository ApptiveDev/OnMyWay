import RouteFinderPanel from "./RouteFinderPanel";
import PlaceSearchPanel from "./PlaceSearchPanel";

export default function Sidebar20({
  mode,
  locStatus,
  sidebarOpen,
  userCoords,
  onDestinationSelect,
  onDestinationClear,
  onDrawRoute,
  onRouteRecs,
  recs,
  activeCategory,
  selectedPlace,
  onCategoryChange,
  onPlaceSelect,
  pinMode,
  pinCenter,
  pinNeighborhood,
  onEnterPinMode,
  onExitPinMode,
}) {
  return (
    <aside
      className="flex-none w-[412px] h-full bg-[#FFFBEC] border-r border-[rgba(62,39,34,0.06)] flex flex-col overflow-hidden transition-transform duration-300"
      style={{ transform: sidebarOpen ? "translateX(0)" : "translateX(-100%)" }}
    >
      {mode === "search" ? (
        <PlaceSearchPanel
          locStatus={locStatus}
          recs={recs}
          activeCategory={activeCategory}
          selectedPlace={selectedPlace}
          onCategoryChange={onCategoryChange}
          onPlaceSelect={onPlaceSelect}
        />
      ) : (
        <RouteFinderPanel
          locStatus={locStatus}
          userCoords={userCoords}
          onDestinationSelect={onDestinationSelect}
          onDestinationClear={onDestinationClear}
          onDrawRoute={onDrawRoute}
          onRouteRecs={onRouteRecs}
          pinMode={pinMode}
          pinCenter={pinCenter}
          pinNeighborhood={pinNeighborhood}
          onEnterPinMode={onEnterPinMode}
          onExitPinMode={onExitPinMode}
        />
      )}
    </aside>
  );
}
