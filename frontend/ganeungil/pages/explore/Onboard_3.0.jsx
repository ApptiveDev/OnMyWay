import { useEffect, useState } from "react";
import { getCurrentPosition, fetchRecommendations } from "../../api/recommend";
import imgBg      from "@/assets/explore/bg.svg";
import imgTree1   from "@/assets/explore/tree1.svg";
import imgTree2   from "@/assets/explore/tree2.svg";
import imgTree3   from "@/assets/explore/tree3.svg";
import imgTree4   from "@/assets/explore/tree4.svg";
import imgTree5   from "@/assets/explore/tree5.svg";
import imgHill1   from "@/assets/explore/hill1.svg";
import imgHill2   from "@/assets/explore/hill2.svg";
import imgPath1   from "@/assets/explore/path1.svg";
import imgPath2   from "@/assets/explore/path2.svg";
import imgPath3   from "@/assets/explore/path3.svg";
import imgGroup1  from "@/assets/explore/group1.svg";
import imgGroup2  from "@/assets/explore/group2.svg";
import imgGroup3  from "@/assets/explore/group3.svg";
import imgGroup4  from "@/assets/explore/group4.svg";
import imgGroup5  from "@/assets/explore/group5.svg";
import imgGroup6  from "@/assets/explore/group6.svg";
import imgDot1    from "@/assets/explore/dot1.svg";
import imgDot2    from "@/assets/explore/dot2.svg";
import imgDot3    from "@/assets/explore/dot3.svg";
import imgDot4    from "@/assets/explore/dot4.svg";

export default function Onboard30() {
  return (
    <div
      className="bg-[#faf6f0] overflow-hidden"
      style={{ fontFamily: "'Noto Serif KR', serif" }}
    >
      <main className="relative w-full h-[calc(100vh-56px)] overflow-hidden">

        {/* 배경 */}
        <div className="absolute inset-[0_0_2.04%_0]">
          <img alt="" className="absolute block max-w-none size-full" src={imgBg} />
        </div>

        {/* 나무 */}
        <div className="absolute inset-[11.63%_87.79%_87.14%_11.32%]">
          <img alt="" className="absolute block max-w-none size-full" src={imgTree1} />
        </div>
        <div className="absolute inset-[7.76%_77.65%_91.43%_21.76%]">
          <img alt="" className="absolute block max-w-none size-full" src={imgTree2} />
        </div>
        <div className="absolute inset-[9.69%_36.4%_89.29%_62.87%]">
          <img alt="" className="absolute block max-w-none size-full" src={imgTree3} />
        </div>
        <div className="absolute inset-[30.2%_11.47%_68.98%_87.94%]">
          <img alt="" className="absolute block max-w-none size-full" src={imgTree4} />
        </div>
        <div className="absolute inset-[13.92%_52.68%_85.35%_46.79%]">
          <img alt="" className="absolute block max-w-none size-full" src={imgTree5} />
        </div>

        {/* 언덕 */}
        <div className="absolute inset-[70.67%_0_0_0]">
          <img alt="" className="absolute block max-w-none size-full" src={imgHill1} />
        </div>
        <div className="absolute inset-[76.4%_0_0_0]">
          <img alt="" className="absolute block max-w-none size-full" src={imgHill2} />
        </div>

        {/* 길(path) */}
        <div className="absolute inset-[48.04%_5%_4.19%_37.42%] overflow-hidden">
          <img alt="" className="absolute block max-w-none size-full" src={imgPath1} />
        </div>
        <div className="absolute inset-[48.04%_5%_4.19%_37.42%] overflow-hidden">
          <img alt="" className="absolute block max-w-none size-full" src={imgPath2} />
        </div>
        <div className="absolute inset-[49.02%_3.91%_2.09%_37.97%] overflow-hidden">
          <img alt="" className="absolute block max-w-none size-full" src={imgPath3} />
        </div>

        {/* 그룹 요소들 */}
        <div className="absolute inset-[27.76%_3.05%_46.94%_85.92%]">
          <img alt="" className="absolute block max-w-none size-full" src={imgGroup1} />
        </div>
        <div className="absolute inset-[51.02%_15.6%_31.63%_76.75%]">
          <img alt="" className="absolute block max-w-none size-full" src={imgGroup2} />
        </div>
        <div className="absolute inset-[68.37%_70.15%_17.35%_23.53%]">
          <img alt="" className="absolute block max-w-none size-full" src={imgGroup3} />
        </div>
        <div className="absolute inset-[73.47%_82.65%_14.69%_12.35%]">
          <img alt="" className="absolute block max-w-none size-full" src={imgGroup4} />
        </div>
        <div className="absolute inset-[61.63%_6.76%_28.16%_88.97%]">
          <img alt="" className="absolute block max-w-none size-full" src={imgGroup5} />
        </div>
        <div className="absolute inset-[62.71%_22.08%_18.16%_43.9%]">
          <img alt="" className="absolute block max-w-none size-full" src={imgGroup6} />
        </div>

        {/* 점 장식 */}
        <div className="absolute inset-[62.71%_41.08%_36.07%_58.04%]">
          <img alt="" className="absolute block max-w-none size-full" src={imgDot1} />
        </div>
        <div className="absolute inset-[70.41%_42.35%_28.78%_57.06%]">
          <img alt="" className="absolute block max-w-none size-full" src={imgDot2} />
        </div>
        <div className="absolute inset-[67.86%_32.72%_31.12%_66.54%]">
          <img alt="" className="absolute block max-w-none size-full" src={imgDot3} />
        </div>
        <div className="absolute inset-[62.29%_23.21%_36.89%_76.2%]">
          <img alt="" className="absolute block max-w-none size-full" src={imgDot4} />
        </div>

        {/* 텍스트 */}
        <div className="absolute inset-[34.64%_27.16%_56.84%_29.25%] flex flex-col items-center justify-center text-center pointer-events-none">
          <p className="text-[#8b7e6a] text-[25px] leading-[50px] whitespace-nowrap">
            <span className="font-bold">여름</span>에 이 길 위에서 만나요.
          </p>
          <p className="text-[#8b7e6a] text-[20px] leading-[50px] whitespace-nowrap">
            <span className="font-bold">동네 사람들의 멋진 이야기</span>를 열심히 모아올게요.
          </p>
        </div>

      </main>
    </div>
  );
}
