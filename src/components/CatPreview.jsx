import catOutline from "../assets/cat-outline.png";
import catMask from "../assets/cat-mask.png";

function CatPreview({ color }) {
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
    </div>
  );
}

export default CatPreview;
