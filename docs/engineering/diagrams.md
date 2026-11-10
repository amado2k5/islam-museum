# Diagrams — islam.museum engineering set

All diagrams in one place (also embedded in the numbered docs). Mermaid —
renders on GitHub.

## 1. System context

```mermaid
flowchart LR
    subgraph Producers["Build phase only"]
        F[Founder]
        AG[AI agents]
        HV[Local harvest<br/>founder's Mac]
    end
    R[(GitHub repo<br/>data + content + schema)]
    CI[GitHub Actions<br/>validate · test · build]
    CF[Cloudflare Pages<br/>islam.museum]
    R2[(R2: pagefind + api/v1)]
    GP[GitHub Pages mirror]
    V([Visitors])
    C([API consumers])

    F & AG -->|PRs| R
    HV -->|draft candidates via PR| R
    R -->|workflow_dispatch, founder only| CI
    CI --> CF & R2
    CI -.-> GP
    CF --> V
    R2 --> V & C
    GP -.-> V
```

## 2. Build pipeline flow

```mermaid
flowchart TD
    D[data/*.yaml] & C[content/**/*.md] & S[schema/ geo/] --> V[validate.ts]
    V --> BG[build-graph.ts]
    BG --> GJ[(.cache/graph.json)]
    GJ --> DV[derive.ts]
    DV --> AB[astro build → dist/]
    AB --> PF[pagefind ar/en/ur]
    AB --> API[api/v1 export]
    PF --> R2S{r2-sync<br/>manifest diff}
    API --> R2S
    R2S --> R2[(R2)]
    AB --> STRIP[strip pagefind+api]
    STRIP --> DEP[wrangler pages deploy]
    DEP --> CFP[Cloudflare Pages]
    DEP --> IN[IndexNow]
```

## 3. Content authoring sequence

```mermaid
sequenceDiagram
    participant A as Agent
    participant W as Own worktree
    participant GH as origin/main
    participant CI as validate.yml
    participant F as Founder

    A->>W: template → data yaml + ar/en/ur md
    A->>W: validate && test && coverage
    A->>GH: fetch, three-way merge
    A->>GH: push branch, open PR (≤25 entities)
    GH->>CI: validate + test + build
    A->>GH: merge own PR
    Note over F: deploy.yml manual, ≈daily
    F->>GH: workflow_dispatch → live
```

## 4. Content model (simplified ER)

```mermaid
erDiagram
    ENTITY {
        string id "class/slug, immutable"
        map label "per lang"
        map summary "per lang"
        object dates "edtf+hijri+precision"
        array aliases
        object status "review: draft|reviewed|verified"
        object provenance
    }
    ENTITY ||--o{ SOURCE : cites
    ENTITY ||--o{ MEDIA : "media sidecar"
    PERSON }o--o{ EVENT : "participant_in + story_roles"
    WORK }o--o{ PERSON : authored_by
    EVENT }o--o{ PLACE : occurred_at
    BUILDING }o--o{ PLACE : located_in
    PASSAGE }o--|| WORK : part_of
    ENTITY }o--o{ ENTITY : "registered predicates only"
```

## 5. Harvest data flow (outside → inside git)

```mermaid
flowchart LR
    subgraph MAC["Founder's Mac — never committed"]
        D[source dumps<br/>~215 GiB]
        DB[(DuckDB)]
        OL[Ollama local models<br/>extract + judge + embed]
        L1[cc0 layer]
        L2[by-sa layer]
        L3[restricted layer<br/>stays outside]
    end
    D --> DB --> OL
    OL --> L1 & L2 & L3
    L1 & L2 -->|rewrite + cite + page| PR[PR: draft + provenance]
    PR --> VA[validate + human review] --> MAIN[main]
```

## 6. Parallel-lane collaboration (gitGraph)

```mermaid
gitGraph
    commit id: "main"
    branch lane-people
    commit id: "batch A"
    commit id: "batch B"
    checkout main
    merge lane-people id: "PR merge"
    branch lane-sira
    commit id: "juz4 batch1"
    checkout main
    merge lane-sira
    branch docs-eng
    commit id: "engineering docs"
    checkout main
    merge docs-eng
```

## 7. Request path (visitor)

```mermaid
sequenceDiagram
    participant B as Browser
    participant CF as Cloudflare edge
    participant P as Pages origin
    participant R2

    B->>CF: GET /ar/person/ibn-sina
    CF-->>B: cached HTML (hit) — or P on miss
    B->>CF: first search → pagefind chunk
    CF->>R2: fetch chunk (miss)
    R2-->>B: immutable, cached forever
    B->>B: search runs locally; islands hydrate
```

## 8. Deploy sequence

```mermaid
sequenceDiagram
    participant F as Founder
    participant W as deploy.yml
    participant R2
    participant P as CF Pages
    participant G as GitHub Pages

    F->>W: workflow_dispatch
    W->>W: validate, test, build
    W->>W: diff data/+content/ — changed?
    W->>R2: manifest sync (pagefind, api)
    W->>P: pages deploy (stripped dist)
    W->>G: fallback mirror
    W->>W: IndexNow notify
```
