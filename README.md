# Dice support website

Public support and privacy information for the Dice iOS app, hosted on GitHub
Pages. The repository contains the static website and app icon; it does not
contain the app source.

| App Store Connect field | Public URL |
| --- | --- |
| Support URL | https://forrestboyer.github.io/dice-support/ |
| Privacy Policy URL | https://forrestboyer.github.io/dice-support/privacy/ |

## Files

- [Support page](index.html) — contact information, purchase restoration, and
  purchase help.
- [Privacy policy](privacy/index.html) — local app data, Apple purchases, support
  correspondence, and GitHub Pages hosting.
- [Shared styles](assets/styles.css) — responsive layout, focus indicators, and
  system light/dark appearance.

## Publishing

GitHub Pages publishes the root of `main`. Edit the HTML or CSS, commit, and push
to `main` to publish an update. `.nojekyll` keeps these static files independent
of a site generator. There are no package dependencies, scripts, analytics,
external fonts, or build steps.

In the repository’s Settings → Pages, the publishing source is **Deploy from a
branch**, using `main` and `/ (root)`. See [GitHub’s publishing
instructions](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site).

For a local preview, run `python3 -m http.server 8080` from this directory and
open http://localhost:8080/.

## Maintaining the privacy policy

The policy describes Dice’s current local storage and StoreKit purchase model.
Update it before introducing accounts, cloud sync, analytics, advertising, or
other information handling. Keep its revision date current when changing its
substance. Support information is handled according to the published policy;
the public contact address is in the HTML.

The app icon is Dice artwork by Forrest Boyer. Preserve its ownership and the
accuracy of the published contact details when editing this site.
