# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend enabling type-aware lint rules by installing `oxlint-tsgolint` and editing `.oxlintrc.json`:

```json
{
  "$schema": "./node_modules/oxlint/configuration_schema.json",
  "plugins": ["react", "typescript", "oxc"],
  "options": {
    "typeAware": true
  },
  "rules": {
    "react/rules-of-hooks": "error",
    "react/only-export-components": ["warn", { "allowConstantExport": true }]
  }
}
```

See the [Oxlint rules documentation](https://oxc.rs/docs/guide/usage/linter/rules) for the full list of rules and categories.

## Android app (APK)

The web app is wrapped with [Capacitor](https://capacitorjs.com/) and ships as an
installable Android APK. The built web app (`dist`) is bundled inside the APK, so the app
opens without a server — only Supabase data calls use the network. The native project lives
in `android/`; app ID is `com.mlc.centralhub`.

APKs are built in the cloud by [`.github/workflows/android-apk.yml`](.github/workflows/android-apk.yml)
— no Android SDK needed on your machine.

### Get a test APK now (no setup)

GitHub → **Actions** → **Build Android APK** → **Run workflow**. When it finishes, download
the `mlc-central-hub-apk` artifact from the run page. With no signing key configured this is
an **unsigned debug APK**: fine for trying on your own phone, but not for wide sharing.

### Build a signed release APK (shareable + updatable)

Do this once, then every version tag produces a signed APK on the Releases page.

**1. Create a signing keystore** (needs a JDK — install Temurin 21 if `keytool` is missing).
Keep the generated file and its passwords safe: **lose the keystore and you can never ship an
update to installed users.** Never commit it (`*.keystore`/`*.jks` are gitignored).

```bash
keytool -genkeypair -v -keystore mlc-central-hub.keystore \
  -alias mlc-central-hub -keyalg RSA -keysize 2048 -validity 10000
```

**2. Base64-encode the keystore** (one line, for the GitHub secret):

```bash
# Git Bash / macOS / Linux
base64 -w0 mlc-central-hub.keystore
```

```powershell
# Windows PowerShell
[Convert]::ToBase64String([IO.File]::ReadAllBytes("mlc-central-hub.keystore"))
```

**3. Add four repository secrets** (Settings → Secrets and variables → Actions → New
repository secret):

| Secret | Value |
| --- | --- |
| `ANDROID_KEYSTORE_BASE64` | the base64 string from step 2 |
| `ANDROID_KEYSTORE_PASSWORD` | the store password you set |
| `ANDROID_KEY_ALIAS` | `mlc-central-hub` |
| `ANDROID_KEY_PASSWORD` | the key password you set |

**4. Cut a release** by pushing a version tag:

```bash
git tag v1.0.0
git push origin v1.0.0
```

CI builds the signed APK and publishes it to **Releases** with a shareable download link.
Share that link; users open the APK and allow installs from their browser/Files app when
prompted. `versionCode` auto-increments per build, so newer tags update in place — no
uninstall needed, as long as every release is signed with the same keystore.
