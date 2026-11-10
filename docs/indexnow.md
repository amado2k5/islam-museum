# IndexNow — islam.museum (production only)

IndexNow lets a site tell participating search engines (Bing, Yandex,
Naver, Seznam and others) that pages have changed, so updates are picked
up promptly instead of waiting for a crawler to wander past. This note
records how it is set up for islam.museum. The deployment-side detail
lives in `docs/engineering/06-deployment.md` (§3 and §8).

## The key

- The IndexNow key file lives at `site/public/<key>.txt`, which the site
  build serves at `https://islam.museum/<key>.txt`. The file's content is
  exactly the key string, and the file name is the key plus `.txt` — that
  pairing is how IndexNow verifies ownership of the host.
- The key is public by design: it is openly served from the site root,
  and ownership is proven by hosting the file, not by secrecy.
- cookwala.ai, the founder's other site, runs IndexNow the same way with
  its own key file at its root (`tools/indexnow.py` in that repo). Each
  host's key is independent; the protocol needs no shared key.

## How submissions work

- Deployment stays manual, by the founder. After a **production** deploy,
  the `notify-indexnow` job in `.github/workflows/deploy-env.yml` runs
  `node scripts/indexnow.mjs`, which derives the changed page URLs from
  the deployed commit's diff and POSTs them to
  `https://api.indexnow.org/indexnow` with the host, key and key
  location. Setting the repository variable `INDEXNOW` to `off` skips
  the ping.
- The helper can also be run by hand from a full checkout:

  ```sh
  node scripts/indexnow.mjs              # URLs changed in the last commit
  node scripts/indexnow.mjs --all        # every URL in the live sitemaps (bootstrap)
  node scripts/indexnow.mjs --sitemaps   # just the sitemap index and sitemaps
  node scripts/indexnow.mjs --dry-run    # print what would be sent, send nothing
  ```

## Production only — never uat

Two independent guards keep staging out of search engines:

1. The workflow's IndexNow job runs only when the deploy environment is
   `production` (UAT never pings; UAT is `noindex` throughout).
2. The helper itself hard-fails for any host other than `islam.museum`:
   if `PUBLIC_SITE_URL` points at `uat.islam.museum`,
   `uat-api.islam.museum` or anywhere else, it throws and submits
   nothing — however it is invoked.
