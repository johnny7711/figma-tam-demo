# Slide Generation from Meeting Minutes

A Claude Code skill set plus a Figma Slides Plugin that turns meeting minutes into slide decks. Claude Code understands and structures the minutes; the Plugin renders structured output as native Figma Slides built on Auto Layout.

## Language

### Inputs and outputs

**Meeting Minutes**:
A text-form record of a meeting that serves as input to the generation flow. Typically a markdown or plain-text file produced after a meeting.
_Avoid_: Notes, Transcript, Memo

**Slide Spec**:
The JSON document handed from Claude Code to the **Slide Generator Plugin** describing what to render. Carries a deck-wide **Theme** selection plus an array of per-**Slide** entries (each a **Slide Layout** plus **Slot** values). The contract between the Claude Code side and the Figma side.
_Avoid_: JSON, Payload, Spec (alone)

**Slide**:
A single page in **Figma Slides** (a fixed 1920×1080 `SlideNode`). Generated from one entry in a **Slide Spec**.
_Avoid_: Page, Card

### Figma-side concepts

**Figma Slides**:
The target environment — Figma's slide-deck product (distinct from Figma Design). The **Slide Generator Plugin** runs here.
_Avoid_: Figma (alone), Slides (alone)

**Slide Generator Plugin**:
The Figma Plugin running inside **Figma Slides** that reads a **Slide Spec** and produces **Slides**. The Figma-side half of the system.
_Avoid_: Figma Component, Extension, Widget

**Auto Layout**:
Figma's frame-level feature that automatically arranges and resizes children by direction, padding, gap, and alignment. Used inside every generated **Slide** so content adapts to length without pixel positioning. The core reason we chose Figma Slides over alternatives — it lets the LLM avoid layout math.

### Design responsibility model

**Theme**:
A named bundle of visual choices — color palette, typography, decoration recipes — defined as JSON bundled inside the **Slide Generator Plugin**. The **Slide Spec** references a Theme by name (e.g. `"executive-dark"`); it never specifies raw colors or fonts. One Theme per deck.
_Avoid_: Style, Skin, Palette

**Slide Layout**:
A named recipe inside the **Slide Generator Plugin** that maps a set of named **Slots** to an **Auto Layout** structure on a **Slide**. Examples: `title`, `bullets`, `two-column`, `decision`, `action-items`, `metrics`, `section-divider`. **Not** a Figma component; **not** a Figma Slides template — those cannot be created or referenced via the Plugin API.
_Avoid_: Layout (alone), Template, Master

**Slot**:
A named placeholder defined by a **Slide Layout** that the **Slide Spec** fills with content (e.g. `two-column` defines `{ heading, left, right }`). Slot values are content + a small fixed vocabulary of semantic decorators.
_Avoid_: Field, Placeholder, Hole

**Semantic Decorator**:
A fixed-vocabulary tag applied to **Slot** content that the **Theme** and **Slide Layout** translate into visual treatment (e.g. `emphasis: warning`, `icon: rocket`). The **Slide Spec** must not carry raw colors, fonts, or pixel values — only these named decorators.
_Avoid_: Style override, Inline style

## Flagged ambiguities

- **"Layout" alone is ambiguous.** It can mean:
  - **Slide Layout** (our concept: a Plugin-side recipe)
  - **Auto Layout** (Figma's frame feature)
  - **Figma Slides Template / Layout** (Figma's UI concept — color+font+layouts applied via the Figma app; **not addressable from the Plugin API**)
  - Always qualify with the prefix.

- **"Template" alone is ambiguous.** In Figma's UI, a Slides Template is a curated bundle of layouts and styles. In our system, the analogue is a **Theme** + the **Slide Layout** menu. We do not use "Template" as a term in our model.

## Example dialogue

> Dev: "The LLM wants to set the title color to dark blue."
>
> Maintainer: "It can't. The Slide Spec doesn't carry colors. It picks a Theme by name, and the Theme decides title color. If 'dark blue' matters, that belongs in a Theme like `executive-dark`."
>
> Dev: "What if it wants to emphasize one bullet?"
>
> Maintainer: "Use a Semantic Decorator — `emphasis: warning` on that bullet's Slot. The Slide Layout reads the decorator and the Theme defines what `warning` looks like."
