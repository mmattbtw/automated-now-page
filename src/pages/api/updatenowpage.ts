import { DiscogsResponse, ReleasesItem } from "@/typings/discogs";
import { GithubResponse } from "@/typings/github";
import { RecentTrack, TrackItem } from "@/typings/lastfm";
import { NextRequest, NextResponse } from "next/server";

export const config = {
  runtime: "edge",
};

export default async function UpdateNowPage(req: NextRequest) {
  if (req.method !== "POST") {
    return NextResponse.json(
      {
        status: 405,
        message: "Method Not Allowed",
      },
      { status: 405 }
    );
  }

  // if secret not in header
  if (!req.headers.get("secret")) {
    return NextResponse.json(
      {
        status: 401,
        message: "Unauthorized",
      },
      { status: 401 }
    );
  } else if (req.headers.get("secret") !== process.env.SECRET) {
    return NextResponse.json(
      {
        status: 401,
        message: "Unauthorized",
      },
      { status: 401 }
    );
  }

  const lastFmFetch = await fetch(
    "https://ws.audioscrobbler.com/2.0/" +
      "?method=user.getrecenttracks" +
      "&user=mmattbtw" +
      "&api_key=" +
      process.env.LAST_FM_KEY +
      "&format=json" +
      "&limit=5"
  );
  const lastFmResponse = (await lastFmFetch.json()) as RecentTrack;

  const discogsFetch = await fetch(
    "https://api.discogs.com/users/mmattbtw/collection/folders/0/releases?sort=added&sort_order=desc&per_page=5",
    {
      headers: {
        "User-Agent": "mmNowApi/0.1 +https://mm.omg.lol/",
      },
    }
  );
  console.log(discogsFetch.statusText, "discogs");
  const discogsResponse = (await discogsFetch.json()) as DiscogsResponse;

  const githubFetch = await fetch(
    "https://api.github.com/users/" +
      "mmattbtw" +
      "/repos" +
      "?sort=pushed" +
      "&per_page=5"
  );
  const githubResponse = (await githubFetch.json()) as GithubResponse;

  const nowPage = `
{profile-picture}

# matt

## My /now page

--- Now ---

### What I’m making

- [Solrock](https://solrock.mmattdonk.com) {globe}

### What I'm listening to
- (source [last.fm](https://www.last.fm/user/mmattbtw)) {lastfm}

${lastFmResponse.recenttracks.track
  .map((track: TrackItem) => {
    return `- [${track.name} by ${track.artist["#text"]}](${track.url}) ${
      track["@attr"]?.nowplaying ? "{headphones}" : "{music}"
    }`;
  })
  .join("\n")}

${
  // if every track in recenttracks have the same aritst, then say "that's a lot of [artist]"
  lastFmResponse.recenttracks.track.every(
    (track: TrackItem) =>
      track.artist["#text"] ===
      lastFmResponse.recenttracks.track[0].artist["#text"]
  )
    ? `- That's **a lot** of [${
        lastFmResponse.recenttracks.track[0].artist["#text"]
      }](https://last.fm/artist/${lastFmResponse.recenttracks.track[0].artist[
        "#text"
      ].replaceAll(" ", "+")})! {headphones}`
    : ""
}

### What Music I'm Collecting
- (source [discogs](https://www.discogs.com/user/mmattbtw/collection)) {record-vinyl}

${discogsResponse.releases
  .map((release: ReleasesItem) => {
    return `- [${release.basic_information.title} by ${
      release.basic_information.artists[0].name
    } (${release.basic_information.formats[0].text} ${
      release.basic_information.formats[0].name
    })](https://www.discogs.com/release/${release.basic_information.id}) {${
      release.basic_information.formats[0].name === "Vinyl"
        ? "record-vinyl"
        : release.basic_information.formats[0].name === "CD"
        ? "compact-disc"
        : "music"
    }}`;
  })
  .join("\n")}

### What I'm coding
${githubResponse
  .map((repo) => {
    return `- [${repo.owner.login}/${repo.name}](${repo.html_url}) {github}`;
  })
  .join("\n")}

---

{last-updated}

[Back to my omg.lol page!](https://{address}.omg.lol)
`;

  // console.log(nowPage);

  const omglolFetch = await fetch("https://api.omg.lol/address/mm/now", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OMG_LOL_SECRET}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      content: nowPage,
      listed: true,
      nudge: "7",
    }),
  });

  const omglolResponse = await omglolFetch.json();
  return NextResponse.json(omglolResponse);
}
