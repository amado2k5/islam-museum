# LinkedIn post: the build and deploy speed work

Drafted 14 November 2026 to go out with the 36-second film in `marketing/build-speed/`. It is a draft: nothing has been posted. The founder posts it from his own account, and the entry in `marketing-and-outreach-register-2026.md` moves from "prepared" to the register when he does.

- **Length:** about 2,580 characters (LinkedIn's limit is 3,000).
- **Numbers:** every figure is taken from `docs/engineering/45-build-deploy-review.md` and matches the film. The comparison is production on the old code against UAT on the new code, 12 and 13 November 2026.
- **Links:** all five were checked on 14 November 2026. LinkedIn tends to show posts with outside links to fewer people; to avoid that, move the links into the first comment and end the post with "links in the comments".
- **The prompt link** is the goal-based prompt of the larger Fable 5.2 run, not of the speed review itself, and the post says so.

## The post

```text
Our build was three and a half hours long and getting longer.

islam.museum is an open, free museum of Islam, published as a static site: 202,253 pages, rebuilt from a knowledge graph in git. Every new record made the build a little slower. GitHub stops a job at six hours. We could see the wall coming.

In November I asked Claude Fable 5.2 to review the whole pipeline. It started with the logs of the last real runs, before touching any code, and they told a simple story. Almost all of the build was one page template, and that template scanned all 147,712 edges of the graph about eight times for every page it rendered. 53 milliseconds a page. Two hours and twenty-eight minutes of a three-hour build.

The fix was not clever. Index the edges once, read one file once. The same story repeated in the deploy: uploads that were meant to run 42 at a time were quietly going one by one, because one blocking call held everything up.

Before and after, same content, measured one day apart:

• Each page: 53 ms → 7.5 ms
• Rendering all pages: 3 h 6 min → 43 min
• Full build: 3 h 34 min → 1 h 22 min
• Deploy: 3 h 13 min → 47 min
• Publishing to storage: 99 min → 42 min, retries 678 → 13
• Build artifact: 456,579 files, 6.7 GB → 1 file, 1.15 GB
• One map page: 25 MB → 601 KB

And the part I care about most: 400 pages sampled across the site came out byte for byte identical. Faster, and nothing a reader sees changed.

What made it work was less the model than the way it was asked. Measure real runs first. Try the change on a staging copy while production keeps the old code, so the two can be compared honestly. Prove the output is the same before believing the speed. Write down what was found and not fixed, too.

All of it is public, so you can read it, argue with it, or lift it for your own repo:

The review, with every number and its run: https://github.com/amado2k5/islam-museum/blob/main/docs/engineering/45-build-deploy-review.md
The pull request: https://github.com/amado2k5/islam-museum/pull/6496
The wider record of the Fable 5.2 work, including what it did not get right: https://github.com/amado2k5/islam-museum/blob/main/docs/engineering/45-fable-5-2-improvements.md
The goal-based prompt we used for the larger run: https://github.com/amado2k5/islam-museum/blob/main/docs/verification/fable-5-2-mission-prompt.md
The museum: https://islam.museum

If your CI has been getting slower for a year and nobody has opened the logs, that is where I would start.

#BuildEngineering #CICD #ClaudeCode #OpenSource #DeveloperProductivity
```
