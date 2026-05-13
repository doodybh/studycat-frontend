import catOutline from "../assets/cat-outline.png";
import catMask from "../assets/cat-mask.png";

import hat1 from "../assets/hats/hat-1.png";
import hat2 from "../assets/hats/hat-2.png";
import hat3 from "../assets/hats/hat-3.png";
import hat4 from "../assets/hats/hat-4.png";
import hat5 from "../assets/hats/hat-5.png";
import hat6 from "../assets/hats/hat-6.png";
import hat7 from "../assets/hats/hat-7.png";
import hat8 from "../assets/hats/hat-8.png";

import glasses1 from "../assets/glasses/glasses-1.png";
import glasses2 from "../assets/glasses/glasses-2.png";
import glasses3 from "../assets/glasses/glasses-3.png";
import glasses4 from "../assets/glasses/glasses-4.png";
import glasses5 from "../assets/glasses/glasses-5.png";
import glasses6 from "../assets/glasses/glasses-6.png";
import glasses7 from "../assets/glasses/glasses-7.png";
import glasses8 from "../assets/glasses/glasses-8.png";

function CatPreview({ color, equippedHat, equippedGlasses }) {
  const hats = {
    "hat-1": hat1,
    "hat-2": hat2,
    "hat-3": hat3,
    "hat-4": hat4,
    "hat-5": hat5,
    "hat-6": hat6,
    "hat-7": hat7,
    "hat-8": hat8,
  };

  const glasses = {
    "glasses-1": glasses1,
    "glasses-2": glasses2,
    "glasses-3": glasses3,
    "glasses-4": glasses4,
    "glasses-5": glasses5,
    "glasses-6": glasses6,
    "glasses-7": glasses7,
    "glasses-8": glasses8,
  };

  return (
    <div
      style={{
        position: "relative",
        width: "260px",
        height: "260px",
        margin: "20px auto",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: color,

          maskImage: `url(${catMask})`,
          WebkitMaskImage: `url(${catMask})`,

          maskSize: "contain",
          WebkitMaskSize: "contain",

          maskRepeat: "no-repeat",
          WebkitMaskRepeat: "no-repeat",

          maskPosition: "center",
          WebkitMaskPosition: "center",
        }}
      />

      <img
        src={catOutline}
        alt="cat"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "contain",
          imageRendering: "pixelated",
        }}
      />

      {equippedHat && hats[equippedHat] && (
        <img
          src={hats[equippedHat]}
          alt="hat"
          style={{
            position: "absolute",
            top: "6px",
            left: "45%",
            transform: "translateX(-50%)",
            width: "80px",
            height: "60px",
            objectFit: "contain",
            imageRendering: "pixelated",
            pointerEvents: "none",
          }}
        />
      )}

      {equippedGlasses && glasses[equippedGlasses] && (
        <img
          src={glasses[equippedGlasses]}
          alt="glasses"
          style={{
            position: "absolute",
            top: equippedGlasses === "glasses-8" ? "46px" : "42px",
            left: "45%",
            transform: "translateX(-50%)",
            width: "95px",
            height: "70px",
            objectFit: "contain",
            imageRendering: "pixelated",
            pointerEvents: "none",
          }}
        />
      )}
    </div>
  );
}

export default CatPreview;
