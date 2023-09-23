# Easy Extension Template

This is a template for browser extension with React Tailwind CSS and manifest v3.

[Figma template](https://www.figma.com/file/oGLtIgfsafbHWXM8V7lXbM/Easy-Extension-Template?type=design&node-id=0%3A1&mode=design&t=1mbXNqNGS6YB2hAP-1)
for extension icon, promo images and screenshots for Chrome and Edge store with proper sizes.

## Primary features

- React
- Tailwind
- Manifest v3
- Localization
- Dark theme support
- Auto refresh on changes in code
- Uninstall survey

## ToDo

- [x] Unit tests
- [ ] E2E tests
- [ ] CI/CD

## State management

### Key libraries

- Redux + react-redux + redux-thunk
- Redux WebExt
- Redux persist

### What is Redux WebExt?

Redux-webext is a toolkit designed to bring Redux's state management capabilities into the world of web extensions.
It simplifies communication and state synchronization across various extension scripts (e.g., background, content, and
popup scripts).

<img src="https://cloud.githubusercontent.com/assets/1555792/19413725/21031a42-9336-11e6-85ce-d5dc63104936.png" width="400">

### Why Redux WebExt?

Selecting redux-webext for web extension template was driven by the following key reasons:

1. **Unified State**: Centrally managed state, making it straightforward to understand and debug.
2. **Seamless Communication**: It abstracts complex messaging systems between scripts, easing data flow.
3. **Familiar Developer Experience**: Built upon Redux's concepts, it's intuitive for Redux users.
4. **Middleware Support**: Allows incorporation of popular tools like redux-thunk.
5. **Broad Compatibility**: Works smoothly across Chrome, Firefox, and Edge without major adjustments.

### State Migration Issue and Solution with Redux Persist

⚠️ Introducing new keys to reducers will desynchronize the client's local storage with the rootReducer, leading to
runtime
errors.
This can be resolved by using Redux Persist's migration strategy.

1. **Implement Migration**:
   Define a migration function to update the persisted state with the new keys. This
   file `src/pages/background/store/migrations.ts`
2. **Increment store version**:
   Increment the `version` in your persist configuration. This file `src/pages/background/store/store.ts`

```typescript
const migrations = {
   // Example of migration
   1: (state: any) => {
      return {
         ...state,
         settings: {
            ...state.settings,
            newSetting: true,
         },
      }
   },
}

export default migrations
```

By following this migration strategy, you maintain state consistency with your rootReducer, preventing potential runtime
errors.

[Read more on this topic (Medium)](https://medium.com/free-code-camp/how-to-use-redux-persist-when-migrating-your-states-a5dee16b5ead)

### Custom Enhancements

To better tailor redux-webext, there are a couple of customizations:

1. **getActionsMapping**
   - **Purpose**: Automatically get all actions from all slices, then create config for redux
     WebExt. [Default way of doing that.](https://www.npmjs.com/package/redux-webext#:~:text=INCREMENT_UI_COUNTER%3A%C2%A0incrementUICounter%2C)
   - **Benefits**: Enhanced developer experience.

2. **getProxyActions**
   - **Purpose**: Automatically get all actions from all slices, then generate proxy actions that can be dispatched in
     a
     React component (e.g., content, options, and
     popup).
   - **Benefits**: Enhanced developer experience.
   - **Downsides**: Lack of typescript support for this proxy actions. Basically payload has a type any.

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
   - There is localization for extension name and description. These are locales that will be visible in Chrome Store.
2. Update `src/locales/languages`
   - There is actual localization for the app
3. Update `supportedLanguages` in `src/constants/supportedLangauges`
   - You can use this object to populate language dropdown in settings

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

Update urls for an uninstall survey to your own Google Form or custom website url at `src/utils/uninstallUrl`

## Out of scope

My recommendation on implementing those features.

### Authentication

You can't easily use Firebase in extensions with manifest v3 because a background script runs in service worker.
I would stick to redirecting user to your website where they can log in,
using third party provider or your own auth api and then passing JWT to an extension from there.

Also, by using website for authentication,
you can reliably track conversions with GoogleAnalytics, Amplitude or anything else.

### Analytics

Google Analytics
If you want to use Google Analytics, I would recommend you to consider using amplitude,
because you will have to jump through hoops in order to only make it work.
User tracking is not reliable, which most likely will lead to duplication of users in analytics.

Amplitude on the other hand is perfect for even small production use
(Currently it's free for applications with under 100 000 MAU).
It's very reliable.