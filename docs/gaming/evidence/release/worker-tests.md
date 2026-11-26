# The games Worker and publisher: test output

_Captured output of `node --test workers/games/test/*.test.mjs`, 25 November 2026, Node 25.4 on the machine in the M0 inventory. Kept as Markdown because the repository ignores `.log` and `.txt` files._

```text
✔ a dry run writes nothing
✔ the first release is uploaded, read back, checked, and only then made live
✔ releasing the same build again uploads nothing and moves nothing
✔ a second release goes live and the first stays in the bucket, untouched
✔ a release whose files do not match its manifest is refused before anything is uploaded
✔ a release id already in the bucket with other contents is never overwritten
✔ rolling back returns to the release before, and status reports it
✔ a damaged pointer stops a release instead of being written over
✔ no call ever left games/, and none removed anything
✔ a release is named by its commit's date and hash
✔ releasing remembers the release before, and releasing the live one again changes nothing
✔ rolling back swaps the two, so rolling back twice returns to where it began
✔ the publisher has no way to delete, and touches nothing outside games/
✔ a folder answers with its index page, and a folder asked for without its slash is redirected
✔ nothing that could leave the release folder becomes an object key
✔ the type comes from the name, and an unknown kind is never a page
✔ only files named by their content are cached for long
✔ the policy lets a page load only from its own address
✔ a pointer is read only if it is well formed
✔ production and UAT name different Workers, hosts and buckets, and neither names the website's
✔ the games have their four workflows, and no other workflow is named like them
✔ no games workflow builds, publishes or deploys anything of the website
✔ the build runs only for the games' own files, and the deploys only when a person starts them
✔ a UAT run is refused if it names anything of production
✔ serves the live release with the host's headers
✔ a page from the release before still gets its own scripts, and only its scripts
✔ what is not there is a 404 with the release's own page, and nothing outside the release is reachable
✔ answers 304 to a matching ETag, nothing but headers to HEAD, and 405 to anything that writes
✔ with nothing released it says so, and a damaged pointer never replaces a good one
✔ a release goes live when the pointer changes, and rolls back the same way
✔ UAT and production both tell robots to stay out while every game is a prototype
ℹ tests 31
ℹ suites 0
ℹ pass 31
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 1372.694583
```
