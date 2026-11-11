# Dice support website

Public social links, support and privacy information for the Dice iOS app,
hosted on GitHub Pages. The repository contains the static website and app icon; it does not
contain the app source.

| Page | Public URL |
| --- | --- |
| Social profile link | https://forrestboyer.github.io/dice-support/links/ |
| Support URL | https://forrestboyer.github.io/dice-support/ |
| Privacy Policy URL | https://forrestboyer.github.io/dice-support/privacy/ |

## Files

- [Links page](links/index.html) — the shared destination for social profile
  bios, with verified account links and access to support and privacy.
- [Links styles](assets/links.css) — the compact mobile layout, using the shared
  site's light/dark colors.
- [Support page](index.html) — contact information, purchase restoration, and
  purchase help.
- [Privacy policy](privacy/index.html) — local app data, Apple purchases and
  update checks, support correspondence, and GitHub Pages hosting.
- [Shared styles](assets/styles.css) — responsive layout, focus indicators, and
  system light/dark appearance.

## Publishing

GitHub Pages publishes the root of `main`. Edit the HTML or CSS, commit, and push
to `main` to publish an update. `.nojekyll` keeps these static files independent
of a site generator. There are no package dependencies, external fonts, or build steps.
[Website counters](assets/analytics.js) run independently of page navigation.

In the repository’s Settings → Pages, the publishing source is **Deploy from a
branch**, using `main` and `/ (root)`. See [GitHub’s publishing
instructions](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site).

For a local preview, run `python3 -m http.server 8080` from this directory and
open http://localhost:8080/.

## Social links and in-app browsers

Use the [links page](links/index.html) with the matching source in each social profile:

- Instagram: `https://forrestboyer.github.io/dice-support/links/?from=instagram`
- TikTok: `https://forrestboyer.github.io/dice-support/links/?from=tiktok`
- Facebook: `https://forrestboyer.github.io/dice-support/links/?from=facebook`

The app icon and prominent download button open Dice in the App Store, with
three quieter social links grouped below. On the published site, the
incoming source selects Apple's campaign token: `instagram`, `tiktok`, or
`Facebook` (case preserved). All three use app ID `6825166222` and provider token
`129653631`. Known social referrers also select the matching campaign when no
valid source parameter is present. Direct or unrecognized visits, disabled
JavaScript, local previews, and browsers sending DNT/GPC use the plain App Store
link. Apple reports campaign downloads separately from the website's click totals.

The counter sends fixed page, source, and action labels. It ignores arbitrary URL
parameters and carries the source through internal navigation without cookies or
browser storage. It records existing social and help links, and recognizes
`apps.apple.com` links. A click does not establish a download. Tracking runs only
on the published origin; blocked or failed delivery never prevents navigation.
See the [privacy policy](privacy/index.html) for information handling.

Account destinations are ordinary HTTPS links verified against the connected Buffer
channels. The page uses same-window navigation, local assets and system fonts;
it works without JavaScript, cookies, pop-ups or embedded social widgets.
The host app controls whether an outgoing link stays in its browser or opens
another app; this page does not force an app handoff or redirect visitors.

When changing the page, check narrow and wide layouts, light and dark mode,
keyboard focus, enlarged text, and navigation from an actual mobile in-app
browser. HTTP and static checks alone do not establish those visual or device
behaviors. The existing support and privacy URLs remain stable.

## Maintaining the privacy policy

The policy describes Dice’s current local storage, StoreKit purchases, automatic
Apple update checks, and optional support correspondence. Update it before introducing accounts, cloud sync, analytics, advertising, or
other information handling. Keep its revision date current when changing its
substance. Support information is handled according to the published policy;
the public contact address is in the HTML.

The app icon is Dice artwork by Forrest Boyer. Preserve its ownership and the
accuracy of the published contact details when editing this site.
