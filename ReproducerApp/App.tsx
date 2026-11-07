import { useState, type ReactNode } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';

// On Android, `aria-busy`, `aria-checked="mixed"` and `aria-valuetext` are
// written into the view's content description. With no `accessibilityLabel`,
// that replaces the name TalkBack would read from the children or the text.
// In each section the first element has the prop and the second, the control,
// differs only by not having it.
//
// Inspect with
// `adb shell uiautomator dump /sdcard/ui.xml && adb pull /sdcard/ui.xml`
// (content-desc) or A11yProbe; the README says what to look at.

const box = { padding: 8, borderWidth: 1, borderColor: '#888' } as const;

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <View style={{ gap: 8 }}>
      <Text style={{ fontWeight: '600' }}>{title}</Text>
      {children}
    </View>
  );
}

function Slider({ name, now }: { name: string; now: number }) {
  return (
    <View
      accessible
      role="slider"
      aria-valuemin={1}
      aria-valuemax={5}
      aria-valuenow={now}
      aria-valuetext={`${now} of 5`}
      style={box}
    >
      <Text>{name}</Text>
    </View>
  );
}

// The first slider is updated in place, the second is mounted again on every
// step (a new key).
function Stepper() {
  const [step, setStep] = useState(0);
  const now = (step % 5) + 1;

  return (
    <Section title="7. aria-valuetext updated, slider, no label">
      <Text>
        Step {step}: aria-valuenow {now}
      </Text>
      <Pressable
        accessibilityLabel="Next S"
        onPress={() => setStep(s => s + 1)}
        style={box}
      >
        <Text>Next S</Text>
      </Pressable>
      <Slider name="Volume S1" now={now} />
      <Slider key={step} name="Volume S2" now={now} />
    </Section>
  );
}

export default function App() {
  return (
    <ScrollView contentContainerStyle={{ padding: 48, gap: 24 }}>
      <Section title="1. aria-busy, Pressable, no label">
        <Pressable aria-busy style={box}>
          <Text>Results B1</Text>
        </Pressable>
        <Pressable aria-busy={false} style={box}>
          <Text>Results B2</Text>
        </Pressable>
      </Section>

      <Section title="2. aria-busy, Pressable, with accessibilityLabel">
        <Pressable aria-busy accessibilityLabel="Results L1" style={box}>
          <Text>Results L1</Text>
        </Pressable>
        <Pressable aria-busy={false} accessibilityLabel="Results L2" style={box}>
          <Text>Results L2</Text>
        </Pressable>
      </Section>

      <Section title="3. aria-checked, checkbox, no label">
        <Pressable role="checkbox" aria-checked="mixed" style={box}>
          <Text>Select all M1</Text>
        </Pressable>
        <Pressable role="checkbox" aria-checked style={box}>
          <Text>Select all M2</Text>
        </Pressable>
      </Section>

      <Section title="4. aria-valuetext, slider, no label">
        <View
          accessible
          role="slider"
          aria-valuemin={1}
          aria-valuemax={5}
          aria-valuenow={3}
          aria-valuetext="3 of 5"
          style={box}
        >
          <Text>Rating V1</Text>
        </View>
        <View
          accessible
          role="slider"
          aria-valuemin={1}
          aria-valuemax={5}
          aria-valuenow={3}
          style={box}
        >
          <Text>Rating V2</Text>
        </View>
      </Section>

      <Section title="5. aria-busy, Text">
        <Text aria-busy>Saving T1</Text>
        <Text aria-busy={false}>Saving T2</Text>
      </Section>

      <Section title="6. aria-busy, accessible View, no label">
        <View accessible aria-busy style={box}>
          <Text>Inbox A1</Text>
        </View>
        <View accessible aria-busy={false} style={box}>
          <Text>Inbox A2</Text>
        </View>
      </Section>

      <Stepper />
    </ScrollView>
  );
}
