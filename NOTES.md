# Notes

Open items pulled out of `index.html` so they stop shipping as inline comments
on the live page. Nothing here is user-facing; it's just a running list of
what still needs your input or a follow-up photo.

## Projects — Christmas Light Show

- Update the card subtitle/tags to match the actual stack (e.g. xLights, Falcon Player, WLED).
- Modal overview could use more detail: what software sequences the show, how audio sync works,
  exact channel/prop count, and how the schedule is triggered.

## Projects — Magic Mirror

- Update the card tags once you confirm the exact software/modules running the display.
- Modal overview could use more detail: exact software/modules running the display (e.g.
  MagicMirror2), how the frame was built, and what other modules it shows (calendar, news, etc.).

## Projects — Autonomous Robot Navigation (Duckiebot)

- Card thumbnail is currently the YouTube `maxresdefault` thumbnail for the demo video. If you'd
  rather not depend on YouTube's thumbnail CDN, drop a local frame in `assets/projects/duckiebot/`
  and swap the `<img src>` on the card.

## Projects — Self-Hosted NVR

- Card thumbnail still needs a real screenshot.
- Modal gallery was removed (it only had an empty placeholder). Once you have a Frigate dashboard
  screenshot, add a `.modal-gallery` back to `#tpl-nvr` with a `Gallery` heading above it.

## Projects — PCB Temperature Sensor

- Modal gallery is missing a photo of the assembled/soldered board. The empty placeholder for it
  was removed from the page; add a real `<figure class="gallery-item">` back in when you have one.

## Resume

- Drop the resume PDF at `assets/resume/Jack_Schmitt_Resume.pdf`. The resume card and the hero
  "Download Résumé" button both already link to that path directly, no other changes needed once
  the file is there.

## Experience — Ambassador & Social Media Intern

- This entry only has one bullet while every other entry has two or three. Need a second bullet
  covering the ambassador side of the role (tours? panels? prospective student events?).
