# rn-a11y-state-words-repro

![Build](https://github.com/faciledictu/rn-a11y-state-words-repro/workflows/Pre%20Merge%20Checks/badge.svg)

On Android, `aria-busy`, `aria-checked="mixed"` and `aria-valuetext` (or
`accessibilityState.busy`, `checked: 'mixed'`, `accessibilityValue.text`)
replace the element's name (React Native 0.88.0, new architecture).
`BaseViewManager.updateViewContentDescription` writes the words "busy" and
"mixed" and the value text into the view's content description, after the
`accessibilityLabel` if there is one. With no label, the content description
is only these words, and TalkBack reads it instead of the text of the view or
its children. iOS keeps the name and puts the same words in the accessibility
value. Issue: react/react-native#59856.

One screen, [`ReproducerApp/App.tsx`](ReproducerApp/App.tsx). In each section
the first element has the prop and the second, the control, differs only by
not having it. Section 7 steps a slider's value with a Next button; its first
slider is updated in place, the second is mounted again on every step.

## Run

```bash
cd ReproducerApp
yarn install
yarn start
yarn android
```

Read the nodes with `adb shell uiautomator dump` or with A11yProbe
([`A11yProbe.kt`](ReproducerApp/android/app/src/androidTest/java/com/reproducerapp/A11yProbe.kt),
`Instrumentation` + `UiAutomation`, no extra dependencies). It restarts the
app, presses the `before` buttons, then prints each target's text, content
description, `checkable`, `checked` and range. A target that starts with `^` is
the element that holds the text after it:

```bash
cd ReproducerApp/android && ./gradlew app:assembleDebugAndroidTest
adb install -r app/build/outputs/apk/androidTest/debug/app-debug-androidTest.apk
adb shell "am instrument -w -e wait 15000 -e targets '^Results B1,^Results B2' com.reproducerapp.test/com.reproducerapp.A11yProbe"
```

## Results

React Native 0.88.0, the node's content description from A11yProbe
(`uiautomator dump` shows the same):

| # | Case | With the prop | Control |
| - | ---- | ------------- | ------- |
| 1 | `Pressable`, `aria-busy` | "busy" | "Results B2" |
| 2 | `Pressable` with `accessibilityLabel`, `aria-busy` | "Results L1, busy" | "Results L2" |
| 3 | checkbox, `aria-checked="mixed"` (control `true`) | "mixed", not checkable | "Select all M2", checked |
| 4 | slider, `aria-valuetext="3 of 5"` | "3 of 5" | "Rating V2" |
| 5 | `Text`, `aria-busy` | "busy" (text "Saving T1") | none (text "Saving T2") |
| 6 | `accessible` View, `aria-busy` | "busy" | "Inbox A2" |
| 7 | slider, `aria-valuetext`, 0 to 3 presses of Next S | "1 of 5" to "4 of 5", never "Volume S1" | the same |

TalkBack reads 1, 5 and 6 as "busy", 3 as "mixed" with no name, 4 as "3 of 5,
slider" (the control: "3, Rating V2, slider"), and 7 as "1 of 5" to "4 of 5"
with no "Volume". Only section 2 keeps the name, because it has an
`accessibilityLabel`. The code is the same on `main`.

iOS keeps the name and reads these words as the value.
