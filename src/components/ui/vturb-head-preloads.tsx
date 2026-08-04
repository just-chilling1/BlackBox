const VTURB_ACCOUNT_ID = "e9cd97bc-7bc8-4a23-bb2f-224a56a84d6b";

type VturbHeadPreloadsProps = {
  playerId: string;
  streamAssetId: string;
};

export function VturbHeadPreloads({ playerId, streamAssetId }: VturbHeadPreloadsProps) {
  const playerScriptSrc = `https://scripts.converteai.net/${VTURB_ACCOUNT_ID}/players/${playerId}/v4/player.js`;
  const streamSrc = `https://cdn.converteai.net/${VTURB_ACCOUNT_ID}/${streamAssetId}/main.m3u8`;

  return (
    <>
      <script
        dangerouslySetInnerHTML={{
          __html:
            "!function(i,n){i._plt=i._plt||(n&&n.timeOrigin?n.timeOrigin+n.now():Date.now())}(window,performance);",
        }}
      />
      <link rel="preload" href={playerScriptSrc} as="script" />
      <link
        rel="preload"
        href="https://scripts.converteai.net/lib/js/smartplayer-wc/v4/smartplayer.js"
        as="script"
      />
      <link rel="preload" href={streamSrc} as="fetch" crossOrigin="anonymous" />
      <link rel="dns-prefetch" href="https://cdn.converteai.net" />
      <link rel="dns-prefetch" href="https://scripts.converteai.net" />
      <link rel="dns-prefetch" href="https://images.converteai.net" />
      <link rel="dns-prefetch" href="https://license.vturb.com" />
    </>
  );
}
