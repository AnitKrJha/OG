import { ImageResponse } from "next/server";
export const runtime = "edge";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const hasTitle = searchParams.has("title");
    const title = hasTitle
      ? searchParams.get("title")?.slice(0, 100)
      : "Anit Jha";
    const hasType = searchParams.has("type");
    const type = hasType ? searchParams.get("type")?.slice(0, 100) : "";

    // Make sure the font exists in the specified path:
    const fontData = await fetch(
      new URL("../../assets/Montserrat-Bold.ttf", import.meta.url)
    ).then((res) => res.arrayBuffer());

    return new ImageResponse(
      (
        <div
          style={{
            display: "flex",
            height: "100%",
            width: "100%",
            alignItems: "center",
            justifyContent: "center",
            letterSpacing: "-.02em",
            fontWeight: 700,
            fontFamily: "monteserrat",
            background:
              "radial-gradient(at center center, rgb(17, 24, 39), rgb(75, 85, 99))",
          }}
        >
          <div
            style={{
              left: 42,
              top: 42,
              position: "absolute",
              display: "flex",
              alignItems: "center",
              color: "white",
            }}
          >
            <span
              style={{
                width: 24,
                height: 24,
                background: "white",
              }}
            />
            <span
              style={{
                marginLeft: 8,
                fontSize: 24,
              }}
            >
              {hasType && type}
            </span>
          </div>
          <div
            style={{
              right: 42,
              bottom: 42,
              position: "absolute",
              display: "flex",
              alignItems: "center",
              color: "white",
            }}
          >
            <svg
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              width="35"
              height="28"
              viewBox="0 0 1398 1024"
            >
              <title></title>
              <g id="icomoon-ignore"></g>
              <path
                fill="#fff"
                d="M352.575 52.12l-340.311 349.509 15.329 18.395 30.659 18.395 15.329 12.263 27.593 9.198 33.725 3.066h45.988l39.856-9.198 42.922-21.461 205.413-208.479 355.641 386.299 6.132 9.198 9.198 24.527v24.527l-3.066 30.659-9.198 33.725-21.461 30.659-27.593 24.527-24.527 18.395-18.395 9.198h-55.186l-15.329-6.132-12.263-3.066-21.461-9.198-15.329-9.198-21.461-21.461-9.198-12.263-9.198-18.395-12.263-18.395-3.066-18.395v-30.659l3.066-24.527 6.132-15.329 6.132-21.461 12.263-15.329 9.198-12.263 9.198-15.329-137.964-144.096-30.659 33.725-21.461 33.725-24.527 36.79-24.527 55.186-9.198 45.988v101.174l24.527 82.778 39.856 67.449 45.988 52.12 98.108 64.383 91.976 24.527h61.317l64.383-9.198 67.449-27.593 52.12-24.527 39.856-36.79 42.922-55.186 24.527-39.856 18.395-52.12 9.198-39.856v-113.437l-12.263-52.12-24.527-52.12-27.593-39.856-377.102-413.892-6.132-9.198-12.263-9.198-9.198-6.132-15.329-9.198-15.329-6.132-9.198-6.132-18.395-3.066-12.263-3.066h-12.263l-18.395-3.066h-24.527l-15.329 3.066-9.198 3.066-12.263 3.066-24.527 12.263-9.198 6.132-12.263 9.198-9.198 9.198z"
              ></path>
              <path
                fill="#fff"
                d="M1128.24 435.353l-331.114-361.772-6.132-9.198 12.263-9.198 21.461-15.329 21.461-12.263 30.659-12.263 30.659-9.198h36.79l39.856 9.198 39.856 18.395 30.659 21.461 331.114 364.838-12.263 15.329-27.593 15.329-24.527 15.329-39.856 12.263h-33.725l-55.186-9.198-39.856-18.395-24.527-15.329z"
              ></path>
            </svg>

            <span
              style={{
                marginLeft: 12,
                fontSize: 24,
              }}
            >
              anit.dev
            </span>
          </div>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              padding: "20px 50px",
              margin: "0 0px",
              fontSize: 60,
              width: "auto",
              maxWidth: 850,
              textAlign: "center",
              color: "white",
              lineHeight: 1.4,
            }}
          >
            {title}
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
        fonts: [
          {
            name: "montserrat",
            data: fontData,
            style: "normal",
          },
        ],
      }
    );
  } catch (error: any) {
    console.log(error.message);
    return new Response("Failed to generate Image", {
      status: 500,
    });
  }
}