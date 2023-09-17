# Easy Extension Template

This is a template for browser extension with React Tailwind CSS and manifest v3.

[Figma template](https://www.figma.com/file/oGLtIgfsafbHWXM8V7lXbM/Easy-Extension-Template?type=design&node-id=0%3A1&mode=design&t=1mbXNqNGS6YB2hAP-1) for extension icon, promo images and screenshots for Chrome and Edge store with proper sizes.

## Primary features

- React
- Tailwind
- Manifest v3
- Localization
- Dark theme support
- Auto refresh on changes in code
- Uninstall survey

## State management

### Key libraries

- Redux + react-redux + redux-thunk
- Redux WebExt
- Redux persist

### What is Redux WebExt?

redux-webext is a toolkit designed to bring Redux's state management capabilities into the world of web extensions. It
simplifies communication and state synchronization across various extension scripts (e.g., background, content, and
popup scripts).

<img src="https://cloud.githubusercontent.com/assets/1555792/19413725/21031a42-9336-11e6-85ce-d5dc63104936.png" width="400">

### Why Redux WebExt?

Selecting redux-webext for web extension template was driven by the following key reasons:

1. **Unified State**: Centrally managed state, making it straightforward to understand and debug.
2. **Seamless Communication**: It abstracts complex messaging systems between scripts, easing data flow.
3. **Familiar Developer Experience**: Built upon Redux's concepts, it's intuitive for Redux users.
4. **Middleware Support**: Allows incorporation of popular tools like redux-thunk.
5. **Broad Compatibility**: Works smoothly across Chrome, Firefox, and Edge without major adjustments.

### Custom Enhancements

To better tailor redux-webext, there are a couple of customisations:

#### getActionsMapping

**Purpose**: Automatically get all actions from all slices, then create config for redux
WebExt. [Default way of doing that.](https://www.npmjs.com/package/redux-webext#:~:text=INCREMENT_UI_COUNTER%3A%C2%A0incrementUICounter%2C)

**Benefits**: Enhanced developer experience.

#### getProxyActions

**Purpose**: Automatically get all actions from all slices, then generate proxy actions that can be dispatched in a
React component (e.g., content, options, and
popup).

**Benefits**: Enhanced developer experience.

**Downsides**: Lack of typescript support for this proxy actions. Basically payload has a type any.

## Localization

For localisation used library react-localization.

### Usage

Import `strings` from `src/locaales/localisation.ts`

```jsx
<div>
  <span>{strings.settings.language}</span>
</div>
```

### How to add new locale

1. Update `extension/_locales`
    1. There is localization for extension name and description. These are locales that will be visible in Chrome Store.
2. Update `src/locales/languages`
    1. There is actual localization for the app
3. Update `supportedLanguages` in `src/constants/supportedLangauges`
    1. You can use this object to populate language dropdown in settings

## Styles

For styles, you can use Tailwind CSS. JIT compile mode by default from v3.

### Reset css

Reset css is applied to popup and options.

⚠️ Don't import it in a content script because **it will break styles of the website** it's been injected into.

Tailwind should not interfere with style of website it's been injected into, because it's only applied to children of an
element with id `#EasyExtensionTemplate`. You can change this id in `taiiwnd.config.js`

### Dark theme

Add class name to root of the page for smooth change between themes`smooth-theme-transition`

To update the current theme, dispatch this action.

`dispatch(proxyActions.settings.setDarkMode({ darkMode: EDarkMode.AlwaysDark }))`

## Uninstall survey

I would recommend to set uninstall url only for suers who have used your extension for at least a couple of hours.

Update urls for uninstall survey to your own Google Form or custom website url at `src/utils/uninstallUrl`

## Out of scope
My recommendation on implementing those features.

### Authentication
You can't easily use Firebase in extensions with manifest v3 because background script runs in service worker.
I would stick to redirecting user to your webstie where they can log in,
using third party provider or your own auth api and than passing JWT to extension from there.

### Analytics

Google Analytics
If you want to use Google Analytics, I would recommend you to consider using amplitude,
because you will have to jump through hoops in order to only make it work.
User training is not reliable, which most likely will lead to duplication of users in analytics.

Amplitude on the other hand is perfect for even small production use
(Currently it's free for applications with under 100 000 MAU).
It's very reliable.