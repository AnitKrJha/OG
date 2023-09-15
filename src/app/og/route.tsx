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
      new URL(
        "../../assets/BricolageGrotesque_24pt-Medium.ttf",
        import.meta.url
      )
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
            fontFamily: "Bricolage Grotesque",
            background:
              "radial-gradient(at right bottom, rgb(30, 58, 138), rgb(24, 24, 27), rgb(0, 0, 0))",
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
                fontSize: 20,
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
              xmlns="http://www.w3.org/2000/svg"
              version="1.1"
              width="46"
              height="32"
              viewBox="0 0 46 32"
            >
              <path
                stroke-linejoin="miter"
                stroke-linecap="butt"
                stroke-miterlimit="4"
                stroke-width="0.4848"
                stroke="#000"
                fill="#fff"
                d="M21.201 0.528l-15.055 22.56h8.063l6.991-10.68 2.488 3.646 3.946-5.919-6.434-9.607z"
              />
              <path
                stroke-linejoin="miter"
                stroke-linecap="butt"
                stroke-miterlimit="4"
                stroke-width="0.4848"
                stroke="#000"
                fill="#fff"
                d="M3.273 27.42l-2.788 4.246c5.719 0.014 17.834 0.043 20.545 0.043s5.075-2.545 5.919-3.817l2.316-3.345c0.5 0.786 1.879 2.831 3.388 4.718s3.946 2.416 4.975 2.445h4.418l-8.793-13.296 11.838-17.928h-18.572l2.831 4.289h4.975c-4.346 6.519-13.236 19.858-14.025 21.059s-2.245 1.558-2.874 1.587h-14.154z"
              />
            </svg>

            <span
              style={{
                marginLeft: 12,
                fontSize: 20,
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
