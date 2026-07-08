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

export const CATEGORIES = [
  { label: "전체",  icon: iconWhiteAll, iconActive: iconAll      },
  { label: "한 잔", icon: iconSip,      iconActive: iconOrgSip   },
  { label: "한 입", icon: iconBite,     iconActive: iconOrgBite  },
  { label: "한 판", icon: iconFight,    iconActive: iconOrgFight },
  { label: "한 눈", icon: iconSee,      iconActive: iconOrgSee   },
  { label: "한 끼", icon: iconMeal,     iconActive: iconOrgMeal  },
];

export const CATEGORY_ICON_MAP = {
  "한잔": iconOrgSip,
  "한입": iconOrgBite,
  "한판": iconOrgFight,
  "한눈": iconOrgSee,
  "한끼": iconOrgMeal,
};
